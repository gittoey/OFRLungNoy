<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: multipart/application/json; charset=UTF-8");
$_POST = json_decode(file_get_contents('php://input'), true);

include_once("conn.php");



if ($mysqli->connect_errno) {
    $_POST["return"]["error"] = "Failed to connect to MySQL: " . $mysqli->connect_error;
    echo json_encode($_POST);
    exit();
}

$sql = "SELECT * FROM `User` WHERE `Username` = '{$_POST["User"]}'";
$result = $mysqli->query($sql);
$row = $result->fetch_assoc();
$result->free_result();
$mysqli->close();



$_POST["Return"]["SQL"] = $sql;
$_POST["Return"]["DATA"] = $row;




echo json_encode($_POST);
