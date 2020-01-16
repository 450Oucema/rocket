// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// Appel des librairies utilisées

const $ = require('jquery');
require('popper.js');
require('bootstrap');
require('uikit');
const Shell = require('node-powershell');
var mysql = require('mysql');

// Connexion à la BDD
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'launcher'
});
connection.connect();


//Affichage dynamique

connection.query('SELECT * FROM `jeu`', function(error, jeux, fields) {
    if (error) throw error;

    jeux.forEach(jeu => {
        console.log(jeu.nom);
        $('.uk-thumbnav').append("<li id='" + jeu.id + "' ><a onclick='SelectionJeu(" + jeu.id + ");' class='thumbjeux'><img style='max-height: 115px; max-width: 200px;' src='minecraft.jpg'></a></li>");
    });

});



//Fonctions
function SelectionJeu(id) {
    connection.query('SELECT chemin FROM `jeu` WHERE id=' + id, function(error, resultat, fields) {
        if (error) throw error;
        console.log('The solution is: ', resultat[0].chemin);
        exeJeux(resultat[0].chemin);
    });
}


const ps = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true
});

function exeJeux(chemin) {
    //var command = String.raw `Start-Process -FilePath "C:\Program Files (x86)\Minecraft Launcher\MinecraftLauncher.exe" -Wait`.split('\\').join('/');
    var command = 'Start-Process -FilePath "' + chemin + '" -Wait';
    alert(command);
    ps.addCommand(command);
    ps.invoke()
        .then(output => {
            console.log(output);
        })
        .catch(err => {
            console.log(err);
        });
}