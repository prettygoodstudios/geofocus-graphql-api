console.log('Must run build before you can use the interactive shell')

const fs = require('fs');
const { connection } = require('../dist/db.js');

// Loading import defaults from models
const models = {};
fs.readdir('./dist/models/', {}, (err, files) => {
    files.forEach(f => {
        const name = f.split('.')[0];
        models[`${name.slice(0, 1).toUpperCase()}${name.slice(1)}`] = require(`../dist/models/${name}`).default;
    });
});


console.log('Shell Successfully loaded!');

module.exports = {
    models,
    connection
};

