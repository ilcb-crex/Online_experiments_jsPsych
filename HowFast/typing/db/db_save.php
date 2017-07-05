<?php
/*
 Saving the data to mySQL database - using PDO 
 jsPsych data are submitted as a unique string (json-encoded object)
 In the main script (where experiment is defined) :

	// Function for writing the data in mysql database
	// The database HAVE TO BE CONFIGURED
	// ACCESS TO DATABASE IS DEFINED IN db / db_save.php 
	function save_data(subjID, subjinfo, blocksorder, data){
	   $.ajax({
		  type:'post',
		  cache: false,
		  url: 'db/db_save.php', 
		  data: {
			subjid: subjID,
			subjinfo: subjinfo,
			blocksorder: blocksorder,
			json: JSON.stringify(data)
			}
	   });
	} 

    // ...
    jsPsych.init({
        experiment_structure: experiment,
        on_finish: function(){    
			// All jsPsych data
			var alldata = jsPsych.data.getData();		
			// Save 					
			save_data(subjID, subjinfo, blocks_order, alldata);
        }   
    });

The database must contain the table $tname with at least 
the 4 columns : subjID, subjinfo, blocksorder and jsonData
The table is created if it doesn't exist yet.


CREx-BLRI-AMU project :
https://github.com/chris-zielinski/Online_experiments_jsPsych/tree/master/HowFast/keyseq
*/


//---- Database connection
// Return database object ($dba)
// and the name of the table ($tname variable)

include("db_connect.php");
// => $dba
// => $tname 

//---------------------
// Create $tname table if not yet

$istable = $dba->query("SHOW TABLES LIKE '".$tname."'")->rowCount() > 0;
if (!$istable){

	try {
		$sql = "CREATE TABLE ".$tname."(
		ID int(11) NOT NULL auto_increment,
		subjID  varchar(200) character set utf8 collate utf8_bin NOT NULL,
		subjinfo varchar(256) character set utf8 collate utf8_bin NOT NULL,
		blocksorder varchar(200) character set utf8 collate utf8_bin NOT NULL,
		jsonData mediumtext character set utf8 collate utf8_bin NOT NULL,
		PRIMARY KEY  (ID)
		)";
		$dba->exec($sql);
		echo " Table ".$tname." created successfully ";
    }
	catch(PDOException $e)
	{
		echo "Error creating table: <br>" . $e->getMessage();
    }
}	

//---------------------
// Get the data submitted in the main experiment script 
// by POST method (using jQuery.ajax)

// subject ID 
$id = $_POST['subjid'];

// subject info
$uinfo = $_POST['subjinfo'];

// Blocks order (typing)
$bord = $_POST['blocksorder'];

// json jsPsych data
$jsdata = $_POST['json'];


//---------------------
// Insert it into the data table

try {
    $req = $dba->prepare('INSERT INTO '.$tname.'(subjID, subjinfo, blocksorder, jsonData) 
						VALUES(:subjID, :subjinfo, :blocksorder, :jsonData)'); 

    $req->execute(array(
        'subjID' => $id,
        'subjinfo' => $uinfo,
		'blocksorder' => $bord,
        'jsonData' => $jsdata
    ));
	
/*	$req->bindValue('subjID', $id, PDO::PARAM_STR);
	$req->bindValue('subjinfo', $uinfo, PDO::PARAM_STR);
	$req->bindValue('jsonData', $jsdata, PDO::PARAM_STR);	*/
	
    echo '  Insertion OK ! ';
}
catch(PDOException $e)
{
    echo " Echec de l'insertion <br>".$e->getMessage();
}


//---------------------
// Disable the connection

$dba = null;

?>