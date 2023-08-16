const fs = require('fs');

function cat(path) {
    // Use fs.readFile to read the file at the given path
    fs.readFile(path, 'utf8', (error, data) => {
        if (error) {
            console.error('An error occurred while reading the file:', error);
        } else {
            // Print the contents of the file
            console.log(data);
        }
    });
}


async function webCat(url){

  try{ res = await axios.get(url)
   console.log(res.data)
    }
    catch(error){
        console.error('an error occured while fetching URL', error)
    }
}

const args = process.argv.slice(2); // The first two elements are "node" and the script file
if (args.length === 1) {
    const filePath = args[0];
   
    if (input.startsWith('http://') || input.startsWith('https://')) {
        webCat(input);
    } else {
        cat(input);
    }
} else {
    console.error('Usage: node script.js <file-path-or-url>');
}

