const fs = require('fs');

// Function to split the JSON data into four parts
function splitJsonData(data) {
  const totalLength = data.length;
  const partSize = Math.ceil(totalLength / 100);
  const parts = [];

  for (let i = 0; i < 100; i++) {
    const start = i * partSize;
    const end = start + partSize;
    parts.push(data.slice(start, end));
  }

  return parts;
}

// Function to write JSON data to a file
function writeJsonToFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Data written to ${filename}`);
}

// Read the original JSON file
fs.readFile('assets/data/points.json', 'utf8', (err, data) => {
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

  // Split the JSON data into four parts
  const parts = splitJsonData(points);

  // Write each part to a separate JSON file
  for (let i = 0; i < parts.length; i++) {
    writeJsonToFile(`assets/data/points_part${i}.json`, parts[i]);
  }
});