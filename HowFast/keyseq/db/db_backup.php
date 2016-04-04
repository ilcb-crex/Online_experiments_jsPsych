<?php
/*
php.net
----
PDO::query : exécute une requête SQL, retourne un jeu de résultats en tant qu'objet PDOStatement

*/
include("db_connect.php");
// => return $dba object 

backup_tables($dba, 'data_table', '', true);


function backup_tables($dbh, $tables, $bkpath, $compflag) {
	// $dbh : data base (object returned by connection)
	// $tables : names of the tables - default : all tables found in $dba ('*')
	// $bkpath : path where to save the backup (on the server) - default : directory of this file
	// $compflag : compression of the sql backup file (true)
	
	$dbh -> setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_NATURAL );

	$nowtimename = date('Ymd\_Gis'); //time();

	// Array of all database field types which just take numbers 
	$numtypes = array('tinyint','smallint','mediumint','int','bigint','float','double','decimal','real');

	// Create/open files
	$bkfp = $bkpath."backup_".$nowtimename ;
	if ($compflag) {
		$hfile = gzopen($bkfp.'.sql.gz', "a9");
	} else {
		$hfile = fopen($bkfp.'.sql','a+');
	}
	
	// Function to write new lines inside the backup file
	function writebk($hf, $cflag, $strw) {
		if ($cflag) {
			gzwrite($hf, $strw);
		} 
		else {
			fwrite($hf, $strw);
		} 
	}

	// Get all of the tables
	if(empty($tables) || $tables == '*' ) {
		$ptab = $dbh -> query('SHOW TABLES');
		while ($ntab = $ptab -> fetch(PDO::FETCH_NUM)) {
			$tables[] = $ntab[0];
		}
	} 
	else {
		$tables = is_array($tables) ? $tables : explode(',',$tables);
	}

	// Cycle through the table(s)

	foreach($tables as $table) {
	
		$return="";

		// Uncomment below if you want 'DROP TABLE IF EXISTS' be displayed
		$return.= 'DROP TABLE IF EXISTS `'.$table.'`;'; 

		// Table structure
		$ptcreat = $dbh -> query("SHOW CREATE TABLE $table");
		$screat = $ptcreat -> fetch(PDO::FETCH_NUM);
		$ctab = str_replace('CREATE TABLE', 'CREATE TABLE IF NOT EXISTS', $screat[1]);
		
		$return.= "\n\n".$ctab.";\n\n";
		
		writebk($hfile, $compflag, $return);

		$return = "";
		
		$result = $dbh -> query("SELECT * FROM $table");
		$num_fields = $result -> columnCount();
		$num_rows = $result -> rowCount();
		
		// Insert values 
		if ($num_rows){
			$return= 'INSERT INTO `'."$table"."` (";
			$ptcol = $dbh -> query("SHOW COLUMNS FROM $table");
			
			$type = array();
			$count = 0;
			while ($fname = $ptcol -> fetch(PDO::FETCH_NUM)) {
				// 1st col : $fname[0] = 'ID' ; fname[1] = 'int(11)';
				// 2nd col : $fname[0] = 'subjID' ; fname[1] = 'varchar(200)';

				// Store data type in $type array (int, varchar, text...) 
				if (stripos($fname[1], '(')) {
					$type[$table][] = stristr($fname[1], '(', true); 
					// Type name before '(' - ex. stristr('int(11)', '(', true) = 'int'
				} 
				else {
					$type[$table][] = $fname[1];
				}
				$return.= "`".$fname[0]."`";
				$count++;
				if ($count < $num_fields) {
					$return.= ", ";
				} 
			}	

			$return.= ")".' VALUES';

			writebk($hfile, $compflag, $return);
			
			$return = "";
		}
		
		$count = 0;
		while($row = $result->fetch(PDO::FETCH_NUM)) {
			$return= "\n\t(";		

			for($j=0; $j<$num_fields; $j++) {
				$row[$j] = addslashes($row[$j]);
				//$row[$j] = preg_replace("\n","\\n",$row[$j]);

				if (isset($row[$j])) {
					// isset — Détermine si une variable est définie et est différente de NULL
					// if number, take away "" ; else leave as string
					if (in_array($type[$table][$j], $numtypes)) {
						$return.= $row[$j] ; 
					}
					else {
						$return.= '"'.$row[$j].'"' ;
					}
				} else {
					$return.= '""'; // 'NULL' ?
				}
				if ($j < ($num_fields-1)) {
					$return.= ',';
				}
			}
			$count++;
			if ($count < $num_rows) {
				$return.= "),";
			} 
			else {
				$return.= ");";
			} 

			writebk($hfile, $compflag, $return);

			$return = "";
		}
		$return="\n\n-- ------------------------------------------------ \n\n";
		
		writebk($hfile, $compflag, $return);
		$return = "";
	}

	$error1 = $ptcreat -> errorInfo();
	$error2 = $result -> errorInfo();
	$error3 = $ptcol -> errorInfo();
	echo $error1[2];
	echo $error2[2];
	echo $error3[2];

	if ($compflag) {
		gzclose($hfile);
	} 
	else {
		fclose($hfile);
	}
}

?>