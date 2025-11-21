var wms_layers = [];


        var lyr_OpenStreetMap_0 = new ol.layer.Tile({
            'title': 'OpenStreetMap',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });
var format_Squadrats_1 = new ol.format.GeoJSON();
var features_Squadrats_1 = format_Squadrats_1.readFeatures(json_Squadrats_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Squadrats_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Squadrats_1.addFeatures(features_Squadrats_1);
var lyr_Squadrats_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Squadrats_1, 
                style: style_Squadrats_1,
                popuplayertitle: 'Squadrats',
                interactive: true,
    title: 'Squadrats<br />\
    <img src="styles/legend/Squadrats_1_0.png" /> squadratinhos<br />\
    <img src="styles/legend/Squadrats_1_1.png" /> squadrats<br />\
    <img src="styles/legend/Squadrats_1_2.png" /> ubersquadrat<br />\
    <img src="styles/legend/Squadrats_1_3.png" /> ubersquadratinho<br />\
    <img src="styles/legend/Squadrats_1_4.png" /> <br />' });

lyr_OpenStreetMap_0.setVisible(true);lyr_Squadrats_1.setVisible(true);
var layersList = [lyr_OpenStreetMap_0,lyr_Squadrats_1];
lyr_Squadrats_1.set('fieldAliases', {'id': 'id', 'Name': 'Name', 'description': 'description', 'timestamp': 'timestamp', 'begin': 'begin', 'end': 'end', 'altitudeMode': 'altitudeMode', 'tessellate': 'tessellate', 'extrude': 'extrude', 'visibility': 'visibility', 'drawOrder': 'drawOrder', 'icon': 'icon', 'size': 'size', });
lyr_Squadrats_1.set('fieldImages', {'id': 'TextEdit', 'Name': 'TextEdit', 'description': 'TextEdit', 'timestamp': 'TextEdit', 'begin': 'TextEdit', 'end': 'TextEdit', 'altitudeMode': 'TextEdit', 'tessellate': 'Range', 'extrude': 'Range', 'visibility': 'Range', 'drawOrder': 'TextEdit', 'icon': 'TextEdit', 'size': 'TextEdit', });
lyr_Squadrats_1.set('fieldLabels', {'id': 'no label', 'Name': 'no label', 'description': 'no label', 'timestamp': 'no label', 'begin': 'no label', 'end': 'no label', 'altitudeMode': 'no label', 'tessellate': 'no label', 'extrude': 'no label', 'visibility': 'no label', 'drawOrder': 'no label', 'icon': 'no label', 'size': 'no label', });
lyr_Squadrats_1.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});