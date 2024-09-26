const fs = require('fs');
const axios = require('axios');

// Function to check if a point is available in Street View
function checkStreetViewAvailability(lat, lng) {

  console.log(`Checking Street View for (${lat}, ${lng})`);
  return axios.get(url)
    .then(response => {
      console.log(`Checked Street View for (${lat}, ${lng}): ${response.data.status}`);
      return {
        lat,
        lng,
        isAvailable: response.data.status === 'OK'
      };
    })
    .catch(err => {
      console.error('Error checking Street View availability:', err);
      return {
        lat,
        lng,
        isAvailable: false
      };
    });
}

// Function to check all points in the JSON
async function checkAllPoints(points, i) {
  console.log("Starting to check all points");
  const availables = [];
  for (point of points) {
    const result = await checkStreetViewAvailability(point.lat, point.lng);
    if (result.isAvailable) {
      availables.push(result);
    }
  }
  // const availables = points.map(point => checkStreetViewAvailability(point.lat, point.lng)).filter(point => point.isAvailable);

  fs.writeFileSync(`assets/data/availables_part${i}.json`, JSON.stringify(availables, null, 2), 'utf8');
}

// Read the JSON file

let i = 0;


async function run(i) {
  fs.readFile(`assets/data/points_part${i}.json`, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
  
    console.log("JSON file read successfully");
  
    // Parse the JSON data
    let points;
    try {
      points = JSON.parse(data);
      console.log("JSON parsed successfully");
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      return;
    }
  
    // Check all points
    checkAllPoints(points, i).then(() => run(i+1));
  });
}

run(0);
