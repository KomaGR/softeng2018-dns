var mymarker = null;
var oldmymarker;
var mymap;
var data;
var markerdata;
var geocodeService = L.esri.Geocoding.geocodeService();
var parameters;
var parsedata;
var script_tag = document.getElementById("searcher");
var shops = JSON.parse(script_tag.getAttribute("name"));
var id;


function hideButton() {
    document.getElementById("newShop").style.visibility = "hidden";
    document.getElementById("oldShop").style.visibility = "hidden";
}

/* Add method to get nearby shops */

function newOldMarker(e) {
    var mylatlng = new L.LatLng(e.lat,e.lng);
    id = e.id;
    oldmymarker = L.marker(mylatlng).addTo(mymap).bindPopup(e.name).on('click', (e)=>{
        for ( var i=0; i<shops.length; i++){
            //console.log(e.lat + " vs " + shops[i].lat);
            if ( (e.latlng.lat == shops[i].lat) && (e.latlng.lng == shops[i].lng)){
                //console.log("zonk");
                id = shops[i].id;
            }
        }
        markerdata = {
            shopId: id
        }
        if (mymarker) {
            mymap.removeLayer(mymarker);
            mymarker = null;
        }
        console.log(markerdata);
    });
}

function newMarker(e) {
    if (mymarker) {
        mymap.removeLayer(mymarker);
        mymarker = null;
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
    //if (mymarker) {
        // If we have an active marker for the store
        if (mymarker === null){
            document.getElementById("oldShop").style.visibility = "visible";
            document.getElementById("shopId").value = markerdata.shopId;    
        } else {
            document.getElementById("newShop").style.visibility = "visible";
            document.getElementById("lat").value = markerdata.lat;
            document.getElementById("lng").value = markerdata.lng;        
            document.getElementById("address").value = markerdata.address;
    
        }
    //} else {
    //    console.error("Error: No marker selected.")
    //}
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

        for ( var i=0; i<shops.length; i++){
            newOldMarker(shops[i]);
        }

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
                if (mymarker) {
                    mymap.removeLayer(mymarker);
                }
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
