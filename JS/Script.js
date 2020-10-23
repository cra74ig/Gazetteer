    var mymap = L.map('mapid').setView([51.505, -0.09], 11);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "<div>Icons made by <a href='https://www.flaticon.com/authors/freepik' title='Freepik'>Freepik</a> from <a href='https://www.flaticon.com/' title='Flaticon'>www.flaticon.com</a><br/>Map data &copy <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a></div>",
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY3JhNzRpZyIsImEiOiJja2c5azJrZGEwMHFoMnNzdzVjZmd5eDJ6In0.bZuD8zD7pmYGbg9tibxE4w',
    closePopupOnClick:false
}).addTo(mymap);

var markerGroup = L.layerGroup().addTo(mymap);

L.Control.select = L.Control.extend({
    onAdd: function(map) {
        var form = L.DomUtil.create('div');
        form.id = "CountryFormDiv"
        form.innerHTML = "<form><label For='CountryChoice'>Select Country:</label> <select name='CountryChoice' value='England' id='CountryChoice'><option value='GB'>England</option><option value='USA'>USA</option><option value='FR'>France</option><option value='ES'>Spain</option></select><input type='button' value='Go' id='CountryChoiceButton'></input><img src='Images/location-pointer.svg' alt='Current Location' id='CurrentLocation'></form>";
        return form;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

L.control.select = function(opts) {
    return new L.Control.select(opts);
}

L.control.select({ position: 'topright' }).addTo(mymap);

L.Control.Options = L.Control.extend({
    onAdd: function(map) {
        var form = L.DomUtil.create('div');
        form.id = "OptionsDiv"
        form.innerHTML = "<nav><input type='button' id='GeoInfo' value='Geographical Information'><br/><input type='button' id='WikiLinks' value='Wikipedia Tourist links'></nav>";
        return form;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

L.control.Options = function(opts) {
    return new L.Control.Options(opts);
}

L.control.Options({ position: 'topleft' }).addTo(mymap);

var GBwikiLink1;
var GBwikiLink2;
var GBwikiLink3;
var GBEconomics;
var GBWeather;
var GBCapital;
var GBPopulation;
var USAwikiLink1;
var USAwikiLink2;
var USAwikiLink3;
var USAEconomics;
var USAWeather;
var USACapital;
var USAPopulation;
var FRwikiLink1;
var FRwikiLink2;
var FRwikiLink3;
var FREconomics;
var FRWeather;
var FRCapital;
var FRPopulation;
var ESwikiLink1;
var ESwikiLink2;
var ESwikiLink3;
var ESEconomics;
var ESWeather;
var ESCapital;
var ESPopulation;

$("#WikiLinks").click(function(){
    $("#WikiLinks").attr("State","Active");
    $("#GeoInfo").css("background-color", "white")
    $("#WikiLinks").css("background-color", "chartreuse")
    L.clearLayers;
    console.log("Wiki");
})
$("#GeoInfo").click(function(){
    $("#WikiLinks").attr("State","InActive");
    $("#GeoInfo").css("background-color", "chartreuse")
    $("#WikiLinks").css("background-color", "white")
    L.clearLayers;
    console.log("GeoInfo");
})


function GetWikiLinks(CountryCode,capital,IsCurrentLocation){
    console.log("Getting Wiki Links..." + CountryCode + IsCurrentLocation);
    $.ajax({
        url: "PHP/GetWikiLinks.PHP",
        type: 'POST',
        dataType: 'json',
        data: {
            country: CountryCode,
            capital: capital
        },
        success: function(result) {
            console.log(result);

            if (result.status.name == "ok") {
                content1 = ("<h3>Country: "+ CountryCode +" (Capital: "+ capital +")</h3><section><h3>"+result['data'][0]['title']+"</h3><a href=https://"+result['data'][0]['wikipediaUrl']+">"+result['data'][0]['wikipediaUrl']+"</a></section>");
                content2 = ("<section><h3>"+result['data'][01]['title']+"</h3><a href=https://"+result['data'][01]['wikipediaUrl']+">"+result['data'][01]['wikipediaUrl']+"</a></section>");
                content3 =("<section><h3>"+result['data'][02]['title']+"</h3><a href=https://"+result['data'][02]['wikipediaUrl']+">"+result['data'][02]['wikipediaUrl']+"</a></section>");
                if(IsCurrentLocation){
                    
                    $("#CurrentLocationLink1").html(content1);
                    $("#CurrentLocationLink2").html(content2);
                    $("#CurrentLocationLink3").html(content3);
                }else{
                    switch(CountryCode){
                    case CountryCode="GB":
                        window.GBwikiLink1 = content1;
                        window.GBwikiLink2 = content2;
                        window.GBwikiLink3 = content3;
                        break;
                    case CountryCode="USA":
                        window.USAwikiLink1 = content1;
                        window.USAwikiLink2 = content2;
                        window.USAwikiLink3 = content3;
                        break;
                    case CountryCode="FR":
                        window.FRwikiLink1 = content1;
                        window.FRwikiLink2 = content2;
                        window.FRwikiLink3 = content3;
                        break;
                    case CountryCode="ES":
                        window.ESwikiLink1 = content1;
                        window.ESwikiLink2 = content2;
                        window.ESwikiLink3 = content3;
                        break;
                    }
                    MoveMapToOptions(CountryCode);
                    // $("#"+CountryCode+"Link1").html(content1);
                    // $("#"+CountryCode+"Link2").html(content1);
                    // $("#"+CountryCode+"Link3").html(content1);
                }
                }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
        
    });

}
    
//checks if browser supports Geolocation (runs on Current Location icon) 
$("#CurrentLocation").click(async function(){
    console.log("Getting Current Location");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(GetCountryCode);
      } else { 
        alert( "Geolocation is not supported by this browser." );
      }
})
//Sends country to get details (using country code)
$("#CountryChoiceButton").click(async function(){
    console.log("Getting Details For Selected Location");
    var Country = $("#CountryChoice").val();
    console.log(Country);
    
    if($("#WikiLinks").attr("State")==="Active"){
        GetDetails(Country,false);
        
    }else{
        GetDetails(Country,false);
        
    }
})
//gets position of client
function GetCountryCode(position) {
    var x = position.coords.longitude;
    var y = position.coords.latitude;
    var markerCorods = new L.LatLng(y,x)
    var Corods = new L.LatLng(y+0.005,x)
    mymap.setView(Corods, 15, {animation: true});
    var marker = L.marker(markerCorods, {
        title: "Current Location"
      }).addTo(markerGroup);
    $.ajax({
        url: "PHP/GetCountry.PHP",
        type: 'POST',
        dataType: 'json',
        data: {
            latitude: y,
            longitude: x
        },
        success: function(result) {
            console.log(result);

            if (result.status.name == "ok") {
                if($("#WikiLinks").attr("State")==="Active"){
                    marker.bindPopup("<div id=CurrentLocationLink1></div><div id=CurrentLocationLink2></div><div id=CurrentLocationLink3></div>",{minWidth: 200, maxWidth:600,autoclose:false}).openPopup();
                    GetDetails(result.data,true)
                    
                }else{
                    marker.bindPopup("<div id=CurrentLocationCapital value="+result.data+"></div><div id=CurrentLocationWeather></div><div id=CurrentLocationTable></div><div id=CurrentLocationPopulation></div>",{minWidth: 200, maxWidth:600,autoclose:false}).openPopup();
                    GetDetails(result.data,true);
                }

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
    
}
function MoveMapToOptions(CountryCode){
    switch(CountryCode){
        case CountryCode="GB":
            y=51.5074;
            x= parseFloat("-0.1278");
            var markerCorods = new L.LatLng(y,x);
            var Corods = new L.LatLng(y+0.005,x);
            console.log(Corods);
            mymap.setView(Corods, 15, {animation: true});
            var marker = L.marker(markerCorods, {
                title: "London"
              }).addTo(mymap);
              if($("#WikiLinks").attr("State")==="Active"){
                  marker.bindPopup("<div id=GBLink1>"+GBwikiLink1+"</div><div id=GBLink2>"+GBwikiLink2+"</div><div id=GBLink3>"+GBwikiLink3+"</div>",{maxWidth: 600,minWidth: 200,autoclose:false}).openPopup();
              }else{
                marker.bindPopup("<div id=GBCapital>"+GBCapital+"</div><div id=GBWeather>"+GBWeather+"</div><div id=GBTable>"+GBEconomics+"</div><div id=GBPopulation>"+GBPopulation+"</div>",{maxWidth: 600,minWidth: 200,autoclose:false}).openPopup();
              }
            break;
        case CountryCode="USA":
            y=38.9072;
            x= parseFloat("-77.0369");
            console.log(x + " " + y);
            var markerCorods = new L.LatLng(y,x);
            var Corods = new L.LatLng(y+0.005,x);
            mymap.setView(Corods, 15, {animation: true});
            var marker = L.marker(markerCorods, {
                title: "Washington DC"
              }).addTo(mymap);
              if($("#WikiLinks").attr("State")==="Active"){
                marker.bindPopup("<div id=USALink1>"+USAwikiLink1+"</div><div id=USALink2>"+USAwikiLink2+"</div><div id=USALink3>"+USAwikiLink3+"</div>",{maxWidth: 600,minWidth: 200,autoclose:false}).openPopup();
            }else{
              marker.bindPopup("<div id=USACapital>"+USACapital+"</div><div id=USAWeather>"+USAWeather+"</div><div id=USATable>"+USAEconomics+"</div><div id=USAPopulation>"+USAPopulation+"</div>",{maxWidth: 600,minWidth: 200,autoclose:false}).openPopup();
            }
              
            break;
        case CountryCode="FR":
            y=48.8566;
            x= parseFloat("2.3522");
            console.log(x + " " + y);
            var markerCorods = new L.LatLng(y,x);
            var Corods = new L.LatLng(y+0.005,x);
            mymap.setView(Corods, 15, {animation: true});
            var marker = L.marker(markerCorods, {
                title: "Paris"
              }).addTo(mymap);
            if($("#WikiLinks").attr("State")==="Active"){
                marker.bindPopup("<div id=FRLink1>"+FRwikiLink1+"</div><div id=FRLink2>"+FRwikiLink2+"</div><div id=FRLink3>"+FRwikiLink3+"</div>",{maxWidth: 600,minWidth: 200,autoclose:false}).openPopup();
            }else{
              marker.bindPopup("<div id=FRCapital>"+FRCapital+"</div><div id=FRWeather>"+FRWeather+"</div><div id=FRTable>"+FREconomics+"</div><div id=FRPopulation>"+FRPopulation+"</div>",{maxWidth: 600,minWidth: 200,autoclose:false}).openPopup();
            }
              
            break;
        case CountryCode="ES":
            y=40.4168;
            x= parseFloat("-3.7038");
            console.log(x + " " + y);
            var markerCorods = new L.LatLng(y,x);
            var Corods = new L.LatLng(y+0.005,x);
            mymap.setView(Corods, 15, {animation: true});
            var marker = L.marker(markerCorods, {
                title: "Madrid"
              }).addTo(mymap);
            if($("#WikiLinks").attr("State")==="Active"){
                marker.bindPopup("<div id=ESLink1>"+ESwikiLink1+"</div><div id=ESLink2>"+ESwikiLink2+"</div><div id=ESLink3>"+ESwikiLink3+"</div>",{maxWidth: 600,minWidth: 200,autoclose:false}).openPopup();
            }else{
              marker.bindPopup("<div id=ESCapital>"+ESCapital+"</div><div id=ESWeather>"+ESWeather+"</div><div id=ESTable>"+ESEconomics+"</div><div id=ESPopulation>"+ESPopulation+"</div>",{maxWidth: 600,minWidth: 200,autoclose:false}).openPopup();
            }            
            break;
        
    }
}
//Reaches to other API/PHP files and shows data on page.
async function GetDetails(CountryCode, IsCurrentLocation){
    $.ajax({
        url: "PHP/GetCountryInfo.PHP",
        type: 'POST',
        dataType: 'json',
        data: {
            country: CountryCode,
        },
        success: function(result) {
            console.log(result);

            if (result.status.name == "ok") {               
                if(IsCurrentLocation){
                    if($("#WikiLinks").attr("State")==="Active"){
                        GetWikiLinks(CountryCode,result["data"][0]["capital"],true)
                    }else{
                        $("#CurrentLocationCapital").html("<p>("+CountryCode+") Capital City: " + (result["data"][0]["capital"])+"</p>");
                        $("#CurrentLocationPopulation").html("<p>Population: " + (result["data"][0]["population"])+ "</p>");
                        GetExchangeRate(result["data"][0]["currencyCode"],"CurrentLocation");
                        $("#CurrentLocationWeather").html(GetWeather(result["data"][0]["capital"],"CurrentLocation"));
                    }
                }else{
                    if($("#WikiLinks").attr("State")==="Active"){
                        GetWikiLinks(CountryCode,result["data"][0]["capital"],false)
                    }else{
                        popContent = "<p>Population: " + (result["data"][0]["population"]);
                        capitalContent  = "<p>("+CountryCode+") Capital City: " + (result["data"][0]["capital"]);
                        switch(CountryCode){
                            case CountryCode="GB":
                                window.GBPopulation = popContent;
                                window.GBCapital = capitalContent;
                                break;
                            case CountryCode="USA":
                                window.USAPopulation = popContent;
                                window.USACapital = capitalContent;
                                break;
                            case CountryCode="FR":
                                window.FRPopulation = popContent;
                                window.FRCapital = capitalContent;
                                break;
                            case CountryCode="ES":
                                window.ESPopulation = popContent;
                                window.ESCapital = capitalContent;
                                break;
                        }
                        GetExchangeRate(result["data"][0]["currencyCode"],CountryCode);
                        GetWeather(result["data"][0]["capital"],CountryCode);

                    }
                }
            } 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

function GetExchangeRate(Currency,Location){
    $.ajax({
        url: "PHP/GetExchangeRate.PHP",
        type: 'POST',
        dataType: 'json',
        data: {
            currency: Currency,
        },
        success: function(result) {
            console.log(result);

            if (result.status.name == "ok") {
                content = ("<table><thead><tr><th>Currency</th><th>GBP</th><th>USD</th><th>EUR</th></tr></thead><tbody><tr><td>"+Currency+"</td><td>"+(result["data"]["GBP"]).toFixed(2)+"</td><td>"+(result["data"]["USD"]).toFixed(2)+"</td><td>"+(result["data"]["EUR"]).toFixed(2)+"</td></tr></tbody></table>");
                
                console.log(content);
                switch(Location){
                    case Location="GB":
                        window.GBEconomics = content;
                        break;
                    case Location="USA":
                        window.USAEconomics = content;
                        break;
                    case Location="FR":
                        window.FREconomics = content;
                        break;
                    case Location="ES":
                        window.ESEconomics = content;
                        break;
                    case Location="CurrentLocation":
                        $("#CurrentLocationTable").html(content);
                        break;
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
        
    });
}
function GetWeather(Capital,Location){
    console.log(Capital)
    $.ajax({
        url: "PHP/GetWeather.PHP",
        type: 'POST',
        dataType: 'json',
        data: {
            capital: Capital,
        },
        success: function(result) {
            console.log(result);

            if (result.status.name == "ok") {
                var Wimage = result["data"];
                content = "<p>Current Weather</p><img src='"+ Wimage +"' />";
                switch(Location){
                    case Location="GB":
                        window.GBWeather = content;
                        MoveMapToOptions(Location);
                        break;
                    case Location="USA":
                        window.USAWeather = content;
                        MoveMapToOptions(Location);
                        break;
                    case Location="FR":
                        window.FRWeather = content;
                        MoveMapToOptions(Location);
                        break;
                    case Location="ES":
                        window.ESWeather = content;
                        MoveMapToOptions(Location);
                        break;
                    case Location="CurrentLocation":
                        $("#CurrentLocationWeather").html(content);
                        break;
                }
                
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}