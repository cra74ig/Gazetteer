<?PHP
//cannot use currencylayer as free version does not allow changing the source
    error_reporting(E_ALL);

	$executionStartTime = microtime(true) / 1000;

	$url='http://api.weatherstack.com/current?access_key=60ddadcdc3a1c266cb2cb2ad42dfbb00&query='.$_REQUEST["capital"];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "Country returned";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode["current"]["weather_icons"];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

 
?>