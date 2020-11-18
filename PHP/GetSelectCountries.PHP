<?PHP
    
	$executionStartTime = microtime(true) / 1000;
    $result = file_get_contents("../assests/countryBorders.geo.json");
    
    $decode = json_decode($result,true);
    $features = $decode["features"];
    $x=0;
    foreach($features as $country){
        $array = array(
            "countryName"=> $country["properties"]["name"],
            "countryCode"=> $country["properties"]["iso_a2"]
        );
        $output["data"][$x] = $array;
        $x += 1;
    }
    usort($output["data"], function ($item1, $item2) {
        return $item1['countryName'] <=> $item2['countryName'];
    });
    // $output["data"][] = $country["properties"]["name"];
    //     $output["data"][$country["properties"]["name"]] = $country["properties"]["iso_a2"];
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Countries returned";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["len"] = $x;
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    //needs ISO_a2 and country
?>
