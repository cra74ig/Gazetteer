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
        $output['data']['borders']["coords"] = $Coords["data"]["coords"];
        $output['data']['borders']["type"] = $Coords["data"]["type"];

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


        $url='http://api.weatherstack.com/current?access_key=60ddadcdc3a1c266cb2cb2ad42dfbb00&query='.$capital;

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

        $decode = json_decode($result,true);	
        $output["data"]["Weather"]["current"] = $decode["current"]["weather_icons"];

        $url='https://api.exchangeratesapi.io/latest?base='.$currency;

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

        $decode = json_decode($result,true);
        
        $output['data']["currency"]["currentCurrency"] = $currency;
        if(isset($decode["rates"]["USD"])){
                $output['data']["currency"]["USD"] = round($decode["rates"]["USD"],2);
        }else{
                $output['data']["currency"]["USD"] = "n/a";
        }
        
        if(isset($decode["rates"]["GBP"])){
                $output['data']["currency"]["GBP"] = round($decode["rates"]["GBP"],2);
        }else{
                $output['data']["currency"]["GBP"] = "n/a";
        }
	if(isset($decode["rates"]["EUR"])){
		$output['data']["currency"]["EUR"] = round($decode["rates"]["EUR"],2);
	}else{
		$output['data']["currency"]["EUR"] = "n/a";
        }
        
        $url='http://api.geonames.org/wikipediaSearchJSON?q=' . $capital."&countryCode=". $_REQUEST['countryCode']. '&maxRows=3&'.'&username=cra74ig';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);
        
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "data returned";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data']['WikiLinks'] = $decode["geonames"];


        header('Content-Type: application/json; charset=UTF-8');

        echo json_encode($output); 
?>