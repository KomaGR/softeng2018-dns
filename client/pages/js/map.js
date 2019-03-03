var mymarker = null;
var mymap;
var data;
var markerdata;
var geocodeService = L.esri.Geocoding.geocodeService();
var parameters;
var parsedata;

function hideButton() {
    document.getElementById("newShop").style.visibility = "hidden";
}

/* Add method to get nearby shops */

function newMarker(e) {
    if (mymarker) {
        mymap.removeLayer(mymarker);
    }
    // Reverse geo search
    geocodeService.reverse().latlng(e.latlng).run(function (error, result) {
        mymarker = L.marker(result.latlng).addTo(mymap).bindPopup(result.address.Match_addr).openPopup();

        markerdata = {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            address: result.address.Match_addr,
            withdrawn: false
        };

        console.log(markerdata);
    });
}

function confirmShop() {
    if (mymarker) {
        // If we have an active marker for the store
        document.getElementById("newShop").style.visibility = "visible";

        document.getElementById("lat").value = markerdata.lat;
        document.getElementById("lng").value = markerdata.lng;        
        document.getElementById("address").value = markerdata.address;
    } else {
        console.error("Error: No marker selected.")
    }
}

// function inputShop() {

//     var shop_name = document.getElementById("shop-name").value;
//     var shop_tags = document.getElementById("shop-tags").value;
    
//     const shop_data = markerdata;
//     shop_data['name'] = shop_name;
//     shop_data['tags'] = shop_tags.split(',');

//     console.log(shop_data['tags']);
//     document.getElementById("shop-tags").value = shop_data['tags'];

//     document.getElementById("newShop").submit();
// }

function myMap() {    
    navigator.geolocation.getCurrentPosition(function (location) {

        var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
        mymap = L.map('map').setView(latlng, 16);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiYmJyb29rMTU0IiwiYSI6ImNpcXN3dnJrdDAwMGNmd250bjhvZXpnbWsifQ.Nf9Zkfchos577IanoKMoYQ'
        }).addTo(mymap);

        var userIcon = L.icon({
            iconUrl: 'images/user_map.png',

            iconSize: [60, 60],     // size of the icon
            iconAnchor: [30, 60],   // point of the icon which will correspond to marker's location
            popupAnchor: [0, -60]   // point from which the popup should open relative to the iconAnchor
        });

        geocodeService.reverse().latlng(latlng).run(function (error, result) {
            markerdata = {
                lat: latlng.lat,
                lng: latlng.lng,
                address: result.address.Match_addr,
                withdrawn: false
            };
            console.log(markerdata);
        });

        var marker = L.marker(latlng, { icon: userIcon })
            .addTo(mymap)
            .bindPopup('<b>You are here!</b>')
            .openPopup()
            .on('click', (e) => {
                geocodeService.reverse().latlng(e.latlng).run(function (error, result) {

                    markerdata = {
                        lat: e.latlng.lat,
                        lng: e.latlng.lng,
                        address: result.address.Match_addr,
                        withdrawn: false
                    };
                    console.log(markerdata);
                });
                mymarker = this;
            });

        mymap.on('click', newMarker);
    });
}

/* This method is called when the page loads */
function onLoad() {
    hideButton();
    myMap();
}
