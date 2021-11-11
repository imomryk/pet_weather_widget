// fetch("keys.txt")
//     .then(response => response.json())
//     .then(keys => {
        const weather = document.querySelector(".main_weather")
        const info = document.querySelector(".info")
        weather.classList.add("blur")
        info.classList.add("blur")
        const days = ["Sunday", "Monday", "Thuesday", "Wednesday", "Thursday", "Friday", "Saturday",]
        const form = document.forms[0]
        // Иконки погоды
        const getWeatherIcon = function (obj) {
            const weatherIcons = {

                ["clear day"]: './imgs/Weather_icons/clear_day.svg',
                ["clear night"]: './imgs/Weather_icons/clear_night.svg',
                ["cloudy day"]: './imgs/Weather_icons/cloudy_day.svg',
                ["cloudy night"]: './imgs/Weather_icons/cloudy_night.svg',
                ["Clouds"]: './imgs/Weather_icons/clouds.svg',
                ["Drizzle"]: './imgs/Weather_icons/drizzle.svg',
                ["Mist"]: './imgs/Weather_icons/mist.svg',
                ["Rain"]: './imgs/Weather_icons/rain.svg',
                ["Snow"]: './imgs/Weather_icons/snow.svg',
                ["Thunderstorm"]: './imgs/Weather_icons/thunderstorm.svg',
            }

            if (obj.main == "Mist" || obj.main == "Smoke" || obj.main == "Haze" || obj.main == "Dust" || obj.main == "Fog" || obj.main == "Sand" || obj.main == "Dust" || obj.main == "Ash" || obj.main == "Squall" || obj.main == "Tornado") {
                return weatherIcons.mist
            }

            if (obj.main == "Clear" && obj.icon == "01d") {
                return weatherIcons["clear day"]
            } else if (obj.main == "Clear" && obj.icon == "01n") {
                return weatherIcons["clear night"]
            }

            if (obj.main == "Clouds" && obj.icon == "02d") {
                return weatherIcons["cloudy day"]
            } else if (obj.main == "Clouds" && obj.icon == "02n") {
                return weatherIcons["cloudy night"]
            }

            return weatherIcons[obj.main]
        }
        // Функция рендера
        const renderWeather = function (dailyweatherArr, index, timezone_offset) {
            weather.classList.add("blur")
            info.classList.add("blur")
            const currDate = new Date(dailyweatherArr[index].dt * 1000 + timezone_offset)
            const currDateSunrise = new Date((dailyweatherArr[index].sunrise + timezone_offset) * 1000)
            const currDateSunset = new Date((dailyweatherArr[index].sunset + timezone_offset) * 1000)
            document.getElementById("date_day").innerText = `${currDate.getUTCDate()}.${currDate.getUTCMonth() + 1}.${currDate.getUTCFullYear()}`
            document.getElementById("date_dayname").innerText = `${days[currDate.getDay()]}`
            document.getElementById("current_temp").innerHTML = `${Math.round(dailyweatherArr[index].temp.eve)}&deg;C`
            document.getElementById("current_icon").setAttribute("src", getWeatherIcon(dailyweatherArr[index].weather[0]))
            document.getElementById("current_description").innerText = `${dailyweatherArr[index].weather[0].main}`
            document.getElementById("uvi").innerText = Math.round(dailyweatherArr[index].uvi)
            document.getElementById("humidity").innerText = Math.round(dailyweatherArr[index].humidity) + "%"
            document.getElementById("wind").innerText = dailyweatherArr[index].wind_speed + "m/s"
            document.getElementById("sunrize").innerText = currDateSunrise.toGMTString().slice(17, 22)
            document.getElementById("sunset").innerText = currDateSunset.toGMTString().slice(17, 22)
            weather.classList.remove("blur")
            info.classList.remove("blur")
        }

        // Выдвижной блок
        document.querySelector(".main_weather").addEventListener("click", e => {

            if (e.target != document.forms[0].elements[0] && e.target != document.forms[0].elements[1] && e.target != document.forms[0].elements[1].children[0]) {
                document.querySelector(".info").classList.toggle("exp")
            }

        })
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
            fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=24b0b062d3c94efaab4bcca77b291472`, { method: 'GET', })
                .then(response => response.json())
                .then(resultReverseGeo => {
                    console.log(resultReverseGeo)
                    const currCity = resultReverseGeo.features[0].properties.city
                    const currCountry = resultReverseGeo.features[0].properties.country_code.toUpperCase()
                    document.getElementById("search").value = `${currCity}, ${currCountry}`

                    // Weather Api
                    fetch(`https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,minutely,alerts&appid=c4c979e5736f06ccaf01358f455ee24e&units=metric&lat=${latitude}&lon=${longitude}`)
                        .then(response => response.json())
                        .then(resultWeather => {

                            // Pixabay API for bcg img
                            fetch(`https://pixabay.com/api/?key=23641840-4160a4a239d12c5dd6197d014&orientation=vertical&per_page=3&q=${resultReverseGeo.features[0].properties.city}`)
                                .then(response => response.json())
                                .then(result => {
                                    // render Image
                                    document.querySelector(".img_container").style.backgroundImage = ""
                                    if (result.hits.length > 0) {
                                        document.querySelector(".img_container").style.backgroundImage = `url(${result.hits[0].previewURL})`
                                    }

                                    console.log(resultWeather)


                                    // render forecast
                                    const forecast = document.querySelector(".forecast")
                                    forecast.innerHTML = ""
                                    for (let i = 0; i < 4; i++) {
                                        const oneDayForecast = document.createElement("div")
                                        const oneDayDate = new Date(resultWeather.daily[i].dt * 1000 + resultWeather.timezone_offset)
                                        
                                        if (i == 0) oneDayForecast.classList.add("active")
                                        oneDayForecast.innerHTML = `
                                            <img id="small_icon" src=${getWeatherIcon(resultWeather.daily[i].weather[0])}>
                                            <span id="small_day">${oneDayDate.toGMTString().slice(0, 3)}</span>
                                            <span id="small_temp">${Math.round(resultWeather.daily[i].temp.eve)}&deg;C</span>
                                        `
                                        const oneDayForecastHelper = function (e) {
                                            if (e.tagName == "SPAN" || e.tagName == "IMG") {
                                                return e.parentElement
                                            } else return e
                                        }
                                        oneDayForecast.addEventListener("click", (e) => {
                                            if (!(oneDayForecastHelper(e.target).classList.contains("active"))) {
                                                Array.from(forecast.children).forEach(e => {
                                                    e.classList.remove("active")
                                                })
                                                oneDayForecastHelper(e.target).classList.add("active")
                                                renderWeather(resultWeather.daily, Array.from(forecast.children).indexOf(oneDayForecastHelper(e.target)), resultWeather.timezone_offset)

                                            }


                                        })
                                        forecast.append(oneDayForecast)
                                    }

                                    // Render weather
                                    renderWeather(resultWeather.daily, 0, resultWeather.timezone_offset)



                                })
                                .catch(err => console.log("err:", err))
                        })
                })
                .catch(error => console.log('error', error));
        }
    // })
