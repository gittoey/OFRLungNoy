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

if ($_POST["Data"][$_POST["Table"] . "ID"] == 0) {
    $db_if = array($_POST["Table"] . "ID", "UpdateDate", "CreateDate", "Active");

    $Field = "";
    $Values = "";
    $Loop = 0;
    foreach ($_POST["Data"] as $key => $value) {
        if (!in_array($key, $db_if)) {
            if ($mysqli->real_escape_string($value) != "<null>") {
                if ($Loop > 0) {
                    $Field .= ", ";
                    $Values .= ", ";
                }
                $Field .= "`" . $key . "`";
                $Values .= "'" . $mysqli->real_escape_string($value) . "'";
                $Loop++;
            }
        }
    }

    $sql = "INSERT INTO `{$_POST["Table"]}` ({$Field}) VALUES ({$Values})";

    $_POST["Return"]["Type"] = "Created";
} else {
    if ($_POST["Data"]["Active"] == false) {
        $sql = "UPDATE `{$_POST["Table"]}` SET `Active` = FALSE, `UpdateDate` = NOW() WHERE `" . $_POST["Table"] . "ID` = {$_POST["Data"][$_POST["Table"] . "ID"]}";
        $_POST["Return"]["Type"] = "Deleted";
    } else {
        $db_if = array($_POST["Table"] . "ID", "CreateBy", "CreateDate", "UpdateDate", "Active");
        $Set = "";
        $Loop = 0;
        foreach ($_POST["Data"] as $key => $value) {
            if (!in_array($key, $db_if)) {
                if ($Loop > 0) {
                    $Set .= ", ";
                }
                $Set .= "`" . $key . "` = '{$mysqli->real_escape_string($value)}'";
                $Loop++;
            }
        }
        $sql = "UPDATE `{$_POST["Table"]}` SET {$Set}, `UpdateDate` = NOW() WHERE `" . $_POST["Table"] . "ID` = {$_POST["Data"][$_POST["Table"] . "ID"]}";

        $_POST["Return"]["Type"] = "Updated";
    }
}


$_POST["Return"]["SQL2"] = $sql;
if ($mysqli->query($sql) === TRUE) {
    $_POST["Return"]["Status"] = "Yes";
    if($_POST["Data"][$_POST["Table"] . "ID"] == 0){
        $_POST["Return"]["insert_id"] = $mysqli->insert_id;
    }else{
        $_POST["Return"]["insert_id"] = $_POST["Data"][$_POST["Table"] . "ID"];
    }
    
} else {
    $ERROR["Return"]["Status"] = "Error";
    $ERROR["Return"]["Message"] = "Error: " . $sql . "<br>" . $mysqli->error;
    echo json_encode($ERROR);
    $mysqli->close();
    exit();
}
$mysqli->close();

echo json_encode($_POST);
