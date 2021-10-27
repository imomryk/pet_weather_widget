const weather = document.getElementById("main_weather")
let query = "https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely,alerts&appid=c4c979e5736f06ccaf01358f455ee24e&"
const days =["Sunday","Monday","Thuesday","Wednesday","Thursday","Friday","Saturday",]



navigator.geolocation.getCurrentPosition(e => {
    let latitude = e.coords.latitude
    let longitude = e.coords.longitude
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=24b0b062d3c94efaab4bcca77b291472`,{method: 'GET',})
    .then(response => response.json())
    .then(resultReverseGeo => {
        let currCity = resultReverseGeo.features[0].properties.city
        document.getElementById("search").value = `${currCity}`
        query += `lat=${latitude}&lon=${longitude}`
        
        
        fetch(query)
        .then(response => response.json())
        .then(resultWeather => {
            console.log(resultWeather)
            console.log(resultWeather.current.dt)
            const currDate = new Date(resultWeather.current.dt)
            console.log(currDate)
            document.getElementById("date_day").innerText = `${currDate.getDate()}.${currDate.getMonth()+1}.${currDate.getFullYear()}`
            document.getElementById("date_dayname").innerText = `${days[currDate.getDay()]}`
        })
        .catch(err=>console.log("err:",err))
    })
    .catch(error => console.log('error', error));
    
})

