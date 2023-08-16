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

const args = process.argv.slice(2); // The first two elements are "node" and the script file
if (args.length === 1) {
    const filePath = args[0];
    cat(filePath);
} else {
    console.error('Usage: node script.js <file-path>');
}