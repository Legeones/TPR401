
var map;

function coord(city, city2) {
    var geocodingUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(city);

    return fetch(geocodingUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.length > 0) {
                var location = data[0];
                var coordinates1 = [parseFloat(location.lat), parseFloat(location.lon)];
                return coordinates1;
            } else {
                throw new Error('Erreur de géocodage pour la ville spécifiée.');
            }
        })
        .then(function(coordinates1) {
            var geocodingUrl2 = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(city2);
            return fetch(geocodingUrl2)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    if (data.length > 0) {
                        var location2 = data[0];
                        var coordinates2 = [parseFloat(location2.lat), parseFloat(location2.lon)];
                        return [coordinates1, coordinates2];
                    } else {
                        throw new Error('Erreur de géocodage pour la deuxième ville spécifiée.');
                    }
                });
        })
        .catch(function(error) {
            throw new Error('Erreur lors de la récupération des coordonnées : ' + error);
        });
}





function initialize(){
    var mapOptions = {
        zoom: 6,
        center : new google.maps.LatLng(47,2),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    }
    const map = new google.maps.Map(document.getElementById('map'),mapOptions);
    const city = document.getElementById('address').value;
    const city2 = document.getElementById('address2').value;

    var mt;

    if (document.getElementById('pied').value === '1'){
        mt = google.maps.DirectionsTravelMode.WALKING;
    }else if (document.getElementById('velo').value === '1'){
        mt = google.maps.DirectionsTravelMode.BICYCLING;
    }else if (document.getElementById('train').value === '1'){
        mt = google.maps.DirectionsTravelMode.TRANSIT;
    }else{
        mt = google.maps.DirectionsTravelMode.DRIVING;
        let defaut = document.getElementById('voiture')
        defaut.value = 1;
        defaut.style.backgroundColor = "blue";
    }
    var payage = false;
    var ferries = false;
    var autoroute = false;


    if (document.getElementById('payage').checked){
        payage = true;
    }
    if (document.getElementById('ferries').checked){
        ferries = true;
    }
    if (document.getElementById('autoroute').checked){
        autoroute = true;
    }

    console.log(document.getElementById('autoroute').checked)
    coord(city,city2)
        .then(function(coordinates) {
            var coordinates1 = coordinates[0];
            var coordinates2 = coordinates[1];
            var lat_ville1 = coordinates1[0];
            var lon_ville1 = coordinates1[1];
            var lat_ville2 = coordinates2[0];
            var lon_ville2 = coordinates2[1];


            var myLatLng = new google.maps.LatLng(lat_ville1,lon_ville1);
            var marker = new google.maps.Marker ({
                position : myLatLng,
                map : map,
            })

            var myLatLng2 = new google.maps.LatLng(lat_ville2,lon_ville2);
            var marker2 = new google.maps.Marker ({
                position : myLatLng2,
                map : map,
            });


            //trajet 1
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer({
                'map' : map
            });

            var request = {
                origin : myLatLng,
                destination : myLatLng2,
                travelMode : mt,
                unitSystem : google.maps.DirectionsUnitSystem.METRICS,
                avoidTolls: payage,
                avoidFerries : ferries,
                avoidHighways : autoroute,
            };
            directionsService.route(request, function (response, status){
                if (status === google.maps.DirectionsStatus.OK){
                    directionsDisplay.setDirections(response);
                    directionsDisplay.suppressMarkers = false;
                    directionsDisplay.setOptions({
                        polylineOptions :{strokeColor : 'blue'},
                        preserveViewport : false
                    })
                    var travelTime = response.routes[0].legs[0].duration.text;
                    var distance = response.routes[0].legs[0].distance.text;
                    console.log('Temps de trajet :', travelTime , 'avec une distance de : ', distance);
                }
            })
        })
        .catch(error => {
            console.log(error);
        });
    displayDirections(document.getElementById('address').value,document.getElementById('address2').value,mt,payage,ferries,autoroute)
    initAutocomplete();
    initAutocomplete2();
    renseignement()
}

function initAutocomplete() {
    var input = document.getElementById('address');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields(['address_components', 'geometry']);

    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();

        if (place.geometry && place.geometry.location) {
            var location = place.geometry.location;

            // Création du marqueur pour la ville sélectionnée
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                title: place.formatted_address
            });

            map.setCenter(location);
        }
    });
}

function initAutocomplete2() {
    var input2 = document.getElementById('address2');
    var autocomplete2 = new google.maps.places.Autocomplete(input2);
    autocomplete2.setFields(['address_components', 'geometry']);

    autocomplete2.addListener('place_changed', function() {
        var place2 = autocomplete2.getPlace();

        if (place2.geometry && place2.geometry.location) {
            var location2 = place2.geometry.location;

            // Création du marqueur pour la ville sélectionnée
            var marker2 = new google.maps.Marker({
                position: location2,
                map: map,
                title: place2.formatted_address
            });

            map.setCenter(location2);
        }
    });
}

function renseignement(){
    var input1 = document.getElementById('address');
    var input2 = document.getElementById('address2');
    let myH1 = document.querySelector('#rend');
    if (input1.value !== "" || input2.value !== "") {
        myH1.textContent = input1.value + ' -> ' + input2.value;
    }
}

function button_zero(){
    var buttons = document.querySelectorAll('.bt-mt');
    for (let i of buttons){
        i.value = 0
        i.style.backgroundColor = "white"
    }
}

document.getElementById('voiture').addEventListener("click", function (){
    button_zero();
    this.value = 1;
    this.style.backgroundColor = "blue";
});

document.getElementById('train').addEventListener("click", function (){
    button_zero();
    this.value = 1;
    this.style.backgroundColor = "blue";
})

document.getElementById('velo').addEventListener("click", function (){
    button_zero();
    this.value = 1;
    this.style.backgroundColor = "blue";
})

document.getElementById('pied').addEventListener("click", function (){
    button_zero();
    this.value = 1;
    this.style.backgroundColor = "blue";
})

document.getElementById('submit').addEventListener("click", function (){
    initialize();
})

function displayDirections(startAddress, endAddress,moyen_trans,payage, ferries,autoroute) {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    const mapOptions = {
        center: { lat: 0, lng: 0 },
        zoom: 10
    };

    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    directionsRenderer.setMap(map);

    var mt2;

    if (moyen_trans === 'WALKING'){
        mt2 = google.maps.TravelMode.WALKING;
    }else if (moyen_trans === 'BICYCLING'){
        mt2 = google.maps.TravelMode.BICYCLING;
    }else if (moyen_trans === 'TRANSIT'){
        mt2 = google.maps.TravelMode.TRANSIT;
    }else{
        mt2 = google.maps.TravelMode.DRIVING;
    }

    const request = {
        origin: startAddress,
        destination: endAddress,
        travelMode: mt2,
        avoidTolls: payage,
        avoidFerries: ferries,
        avoidHighways: autoroute
    };

    directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);

            // Parcourir les étapes des directions
            const route = response.routes[0];
            const div_direction= document.querySelector('#direction');
            div_direction.innerHTML = '';
            for (let i = 0; i < route.legs.length; i++) {
                const leg = route.legs[i];
                let H1 = document.createElement('h2');
                H1.textContent = ("Distance totale :" + leg.distance.text);
                let H2 = document.createElement('h2');
                H2.textContent = ("Durée totale :" + leg.duration.text);
                let P1 = document.createElement('p');
                P1.textContent =("----------------------");
                div_direction.appendChild(H1);
                div_direction.appendChild(H2);
                div_direction.appendChild(P1);

                for (let j = 0; j < leg.steps.length; j++) {
                    const step = leg.steps[j];
                    let P2 = document.createElement('p');
                    P2.textContent = (step.instructions.replace(/<[^>]+>/g, ''));
                    let P3 = document.createElement('p');
                    P3.textContent = ("Distance :"+ step.distance.text);
                    let P4 = document.createElement('p');
                    P4.textContent =("Durée :"+ step.duration.text);
                    let P5 = document.createElement('p');
                    P5.textContent =("----------------------");
                    div_direction.appendChild(P2);
                    div_direction.appendChild(P3);
                    div_direction.appendChild(P4);
                    div_direction.appendChild(P5);

                }
            }
        } else {
            console.error("Erreur de calcul des directions :", status);
        }
    });
}



