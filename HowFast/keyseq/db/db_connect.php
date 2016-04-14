<?php
/* Database connection to save data from the online experiment using PDO
Table name is defined here too.


CREx-BLRI-AMU project :
https://github.com/chris-zielinski/Online_experiments_jsPsych/tree/master/HowFast/keyseq
*/

//---------------------
// Connection parameters

$hname = "localhost";
$dname = 'your_db_name'; // Database name

$usern =  'your_user_name';  	// User name
$pword =  'your_password'; 		// Password

//---- Name of the table used to store the data
$tname = 'name_of_the_table';

//---------------------
// Database connection

$dsn = 'mysql:host=' . $hname . ';dbname=' . $dname . ';charset=utf8';

$opt = array(
	// any occurring errors will be thrown as PDOException
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    // an SQL command to execute when connecting
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'"
);

try {
    $dba = new PDO($dsn, $usern, $pword, $opt);
	echo " Connected to database "; 
} 
catch(PDOException $e)
{
    echo "Connection to database FAILED <br>" . $e->getMessage();  
}
	
?>