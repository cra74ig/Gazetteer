    var mymap = L.map('mapid').setView([51.505, -0.09], 11);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY3JhNzRpZyIsImEiOiJja2c5azJrZGEwMHFoMnNzdzVjZmd5eDJ6In0.bZuD8zD7pmYGbg9tibxE4w'
}).addTo(mymap);
L.Control.select = L.Control.extend({
    onAdd: function(map) {
        var form = L.DomUtil.create('div');
        form.id = "CountryFormDiv"
        form.innerHTML = "<form><select name='CountryChoice' value='England' id='CountryChoice'><option value='GB'>England</option><option value='USA'>USA</option><option value='FR'>France</option><option value='ES'>Spain</option></select><input type='button' value='Go' id='CountryChoiceButton'></input><img src='Images/location-pointer.svg' alt='Current Location' id='CurrentLocation'></form>";
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
$("#CountryChoiceButton").click(function(){
    console.log("Getting Details For Selected Location");
    var Country = $("#CountryChoice").val();
    console.log(Country);
    MoveMapToOptions(Country);
    GetDetails(Country);
})
//gets position of client
function GetCountryCode(position) {
    var x = position.coords.longitude;
    console.log(x);
    var y = position.coords.latitude;
    console.log(y);
    var Corods = new L.LatLng(y,x)
    mymap.setView(Corods, 13, {animation: true});
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
                GetDetails(result.data);

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
            console.log(x + " " + y)
            var Corods = new L.LatLng(y,x);
            console.log(Corods);
            mymap.setView(Corods, 11, {animation: true});
            break;
        case CountryCode="USA":
            y=38.9072;
            x= parseFloat("-77.0369");
            console.log(x + " " + y);
            var Corods = new L.LatLng(y,x);
            mymap.setView(Corods, 11, {animation: true});
            break;
        case CountryCode="FR":
            y=48.8566;
            x= parseFloat("2.3522");
            console.log(x + " " + y);
            var Corods = new L.LatLng(y,x);
            mymap.setView(Corods, 11, {animation: true});
            break;
        case CountryCode="ES":
            y=40.4168;
            x= parseFloat("-3.7038");
            console.log(x + " " + y);
            var Corods = new L.LatLng(y,x);
            mymap.setView(Corods, 11, {animation: true});
            break;
        
    }
}
//Reaches to other API/PHP files and shows data on page.
function GetDetails(CountryCode){
    $.ajax({
        url: "PHP/GetCountryinfo.PHP",
        type: 'POST',
        dataType: 'json',
        data: {
            country: CountryCode,
        },
        success: function(result) {
            console.log(result);

            if (result.status.name == "ok") {
                GetExchangeRate(result["data"][0]["currencyCode"]);
                GetWeather(result["data"][0]["capital"]);
                $("#population").html((result["data"][0]["population"]));
                $("#capital").html((result["data"][0]["capital"]));
                $("#Currency").html((result["data"][0]["currencyCode"]));
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
    console.log(CountryCode);
}
function GetExchangeRate(Currency){
    console.log("test");
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
                $("#exchangeUSD").html((result["data"]["USD"]));
                $("#exchangeGBP").html((result["data"]["GBP"]));
                $("#exchangeEUR").html((result["data"]["EUR"]));
                }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}
function GetWeather(Capital){
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
                $("#weather").attr("src", Wimage);
                console.log(result["data"]);
                }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}