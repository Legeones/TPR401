<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
    <link rel="stylesheet" href="css/styles.css">
<!--    <link rel="stylesheet" type="text/css" href="./style.css" />-->
<!--    <script type="module" src="./index.js"></script>-->
    <script src="../Controller/Controller.js"></script>
</head>
<body>
<h1 style="text-align: center">Itinéraire Map</h1>
<div class="form_desti">
    <label>
        <input id="source" type="text" class="form_desti_input" placeholder="From Location">
    </label>
    <label>
        <input id="destination" type="text" class="form_desti_input" placeholder="To Location">
    </label>
    <div class="div_label">
        <label class="label_check">
            Esquiver autoroutes:
            <input id="highways" type="checkbox">
        </label>
        <label class="label_check">
            Esquiver férries:
            <input id="ferries" type="checkbox">
        </label>
        <label class="label_check">
            Esquiver péages:
            <input id="tolls" type="checkbox">
        </label>
    </div>

    <button onclick="calcRoute()">Calculer</button>
</div>
<div id="map" style="height: 600px"></div>
<script async
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBTcVGnVeUmBWxifCThnkq_X91rwS03Ngk&libraries=places,routes&callback=initMap">
</script>
</body>
</html>