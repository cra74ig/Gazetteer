    var mymap = L.map('mapid',{zoomControl:false}).setView([51.505, -0.09], 11);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "<div>Icons made by <a href='https://www.flaticon.com/authors/freepik' title='Freepik'>Freepik</a> from <a href='https://www.flaticon.com/' title='Flaticon'>www.flaticon.com</a><br/>Map data &copy <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a></div>",
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY3JhNzRpZyIsImEiOiJja2c5azJrZGEwMHFoMnNzdzVjZmd5eDJ6In0.bZuD8zD7pmYGbg9tibxE4w',
    closePopupOnClick:false,
}).addTo(mymap);

var markerGroup = L.layerGroup().addTo(mymap);

L.Control.select = L.Control.extend({
    onAdd: function(map) {
        var form = L.DomUtil.create('div');
        form.id = "CountryFormDiv";
        form.innerHTML = "<div class='input-group'><select class='custom-select' id='CountryChoice'></select><img src='Images/location-pointer.svg' class='input-group-append img-fluid p-0 m-0' alt='Current Location' id='CurrentLocation'></div>";
        return form;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

L.control.select = function(opts) {
    return new L.Control.select(opts);
}

L.control.select({ position: 'topleft' }).addTo(mymap);

L.Control.data = L.Control.extend({
    onAdd: function(map) {
        var form = L.DomUtil.create('div');
        form.id = "DataTable";
        form.innerHTML = "<div class='swiper-container'><div class='swiper-wrapper'><div class='swiper-slide'><table class='table table-dark'><tr><th>Country</th><td id='countryName'></td></tr><tr><th>Capital City</th><td id='capitalCity'></td></tr><tr><th>Population</th><td id='Population'></td></tr></table></div><div class='swiper-slide'><table class='table table-dark'><thead><th>Now</th></thead><tbody><tr><td id='currentWeather'></td></tr></tbody></table></div><div class='swiper-slide'><table class='table table-dark'><thead><th>Currency</th><th>GBP</th><th>USD</th><th>EUR</th></thead><tbody><tr><td id='currency'></td><td id='GBP'></td><td id='USD'></td><td id='EUR'></td></tr></tbody></table></div></div></div><div class='swiper-pagination'></div>";
        return form;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

L.control.data = function(opts) {
    return new L.Control.data(opts);
}

L.control.data({ position: 'topleft' }).addTo(mymap);
var mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  })

$(document).ready(function(){
    $.ajax({
        url: "PHP/GetSelectCountries.PHP",
        type: 'POST',
        dataType: 'json',
        success: function(result) {
            

            if (result.status.name == "ok") {
                $x = result.len;
                for (let index = 0; index < $x; index++) {
                    $('#CountryChoice').append($('<option>', {
                    value: result.data[index]["countryCode"],
                    text: result.data[index]["countryName"]
                }));
                    
                }

                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
    CurrentPosition();
})
$("#CountryChoice").change(function(){
    console.log("countryChange")
    console.log($("#CountryChoice :selected").val())
    main($("#CountryChoice :selected").val())
})
    
//checks if browser supports Geolocation (runs on Current Location icon) 
$("#CurrentLocation").click(function(){
    CurrentPosition();
})
function CurrentPosition(){
    console.log("Getting Current Location");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(GetCountryCode);
      } else { 
        alert( "Geolocation is not supported by this browser." );
      }
}
function main(countryCode){
    $.ajax({
        url: "PHP/Main.PHP",
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode: countryCode
        },
        success: function(result) {
            

            if (result.status.name == "ok") {
                console.log(result.data["coords"]);

                //Lang and lat are the wrong way round in JSON so need to be flipped 
                var polygon = L.polygon(result.data["coords"],{color: 'red'}).addTo(mymap);

                // zoom the map to the polyline
                mymap.fitBounds(polygon.getBounds());

                // $('#currentWeather').html("<img src='"+result.data["Weather"]["current"] + "'>");
                console.log(result.data["currency"]["EUR"].toFixed(2));
                $('#countryName').html(result.data["geonames"][0]["countryName"]);
                $('#capitalCity').html(result.data["geonames"][0]["capital"]);
                $('#Population').html(result.data["geonames"][0]["population"]);
                $('#currency').html(result.data["currency"]["currentCurrency"]);
                $('#GBP').html(result.data["currency"]["GBP"].toFixed(2));
                $('#USD').html(result.data["currency"]["USD"].toFixed(2));
                $('#EUR').html(result.data["currency"]["EUR"].toFixed(2));

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}
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
            

            if (result.status.name == "ok") {
                console.log(result.data);

                $('#CountryChoice').val(result.data);
                main(result.data);
                

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
    
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
            

            if (result.status.name == "ok") {
                content = ("<table><thead><tr><th>Currency</th><th>GBP</th><th>USD</th><th>EUR</th></tr></thead><tbody><tr><td>"+Currency+"</td><td>"+(result["data"]["GBP"]).toFixed(2)+"</td><td>"+(result["data"]["USD"]).toFixed(2)+"</td><td>"+(result["data"]["EUR"]).toFixed(2)+"</td></tr></tbody></table>");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
        
    });
}
function GetWeather(Capital,Location){
    
    $.ajax({
        url: "PHP/GetWeather.PHP",
        type: 'POST',
        dataType: 'json',
        data: {
            capital: Capital,
        },
        success: function(result) {
            

            if (result.status.name == "ok") {
                var Wimage = result["data"];
                content = "<p>Current Weather</p><img src='"+ Wimage +"' />";
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}