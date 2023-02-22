class infoFilm {
    constructor(position, id, title, image)  {
        this.position = position;
        this.id = id;
        this.title = title;
        this.image = image;
    };

};

function hidButton(premierID){
    const buttonDown = document.getElementById();
    if(premierID <= 7){
        buttonDown.style.hidden = true;
    }else{
        buttonDown.style.hidden = false;
    }  
}

function afficherFilms(section, film){
    const sectionFilms = document.querySelector(section);
    const filmElement = document.createElement("film");
    const imageFilm = document.createElement("img");
    imageFilm.src = film.image;
    const nomFilm = document.createElement("h3");
    nomFilm.innerText = film.title;
    sectionFilms.appendChild(filmElement);
    filmElement.appendChild(imageFilm);
    filmElement.appendChild(nomFilm);
};

function listeDesPagesaParcourir(premierFilmIDARecuperer, nombreFilmARecuperer){
    let pageAAjouter= (Math.trunc((premierFilmIDARecuperer-1)/5)+1);
    const nombreDePage  = (Math.trunc((nombreFilmARecuperer-1) / 5) + 1);
    let listeDesPages = [];
    for(let j=0; j < nombreDePage; j++){
        listeDesPages.push(pageAAjouter);
        pageAAjouter++;
    };
    return listeDesPages;
};

async function RecuperationEtStockageDeFilm(methodeDeTri, page){
    const indexPage = 'page'+methodeDeTri+page.toString();
    let pagefilms = window.localStorage.getItem("'"+indexPage+"'");
    if(pagefilms === null){
        const reponse = await fetch('http://localhost:8000/api/v1/titles/?page='+page.toString()+'&sort_by='+methodeDeTri);
        pagefilms = await reponse.json();
        const valeurFilms = JSON.stringify(pagefilms);
        window.localStorage.setItem("'"+indexPage+"'", valeurFilms);
    }else{
        pagefilms = JSON.parse(pagefilms);
    };
    let positionFilm = (page*5)-4;
    
    for (let film of pagefilms.results) {
        const objetFilm = new infoFilm(positionFilm, film.id, film.title, film.image_url);
        const nomStorage = methodeDeTri+positionFilm.toString();
        const valeurObjet = JSON.stringify(objetFilm);
        window.localStorage.setItem(nomStorage, valeurObjet);
        positionFilm++;
    };
    
};


async function recuperationFilm(methodeDeTri, premierFilmIDARecuperer, nombreFilmARecuperer){
    const listeDesPages = listeDesPagesaParcourir(premierFilmIDARecuperer, nombreFilmARecuperer);
    let filmsRecuperes = [];
    let listeDesFilms = [];
    // parcours toutes les pages de résultat
    for (let page of listeDesPages) {
        // Récupère la page et la stock
        RecuperationEtStockageDeFilm(methodeDeTri, page, listeDesFilms);
    };
    let filmID = premierFilmIDARecuperer;
    for(let i=0; i<nombreFilmARecuperer; i++){
        const indexFilm = methodeDeTri+filmID.toString();
        const film = JSON.parse(window.localStorage.getItem(indexFilm));
        filmsRecuperes.push(film);
        filmID++;
    }    
    return filmsRecuperes;
};

async function generateButtonUpDown (sectionButton, methodeDeTri, indiceDeDepart, nombreFilmARecuperer, sectionPage){
    document.addEventListener('DOMContentLoaded', function() {
        let buttonDown = document.createElement('button');
        buttonDown.type = 'button';
        buttonDown.innerHTML = 'Films Précédents';
        buttonDown.className = 'btn-class-down';
        buttonDown.id = sectionButton+'btn-id-down';
        buttonDown.hidden = true;
        buttonDown.onclick = function(){          
            indiceDeDepart -=7;
            if (indiceDeDepart <=7){
                buttonDown.hidden = true;
            }
            document.querySelector(sectionPage).innerHTML= "";
            recuperationStockageEtAffichageFilm(methodeDeTri,indiceDeDepart,nombreFilmARecuperer,sectionPage);
            };
        let buttonUp = document.createElement('button');
        buttonUp.type = 'button';
        buttonUp.innerHTML = 'Films Suivants';
        buttonUp.className = 'btn-class-up';
        buttonUp.id = sectionButton+'btn-id-up';
        buttonUp.onclick = function(){          
            indiceDeDepart +=7;
            if (indiceDeDepart >7){
                buttonDown.hidden = false;
            };
            document.querySelector(sectionPage).innerHTML= "";
            recuperationStockageEtAffichageFilm(methodeDeTri,indiceDeDepart,nombreFilmARecuperer,sectionPage);
            };
        let container = document.querySelector(sectionButton);
        container.appendChild(buttonDown);
        container.appendChild(buttonUp);
    }, false);
}

async function recuperationStockageEtAffichageFilm(methodeDeTri, indiceDeDepart, nombreFilmARecuperer, sectionPage){
    let filmRecup = await recuperationFilm(methodeDeTri, indiceDeDepart, nombreFilmARecuperer);
    for (let film of filmRecup){
        afficherFilms(sectionPage, film);
        console.log(film);
    };
}

let methodeDeTri = '-imdb_score';
var indiceDeDepart = 2;
let nombreFilmARecuperer = 7;
let sectionPage = '.populaires';
let sectionButton = '.populaires-btn';
generateButtonUpDown(sectionButton, methodeDeTri, indiceDeDepart, nombreFilmARecuperer, sectionPage);
recuperationStockageEtAffichageFilm('-imdb_score', 1, 1, '.meilleurFilm');
recuperationStockageEtAffichageFilm(methodeDeTri,indiceDeDepart,nombreFilmARecuperer,sectionPage);

