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

$sql = "SELECT `varieties`.* FROM `varieties` WHERE `varieties`.`Active` = TRUE";

if ($_POST["Name"] != "") {
    $sql .= " AND `varieties`.`Name` LIKE '%{$_POST["Name"]}%'";
}

$_POST["Return"]["SQL"] = $sql;
$result = $mysqli->query($sql);

if (!($result = $mysqli->query($sql))) {
    $ERROR["Return"]["Status"] = "Error";
    $ERROR["Return"]["Message"] = "Error: " . $sql . "<br>" . $mysqli->error;
    echo json_encode($ERROR);
    $mysqli->close();
    exit();
}

$dataReturn;
if ($result->num_rows > 0) {
    // output data of each row
    while ($row = $result->fetch_assoc()) {
        $dataReturn[] = $row;
    }
} else {
    $dataReturn = 0;
}
$result->free_result();
$mysqli->close();

$_POST["Return"]["Status"] = "Yes";
$_POST["Return"]["Type"] = "Geted";
$_POST["Return"]["Varieties"] = $dataReturn;

echo json_encode($_POST);
