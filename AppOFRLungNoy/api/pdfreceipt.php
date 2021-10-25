<?php
include_once("pdf/2pdf.php");
include_once("conn.php");

$sqlOrder = "
SELECT
	`order`.*, 
	province.NameInThai AS ProvinceNameInThai, 
	district.NameInThai AS DistrictNameInThai, 
	subdistrict.NameInThai AS SubDistrictNameInThai, 
	subdistrict.ZipCode, 
	`user`.`Name` AS `OrderByName`
FROM
	`order`
	INNER JOIN
	subdistrict
	ON 
		`order`.SubDistrictID = subdistrict.SubDistrictID
	INNER JOIN
	district
	ON 
		`order`.DistrictID = district.DistrictID
	INNER JOIN
	province
	ON 
		`order`.ProvinceID = province.ProvinceID
	INNER JOIN
	`user`
	ON 
		`order`.UserID = `user`.UserID
		
WHERE
`order`.Active = TRUE
AND `order`.StatusCode = 'Paid'
AND `order`.OrderID = {$_GET["OrderID"]}
";

$result = $mysqli->query($sqlOrder);

$dataOrder;
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dataOrder[] = $row;
    }
} else {
    $dataOrder = 0;
}


$sqlPaymentDate = "
SELECT
	orderpayment.PaymentDate
FROM
	orderpayment
WHERE
	orderpayment.OrderID = {$dataOrder[0]["OrderID"]}
ORDER BY
	orderpayment.OrderPaymentID DESC
LIMIT 1
";

$result = $mysqli->query($sqlPaymentDate);

$dataPaymentDate;
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dataPaymentDate[] = $row;
    }
} else {
    $dataPaymentDate = 0;
}



$sqlOrderDetail = "
SELECT
	orderdetail.*, 
	varieties.`Name`, 
	systemconfig.ConfigDisplay
FROM
	orderdetail
	INNER JOIN
	varieties
	ON 
		orderdetail.VarietiesID = varieties.VarietiesID
	INNER JOIN
	systemconfig
	ON 
		orderdetail.GradeCode = systemconfig.ConfigValue AND systemconfig.ConfigCode = 'Grade'
WHERE orderdetail.OrderID = {$dataOrder[0]["OrderID"]}
";

$result = $mysqli->query($sqlOrderDetail);

$dataOrderDetail;
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dataOrderDetail[] = $row;
    }
} else {
    $dataOrderDetail = 0;
}





$html = file_get_contents("report/receipt.html");

$html = str_replace("{{OrderNo}}", $dataOrder[0]["OrderNo"], $html);

$html = str_replace("{{OrderByName}}", $dataOrder[0]["OrderByName"], $html);
$html = str_replace("{{AddressText}}", $dataOrder[0]["AddressText"], $html);
$html = str_replace("{{SubDistrictNameInThai}}", $dataOrder[0]["SubDistrictNameInThai"], $html);
$html = str_replace("{{DistrictNameInThai}}", $dataOrder[0]["DistrictNameInThai"], $html);
$html = str_replace("{{ProvinceNameInThai}}", $dataOrder[0]["ProvinceNameInThai"], $html);
$html = str_replace("{{ZipCode}}", $dataOrder[0]["ZipCode"], $html);

$datePaymentDate = new DateTime($dataPaymentDate[0]["PaymentDate"]);
$html = str_replace("{{PaymentDate}}", date_format($datePaymentDate, 'd/m/Y'), $html);

$dateDateNow = new DateTime();
$html = str_replace("{{DateNow}}", date_format($dateDateNow, 'd/m/Y'), $html);


$row = '';
$totalPrice = 0;
foreach($dataOrderDetail as $index => $val) {
	$totalPrice = $totalPrice + $val["Amount"] * $val["SellingPrice"];
	$row .= '
    <tr>
        <td>'.($index+1).'</td>
        <td>'.$val["Name"].'</td>
        <td align="right">'.number_format($val["Amount"]).'</td>
        <td align="right">'.number_format($val["SellingPrice"], 2).'</td>
        <td align="right">'.number_format($val["Amount"] * $val["SellingPrice"], 2).'</td>
    </tr>
    ';
}
$html = str_replace("{{row}}", $row, $html);

$html = str_replace("{{TotalPrice}}", number_format($totalPrice, 2), $html);

if ($mysqli->connect_errno) {
    $sql = "Failed to connect to MySQL: " . $mysqli->connect_error;
}

html2pdf($dataOrder[0]["OrderNo"], $html);
