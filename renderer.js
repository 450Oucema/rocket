// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
/**https://rawgthedocs.orels.sh/api/games/#get */

// Appel des librairies utilisées

const $ = require('jquery');
require('popper.js');
require('bootstrap');
require('uikit');
const Shell = require('node-powershell');
var mysql = require('mysql');
const Rawger = require('rawger');
const slash = require('slash');
var download = require('download-file')

var repert = "";

// Connexion à la BDD
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'launcher'
});
connection.connect();

const ps = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true
});

//Affichage dynamique

connection.query('SELECT * FROM `jeu`', function(error, jeux, fields) {
    if (error) throw error;

    jeux.forEach(jeu => {
        console.log(jeu.nom);
        $('.uk-thumbnav').append("<li id='" + jeu.id + "' ><a onclick='SelectionJeu(" + jeu.id + ");' class='thumbjeux'><img class='imgcard' src='./assets/cover/" + jeu.cover + "'> <div class='uk-position-center uk-overlay uk-overlay-default'>" + jeu.nom + "</div></a></li>");
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





async function RechRAWGER(nom) {
    //chemin = String.raw `` + chemin + ``.split('\\').join('/');
    repertoire = repert;
    alert("chemin2: " + repertoire);
    const { games } = await Rawger({});
    const results = (await games.search(nom)).get();
    console.log(results);
    var count = Object.keys(results).length;
    if (count > 0) {
        $('.proposition').html('<div class="input-group"><input id="titre_prop" type="text" class="form-control" value="' + results[0].name + '"><div class="input-group-append"><button class="uk-button uk-button-primary" id="validjeux"  type="button"><i class="fas fa-check"></i></button><button id="nouvrecherche" class="uk-button uk-button-danger" type="button"><i class="fas fa-times"></i></button></div></div><hr><ul class="uk-thumbnav"><li class="uk-active"><img src="' + results[0].image + '" alt=""></li></ul></div>');


        return true;
    } else {
        return false;
    }
}


async function nouvRecherche() {
    var nom = $('#titre_prop').val();
    const { games } = await Rawger({});
    const results = (await games.search(nom)).get();
    var count = Object.keys(results).length;
    if (count > 0) {
        $('.proposition').html('<div class="input-group"><input id="titre_prop" type="text" class="form-control" value="' + results[0].name + '" ><div class="input-group-append"><button id="validjeux" class="uk-button uk-button-primary" type="button"><i class="fas fa-check"></i></button><button id="nouvrecherche" class="uk-button uk-button-danger" type="button"><i class="fas fa-times"></i></button></div></div><hr><ul class="uk-thumbnav"><li class="uk-active"><img src="' + results[0].image + '" alt=""></li></ul></div>');
    }
}


async function validJeux(nom) {

    const { games } = await Rawger({});
    const results = (await games.search(nom)).get();
    var opt = {
        directory: "./assets/cover/",
        filename: results[0].slug + ".jpg"
    }
    download(results[0].image, opt, function(err) {
        if (err) throw err
        console.log('çamarche');
    })



    ajoutJeux(results[0].name, results[0].slug + ".jpg");

}

function ajoutJeux(nom, image) {

    connection.query("INSERT INTO `jeu` (`nom`, `chemin`, `cover`) VALUES ('" + nom + "', '" + repert + "', '" + image + "')", function(error, resultat, fields) {
        if (error) throw error;
        //location.reload(true);
    });

}


/** JQUERY */
$(document).on('click', '#validjeux', function() {
    nom = $('#titre_prop').val();
    chemin = $('#rp').val();
    validJeux(nom);
});

$(document).on('click', '#nouvrecherche', function() {
    console.log(repert);
    nouvRecherche();
});

$('.uk-card-default').hover(function() {
    $('.uk-card-body').css("display", "inline");
});


/** DESIGN JQUERY */
"use strict";

var fullHeight = function() {

    $('.js-fullheight').css('height', $(window).height());
    $(window).resize(function() {
        $('.js-fullheight').css('height', $(window).height());
    });

};
fullHeight();

$('#sidebarCollapse').on('click', function() {
    $('#sidebar').toggleClass('active');
});