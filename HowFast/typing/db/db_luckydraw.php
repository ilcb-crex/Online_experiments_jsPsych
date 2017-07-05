<?php
/*
Function to define the participant as a winner or not
A winner is theorically defined every N participants.
To avoid the possible association between the winner participant 
and the recorded data (row of the database), a new value of N is
set in the script, comprised between N-3 and N+3 and randomly selected.


the code is chosen randomly from a list stored in a txt file.
 

 To prevent any link between the current winner and one of the row of the database, 
the code is randomly selected from the codes lists
 It is then removed from the list 
 Thanks to Phenom response in Open Classroom forum 
 https://openclassrooms.com/forum/sujet/php-supprimer-ligne-d-un-fichier-texte-25980

 Be careful, while we are testing if the current participant is a winner,
 maybe another from the potential winner region 

CREx-BLRI-AMU project :
https://github.com/chris-zielinski/Online_experiments_jsPsych/tree/master/HowFast/keyseq
*/

/*-------- PARAMETERS -----------------------*/

// PHP script to access to the database 
$connect = "db_connect.php";

// Initial value of N 
$ngap = 50;

// List of the remained codes
$curlist = '/home/somewhere/codes_remain.txt';
// The firt row of the file (first row) contains the total number of winner,
// following by the remained codes.

// n_around
$nar = 3;

/*--------------------------------------------*/

/*--- Defined required variables ---*/
// to test if the current participant is a winner

// Current participant's number
$isubj = get_subjnum($connect);

// Initial number of codes	
//$Nc_ini = count(extract_codes($inifile));

// Current codes list
$codes = extract_codes($curlist);

// Current number of codes !! -1 (first line = winner counter)
$Nc_cur = count($codes) - 1;

// Total number of winners
$nwin = intval($codes[0]); // $Nc_ini - $Nc_cur; 

// Theorical winner at +/- $ngap depending of the current winner number
$imid = ($nwin+1)*$ngap;

// If an issue as occured when writing the new $curlist, new nwin is defined
if  ($isubj > ($imid+$nar+1) ){
	// Find the theorical nwin - depending on the number of data in the table
	$imid = $isubj;
	while (($imid%$ngap)!=0){
		$imid = $imid +1;
	}
	// Number of theorical winner
	$nwin = ($imid / $ngap) - 1;
	$imid = $iwin;
}
// According to the number of winners and the current subject's number
// we can already define if the subject is a potential winner
$potwin = potential_winner($isubj, $nwin, $ngap, $nar);


// Initialized output
$data = array("winflag"=>0, "alphacode"=>"nocode"); 
//,"isubj"=>$isubj, "nwin"=>$nwin, "potwin"=>$potwin, "imid"=>0,  "IWIN"=>0, "code"=>$nwin);
	
if ($potwin==1) {

	// The real ngap is finally increased or decreased by a random numbre between 1 and $nar
	// This ensures the total anonymity of the participant 	
	
	$IWIN = rand(1, 3);
		
	// If the last possible winner of the potential winner region is reached, he is automatically
	// defined as the winner.

	if ( ($IWIN == 1) || ($isubj == ($imid+$nar)) ){	
	
		/*--- Draw one of the code from the list ---*/
		/* From 1 (0 = counter) to available number of codes = $Nc_cur = count($codes)-1*/
		$irand = rand(1, $Nc_cur);
		$code = $codes[$irand];
		
		/*--- Remove the selected code from the text list ---*/
		unset($codes[$irand]);
		$codes = array_values($codes);
		$codes[0] = strval($nwin + 1);
		$codes = implode(PHP_EOL, $codes);

		file_put_contents($curlist, $codes, LOCK_EX);
		
		/*--- Fill output ---*/
		$data["winflag"] = 1;
		$data["alphacode"] = $code;			
	}
}

echo json_encode($data);



/*--- Function to read the list of codes in a txt file---*/
// Return the list as an array (one row per code)
function extract_codes($filename){
	// Open, read and close
	$pfile = fopen($filename, 'r');
	$content = fread($pfile, filesize($filename));
	fclose($pfile);

	// Make an array of string (one row per text file line)
	// PHP_EOL <=> the line feed symbol used on the server (linux:\n, win:\r\n, mac:\r) 	
	$codes = explode(PHP_EOL, $content); 
	
	return $codes;
}

/*--- Function to know the subject number in the database ---*/ 
// <=> the number of row of the database
function get_subjnum($connectfile){
	/*--- Database connection ---*/
	// Return database object ($dba)
	// and the name of the table ($tname variable)
	include($connectfile);

	$sel = "SELECT count(ID) FROM ".$tname;
	$nrow = $dba->query($sel)->fetchColumn();
	
	// Disable the connection
	$dba = null;
	
	return $nrow;
}

/*--- Check if the current participant is a potential winner*/
// => if he is comprised into the "potential winner region"
// Return 1 if true, 0 if false
function potential_winner($icur, $nwin, $ngap, $nar){
	$pot = 0;
	if ($icur >= ($ngap-$nar)) {
		$mid = ($nwin + 1)*$ngap;
		if (($icur >= ($mid-$nar)) && ($icur <= ($mid+$nar))){
			$pot = 1;	
		}
	}
	return $pot;
}
?>