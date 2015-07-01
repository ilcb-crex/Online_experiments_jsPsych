<?php

//---------------------
// Connection parameters

$hname = "localhost";
$dname = 'my_dbname';

$usern =  'my_username';  
$pword =  'roger_rabbit'; 

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