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
var d = new Date();
var n = d.getDay()
switch (n){
    case n=0:
        var day3= "Tuesday";
        break;
    case n=1:
        var day3= "Wednesday";
        break;
    case n=2:
        var day3= "Thursday";
        break;
    case n=3:
        var day3= "Friday";
        break;
    case n=4:
        var day3= "Saturday";
        break;   
    case n=5:
        var day3= "Sunday";
        break; 
    case n=6:
        var day3= "Monday";
        break; 
}
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
        form.innerHTML = "<div class='swiper-container'><div class='swiper-wrapper'><div class='swiper-slide' id='Picture'></div><div class='swiper-slide card'><table class='table table-light table-bordered'><tr><th>Country</th><td id='countryName'></td></tr><tr><th>Capital City</th><td id='capitalCity'></td></tr><tr><th>Population</th><td id='Population'></td></tr></table></div><div class='swiper-slide card'><table class='table table-light table-bordered'><thead><th>Current</th><th>Tomorrow</th><th>"+day3+"</th></thead><tbody><tr><td id='currentWeather'></td><td id='weatherDay2'></td><td id='weatherDay3'></td></tr></tbody></table></div><div class='swiper-slide card'><table class='table table-light table-bordered'><thead><th>Currency</th><th>GBP</th><th>USD</th><th>EUR</th></thead><tbody><tr><td id='currency'></td><td id='GBP'></td><td id='USD'></td><td id='EUR'></td></tr></tbody></table></div><div class='swiper-slide card'><table class='table table-light'><thead><tr><th>Wikipedia Tourist Links</tr><tr><th id='WikiTitle1'></th></tr><tr><th id='WikiTitle2'></th></tr></table></div></div></div><div class='swiper-pagination'></div>";
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
    loop: false,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      }
  })

var CurrentIcon = L.icon({
    iconUrl: "Images/location-pointer.svg",
    

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
});

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
                $type = result.data['borders']["type"];
                    if($type === "MultiPolygon"){
                        
                        coordsArray = Array();
                        // Test = L.GeoJSON(result.data['borders']["coords"][0],{coordsToLatLang(coords){
                        //     coords.foreach(coord=>{
                        //         return new L.LatLng(coord);
                        //     })
                        // }})
                        
                        result.data['borders']["coords"].forEach(coordA => {
                            coordA.forEach(coord=>{  
                                // console.log(coord);
                                coordArray = Array();
                                coord.forEach(coordB=>{
                                    coordB = coordB.reverse();
                                    coordArray.push(coordB);
                                });
                                coordsArray.push(coordArray);
                                // console.log(coordsArray)
                            }); 
                            
                        });
                    }else{
                        result.data['borders']["coords"].forEach(coordA => {
                            coordsArray = Array();
                                coordA.forEach(coordB=>{
                                    coordB = coordB.reverse();
                                    coordsArray.push(coordB);
                                });
                        });
                    };
                    
                //Lang and lat are the wrong way round in JSON so need to be flipped 
                var polygon = L.polygon(coordsArray,{color: 'blue'}).addTo(mymap);
               
                // zoom the map to the polyline
                mymap.fitBounds(polygon.getBounds(),{'duration': 2.5});
                $('#Picture').html("<img class='picture' src='"+result.data["picture"] + "'>");
                $('#currentWeather').html("<img class='weather' src='"+result.data["Weather"]["current"] + "'>");
                $('#weatherDay2').html("<img class='weather' src='"+result.data["Weather"]["day2"] + "'>");
                $('#weatherDay3').html("<img class='weather' src='"+result.data["Weather"]["day3"] + "'>");
                $('#countryName').html(result.data["geonames"][0]["countryName"]);
                $('#capitalCity').html(result.data["geonames"][0]["capital"]);
                $('#Population').html(result.data["geonames"][0]["population"]);
                $('#currency').html(result.data["currency"]["currentCurrency"]);
                $('#GBP').html(result.data["currency"]["GBP"]);
                $('#USD').html(result.data["currency"]["USD"]);
                $('#EUR').html(result.data["currency"]["EUR"]);
                $('#WikiTitle1').html("<a href='https://"+result.data['WikiLinks'][0]['wikipediaUrl']+"'>"+result.data['WikiLinks'][0]['title']+"</a>");
                $('#WikiTitle2').html("<a href='https://"+result.data['WikiLinks'][1]['wikipediaUrl']+"'>"+result.data['WikiLinks'][1]['title']+"</a>");
                $('#WikiTitle3').html("<a href='https://"+result.data['WikiLinks'][2]['wikipediaUrl']+"'>"+result.data['WikiLinks'][2]['title']+"</a>");
                
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
        title: "Current Location",
        icon: CurrentIcon
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
