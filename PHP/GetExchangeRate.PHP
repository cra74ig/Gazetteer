<?PHP
//cannot use currencylayer as free version does not allow changing the source
    error_reporting(E_ALL);

	$executionStartTime = microtime(true) / 1000;

	$url='https://api.exchangeratesapi.io/latest?base='.$_REQUEST["currency"];

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
	
	$output['data']["currentCurrency"] = 1.0;
	$output['data']["USD"] = $decode["rates"]["USD"];
	$output['data']["GBP"] = $decode["rates"]["GBP"];
	if(isset($decode["rates"]["EUR"])){
		$output['data']["EUR"] = $decode["rates"]["EUR"];
	}else{
		$output['data']["EUR"] = 1.0;
	}
	
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

 
?>