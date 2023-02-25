class infoFilm {
    // Create Object with a movie's usable informations 
    constructor(position, id, title, image)  {
        this.position = position;
        this.id = id;
        this.title = title;
        this.image = image;
    };

};

async function afficherFilms(section, film){
    // Select the right div 
    const sectionFilms = document.querySelector(section);
    // Create a container that will hold image, title and a button
    const filmElement = document.createElement("film");
    filmElement.className = section+'__MovieContainer';
    const imageFilm = document.createElement("img");
    imageFilm.src = film.image;
    const nomFilm = document.createElement("h3");
    nomFilm.innerText = film.title;
    nomFilm.className = section+'__MovieName';
    const divButton = document.createElement("div");
    divButton.className = film.id.toString()+'-btn';
    // attach the container and its elements to the div
    sectionFilms.appendChild(filmElement);
    filmElement.appendChild(imageFilm);
    filmElement.appendChild(nomFilm);
    filmElement.appendChild(divButton);
    generateButtonInfo(divButton, film.id, imageFilm);
};

function affichageInfoFilm(section, idMovie){
    // Create a modal that will display detailed informations on a movie
    const sectionInfoFilm = document.querySelector(section);
    const infoFilmElement = document.createElement("infoFilmElement");
    
    const boutonFermetureModale = document.createElement("p");
    boutonFermetureModale.className = 'buttonModaleX';
    boutonFermetureModale.innerText = 'X';
    boutonFermetureModale.style.fontSize = "30px";
    boutonFermetureModale.style.float = 'right';
    // Create a "button" that will hide the modal
    boutonFermetureModale.onclick = function(){
        const modalSelector = document.querySelector('.Movies__ModalMovie');
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
    // all the if test if there's a value for the information, and do not display it , if not
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
    // When the informations given by the API is a list, browse through that list and extract each value
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
    // Calculate and return which page will be needed to get, to later extract each movie informations
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
    // get the informations for one movie through its id then parse and return it
    const reponse = await fetch('http://localhost:8000/api/v1/titles/'+idFilm.toString());
    let infoFilmParsed = await reponse.json();
    return infoFilmParsed;
};

async function RecuperationEtStockageDeFilm(methodeDeTri, genre, page){
    // check if the information from a page result is already stored, if so it parses it, if not, it gets, stringify  and store it
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
    // create the needed information for each movie of the page and store them 
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

function generateButtonInfo (divButton, idMovie, divImage){
    let buttonInfo = document.createElement('button');
    buttonInfo.type = 'button';
    buttonInfo.innerHTML = '+';
    buttonInfo.className = 'infoFilm';
    // When the button is clicked, open a modal with the movie's detailed informations
    modalOpening(buttonInfo, '.Movies__ModalMovie', '.Movies__ModalMovie__Content', idMovie)
    // Make the image clickable, and open a modal with the movie's detailed informations
    modalOpening(divImage, '.Movies__ModalMovie', '.Movies__ModalMovie__Content', idMovie)
    divButton.appendChild(buttonInfo);
};

function modalOpening(elementClicked, modalContainer, modalContent, idMovie){
    // Check if a modal is already opened, if not , open a modal with a movie detailed information
    elementClicked.onclick = async function(){       
        const modalSelector = document.querySelector(modalContainer);
        if (modalSelector.style.visibility === "visible"){
            //
        }else{
            modalSelector.style.visibility = "visible";
            const movieInfo = await recuperationInfoFilm(idMovie); 
            affichageInfoFilm(modalContent, movieInfo);
        };
            
    };
}


async function generateButtonUpDown (sectionButton, methodeDeTri, genre, indiceDeDepart, nombreFilmARecuperer, sectionPage){
    let buttonDown = document.createElement('button');
    buttonDown.type = 'button';
    buttonDown.innerHTML = 'Films Précédents';
    buttonDown.className = 'btn-class-down';
    buttonDown.id = sectionButton+'__btn-id-down';
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
    buttonUp.id = sectionButton+'__btn-id-up';
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

async function bestMovieDisplay(methodeDeTri, genre, indiceDeDepart, nombreFilmARecuperer, bestMovieContainer){
    const bestMovieParsed = await recuperationFilm(methodeDeTri, genre, indiceDeDepart, nombreFilmARecuperer);
    const idBestMovie = bestMovieParsed[0].id;
    const infoBestMovie = await recuperationInfoFilm(idBestMovie);
    const bestMovieResumeContainer = document.querySelector(bestMovieContainer+'__MovieInfo__Resume');
    bestMovieResumeContainer.innerText = infoBestMovie.description;
    const bestMovieTitleContainer = document.querySelector(bestMovieContainer+'__MovieInfo__Title');
    bestMovieTitleContainer.innerText = infoBestMovie.title;
    const divButton = document.querySelector(bestMovieContainer+'__MovieInfo__BtnContainer');
    
    const bestMovieImageContainer = document.querySelector(bestMovieContainer+'__Image');
    bestMovieImageContainer.src = infoBestMovie.image_url;
    generateButtonInfo(divButton, idBestMovie, bestMovieImageContainer);

};



await bestMovieDisplay('-imdb_score', '', 1, 1, '.Movies__BestMovie');
await affichageSectionFilms('.Movies__PopularMovies__Scrolling-Btn', '-imdb_score','', 2, 7, '.Movies__PopularMovies__MoviesList');
await affichageSectionFilms('.Movies__ActionMovies__Scrolling-Btn', '-imdb_score','action', 1, 7, '.Movies__ActionMovies__MoviesList');
await affichageSectionFilms('.Movies__RomanticMovies__Scrolling-Btn', '-imdb_score','romance', 1, 7, '.Movies__RomanticMovies__MoviesList');
await affichageSectionFilms('.Movies__Comedies__Scrolling-Btn', '-imdb_score','comedy', 1, 7, '.Movies__Comedies__MoviesList');