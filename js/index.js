class infoFilm {
    constructor(position, id, title, image)  {
        this.position = position;
        this.id = id;
        this.title = title;
        this.image = image;
    };

};

async function afficherFilms(section, film){
    const sectionFilms = document.querySelector(section);
    const filmElement = document.createElement("film");
    filmElement.className = 'MovieContainer';
    const imageFilm = document.createElement("img");
    imageFilm.src = film.image;
    const nomFilm = document.createElement("h3");
    nomFilm.innerText = film.title;
    nomFilm.className = 'MovieName';
    const divButton = document.createElement("div");
    divButton.className = film.id.toString()+'-btn';
    
    sectionFilms.appendChild(filmElement);
    filmElement.appendChild(imageFilm);
    filmElement.appendChild(nomFilm);
    filmElement.appendChild(divButton);
    generateButtonInfo(divButton, film.id);
};

function affichageInfoFilm(section, idMovie){
    const sectionInfoFilm = document.querySelector(section);
    const infoFilmElement = document.createElement("infoFilmElement");
    
    const boutonFermetureModale = document.createElement("p");
    boutonFermetureModale.className = 'buttonModaleX';
    boutonFermetureModale.innerText = 'X';
    boutonFermetureModale.style.fontSize = "30px";
    boutonFermetureModale.style.float = 'right';
    boutonFermetureModale.onclick = function(){
        const modalSelector = document.querySelector('.ModalMovie');
        modalSelector.style.visibility = "hidden";
        sectionInfoFilm.innerHTML = ""
    };
    

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
    if (idMovie.genres){
        infoFilmElement.appendChild(genresInfoFilm);
    };
    if (idMovie.date_published){
        infoFilmElement.appendChild(dateSortieInfoFilm);
    };
    if (idMovie.avg_vote && idMovie.votes){
        infoFilmElement.appendChild(ratingInfoFilm);
    };
    if (idMovie.imdb_score){
        infoFilmElement.appendChild(ratingImdbInfoFilm);
    };
    if (idMovie.directors){
        infoFilmElement.appendChild(directorsInfoFilm);
    };
    if (idMovie.actors){
        infoFilmElement.appendChild(actorsInfoFilm);
    };
    if (idMovie.duration){
        infoFilmElement.appendChild(lengthInfoFilm);
    };
    if (idMovie.countries){
        infoFilmElement.appendChild(countryOfOriginInfoFilm);
    };
    if (idMovie.worldwide_gross_income){
        infoFilmElement.appendChild(boxOfficeResultInfoFilm);
    };
    if (idMovie.long_description){
        infoFilmElement.appendChild(descriptionInfoFilm);
    };
};

function browseListToCreateElement(categorie, source){
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

async function RecuperationEtStockageDeFilm(methodeDeTri, genre, page){
    const indexPage = 'page'+methodeDeTri+genre+page.toString();
    let pagefilms = window.localStorage.getItem("'"+indexPage+"'");
    if(pagefilms === null){
        console.log('http://localhost:8000/api/v1/titles/?genre='+genre+'&page='+page.toString()+'&sort_by='+methodeDeTri);
        const reponse = await fetch('http://localhost:8000/api/v1/titles/?genre='+genre+'&page='+page.toString()+'&sort_by='+methodeDeTri);
        console.log(reponse);
        pagefilms = await reponse.json();
        console.log(pagefilms);
        const valeurFilms = JSON.stringify(pagefilms);
        window.localStorage.setItem("'"+indexPage+"'", valeurFilms);
    }else{
        pagefilms = JSON.parse(pagefilms);
    };
    let positionFilm = (page*5)-4;
    
    for (let film of pagefilms.results) {
        const objetFilm = new infoFilm(positionFilm, film.id, film.title, film.image_url);
        const nomStorage = methodeDeTri+genre+positionFilm.toString();
        const valeurObjet = JSON.stringify(objetFilm);
        window.localStorage.setItem(nomStorage, valeurObjet);
        positionFilm++;
    };
    
};


async function recuperationFilm(methodeDeTri, genre, premierFilmIDARecuperer, nombreFilmARecuperer){
    const listeDesPages = listeDesPagesaParcourir(premierFilmIDARecuperer, nombreFilmARecuperer);
    let filmsRecuperes = [];
    let listeDesFilms = [];
    // parcours toutes les pages de résultat
    for (let page of listeDesPages) {
        // Récupère la page et la stock
        await RecuperationEtStockageDeFilm(methodeDeTri, genre, page);
    };
    let filmID = premierFilmIDARecuperer;
    for(let i=0; i<nombreFilmARecuperer; i++){
        const indexFilm = methodeDeTri+genre+filmID.toString();
        const film = JSON.parse(window.localStorage.getItem(indexFilm));
        filmsRecuperes.push(film);
        filmID++;
    }    
    return filmsRecuperes;
};

function generateButtonInfo (sectionButton, idMovie){
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
        };
            
    };
    sectionButton.appendChild(buttonInfo);
};

async function generateButtonUpDown (sectionButton, methodeDeTri, genre, indiceDeDepart, nombreFilmARecuperer, sectionPage){
    let buttonDown = document.createElement('button');
    buttonDown.type = 'button';
    buttonDown.innerHTML = 'Films Précédents';
    buttonDown.className = 'btn-class-down';
    buttonDown.id = sectionButton+'btn-id-down';
    buttonDown.hidden = true;
    buttonDown.onclick = async function(){          
        indiceDeDepart -=7;
        if (indiceDeDepart <=7){
            buttonDown.hidden = true;
        }
        document.querySelector(sectionPage).innerHTML= "";
        await recuperationStockageEtAffichageFilm(methodeDeTri,genre,indiceDeDepart,nombreFilmARecuperer,sectionPage);
        };
    let buttonUp = document.createElement('button');
    buttonUp.type = 'button';
    buttonUp.innerHTML = 'Films Suivants';
    buttonUp.className = 'btn-class-up';
    buttonUp.id = sectionButton+'btn-id-up';
    buttonUp.onclick = async function(){          
        indiceDeDepart +=7;
        if (indiceDeDepart >7){
            buttonDown.hidden = false;
        };
        document.querySelector(sectionPage).innerHTML= "";
        await recuperationStockageEtAffichageFilm(methodeDeTri,genre,indiceDeDepart,nombreFilmARecuperer,sectionPage);
        };
    let container = document.querySelector(sectionButton);
    container.appendChild(buttonDown);
    container.appendChild(buttonUp);
};

async function recuperationStockageEtAffichageFilm(methodeDeTri, genre, indiceDeDepart, nombreFilmARecuperer, sectionPage){
    let filmRecup = await recuperationFilm(methodeDeTri, genre, indiceDeDepart, nombreFilmARecuperer);
    for (let film of filmRecup){
        await afficherFilms(sectionPage, film);
    };
};

async function affichageSectionFilms(sectionButtonArg, methodeDeTriArg, genreArg,indiceDeDepartArg, nombreFilmARecupererArg, sectionPageArg){
    let methodeDeTri = methodeDeTriArg;
    var indiceDeDepart = indiceDeDepartArg;
    let nombreFilmARecuperer = nombreFilmARecupererArg;
    let sectionPage = sectionPageArg;
    let sectionButton = sectionButtonArg;
    let genre=genreArg
    await generateButtonUpDown(sectionButton, methodeDeTri, genre, indiceDeDepart, nombreFilmARecuperer, sectionPage);
    await recuperationStockageEtAffichageFilm(methodeDeTri, genre, indiceDeDepart,nombreFilmARecuperer,sectionPage);
};

async function bestMovieDisplay(methodeDeTri, genre, indiceDeDepart, nombreFilmARecuperer, sectionPage){
    const bestMovieParsed = await recuperationFilm(methodeDeTri, genre, indiceDeDepart, nombreFilmARecuperer);
    await afficherFilms(sectionPage, bestMovieParsed[0]);
    const idBestMovie = bestMovieParsed[0].id;
    const infoBestMovie = await recuperationInfoFilm(idBestMovie);
    const bestMovieResumeContainer = document.querySelector('.bestMovie__Resume');
    bestMovieResumeContainer.innerText = infoBestMovie.description;
};



await bestMovieDisplay('-imdb_score', '', 1, 1, '.bestMovie');
await affichageSectionFilms('.populaires-btn', '-imdb_score','', 2, 7, '.populaires');
await affichageSectionFilms('.popAction-btn', '-imdb_score','action', 1, 7, '.popAction');
await affichageSectionFilms('.popRomance-btn', '-imdb_score','romance', 1, 7, '.popRomance');
await affichageSectionFilms('.popComedie-btn', '-imdb_score','comedy', 1, 7, '.popComedie');