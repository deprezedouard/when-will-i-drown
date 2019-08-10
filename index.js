const jawgApiKey = '&access-token=w8nijIBK16cjLbibUeS9wGUMmafAPEoIOkhkb3Yl1VSt6X2kbgpwjcjlrlZpfYaK';
const jawgUrl = 'https://cors-anywhere.herokuapp.com/https://api.jawg.io/elevations?locations=';
const mapBoxApiKey = '.json?access_token=pk.eyJ1IjoiZGVwcmV6ZWRvdWFyZCIsImEiOiJjanlrMTljYmIwMDRsM2xxcXpvN3d2Z3FqIn0.6TRhVAm3CyhuueZNEuCkqw';
const mapBoxUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const frontContainer = document.getElementById('front-container');
const sea = document.getElementById('sea');
const calculation = document.getElementById('calculation');
const solution = document.getElementById('solution');
let root = document.documentElement;
let size = 0;
let startString = 0;
let place = '';
let riseLevel = 29;



const fetchAltitude = (input) => {
  size = parseInt(document.getElementById('size').value, 10);
  fetch(jawgUrl + input + jawgApiKey)
    .then(response => response.json())
    .then((data) => {
      frontContainer.classList.add('slide-out');
      let elevation = ((data[0].elevation * 1000) + size * 10);
      if(elevation > 7000) {
        riseLevel = 67 - Math.round((7000 * 38 / elevation));
        console.log(riseLevel);
        calculation.innerText = 'Calculated!';
        solution.classList.add('green');
        solution.innerHTML = `${startString}${parseInt(data[0].elevation, 10)} meters above sea level.<br> ${place} will not drown in the coming 1000 years!`;
      } else {
        const currentYear = parseInt(new Date().getFullYear(), 10);
        const deathYear = parseInt(((elevation / 7) + currentYear));
        calculation.innerText = 'Calculated!';
        solution.classList.add('red');
        solution.innerHTML = `<div>${startString}${parseInt(data[0].elevation, 10)} meters above sea level.
          <br>
          ${place} will drown in the year:</div><div class="death-year">${deathYear}</div>`;
      }
      root.style.setProperty('--result', riseLevel + "vh");
      sea.classList.add('slide-in');
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
    place = `If you live in ${input}, <br> you`;
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
  calculation.innerHTML = 'Calculating...'
  const location = document.getElementById('location').value;
  getLocation(location);
});
