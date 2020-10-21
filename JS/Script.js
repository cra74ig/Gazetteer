    var mymap = L.map('mapid').setView([51.505, -0.09], 11);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "<div>Icons made by <a href='https://www.flaticon.com/authors/freepik' title='Freepik'>Freepik</a> from <a href='https://www.flaticon.com/' title='Flaticon'>www.flaticon.com</a><br/>Map data &copy <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a></div>",
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY3JhNzRpZyIsImEiOiJja2c5azJrZGEwMHFoMnNzdzVjZmd5eDJ6In0.bZuD8zD7pmYGbg9tibxE4w'
}).addTo(mymap);

var markerGroup = L.layerGroup().addTo(mymap);

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

L.Control.Options = L.Control.extend({
    onAdd: function(map) {
        var form = L.DomUtil.create('div');
        form.id = "OptionsDiv"
        form.innerHTML = "<nav><input type='button' id='GeoInfo' value='GeoInfo'><input type='button' id='WikiLinks' value='Wikipedia'></nav>";
        return form;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

L.control.Options = function(opts) {
    return new L.Control.Options(opts);
}

L.control.Options({ position: 'bottomleft' }).addTo(mymap);
$("#WikiLinks").click(function(){
    $("#WikiLinks").attr("State","Active");
    L.clearLayers;
        console.log("show me");
})
function GetWikiLinks(CountryCode,IsCurrentLocation){
    console.log("Getting Wiki Links..." + CountryCode + IsCurrentLocation);
    if(IsCurrentLocation){
        $("#CurrentLocation").html("Test");
    }
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
$("#CountryChoiceButton").click(function(){
    console.log("Getting Details For Selected Location");
    var Country = $("#CountryChoice").val();
    console.log(Country);
    MoveMapToOptions(Country);
    if($("#WikiLinks").attr("State")==="Active"){
        GetWikiLinks(Country,false);
    }else{
        GetDetails(Country,false);
    }
})
//gets position of client
function GetCountryCode(position) {
    var x = position.coords.longitude;
    var y = position.coords.latitude;
    var Corods = new L.LatLng(y,x)
    mymap.setView(Corods, 13, {animation: true});
    var marker = L.marker(Corods, {
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
                    marker.bindPopup("<div id=CurrentLocation></div>",{minWidth: 200, maxWidth:600,autoclose:false}).openPopup();
                    GetWikiLinks(result.data,true)
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
            var Corods = new L.LatLng(y,x);
            console.log(Corods);
            mymap.setView(Corods, 11, {animation: true});
            var marker = L.marker(Corods, {
                title: "London"
              }).addTo(mymap);
              
              marker.bindPopup("<div id=GB><div id=GBWeather></div><br/><div id=GBTable></div><br/><div id=GBPopulation></div><br/><div id=GBCapital></div></div>",{maxWidth: 400,minWidth: 200}).openPopup();
            
            break;
        case CountryCode="USA":
            y=38.9072;
            x= parseFloat("-77.0369");
            console.log(x + " " + y);
            var Corods = new L.LatLng(y,x);
            mymap.setView(Corods, 11, {animation: true});
            var marker = L.marker(Corods, {
                title: "Washington DC"
              }).addTo(mymap);
              
              marker.bindPopup("<div id=USAWeather></div><br/><div id=USATable></div><br/><div id=USAPopulation></div><br/><div id=USACapital></div><br/>",{maxWidth: 400,minWidth: 200}).openPopup();
            break;
        case CountryCode="FR":
            y=48.8566;
            x= parseFloat("2.3522");
            console.log(x + " " + y);
            var Corods = new L.LatLng(y,x);
            mymap.setView(Corods, 11, {animation: true});
            var marker = L.marker(Corods, {
                title: "Paris"
              }).addTo(mymap);
              
              marker.bindPopup("<div id=FRWeather></div><br/><div id=FRTable></div><br/><div id=FRPopulation></div><br/><div id=FRCapital></div><br/>",{maxWidth: 400,minWidth: 200}).openPopup();
            break;
        case CountryCode="ES":
            y=40.4168;
            x= parseFloat("-3.7038");
            console.log(x + " " + y);
            var Corods = new L.LatLng(y,x);
            mymap.setView(Corods, 11, {animation: true});
            var marker = L.marker(Corods, {
                title: "Madrid"
              }).addTo(mymap);
              
              marker.bindPopup("<div id=ESWeather></div><br/><div id=ESTable></div><br/><div id=ESPopulation></div><br/><div id=ESCapital></div><br/>",{maxWidth: 400,minWidth: 200}).openPopup();
            break;
        
    }
}
//Reaches to other API/PHP files and shows data on page.
function GetDetails(CountryCode, IsCurrentLocation){
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
                if(IsCurrentLocation){
                    $("#CurrentLocationPopulation").html("<p>Population: " + (result["data"][0]["population"])+ "</p>");
                    $("#CurrentLocationCapital").html("<p>("+CountryCode+") Capital City: " + (result["data"][0]["capital"])+"</p>");
                    console.log(GetExchangeRate(result["data"][0]["currencyCode"],"CurrentLocation"));
                    $("#CurrentLocationWeather").html(GetWeather(result["data"][0]["capital"],"CurrentLocation"));
                }else{
                    GetExchangeRate(result["data"][0]["currencyCode"],CountryCode);
                    GetWeather(result["data"][0]["capital"],CountryCode);
                    console.log(CountryCode);
                    $("#"+CountryCode+"Population").html("<p>Population: " + (result["data"][0]["population"]));
                    $("#"+CountryCode+"Capital").html("<p>Capital City: " + (result["data"][0]["capital"]));
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
                // console.log("#"+Location)
                // console.log((result["data"]["USD"]).toFixed(2));
                // console.log((result["data"]["GBP"]).toFixed(2));
                // console.log((result["data"]["EUR"]).toFixed(2));
                // $("#"+Location).html("<table><thead><tr><th>Currency</th><th>GBP</th><th>USD</th><th>EUR</th></tr></thead><tbody><tr><td>"+Currency+"</td><td>"+(result["data"]["GBP"]).toFixed(2)+"</td><td>"+(result["data"]["USD"]).toFixed(2)+"</td><td>"+(result["data"]["EUR"]).toFixed(2)+"</td></tr></tbody></table>")
                // $("#CurrentLocation").html("<table><thead><tr><th>Currency</th><th>GBP</th><th>USD</th><th>EUR</th></tr></thead><tbody><tr><td>"+Currency+"</td><td>"+(result["data"]["GBP"]).toFixed(2)+"</td><td>"+(result["data"]["USD"]).toFixed(2)+"</td><td>"+(result["data"]["EUR"]).toFixed(2)+"</td></tr></tbody></table>")
                content = ("<table><thead><tr><th>Currency</th><th>GBP</th><th>USD</th><th>EUR</th></tr></thead><tbody><tr><td>"+Currency+"</td><td>"+(result["data"]["GBP"]).toFixed(2)+"</td><td>"+(result["data"]["USD"]).toFixed(2)+"</td><td>"+(result["data"]["EUR"]).toFixed(2)+"</td></tr></tbody></table>");
                // console.log(content);
                console.log(content);
                $("#" + Location + "Table").html(content);
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
                // $("#"+Location+"weather").attr("src", Wimage);
                console.log(result["data"]);
                content = "<p>Current Weather</p><img src='"+ Wimage +"' />";
                $("#"+Location+"Weather").html(content);
                }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}