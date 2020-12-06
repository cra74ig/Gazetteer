streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "<div>Icons made by <a href='https://www.flaticon.com/authors/freepik' title='Freepik'>Freepik</a> from <a href='https://www.flaticon.com/' title='Flaticon'>www.flaticon.com</a><br/>Map data &copy <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a></div>",
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY3JhNzRpZyIsImEiOiJja2c5azJrZGEwMHFoMnNzdzVjZmd5eDJ6In0.bZuD8zD7pmYGbg9tibxE4w',
    closePopupOnClick:false,
})
satellite =L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "<div>Icons made by <a href='https://www.flaticon.com/authors/freepik' title='Freepik'>Freepik</a> from <a href='https://www.flaticon.com/' title='Flaticon'>www.flaticon.com</a><br/>Map data &copy <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a></div>",
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY3JhNzRpZyIsImEiOiJja2c5azJrZGEwMHFoMnNzdzVjZmd5eDJ6In0.bZuD8zD7pmYGbg9tibxE4w',
    closePopupOnClick:false,
});
var mymap = L.map('mapid',{zoomControl:false, layers:[satellite]}).setView([51.505, -0.09], 11);
var baseMaps = {
    "Satellite": satellite,
    "Streets": streets
};
L.control.layers(baseMaps).addTo(mymap);

// L.easyButton("fa-compass",CurrentPosition()).addTo(mymap);
var d = new Date();
var n = d.getDay()
switch (n){
    case n=0:
        var day3= "Tuesday";
        var day4= "Wednesday";
        var day5= "Thursday";
        break;
    case n=1:
        var day3= "Wednesday";
        var day4= "Thursday";
        var day5= "Friday";
        break;
    case n=2:
        var day3= "Thursday";
        var day4= "Friday";
        var day5= "Saturday";
        break;
    case n=3:
        var day3= "Friday";
        var day4= "Saturday";
        break;
    case n=4:
        var day3= "Saturday";
        var day4= "Sunday";
        var day5= "Monday";
        break;   
    case n=5:
        var day3= "Sunday";
        var day4= "Monday";
        var day5= "Tuesday";
        break; 
    case n=6:
        var day3= "Monday";
        var day4= "Tuesday";
        var day5= "Wednesday";
        break; 
}


L.Control.select = L.Control.extend({
    onAdd: function(map) {
        var form = L.DomUtil.create('div');
        form.id = "CountryFormDiv";
        form.innerHTML = "<div class='input-group'><select class='custom-select' id='CountryChoice'></select></div>";
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

L.easyButton('fa-compass currentIcon', function(){CurrentPosition()},{position: 'topright'}).addTo(mymap);

L.Control.data = L.Control.extend({
    onAdd: function(map) {
        var form = L.DomUtil.create('div');
        form.id = "DataTable";
        form.innerHTML = "<div class='container'><ul class='nav nav-pills'><li class='active'><a href='#Overview' data-toggle='tab'>Overview</a></li><li><a href='#picture' data-toggle='tab'>Picture</a></li><li><a href='#weather' data-toggle='tab'>Weather</a></li><li><a href='#currency-tab' data-toggle='tab'>Currency</a></li></ul><div class='tab-content clearfix'> <div class='tab-pane active' id='Overview'><table class='table table-light table-bordered'><tr><th>Country</th><td id='countryName'></td></tr><tr><th>Capital City</th><td id='capitalCity'></td></tr><tr><th>Population</th><td id='Population'></td></tr><tr><th>Wikipedia Tourist Links</th><td id='WikiLinks'></td></tr></table> </div> <div class='tab-pane' id='picture'> <div class='container'><div id='myCarousel' class='carousel slide' data-ride='carousel'><ol class='carousel-indicators'><li data-target='#myCarousel' data-slide-to='0' class='active'></li><li data-target='#myCarousel' data-slide-to='1'></li><li data-target='#myCarousel' data-slide-to='2'></li></ol><div class='carousel-inner' id='Pictures'></div><a class='left carousel-control' href='#myCarousel' data-slide='prev'><span class='glyphicon glyphicon-chevron-left'></span><span class='sr-only'>Previous</span></a><a class='right carousel-control' href='#myCarousel' data-slide='next'><span class='glyphicon glyphicon-chevron-right'></span><span class='sr-only'>Next</span></a></div></div></div> <div class='tab-pane' id='weather'><table class='table table-light table-bordered'><thead><th>Current</th><th>Tomorrow</th><th>"+day3+"</th><th>"+day4+"</th></thead><tbody><tr><td id='currentWeather'></td><td id='weatherDay2'></td><td id='weatherDay3'></td><td id='weatherDay4'></td></tr></tbody></table></div> <div class='tab-pane' id='currency-tab'><table class='table table-light table-bordered'><thead><th>Currency</th><th>GBP</th><th>USD</th><th>EUR</th></thead><tbody><tr><td id='currency'></td><td id='GBP'></td><td id='USD'></td><td id='EUR'></td></tr></tbody></table></div></div></div>";
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

var CurrentIcon = L.divIcon({
    html: '<i class="fas fa-street-view currentIcon"></i>',

    className: 'myDivIcon'
})
var tackIcon = L.divIcon({
    html: '<i class="fas fa-map-pin locationIcon"></i>',

    className: 'myDivIcon'
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
            console.log(result);

            if (result.status.name == "ok") {
                $type = result.data['borders']["type"];
                    if($type === "MultiPolygon"){
                        
                        coordsArray = Array();

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
                if (mymap.hasLayer(window.markerGroup)) {
                    console.log("test");
                    mymap.removeLayer(window.markerGroup);
                    }
                window.markerGroup = L.layerGroup().addTo(mymap);
                window.polygon = L.polygon(coordsArray,{color: 'blue'}).bindTooltip(result.data["geonames"][0]["countryName"],{
                    sticky: true
                }).addTo(markerGroup);
                var pictureHtml; 
                var first = true
                result.data["webPicture"].forEach(picture => {
                    if (first){
                        pictureHtml="<div class='item active'><img src='"+picture+"'></div>"
                        first= false;
                        console.log(pictureHtml)
                    }else{
                        pictureHtml = pictureHtml + "<div class='item'><img src='"+picture+"'></div>"
                        console.log(pictureHtml)
                    }
                });
                // zoom the map to the polyline
                mymap.fitBounds(polygon.getBounds());
                $("#News").html("<h2>Global News</h2><h3>"+result.data["news"]["title"]+"</h3>"+result.data["news"]["description"]+"<a href="+result.data["news"]["url"]+">Read more</a>")
                $('#Pictures').html(pictureHtml);
                $('#currentWeather').html("<img class='weather' src='"+result.data["Weather"]["current"]["condition"]["icon"] + "'><h3>"+result.data["Weather"]["current"]["temp_c"]+"&#8451<h3>");
                $('#weatherDay2').html("<img class='weather' src='"+result.data["Weather"]["day2"]["condition"]["icon"] + "'><h3>"+result.data["Weather"]["day2"]["maxtemp_c"]+"&#8451</h3><p>"+result.data["Weather"]["day2"]["mintemp_c"]+"&#8451</p>");
                $('#weatherDay3').html("<img class='weather' src='"+result.data["Weather"]["day3"]["condition"]["icon"] + "'><h3>"+result.data["Weather"]["day3"]["maxtemp_c"]+"&#8451</h3><p>"+result.data["Weather"]["day3"]["mintemp_c"]+"&#8451</p>");
                $('#weatherDay4').html("<img class='weather' src='"+result.data["Weather"]["day4"]["condition"]["icon"] + "'><h3>"+result.data["Weather"]["day4"]["maxtemp_c"]+"&#8451</h3><p>"+result.data["Weather"]["day4"]["mintemp_c"]+"&#8451</p>");
                $('#countryName').html(result.data["geonames"][0]["countryName"]);
                $('#capitalCity').html(result.data["geonames"][0]["capital"]);
                $('#Population').html(result.data["geonames"][0]["population"]);
                $('#currency').html(result.data["currency"]["currentCurrency"]);
                $('#GBP').html(result.data["currency"]["GBP"]);
                $('#USD').html(result.data["currency"]["USD"]);
                $('#EUR').html(result.data["currency"]["EUR"]);
                $('#WikiLinks').html("<a href='https://"+result.data['WikiLinks'][0]['wikipediaUrl']+"'>"+result.data['WikiLinks'][0]['title']+"</a></br><a href='https://"+result.data['WikiLinks'][1]['wikipediaUrl']+"'>"+result.data['WikiLinks'][1]['title']+"</a></br><a href='https://"+result.data['WikiLinks'][2]['wikipediaUrl']+"'>"+result.data['WikiLinks'][2]['title']+"</a>");
                
                for (let index = 0; index < result.data["cities"].length; index++) {
                    var markerCorods = new L.LatLng(result.data["cities"][index]["latitude"],result.data["cities"][index]["longitude"]);
                    var marker = L.marker(markerCorods, {
                        title: result.data["cities"][index]["name"],
                        icon: tackIcon
                      }).bindTooltip(result.data["cities"][index]["name"] + "<br>Population: " + result.data["cityData"][result.data["cities"][index]["id"]]["population"],{
                          sticky: true
                      }).addTo(markerGroup);
                }

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
    var markerCorods = new L.LatLng(y,x);
    var Corods = new L.LatLng(y+0.005,x);
    mymap.setView(Corods, 15, {animation: true});
    var marker = L.marker(markerCorods, {
        title: "Current Location",
        icon: CurrentIcon
      }).bindTooltip("Current Location", {
          sticky: true
      }).addTo(mymap);
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
function showCurrency(){
    console.log("test");
}