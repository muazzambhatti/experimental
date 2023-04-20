const fs = require('fs'); // import the 'fs' module to read/write files

function deleteProperty(obj, prop) {
  // loop through all keys in the object
  for (let key in obj) {
    // check if the current value is an object
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // if it is an object, call the function recursively on the child object
      deleteProperty(obj[key], prop);
    } else if (key === prop) {
      // if the current key matches the property you want to delete, delete the key-value pair
      delete obj[key];
    }
  }
}

const data = JSON.parse(fs.readFileSync('data.json')); // read the file and parse the JSON

// loop through all objects and delete the "city" property from the nested "address" object
data.forEach(obj => deleteProperty(obj, 'twitter_id'));

const jsonStr = JSON.stringify(data, null, 2); // format the JSON with 2-space indentation
fs.writeFileSync('data.json', jsonStr); // write the modified JSON back to the file
