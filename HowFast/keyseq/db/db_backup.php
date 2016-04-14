<?php
/*
Script to make a copy of the experiment data in the server as a txt file
The data file will be save in the same directory than this script.

To make the backup, simply go to the db_backup.php page on the server from the browser...
(ex. http://my_super_experiement/db/db_backup.php )
The exported data will appeared as a new file in the db directory on the server.


Adapted from :
https://davidwalsh.name/backup-mysql-database-php

CREx-BLRI-AMU project :
https://github.com/chris-zielinski/Online_experiments_jsPsych/tree/master/HowFast/keyseq
*/

//---- Connection to the database
include("db_connect.php");
// => return $dba object 
// and the table name $tname

backup_tables($dba, $tname, '', true);


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
		$hfile = gzopen($bkfp.'.txt.gz', "a9");
	} else {
		$hfile = fopen($bkfp.'.txt','a+');
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
		
		writebk($hfile, $compflag, $return);

		$return = "";
		
		$result = $dbh -> query("SELECT * FROM $table");
		$num_fields = $result -> columnCount();
		$num_rows = $result -> rowCount();
		

		$count = 0;
		while($row = $result->fetch(PDO::FETCH_NUM)) {
			if ($count > 0) {
				$return= "\n";	
			}

			for($j=0; $j<$num_fields; $j++) {
				
				if (isset($row[$j])) {
					
					$return.= $row[$j] ; 

				} else {
					$return.= '""'; 
				}
				// Separate column data by a tab
				if ($j < ($num_fields-1)) {
					$return.= "\t";
				}
			}
			$count++;

			writebk($hfile, $compflag, $return);

			$return = "";
		}

	}
	$error2 = $result -> errorInfo();

	echo $error2[2];

	if ($compflag) {
		gzclose($hfile);
	} 
	else {
		fclose($hfile);
	}
}

?>