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

$sql = "SELECT `UserID`,`Type`,`Username`,`Password`,`Name`,`Active`,`NewDate`,`UpdateDate` FROM `User` WHERE `Username` = '".$mysqli->real_escape_string($_POST["Username"])."'";
$_POST["Return"]["SQL"] = $sql;
$result = $mysqli->query($sql);
$row = $result->fetch_assoc();
$result->free_result();
$mysqli->close();

if($row == 0){
    $_POST["Return"]["Status"] = "No";
    $_POST["Return"]["Type"] = "Username";
    print_r(json_encode($_POST));
    exit();
}

if($_POST["Password"] != $row["Password"]){
    $_POST["Return"]["Status"] = "No";
    $_POST["Return"]["Type"] = "Password";
    print_r(json_encode($_POST));
    exit();
}

$_POST["Return"]["Status"] = "Yes";
$_POST["Return"]["Type"] = "Logged";
$_POST["Return"]["User"]["UserID"] = $row["UserID"];
$_POST["Return"]["User"]["Type"] = $row["Type"];
$_POST["Return"]["User"]["Username"] = $row["Username"];
$_POST["Return"]["User"]["Name"] = $row["Name"];
$_POST["Return"]["User"]["Active"] = $row["Active"];
$_POST["Return"]["User"]["NewDate"] = $row["NewDate"];
$_POST["Return"]["User"]["UpdateDate"] = $row["UpdateDate"];
print_r(json_encode($_POST));
