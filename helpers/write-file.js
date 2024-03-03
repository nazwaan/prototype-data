const fs = require('fs')

async function writeFile(jsonData, filePath){
  const jsonString = JSON.stringify(jsonData)

  fs.writeFile(filePath, jsonString, err => {
    if (err) { console.log('Error writing file', err) }
    else { console.log('Successfully wrote file') }
  })
}

module.exports = writeFile