const fs = require('fs')

async function writeFile(jsonData){
  const jsonString = JSON.stringify(jsonData)

  fs.writeFile('./report.json', jsonString, err => {
    if (err) { console.log('Error writing file', err) }
    else { console.log('Successfully wrote file') }
  })
}

module.exports = writeFile