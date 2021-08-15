<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header("Content-Type: multipart/application/json; charset=UTF-8");

function authorization($apiName){
    $token = "";
    if (function_exists("apache_request_headers")) {
        $headers = apache_request_headers();
        $token = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    }
    
    if($token != 'Bearer '.md5("TOEY<>{$apiName}")) {    
        $ERROR["Return"]["Status"] = "Error";
        $ERROR["Return"]["Authorization"] = $token;
        $ERROR["Return"]["Message"] = "Failed to authorization \"{$token}";
        echo json_encode($ERROR);
        exit();
    }
}
