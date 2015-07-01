<?php

// Saving the data to mySQL database - using PDO 
// jsPsych data are submitted as a unique string (json-encoded object)
// In the main script (where experiment is defined) :
/*  function save_data(data){   
    // adapted from J. de Leeuw (jsPsych tutorial)

        $.ajax({
          type:'post',
          cache: false,
          url: 'dbsav/db_save.php', // THIS SCRIPT 
          data: {
             subjid: subjectID,         // (based on the starting date)
             json: JSON.stringify(data) // json-encoded object
            },
       });

    }
    // ...
    jsPsych.init({
        experiment_structure: experiment,
        on_finish: function(){    
            var alldata = jsPsych.data.getData();           
            save_data(alldata); 
        }   
    });
*/
// The database must contain the table $tname with at least 
// the 3 columns : subjID, subjinfo and jsonData
// New table is creating if it doesn't exist

//---- Name of the table

$tname = 'ks_test';

//---- Database connection

include("db_connect.php");

//---------------------
// Create $tname table if not yet

$istable = $dba->query("SHOW TABLES LIKE '".$tname."'")->rowCount() > 0;
if (!$istable){

	try {
		$sql = "CREATE TABLE ".$tname."(
		ID int(11) NOT NULL auto_increment,
		subjID  varchar(200) character set utf8 collate utf8_bin NOT NULL,
		subjinfo varchar(256) character set utf8 collate utf8_bin NOT NULL,
		jsonData text character set utf8 collate utf8_bin NOT NULL,
		PRIMARY KEY  (ID)
		)";
		$dba->exec($sql);
		echo " Table ".$tname." created successfully ";
    }
	catch(PDOException $e)
	{
		echo "<br>" . $e->getMessage();
    }
}	

//---------------------
// Get the data submitted in the main experiment script 
// by POST method (using jQuery.ajax)

// subject ID 
$id = $_POST['subjid'];

// json jsPsych data
$uinfo = $_POST['subjinfo'];

// json jsPsych data
$jsdata = $_POST['json'];


//---------------------
// Insert it into the data table

try {
    $req = $dba->prepare('INSERT INTO '.$tname.'(subjID, subjinfo, jsonData) 
						VALUES(:subjID, :subjinfo, :jsonData)'); 

    $req->execute(array(
        'subjID' => $id,
        'subjinfo' => $uinfo,
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