(async () => {
    const temperaturesCaneva 
        = document.getElementById('temperatures')

    // Charger les données de l'api sur base de coordonnées
    const loadData = async (lat, long) => {
        return await fetch(`https://www.prevision-meteo.ch/services/json/lat=${lat}lng=${long}`)
            .then(data => data.json())
    }

    // récupérer la position actuelle
    const getPosition = () => {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(p => {
                const pos = { 
                    lat: p.coords.latitude,
                    lng: p.coords.longitude,
                }
                resolve(pos);
            })
        })
    }

    // afficher le graphique
    const displayChart = (data) => {

        const labels = Object.keys(data.fcst_day_0.hourly_data)
            .filter((_, i) => i % 3 === 0);
        
        const datasets = [];
        
        for(let i = 0; i < 5; i++) {
            const previsions = data['fcst_day_' + i];

            const dataset = {
                label: previsions.day_long + ' ' + previsions.date,
                data: Object.values(
                    previsions.hourly_data)
                    .reduce((prev, next, i) => {
                        if(i % 3 === 0){
                            prev.push(next.TMP2m / 3)
                        } else {
                            prev[prev.length - 1] += next.TMP2m / 3
                        }
                        return prev;
                    }, [])
            }
            datasets.push(dataset)
        }

        new Chart(temperaturesCaneva ,{
            type: 'line',
            data: {
                labels, // x
                datasets // y
            },
            options: {}
        })
    }

    const position = await getPosition();
    const data = await loadData(position.lat, position.lng);
    displayChart(data);
})()



