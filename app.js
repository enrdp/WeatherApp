const app = {
  init: () => {
    document
      .getElementById('btnGet')
      .addEventListener('click', app.fetchWeather);
    document
      .getElementById('btnCurrent')
      .addEventListener('click', app.getLocation);
    document
      .getElementById('btnCityName')
      .addEventListener('click', app.getName);

    document
      .getElementById('btnCityCompareName')
      .addEventListener('click', app.compareCity);

      document.getElementById('nameCity')
      .addEventListener('keyup', function(event) {
          if (event.key === 'Enter')
          {
            document.getElementById("btnCityName").click();
          }
      });
    
  },
  getName: (ev) =>{
    let city = document.getElementById('nameCity').value;
    let key = "85af1579f962c52499b41e25912beb5b";
    let lang = 'en';
    let units = 'metric';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&cnt=40&units=${units}&APPID=${key}&lang=${lang}`;
    
    fetch(url)
      .then((resp) => {
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
      })
      .then((data) => {
        app.showWeather(data);
      })
      .catch(console.err);
  },
  compareCity: (ev) => {
    let cityCompare1 = document.getElementById('nameCompareCity1').value;
    let cityCompare2 = document.getElementById('nameCompareCity2').value;
    let key = "85af1579f962c52499b41e25912beb5b";
    let lang = 'en';
    let units = 'metric';
    Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityCompare1}&cnt=40&units=${units}&APPID=${key}&lang=${lang}`),
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityCompare2}&cnt=40&units=${units}&APPID=${key}&lang=${lang}`)
    ]).then(function (responses) {
      // Get a JSON object from each of the responses
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    }).then(function (data) {
      // Log the data to the console
      // You would do something with both sets of data here
      console.log(data);
      app.showCompareCity(data);
    }).catch(function (error) {
      // if there's an error, log it
      console.log(error);
    });
    
  },
  fetchWeather: (ev) => {
    
    //use the values from latitude and longitude to fetch the weather
   let lat = document.getElementById('latitude').value;
    let lon = document.getElementById('longitude').value;
    let key = '85af1579f962c52499b41e25912beb5b';
    let lang = 'en';
    let units = 'metric';
    let url = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&lang=${lang}`;
    //fetch the weather
    fetch(url)
      .then((resp) => {
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
      })
      .then((data) => {
        app.showWeatherLonLat(data);
      })
      .catch(console.err);

      let callWeatherLatLon = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&lang=${lang}`;
      fetch(callWeatherLatLon)
      .then((resp) => {
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
      })
      .then((data) => {
        console.log(data)
        app.showWeather(data);
      })
  },
  getLocation: (ev) => {
    let opts = {
      enableHighAccuracy: true,
      timeout: 1000 * 10, //10 seconds
      maximumAge: 1000 * 60 * 5, //5 minutes
    };
    navigator.geolocation.getCurrentPosition(app.ftw, app.wtf, opts);
  },
  ftw: (position) => {
    //got position
    document.getElementById('latitude').value =
      position.coords.latitude.toFixed(2);
    document.getElementById('longitude').value =
      position.coords.longitude.toFixed(2);
  },
  wtf: (err) => {
    //geolocation failed
    console.error(err);
  },
  //Weather Daily
  showFetchWeather: (respWeather) =>{
    let row = document.querySelector('.weather.row');
    console.log(respWeather)
    row.innerHTML = respWeather.daily
      .map((day, idx) => {
        if (idx < 6 && idx != 0) {
          let dt = new Date(day.dt * 1000); //timestamp * 1000
          let sr = new Date(day.sunrise * 1000).toTimeString();
          let ss = new Date(day.sunset * 1000).toTimeString();
          return `<div class="col">
          <div class="cardFlip" id="card">
              <div class="front" id="front">
              
              <h5 class="card-title p-2">${dt.toDateString()}</h5>
              <h2>${respWeather.timezone}</h2>
                <img
                  src="http://openweathermap.org/img/wn/${
                    day.weather[0].icon
                  }@4x.png"
                  class="card-img-top"
                  alt="${day.weather[0].description}"
                />
                
                  <h3 class="card-title">${day.weather[0].main}</h3>
                  
                  <p class="card-text"><b>High:</b> ${day.temp.max}&deg;C</p>
                  <p class="card-text"><b>Low:</b> ${day.temp.min}&deg;C</p>
          </div>
                  <div class="card-body back" id="back">
                <div class="card-body">
                  <p class="card-text"><b>High Feels like: </b>${
                    day.feels_like.day
                  }&deg;C</p>
                  <p class="card-text"><b>Pressure:</b> ${day.pressure}mb</p>
                  <p class="card-text"><b>Humidity:</b> ${day.humidity}%</p>
                  <p class="card-text"><b>UV Index:</b> ${day.uvi}</p>
                  <p class="card-text"><b>Precipitation:</b> ${day.pop * 100}%</p>
                  <p class="card-text"><b>Dewpoint:</b> ${day.dew_point}</p>
                  <p class="card-text"><b>Wind:</b> ${day.wind_speed}m/s, ${
            day.wind_deg
          }&deg;</p>
                  <p class="card-text"><b>Sunrise:</b> <i>${sr}</i></p>
                  <p class="card-text"><b>Sunset:</b> <i>${ss}</i></p>
                </div>
                </div>
              </div>
            </div>
          </div>`;
        }
      })
      .join(' ');
  //Flip Card
  const cards = document.querySelectorAll(".cardFlip");

  function flipCard() {
    if (this.classList.contains('active')) {
      this.classList.remove('active')
    } else {
      this.classList.add('active');
    }
  }
  cards.forEach((card) => card.addEventListener("click",  flipCard));

  },
//OneCall 5 Days
  showWeather: (resp) => {
    if(window.myChart instanceof Chart)
    {
     window.myChart.destroy();
    }
    let latitude = resp.coord.lat;
    let longitude = resp.coord.lon;
    let key = "85af1579f962c52499b41e25912beb5b";
    let lang = 'en';
    let units = 'metric';

    let fetchWeatherApp = `http://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${key}&units=${units}&lang=${lang}`;
      fetch(fetchWeatherApp)
      .then((respWeather) => {
        if (!respWeather.ok) throw new Error(respWeather.statusText);
        return respWeather.json();
      })
      .then((dataWeather) => {
        console.log(dataWeather)
        app.showFetchWeather(dataWeather);
      })
      .catch(console.err);

      let rowWeather = document.getElementById('weatherApp');
      rowWeather.innerHTML = "";
      let dt = new Date(resp.dt * 1000); //timestamp * 1000
      return rowWeather.insertAdjacentHTML('afterbegin', `
      <div class="col weather_day">
      <h5 class="card-title-weather">${dt.toDateString()}</h5>
              <div class="card" id="card">
              
              <div class="figure">
              
                <img
                  src="http://openweathermap.org/img/wn/${
                    resp.weather[0].icon
                  }@4x.png"
                  class="card-img-top"
                  alt="${resp.weather[0].description}"
                />
                </div>
                <div class="card-body">
                <h2 class="card-title">${resp.name} - ${resp.sys.country}</h2>
                  <h3 class="card-title">${resp.weather[0].main}</h3>
                  
                  <p class="card-text"><b>High:</b> ${resp.main.temp_max}&deg;C - <b>Low:</b> ${
                    resp.main.temp_min
          }&deg;C</p>
                  <p class="card-text"><b>High Feels like:</b> ${
                    resp.main.feels_like
                  }&deg;C</p>
                  <p class="card-text"><b>Pressure:</b> ${resp.main.pressure}mb</p>
                  <p class="card-text"><b>Humidity:</b> ${resp.main.humidity}%</p>
                  <p class="card-text"><b>Wind:</b> ${resp.wind.speed}m/s, ${
                    resp.wind.deg
          }&deg;</p>
                  
                </div>
              </div>
            </div>
          </div>

      `);
      
},
  showWeatherLonLat: (resp) => {
    let row = document.querySelector('.weather.row');
    console.log(resp)
    row.innerHTML = resp.daily
      .map((day, idx) => {
        if (idx < 6) {
          let dt = new Date(day.dt * 1000); //timestamp * 1000
          let sr = new Date(day.sunrise * 1000).toTimeString();
          let ss = new Date(day.sunset * 1000).toTimeString();
          return `<div class="col">
          <div class="cardFlip" id="card">
              <div class="front" id="front">
              
              <h5 class="card-title p-2">${dt.toDateString()}</h5>
              <h2>${resp.timezone}</h2>
                <img
                  src="http://openweathermap.org/img/wn/${
                    day.weather[0].icon
                  }@4x.png"
                  class="card-img-top"
                  alt="${day.weather[0].description}"
                />
                
                  <h3 class="card-title">${day.weather[0].main}</h3>
                  
                  <p class="card-text"><b>High:</b> ${day.temp.max}&deg;C</p>
                  <p class="card-text"><b>Low:</b> ${day.temp.min}&deg;C</p>
          </div>
                  <div class="card-body back" id="back">
                <div class="card-body">
                  <p class="card-text"><b>High Feels like: </b>${
                    day.feels_like.day
                  }&deg;C</p>
                  <p class="card-text"><b>Pressure:</b> ${day.pressure}mb</p>
                  <p class="card-text"><b>Humidity:</b> ${day.humidity}%</p>
                  <p class="card-text"><b>UV Index:</b> ${day.uvi}</p>
                  <p class="card-text"><b>Precipitation:</b> ${day.pop * 100}%</p>
                  <p class="card-text"><b>Dewpoint:</b> ${day.dew_point}</p>
                  <p class="card-text"><b>Wind:</b> ${day.wind_speed}m/s, ${
            day.wind_deg
          }&deg;</p>
                  <p class="card-text"><b>Sunrise:</b> <i>${sr}</i></p>
                  <p class="card-text"><b>Sunset:</b> <i>${ss}</i></p>
                </div>
                </div>
              </div>
            </div>
          </div>`;
        }
      })
      .join(' ');
  //Flip Card
  const cards = document.querySelectorAll(".cardFlip");

  function flipCard() {
    if (this.classList.contains('active')) {
      this.classList.remove('active')
    } else {
      this.classList.add('active');
    }
  }
  cards.forEach((card) => card.addEventListener("click",  flipCard));
  },
  showCompareCity: (compareCity) => {

    let rowWeather = document.getElementById('weatherApp');
    rowWeather.innerHTML = "";
    let row = document.querySelector('.weather.row');
    row.innerHTML = "";

   
    let city = compareCity;

    if(window.myChart instanceof Chart)
    {
     window.myChart.destroy();
    }
    
    const ctx = document.getElementById('myChart').getContext('2d');
   
    window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [city[0].name, city[1].name],
        datasets: [{
            label: '# of Votes',
            data: [compareCity[0].main.temp, compareCity[1].main.temp],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
},
};

app.init();



