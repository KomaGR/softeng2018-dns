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

function onClick(e) {
    geocodeService.reverse().latlng(e.latlng).run(function (error, result) {

        markerdata = JSON.stringify({
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
            shopAddress: result.address.Match_addr,
            new: false
        });
    });
    if (mymarker != null) {
        mymap.removeLayer(mymarker);
        mymarker = null;
    }
}

function newMarker(e) {
    if (mymarker != null) {
        mymap.removeLayer(mymarker);
    }
    geocodeService.reverse().latlng(e.latlng).run(function (error, result) {
        mymarker = L.marker(result.latlng).addTo(mymap).bindPopup(result.address.Match_addr).openPopup();

        data = JSON.stringify({
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
            shopAddress: result.address.Match_addr,
            new: true
        });

    });
}

function myMap() {
    navigator.geolocation.getCurrentPosition(function (location) {
        var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

        mymap = L.map('map').setView(latlng, 16)
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiYmJyb29rMTU0IiwiYSI6ImNpcXN3dnJrdDAwMGNmd250bjhvZXpnbWsifQ.Nf9Zkfchos577IanoKMoYQ'
        }).addTo(mymap);

        var userIcon = L.icon({
            iconUrl: 'images/user_map.png',

            iconSize: [60, 60], // size of the icon
            iconAnchor: [30, 60], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -60] // point from which the popup should open relative to the iconAnchor
        });

        geocodeService.reverse().latlng(latlng).run(function (error, result) {
            markerdata = JSON.stringify({
                latitude: latlng.lat,
                longitude: latlng.lng,
                shopAddress: result.address.Match_addr,
                new: false
            });
        });

        var marker = L.marker(latlng, { icon: userIcon })
                        .addTo(mymap)
                        .bindPopup('<b>You are here!</b>')
                        .openPopup()
                        .on('click', onClick);

        mymap.on('click', (e) => {
            console.log(e.latlng.lat);
            newMarker(e);
        });
    });
}

function postShop() {

}

function confirmShop() {
    if (mymarker != null) {
        document.getElementById("newShop").style.visibility = "visible";
    } else {
        parameters = {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": 'application/json'
            },
            body: markerdata
        };

        fetch('https://localhost:3000/map', parameters)
            .then(res => res.json())
            .then(response => console.log("Success!", JSON.stringify(response)))
            .catch(error => console.error("Oopsie", error));
    }
}

function inputShop() {
    var b = JSON.parse(data);
    var shopname = document.getElementById("sn").value;
    var shoptags = document.getElementById("st").value;
    var shoplat = b.latitude;
    var shoplng = b.longitude;
    var shopad = b.shopAddress;
    parsedata = JSON.stringify({
        latitude: shoplat,
        longitude: shoplng,
        shopAddress: shopad,
        new: true,
        shopname: shopname,
        shoptags: shoptags
    });
    parameters = {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            "Content-Type": 'application/json'
        },
        body: parsedata,
    };
    fetch('https://localhost:3000/map', parameters)
        .then(res => res.json())
        .then(response => console.log("Success!", JSON.stringify(response)))
        .catch(error => console.error("Oopsie", error));
}


myMap();
