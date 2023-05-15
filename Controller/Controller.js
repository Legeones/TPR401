
let directionService, directionRenderer;
let sourceAutoComplete, destinationAutoComplete;

function initMap() {
    const paris = {lat: 48.866667, lng: 2.333333};
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: paris,
    });
    google.maps.event.addListener(map, "click", function (event) {
        this.setOptions({scrollWheelZoom: true})
    })
    directionService = new google.maps.DirectionsService();
    directionRenderer = new google.maps.DirectionsRenderer();
    directionRenderer.setMap(map);
    sourceAutoComplete = new google.maps.places.Autocomplete(
        document.getElementById("source")
    );
    destinationAutoComplete = new google.maps.places.Autocomplete(
        document.getElementById("destination")
    );
}

function calcRoute(){
    var source = document.getElementById("source").value;
    var dest = document.getElementById("destination").value;
    let request = {
        origin: source,
        destination: dest,
        travelMode: 'WALKING',
        avoidHighways: document.getElementById("highways").checked,
        avoidFerries: document.getElementById("ferries").checked,
        avoidTolls: document.getElementById("tolls").checked,
    }
    directionService.route(request, function (result, status){
        if (status==="OK"){
            directionRenderer.setDirections(result);
            let message = result.routes[0].legs[0].distance + " et " + result.routes[0].legs[0].duration;
            alert(message)
        }
    })
}

window.initMap = initMap;