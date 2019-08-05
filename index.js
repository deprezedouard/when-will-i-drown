const jawgApiKey = '&access-token=w8nijIBK16cjLbibUeS9wGUMmafAPEoIOkhkb3Yl1VSt6X2kbgpwjcjlrlZpfYaK';
const jawgUrl = 'https://cors-anywhere.herokuapp.com/https://api.jawg.io/elevations?locations=';

const mapBoxApiKey = '.json?access_token=pk.eyJ1IjoiZGVwcmV6ZWRvdWFyZCIsImEiOiJjanlrMTljYmIwMDRsM2xxcXpvN3d2Z3FqIn0.6TRhVAm3CyhuueZNEuCkqw';
const mapBoxUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const solution = document.getElementById('solution');
let size = 0;
let startString = 0;
let place = '';


const fetchAltitude = (input) => {
  console.log(input);
  size = parseInt(document.getElementById('size').value, 10);
  fetch(jawgUrl + input + jawgApiKey)
    .then(response => response.json())
    .then((data) => {
      if(((data[0].elevation * 1000) + size * 10) > 7000) {
        if(solution.classList.contains('red')) { solution.classList.remove('red');}
        solution.classList.add('green');
        solution.innerHTML = `${startString}${parseInt(data[0].elevation, 10)} meters above sea level!<br> ${place} will not drown in the coming 1000 years!`;
      } else {
        const currentYear = parseInt(new Date().getFullYear(), 10);
        const deathYear = parseInt(((((data[0].elevation * 1000) + size * 10) / 7) + currentYear));
        if(solution.classList.contains('green')) { solution.classList.remove('green');}
        solution.classList.add('red')
        solution.innerHTML = `${startString}${parseInt(data[0].elevation, 10)} meters above sea level!
        <br>
        ${place} will drown in the year <strong>${deathYear}</strong>!`;
      }
    });
};

const fetchCoordinates = (input) => {
  fetch(mapBoxUrl + input + mapBoxApiKey)
    .then(response => response.json())
    .then((data) => {
      const gps = data.features[0].geometry.coordinates.reverse().join();
      fetchAltitude(gps);
    });
};

const getLocation = (input) => {
  if (input !== '') {
    place = input;
    startString = `'${input}' is currently `;
    fetchCoordinates(input);
  } else {
    place = 'You'
    startString = 'Right now, you are ';
    navigator.geolocation.getCurrentPosition((data) => {
      fetchAltitude(`${data.coords.latitude},${data.coords.longitude}`);
    });
  };
};

const button = document.getElementById('button');
button.addEventListener('click', (event) => {
  event.preventDefault();
  solution.innerHTML = 'calculating...'
  const location = document.getElementById('location').value;
  getLocation(location);
});
