class infoFilm {
    constructor(position, id, title, image)  {
        this.position = position;
        this.id = id;
        this.title = title;
        this.image = image;
    };

};

function afficherFilms(section, film){
    const sectionFilms = document.querySelector(section);
    const filmElement = document.createElement("film");
    const imageFilm = document.createElement("img");
    imageFilm.src = film.image;
    const nomFilm = document.createElement("h3");
    nomFilm.innerText = film.title;
    const divButton = document.createElement("div");
    divButton.className = film.id.toString()+'-btn';
    
    sectionFilms.appendChild(filmElement);
    filmElement.appendChild(imageFilm);
    filmElement.appendChild(nomFilm);
    filmElement.appendChild(divButton);

    generateButtonInfo(divButton, film.id);

};

function affichageInfoFilm(section, idMovie){
    console.log(idMovie);
    console.log(idMovie.genres);
    const sectionInfoFilm = document.querySelector(section);
    const infoFilmElement = document.createElement("infoFilmElement");
    
    const boutonFermetureModale = document.createElement("p");
    boutonFermetureModale.innerText = 'X';
    boutonFermetureModale.style.fontSize = "30px";
    boutonFermetureModale.style.float = 'right';

    const imageInfoFilm = document.createElement("img");
    imageInfoFilm.src = idMovie.image_url;
    
    const nomInfoFilm = document.createElement("h2");
    nomInfoFilm.innerText = idMovie.title;
    
    const genresInfoFilm = browseListToCreateElement('Genre(s) : ', idMovie.genres);
    
    const dateSortieInfoFilm = document.createElement("p");
    dateSortieInfoFilm.innerText = 'Date de sortie : '+idMovie.date_published+'.';

    const ratingInfoFilm = document.createElement("p");
    ratingInfoFilm.innerText = 'Classement : note de '+idMovie.avg_vote+' sur '+idMovie.votes+' votants.';

    const ratingImdbInfoFilm = document.createElement("p");
    ratingImdbInfoFilm.innerText = 'Classement IMDB : note de '+idMovie.imdb_score+'.';

    const directorsInfoFilm = browseListToCreateElement('Realisateur(s) : ', idMovie.directors);

    const actorsInfoFilm = browseListToCreateElement('Acteur(s, ice(s)) : ', idMovie.actors);

    const lengthInfoFilm = document.createElement("p");
    lengthInfoFilm.innerText = 'Durée : '+idMovie.duration+' minutes.';

    const countryOfOriginInfoFilm = browseListToCreateElement("Pays d'origine : ", idMovie.countries);

    const boxOfficeResultInfoFilm = document.createElement("p");
    boxOfficeResultInfoFilm.innerText = 'Résultat au Box Office : '+idMovie.worldwide_gross_income+' dollars.';

    const descriptionInfoFilm = document.createElement("p") ;
    descriptionInfoFilm.innerText = 'Résumé : '+idMovie.long_description;
    

    sectionInfoFilm.appendChild(infoFilmElement);
    infoFilmElement.appendChild(boutonFermetureModale);
    infoFilmElement.appendChild(imageInfoFilm);
    infoFilmElement.appendChild(nomInfoFilm);
    infoFilmElement.appendChild(genresInfoFilm);
    infoFilmElement.appendChild(dateSortieInfoFilm);
    infoFilmElement.appendChild(ratingInfoFilm);
    infoFilmElement.appendChild(ratingImdbInfoFilm);
    infoFilmElement.appendChild(directorsInfoFilm);
    infoFilmElement.appendChild(actorsInfoFilm);
    infoFilmElement.appendChild(lengthInfoFilm);
    infoFilmElement.appendChild(countryOfOriginInfoFilm);
    infoFilmElement.appendChild(boxOfficeResultInfoFilm);
    infoFilmElement.appendChild(descriptionInfoFilm);

};

function browseListToCreateElement(categorie, source){
    console.log(source);
    const ListConteneur = document.createElement("p");
    ListConteneur.innerText = categorie+' \n';
    if (source.length > 1){
        let i = 0;
        if (i < (source.length-1)){
            let ListElement = document.createElement("span");
            ListElement.innerText = source[i]+', \n';
            ListConteneur.appendChild(ListElement);
            i++;
        };
        let ListElement = document.createElement("span");
        ListElement.innerText = source[i]+'.';
        ListConteneur.appendChild(ListElement);
    }else{
        const ListElement = document.createElement("span");
        ListElement.innerText = source[0]+'.';
        ListConteneur.appendChild(ListElement);
    };
    return ListConteneur;
}

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

async function recuperationInfoFilm(idFilm){
    const reponse = await fetch('http://localhost:8000/api/v1/titles/'+idFilm.toString());
    let infoFilmParsed = await reponse.json();
    return infoFilmParsed;
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

function generateButtonInfo (sectionButton, idMovie){
    
    document.addEventListener('DOMContentLoaded', function() {
        let buttonInfo = document.createElement('button');
        buttonInfo.type = 'button';
        buttonInfo.innerHTML = '+';
        buttonInfo.className = 'infoFilm';
        buttonInfo.onclick = async function(){       
            const modalSelector = document.querySelector('.ModalMovie');
            if (modalSelector.style.visibility === "visible"){
                //
            }else{
                modalSelector.style.visibility = "visible";
                const movieInfo = await recuperationInfoFilm(idMovie); 
                affichageInfoFilm('.ModalMovieContent', movieInfo);
            }
            
            };
        sectionButton.appendChild(buttonInfo);
    }, false);
};

function generateButtonCloseModal (sectionButton, idMovie){
    
    document.addEventListener('DOMContentLoaded', function() {
        let buttonInfo = document.createElement('button');
        buttonInfo.type = 'button';
        buttonInfo.innerHTML = 'X';
        buttonInfo.className = 'closeModal';
        buttonInfo.onclick = async function(){       
            const modalSelector = document.querySelector('.ModalMovie');
            modalSelector.style.visibility = "hidden";
            modalSelector.innerHTML = ""
            };
        sectionButton.appendChild(buttonInfo);
    }, false);
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

