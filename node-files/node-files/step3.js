const fs = require('fs');
const axios = require('axios');

function cat(path, outputFile) {
    fs.readFile(path, 'utf8', (error, data) => {
        if (error) {
            console.error('An error occurred while reading the file:', error);
        } else {
            if (outputFile) {
                // Write the content to the specified output file
                fs.writeFile(outputFile, data, 'utf8', (error) => {
                    if (error) {
                        console.error('An error occurred while writing to the output file:', error);
                    } else {
                        console.log(`Content written to ${outputFile}`);
                    }
                });
            } else {
                console.log(data);
            }
        }
    });
}

async function webCat(url, outputFile) {
    try {
        const response = await axios.get(url);
        const content = response.data;
        if (outputFile) {
            // Write the content to the specified output file
            fs.writeFile(outputFile, content, 'utf8', (error) => {
                if (error) {
                    console.error('An error occurred while writing to the output file:', error);
                } else {
                    console.log(`Content written to ${outputFile}`);
                }
            });
        } else {
            console.log(content);
        }
    } catch (error) {
        console.error('An error occurred while fetching the URL:', error);
    }
}

// Get the arguments from the command line
const args = process.argv.slice(2);
if (args.length >= 1) {
    const input = args.pop(); // Get the last argument as input (file path or URL)
    const outputFileIndex = args.indexOf('--out');

    if (outputFileIndex !== -1) {
        // Output file is specified
        const outputFile = args[outputFileIndex + 1];
        args.splice(outputFileIndex, 2); // Remove --out and the output file from the arguments
        if (input.startsWith('http://') || input.startsWith('https://')) {
            webCat(input, outputFile);
        } else {
            cat(input, outputFile);
        }
    } else {
        // Output to console
        if (input.startsWith('http://') || input.startsWith('https://')) {
            webCat(input);
        } else {
            cat(input);
        }
    }
} else {
    console.error('Usage: node script.js [--out output-file] <file-path-or-url>');
}
