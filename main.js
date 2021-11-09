fetch("keys.txt")
    .then(response => response.json())
    .then(keys => {
        const weather = document.querySelector(".main_weather")
        const info = document.querySelector(".info")
        weather.classList.add("blur")
        info.classList.add("blur")
        // Выдвижной блок
        document.querySelector(".main_weather").addEventListener("click", e => {

            if (e.target != document.forms[0].elements[0] && e.target != document.forms[0].elements[1] && e.target != document.forms[0].elements[1].children[0]) {
                document.querySelector(".info").classList.toggle("exp")
            }

        })

        const days = ["Sunday", "Monday", "Thuesday", "Wednesday", "Thursday", "Friday", "Saturday",]
        const form = document.forms[0]

        // Старт погоды при загрузке
        navigator.geolocation.getCurrentPosition(e => {
            let latitude = e.coords.latitude
            let longitude = e.coords.longitude
            weatherRequest(latitude, longitude)
        })
        // Поиск по кнопке
        form.addEventListener("submit", e => {
            e.preventDefault()
            weather.classList.add("blur")
            info.classList.add("blur")
            console.log(form.elements[0].value)
            fetch(`https://api.geoapify.com/v1/geocode/search?apiKey=${keys.geoapi}&text=${form.elements[0].value}`, { method: 'GET', })
                .then(response => response.json())
                .then(result => {
                    const latitude = result.features[0].geometry.coordinates[1]
                    const longitude = result.features[0].geometry.coordinates[0]
                    console.log(latitude, longitude)
                    weatherRequest(latitude, longitude)

                })
                .catch(error => console.log('error', error));
        })
        // Geo API cuz openweather dont return city name
        const weatherRequest = function (latitude, longitude) {
            fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${keys.geoapi}`, { method: 'GET', })
                .then(response => response.json())
                .then(resultReverseGeo => {
                    console.log(resultReverseGeo)

                    let query = `https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely,alerts&appid=${keys.openweather}&units=metric&lat=${latitude}&lon=${longitude}`
                    // Weather Api
                    fetch(query)
                        .then(response => response.json())
                        .then(resultWeather => {

                            // Pixabay API for bcg img
                            fetch(`https://pixabay.com/api/?key=${keys.pixabay}&orientation=vertical&per_page=3&q=${resultReverseGeo.features[0].properties.city}`)
                                .then(response => response.json())
                                .then(result => {
                                    document.querySelector(".img_container").style.backgroundImage = ""
                                    if (result.hits.length > 0) {
                                        document.querySelector(".img_container").style.backgroundImage = `url(${result.hits[0].previewURL})`
                                    }



                                    console.log(resultWeather)
                                    const currDate = new Date(resultWeather.current.dt * 1000 + resultWeather.timezone_offset)
                                    let currCity = resultReverseGeo.features[0].properties.city
                                    let currCountry = resultReverseGeo.features[0].properties.country_code.toUpperCase()
                                    let currDateSunrise = new Date((resultWeather.current.sunrise + resultWeather.timezone_offset) * 1000)
                                    let currDateSunset = new Date((resultWeather.current.sunset + resultWeather.timezone_offset) * 1000)
                                    document.getElementById("search").value = `${currCity}, ${currCountry}`
                                    document.getElementById("date_day").innerText = `${currDate.getUTCDate()}.${currDate.getUTCMonth() + 1}.${currDate.getUTCFullYear()}`
                                    document.getElementById("date_dayname").innerText = `${days[currDate.getDay()]}`
                                    document.getElementById("current_temp").innerHTML = `${Math.round(resultWeather.current.temp)}&deg;C`
                                    document.getElementById("current_description").innerText = `${resultWeather.current.weather[0].main}`
                                    document.getElementById("uvi").innerText = Math.round(resultWeather.current.uvi)
                                    document.getElementById("humidity").innerText = Math.round(resultWeather.current.humidity) + "%"
                                    document.getElementById("wind").innerText = resultWeather.current.wind_speed + "m/s"
                                    document.getElementById("sunrize").innerText = currDateSunrise.toGMTString().slice(17, 22)
                                    document.getElementById("sunset").innerText = currDateSunset.toGMTString().slice(17, 22)


                                    weather.classList.remove("blur")
                                    info.classList.remove("blur")
                                })
                                .catch(err => console.log("err:", err))
                        })
                })
                .catch(error => console.log('error', error));
        }
    })
