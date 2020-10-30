<?php
        error_reporting(E_ALL);

        $executionStartTime = microtime(true) / 1000;
    
        $url='https://gazetter.craigbutton.co.uk/PHP/GetBorders.PHP?countryCode='. $_REQUEST['countryCode'];
    
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL,$url);
    
        $result=curl_exec($ch);
    
        curl_close($ch);
    
        $Coords = json_decode($result,true);
        $output['data']['coords'] = $Coords["data"];

        $url='http://api.geonames.org/countryInfoJSON?country=' . $_REQUEST['countryCode']. '&username=cra74ig';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

        $decode = json_decode($result,true);
        
        $output["data"]["geonames"] = $decode["geonames"];

        $capital = $decode["geonames"][0]["capital"];
        $currency = $decode["geonames"][0]["currencyCode"];


        // $url='http://api.weatherstack.com/current?access_key=60ddadcdc3a1c266cb2cb2ad42dfbb00&query='.$capital;

	// $ch = curl_init();
	// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	// curl_setopt($ch, CURLOPT_URL,$url);

	// $result=curl_exec($ch);

	// curl_close($ch);

        // $decode = json_decode($result,true);	
        // $output["data"]["Weather"]["current"] = $decode["current"]["weather_icons"];

        $url='https://api.exchangeratesapi.io/latest?base='.$currency;

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

        $decode = json_decode($result,true);
        
        $output['data']["currency"]["currentCurrency"] = $currency;
	$output['data']["currency"]["USD"] = $decode["rates"]["USD"];
	$output['data']["currency"]["GBP"] = $decode["rates"]["GBP"];
	if(isset($decode["rates"]["EUR"])){
		$output['data']["currency"]["EUR"] = $decode["rates"]["EUR"];
	}else{
		$output['data']["currency"]["EUR"] = 1.0;
	}

        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "data returned";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        


        header('Content-Type: application/json; charset=UTF-8');

        echo json_encode($output); 
?>