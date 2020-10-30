<?PHP 
        $executionStartTime = microtime(true) / 1000;
        $result = file_get_contents("../assests/countryBorders.geo.json");
        
        $decode = json_decode($result,true);
        $features = $decode["features"];
        foreach($features as $country){
            if($country["properties"]["iso_a2"] === $_REQUEST["countryCode"]){
                $output["data"]["coords"]=$country["geometry"]["coordinates"];
                $output["data"]["type"]=$country["geometry"]["type"];
            break;
            }
        
        }
        // $output["data"][] = $country["properties"]["name"];
        //     $output["data"][$country["properties"]["name"]] = $country["properties"]["iso_a2"];
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "Borders returned";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
?>