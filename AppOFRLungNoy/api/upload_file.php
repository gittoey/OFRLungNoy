<?php
include_once("auth_ck.php");

authorization(basename(__FILE__));

$_POST["File"] = $_FILES['File']['name'];

$uploadFolder =  "upload/";
if(isset($_POST["Path"])){
    if($_POST["Path"] != ""){
        $uploadFolder .= $_POST["Path"];
    }
}

if( is_dir($uploadFolder) === false )
{
    mkdir($uploadFolder);
}

$files = $_FILES['File']['name'];
$filename = $files;
$filenames =  explode(".", $filename);
$ext =  end($filenames);
$original = pathinfo($filename, PATHINFO_FILENAME);
$fileurl = $original .  "-"  . date("YmdHis")  .  "."  . $ext;
$_POST["PathFileName"] = $uploadFolder . $fileurl;
copy($_FILES["File"]["tmp_name"], $_POST["PathFileName"]);

echo json_encode($_POST);
