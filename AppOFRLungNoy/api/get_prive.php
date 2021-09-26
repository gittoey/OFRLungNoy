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

$sql = "
SELECT `Price`.* 
FROM `Price` 
INNER JOIN `Varieties` ON `Price`.`VarietiesID` = `Varieties`.`VarietiesID` AND `Varieties`.`Active` = 1 
WHERE `Price`.`Active` = 1 
";

if ($_POST["VarietiesID"] != 0) {
    $sql .= " AND `Price`.`VarietiesID` = '{$mysqli->real_escape_string($_POST["VarietiesID"])}'";
}

if ($_POST["GradeCode"] != '') {
    $sql .= " AND `Price`.`GradeCode` = '{$mysqli->real_escape_string($_POST["GradeCode"])}'";
}

$sql .= " ORDER BY `Varieties`.`Name` ASC,  `Price`.`GradeCode` ASC";

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
$_POST["Return"]["Price"] = $dataReturn;
echo json_encode($_POST);
