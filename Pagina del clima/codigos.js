// Función para obtener el clima actual
const obtenerClima = async (latitud, longitud) => {
    try {
      const API_KEY = '79d122014df8d199bb5b032b530c477b';
      const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
      const url = `${baseUrl}?lat=${latitud}&lon=${longitud}&units=metric&appid=${API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener el clima:', error);
      throw error;
    }
  };
  
  // Función para mostrar la información del clima en el HTML
  const mostrarClima = (clima) => {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
      <h2>Clima en ${clima.name}</h2>
      <p>Temperatura Max-Min: ${clima.main.temp}°C</p>
      <p>Humedad: ${clima.main.humidity}%</p>
      <p>Presión Del Aire: ${clima.main.pressure} </p>
    `;
  };
  
  // Función para manejar la obtención de la ubicación del usuario
  const obtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitud = position.coords.latitude;
        const longitud = position.coords.longitude;
        
        try {
          const clima = await obtenerClima(latitud, longitud);
          mostrarClima(clima);
        } catch (error) {
          console.error('Error al obtener la ubicación:', error);
        }
      }, (error) => {
        console.error('Error al obtener la ubicación:', error);
      });
    } else {
      console.error('Geolocalización no es compatible en este navegador.');
    }
  };
  
  // Llama a la función para obtener la ubicación del usuario
  obtenerUbicacion();


  const result = document.querySelector('.result');
  const form = document.querySelector('.Buscar-clima');
  const nameCity = document.querySelector('#city');
  const nameCountry = document.querySelector('#country');
  
  form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      if (nameCity.value === '' || nameCountry.value === '') {
          showError('Ambos campos son obligatorios...');
          return;
      }
  
      callAPI(nameCity.value, nameCountry.value);
      //console.log(nameCity.value);
      //console.log(nameCountry.value);
  })
  
  function callAPI(city, country){
      const apiId = '79d122014df8d199bb5b032b530c477b';
      const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiId}`;
  
      fetch(url)
          .then(data => {
              return data.json();
          })
          .then(dataJSON => {
              if (dataJSON.cod === '404') {
                  showError('Ciudad no encontrada...');
              } else {
                  clearHTML();
                  showWeather(dataJSON);
              }
              //console.log(dataJSON);
          })
          .catch(error => {
              console.log(error);
          })
  }
  // Función para mostrar la información del clima en el HTML
  function showWeather(data){
      const {name, main:{temp, temp_min, temp_max}, weather:[arr]} = data;
  
      const degrees = kelvinToCentigrade(temp);
      const min = kelvinToCentigrade(temp_min);
      const max = kelvinToCentigrade(temp_max);
  
      const content = document.createElement('div');
      content.innerHTML = `
          <h5>Clima en ${name}</h5>
          <img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="icon">
          <h3>${degrees}°C</h3>
          <p>Max: ${max}°C</p>
          <p>Min: ${min}°C</p>
      `;
  
      result.appendChild(content);
  
      /* console.log(name);
      console.log(temp);
      console.log(temp_max);
      console.log(temp_min);
      console.log(arr.icon); */
  }
  //alerta para cuado no se agrege la ciudad o pais y se remueve despues de 5segundos
  function showError(message){
      //console.log(message);
      const alert = document.createElement('p');
      alert.classList.add('alert-message');
      alert.innerHTML = message;
  
      form.appendChild(alert);
      setTimeout(() => {
          alert.remove();
      }, 5000);
  }
  // conversion de kelvin a centigrados 
  function kelvinToCentigrade(temp){
      return parseInt(temp - 273.15);
  }
  //limpia la funcion de agregar ciudad y pais despues de buscar 
  function clearHTML(){
      result.innerHTML = '';
  }