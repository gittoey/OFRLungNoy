<?php
include_once("auth_ck.php");
include_once("conn.php");

authorization(basename(__FILE__));
$_POST = json_decode(file_get_contents('php://input'), true);
$_POST["Return"]["File"] = basename(__FILE__); 

if ($mysqli->connect_errno) {
    $ERROR["Return"]["Status"] = "Error";
    $ERROR["Return"]["Message"] = "Failed to connect to MySQL: " . $mysqli->connect_error;
    echo json_encode($ERROR);
    exit();
}

$sql = "SELECT `UserID` FROM `User` WHERE `Username` = '{$_POST["Username"]}'";
$_POST["Return"]["SQL1"] = $sql;
$result = $mysqli->query($sql);
$row = $result->fetch_assoc();
$result->free_result();

if($row != 0){
    $_POST["Return"]["Status"] = "No";
    $_POST["Return"]["Type"] = "Username";
    echo json_encode($_POST);
    exit();
}

$sql = "INSERT INTO `user` (`Username`, `Password`, `Name`) VALUES ('{$_POST["Username"]}', '{$_POST["Password1"]}', '{$_POST["Name"]}')";
$_POST["Return"]["SQL2"] = $sql;
$mysqli->query($sql);
$mysqli->close();

$_POST["Return"]["Status"] = "Yes";
$_POST["Return"]["Type"] = "Registed";
echo json_encode($_POST);
