const weather = document.getElementById("main_weather")
let query = "http://api.weatherapi.com/v1/current.json?key=4dc742e4282c49a3a2d175330212110&"
const days =["Sunday","Monday","Thuesday","Wednesday","Thursday","Friday","Saturday",]
navigator.geolocation.getCurrentPosition(e => {
    query += `q=${e.coords.latitude},${e.coords.longitude}`
    console.log(e)
    fetch(query)
        .then(response => response.json())
        .then(response2 => {
            console.log(response2)
            const date = new Date()
            document.getElementById("date_day").innerText = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`
            document.getElementById("date_dayname").innerText = `${days[date.getDay()]}`
            document.getElementById("search").value = `${response2.location.name}`
        })
})
fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyB2oyG_Z1UcjXZ1IyUXa_VpgMhIGsggLxY")
.then(r=>console.log(r.json()))


