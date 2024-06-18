// Replace 'your-cesium-ion-access-token' with the token you copied
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMzZlMDI2MC05YjAyLTRhMWQtYTQxMC02M2ZiYTY4ZDMyNmIiLCJpZCI6MjIwMjQxLCJpYXQiOjE3MTc1Nzk5Njh9.od6Gar2MbKhbBGsZyyi_qqP6be69uEn38uCzpMF1r1M';
const weatherApiKey = '35b62e7b995382384d0d7207ae94028c';

// Initialize the Cesium Viewer in the HTML element with the ID `cesiumContainer`.
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});

// Function to display coordinates and weather information
function showInfo(cartesian) {
    const ellipsoid = viewer.scene.globe.ellipsoid;
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian, ellipsoid);
    const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
    const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);

    // Fetch weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;

            const infoBox = document.getElementById('infoBox');
            infoBox.textContent = `Longitude: ${longitude}°, Latitude: ${latitude}°\n` +
                                  `Weather: ${weatherDescription}, Temperature: ${temperature}°C`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            const infoBox = document.getElementById('infoBox');
            infoBox.textContent = `Longitude: ${longitude}°, Latitude: ${latitude}°\n` +
                                  `Weather data not available.`;
        });
}

// Event listener for click events
viewer.screenSpaceEventHandler.setInputAction(function(click) {
    const cartesian = viewer.scene.pickPosition(click.position);
    if (Cesium.defined(cartesian)) {
        showInfo(cartesian);
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
