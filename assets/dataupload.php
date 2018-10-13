<?php

if (!defined('SITE_ROOT')){
    define('SITE_ROOT', dirname(__DIR__, 1));
}
$fileallloc = SITE_ROOT . '/assets' . DIRECTORY_SEPARATOR . 'voxelmap.json' ;

$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

if ($contentType === "application/json") {
  //Receive the RAW post data.
  $content = trim(file_get_contents("php://input"));

  $decoded = json_decode($content, true);

  //If json_decode failed, the JSON is invalid.
  if(! is_array($decoded)) {

  } else {
    // Send error back to user.
  }
}
//$decodeddraft = json_decode($vsjson, true);
//$boolnew=true;

//if ($decodedall == null){
    $out='sus';
    //$encodedall = json_encode($decodedall, JSON_UNESCAPED_UNICODE);
    file_put_contents($fileallloc, $content);
//}else{ // add &$vll make iterator replace able
	/*
    foreach ($decodedall['items'] as &$value) {
        if ($id === strval($value['post-id'])){// ­Yid­«½Æ¸m´«ÂÂªº
          $boolnew = false;
          $value = $decodeddraft['items'][0]; 
          break;  
        }
    }
    // ­Yid¥¼­«½Æ ¥[¤J·sªº
    if ($boolnew){
        array_push($decodedall['items'], $decodeddraft['items'][0]);
    }
    
    $out=$decodedall;
    $encodedall = json_encode($decodedall, JSON_UNESCAPED_UNICODE);
    file_put_contents($fileallloc, $encodedall);
    */
//}

//require(SITE_ROOT . '/data/xcopy.php');
//xcopy($dirdraftloc,$dirallloc);

echo json_encode($out);
?>