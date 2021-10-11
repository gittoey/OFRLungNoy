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
SELECT
	oderdetail.*,
	varieties.`Name`,
	systemconfig.ConfigDisplay,
    0 AS TotalPrice
FROM
	oderdetail
	INNER JOIN
	varieties
	ON 
		oderdetail.VarietiesID = varieties.VarietiesID
	INNER JOIN
	systemconfig
	ON 
		oderdetail.GradeCode = systemconfig.ConfigValue AND
		systemconfig.ConfigCode = 'Grade'
WHERE `oderdetail`.`Active` = TRUE AND `oderdetail`.`OderID` = {$_POST["OderID"]}
";

$sql .= " ORDER BY `oderdetail`.`OderDetailID` ASC";

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
$_POST["Return"]["SysOderDetail"] = $dataReturn;

echo json_encode($_POST);
