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
	`Order`.*,
	systemconfig.ConfigDisplay,
	od.TotalAmount,
	od.TotalPrice 
FROM
	`Order`
	INNER JOIN systemconfig ON systemconfig.ConfigCode = 'Order' 
	AND systemconfig.ConfigValue = `Order`.StatusCode
	INNER JOIN (
	SELECT
		orderdetail.OrderID,
		COUNT( orderdetail.OrderDetailID ) TotalAmount,
		SUM( ( CASE orderdetail.Unit WHEN 1 THEN orderdetail.SellingPrice ELSE orderdetail.SellingPrice * 1000 END ) * orderdetail.Amount ) TotalPrice 
	FROM
		orderdetail 
	WHERE
		orderdetail.Active = TRUE 
	GROUP BY
		orderdetail.OrderID 
	) od ON `Order`.OrderID = od.OrderID 
WHERE `Order`.`Active` = TRUE AND `Order`.`UserID` = {$_POST["UserID"]}
";

if ($_POST["OrderNo"] != "") {
    $sql .= " AND `Order`.`OrderNo` LIKE '%{$mysqli->real_escape_string($_POST["OrderNo"])}%'";
}

$sql .= " ORDER BY `Order`.`UpdateDate` DESC";

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
$_POST["Return"]["SysOrder"] = $dataReturn;

echo json_encode($_POST);
