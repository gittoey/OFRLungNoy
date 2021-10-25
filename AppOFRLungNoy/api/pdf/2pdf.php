<?php
// DOWNLOAD COMPOSER - https://getcomposer.org
// NAVIGATE TO PROJECT FOLDER IN COMMAND LINE
// RUN "composer require mpdf/mpdf"

// (A) LOAD MPDF
require_once __DIR__ . '/vendor/autoload.php';


// PORTRAIT BY DEFAULT, WE CAN ALSO SET LANDSCAPE
// $mpdf = new \Mpdf\Mpdf(["orientation" => "L"]);

function html2pdf($title, $html)
{
    //custom font
    $defaultConfig = (new Mpdf\Config\ConfigVariables())->getDefaults();
    $fontDirs = $defaultConfig['fontDir'];

    $defaultFontConfig = (new Mpdf\Config\FontVariables())->getDefaults();
    $fontData = $defaultFontConfig['fontdata'];

    $mpdf = new \Mpdf\Mpdf([
        'fontDir' => array_merge($fontDirs, [
            __DIR__ . '/fonts',
        ]),
        'fontdata' => $fontData + [
            'sarabun' => [
                'R' => 'THSarabunNew.ttf',
                'I' => 'THSarabunNew Italic.ttf',
                'B' => 'THSarabunNew Bold.ttf',
            ]
        ],
    ]);
    // (B) OPTIONAL META DATA + PASSWORD PROTECTION
    $mpdf->SetTitle($title);
    //$mpdf->SetAuthor("Jon Doe");
    //$mpdf->SetCreator("Code Boxx");
    $mpdf->SetSubject($title);
    //$mpdf->SetKeywords("Demo", "Testing");
    // $mpdf->SetProtection([], "user", "password");

    // (C) THE HTML
    // $html = "";
    // OR WE CAN JUST READ FROM A FILE
    // $html = file_get_contents("PAGE.HTML");

    // (D) WRITE HTML TO PDF
    $mpdf->WriteHTML($html);

    // (E) OUTPUT
    // (E1) DIRECTLY SHOW IN BROWSER
    $mpdf->Output();

    // (E2) FORCE DOWNLOAD
    // $mpdf->Output("demo.pdf", "D");

    // (E3) SAVE TO FILE ON SERVER
    // $mpdf->Output("demo.pdf");

}
