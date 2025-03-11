// Coordenadas de los límites de la imagen (esquina superior izquierda y esquina inferior derecha)
var bounds = [
    [0, 0],           // Esquina superior izquierda (y, x)
    [4000, 3000]      // Esquina inferior derecha (y, x)
];

// Crear el mapa
var map = L.map('map', {
    crs: L.CRS.Simple, // Usar un sistema de coordenadas simple (sin proyección geográfica)
    minZoom: -2,       // Ajustar el zoom mínimo para que la imagen no se vea demasiado pequeña
    maxZoom: 3         // Ajustar el zoom máximo para que la imagen no se vea demasiado pixelada
});

// Añadir la imagen como capa base
var image = L.imageOverlay('img/anvil_map.jpeg', bounds).addTo(map);

// Ajustar la vista del mapa al centro de la imagen
map.fitBounds(bounds);

// Cargar los marcadores desde el archivo JSON
fetch('markers.json')
    .then(response => response.json()) // Convertir la respuesta a JSON
    .then(markers => {
        markers.forEach(markerData => {
            // Verificar que las coordenadas estén definidas
            if (!markerData.coordinates || !Array.isArray(markerData.coordinates)) {
                console.error("Coordenadas no válidas para el marcador:", markerData);
                return;
            }

            // Si el marcador es de tipo "circle", crear un círculo
            if (markerData.type === "circle") {
                L.circle(markerData.coordinates, {
                    color: markerData.color,
                    fillColor: markerData.fillColor,
                    fillOpacity: markerData.fillOpacity,
                    radius: markerData.radius
                }).addTo(map);
            } else {
                // Si no es un círculo, crear un marcador
                var icon = markerData.icon ? L.icon({
                    iconUrl: markerData.icon,
                    iconSize: markerData.iconSize,
                    iconAnchor: markerData.iconAnchor,
                    popupAnchor: markerData.popupAnchor
                }) : null;

                // Crear un marcador
                var markerOptions = {};
                if (icon) {
                    markerOptions.icon = icon;
                }
                var marker = L.marker(markerData.coordinates, markerOptions).addTo(map);

                // Añadir un popup si está definido
                if (markerData.popupText) {
                    marker.bindPopup(markerData.popupText).openPopup();
                }
            }
        });
    })
    .catch(error => console.error('Error cargando los marcadores:', error));

// Obtener el elemento donde se mostrarán las coordenadas
var coordsDisplay = document.getElementById('coords');

// Evento para actualizar las coordenadas al mover el ratón sobre el mapa
map.on('mousemove', function(e) {
    // Obtener las coordenadas del ratón (en el sistema de coordenadas de la imagen)
    var coords = e.latlng;
    // Actualizar el contenido del span con las coordenadas
    coordsDisplay.textContent = `(${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`;
});