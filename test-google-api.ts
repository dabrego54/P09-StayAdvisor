import fetch from 'node-fetch'; // debes instalarlo

const apiKey = 'AIzaSyB0v325moLIyVLUbHlL5ROOOoY_giqOcUk'; // copia tu clave directamente aquí (sin usar process.env)
const query = 'hoteles en Santiago, Chile';

const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&region=cl&key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("🟢 Resultado de prueba:");
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error("❌ Error en fetch:", err);
  });
