class infoFilm {
    // Create Object with a movie's usable informations 
    constructor(position, id, title, image)  {
        this.position = position;
        this.id = id;
        this.title = title;
        this.image = image;
    };

};

async function createMovieDiv(divSelected, film){
    // Select the right div 
    const moviesDiv = document.querySelector(divSelected);
    // Create a container that will hold image, title and a button
    const elementDiv = document.createElement("film");
    elementDiv.className = divSelected+'__MovieContainer';
    const movieImage = document.createElement("img");
    movieImage.src = film.image;
    const movieName = document.createElement("h3");
    movieName.innerText = film.title;
    movieName.className = divSelected+'__MovieName';
    const divButton = document.createElement("div");
    divButton.className = film.id.toString()+'-btn';
    // attach the container and its elements to the div
    moviesDiv.appendChild(elementDiv);
    elementDiv.appendChild(movieImage);
    elementDiv.appendChild(movieName);
    elementDiv.appendChild(divButton);
    generateButtonInfo(divButton, film.id, movieImage);
};

async function createMovieDivTest(divSelected, film, i){
    // Select the right div 
    const moviesDiv = document.querySelector(divSelected+'__Movie'+i);
    // Create containers that will hold image, title and a button
    const elementDiv = document.createElement("div");
    elementDiv.className = divSelected+'__Movie'+i+'__MovieContainer';
    const movieImage = document.createElement("img");
    movieImage.src = film.image;
    const movieName = document.createElement("h3");
    movieName.innerText = film.title;
    movieName.className = divSelected+'__MovieName';
    const divButton = document.createElement("div");
    divButton.className = film.id.toString()+'-btn';
    // attach containers to the div
    moviesDiv.appendChild(elementDiv);
    elementDiv.appendChild(movieImage);
    elementDiv.appendChild(movieName);
    elementDiv.appendChild(divButton);
    generateButtonInfo(divButton, film.id, movieImage);
};

function affichageInfoFilm(divSelected, idMovie){
    // Create a modal that will display detailed informations on a movie
    const divSelectedInfoFilm = document.querySelector(divSelected);
    const infoElementDiv = document.createElement("infoElementDiv");
    
    const closingModalButton = document.createElement("p");
    closingModalButton.className = 'buttonModaleX';
    closingModalButton.innerText = 'X';
    closingModalButton.style.fontSize = "30px";
    closingModalButton.style.float = 'right';
    // Create a "button" that will hide the modal
    closingModalButton.onclick = function(){
        const modalSelector = document.querySelector('.Movies__ModalMovie');
        modalSelector.style.visibility = "hidden";
        divSelectedInfoFilm.innerHTML = ""
    };
    

    const movieImageElement = document.createElement("img");
    movieImageElement.src = idMovie.image_url;
    
    const movieNameElement = document.createElement("h2");
    movieNameElement.innerText = idMovie.title;
    
    const movieGenreElement = browseListToCreateElement('Genre(s) : ', idMovie.genres);
    
    const movieReleaseDateElement = document.createElement("p");
    movieReleaseDateElement.innerText = 'Date de sortie : '+idMovie.date_published+'.';

    const movieRatingElement = document.createElement("p");
    movieRatingElement.innerText = 'Classement : note de '+idMovie.avg_vote+' sur '+idMovie.votes+' votants.';

    const movieImdbRatingElement = document.createElement("p");
    movieImdbRatingElement.innerText = 'Classement IMDB : note de '+idMovie.imdb_score+'.';

    const movieDirectorsElement = browseListToCreateElement('Realisateur(s) : ', idMovie.directors);

    const movieActorsElement = browseListToCreateElement('Acteur(s, ice(s)) : ', idMovie.actors);

    const movieLengthElement = document.createElement("p");
    movieLengthElement.innerText = 'Durée : '+idMovie.duration+' minutes.';

    const movieCountriesElement = browseListToCreateElement("Pays d'origine : ", idMovie.countries);

    const movieBoxOfficeElement = document.createElement("p");
    movieBoxOfficeElement.innerText = 'Résultat au Box Office : '+idMovie.worldwide_gross_income+' dollars.';

    const movieDescriptionElement = document.createElement("p") ;
    movieDescriptionElement.innerText = 'Résumé : '+idMovie.long_description;
    

    divSelectedInfoFilm.appendChild(infoElementDiv);
    infoElementDiv.appendChild(closingModalButton);
    infoElementDiv.appendChild(movieImageElement);
    infoElementDiv.appendChild(movieNameElement);
    // all the if test if there's a value for the information, and do not display it , if not
    if (idMovie.genres){
        infoElementDiv.appendChild(movieGenreElement);
    };
    if (idMovie.date_published){
        infoElementDiv.appendChild(movieReleaseDateElement);
    };
    if (idMovie.avg_vote && idMovie.votes){
        infoElementDiv.appendChild(movieRatingElement);
    };
    if (idMovie.imdb_score){
        infoElementDiv.appendChild(movieImdbRatingElement);
    };
    if (idMovie.directors){
        infoElementDiv.appendChild(movieDirectorsElement);
    };
    if (idMovie.actors){
        infoElementDiv.appendChild(movieActorsElement);
    };
    if (idMovie.duration){
        infoElementDiv.appendChild(movieLengthElement);
    };
    if (idMovie.countries){
        infoElementDiv.appendChild(movieCountriesElement);
    };
    if (idMovie.worldwide_gross_income){
        infoElementDiv.appendChild(movieBoxOfficeElement);
    };
    if (idMovie.long_description.length > 5){
        infoElementDiv.appendChild(movieDescriptionElement);
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

function PagesListaParcourir(firstMovieID, numberOfMovies){
    // Calculate and return which page will be needed to get, to later extract each movie informations
    let pageToAdd= (Math.trunc((firstMovieID-1)/5)+1);
    const numberOfPages  = (Math.trunc((numberOfMovies-1) / 5) + 1);
    let PagesList = [];
    for(let j=0; j < numberOfPages; j++){
        PagesList.push(pageToAdd);
        pageToAdd++;
    };
    return PagesList;
};

async function recuperationInfoFilm(idFilm){
    // get the informations for one movie through its id then parse and return it
    const reponse = await fetch('http://localhost:8000/api/v1/titles/'+idFilm.toString());
    let infoFilmParsed = await reponse.json();
    return infoFilmParsed;
};

async function RecuperationEtStockageDeFilm(sortingMethod, genre, page){
    // check if the information from a page result is already stored, if so it parses it, if not, it gets, stringify  and store it
    const indexPage = 'page'+sortingMethod+genre+page.toString();
    let moviesPage = window.localStorage.getItem("'"+indexPage+"'");
    if(moviesPage === null){
        const reponse = await fetch('http://localhost:8000/api/v1/titles/?genre='+genre+'&page='+page.toString()+'&sort_by='+sortingMethod);
        moviesPage = await reponse.json();
        const movieStringified = JSON.stringify(moviesPage);
        window.localStorage.setItem("'"+indexPage+"'", movieStringified);
    }else{
        moviesPage = JSON.parse(moviesPage);
    };
    let moviePosition = (page*5)-4;
    // create the needed information for each movie of the page and store them 
    for (let film of moviesPage.results) {
        const movieObject = new infoFilm(moviePosition, film.id, film.title, film.image_url);
        const storageName = sortingMethod+genre+moviePosition.toString();
        const movieObjectStringified = JSON.stringify(movieObject);
        window.localStorage.setItem(storageName, movieObjectStringified);
        moviePosition++;
    };
    
};


async function recuperationFilm(sortingMethod, genre, firstMovieID, numberOfMovies){
    const PagesList = PagesListaParcourir(firstMovieID, numberOfMovies);
    let moviesToDisplayList = [];
    // parcours toutes les pages de résultat
    for (let page of PagesList) {
        // Récupère la page et la stock
        await RecuperationEtStockageDeFilm(sortingMethod, genre, page);
    };
    let filmID = firstMovieID;
    for(let i=0; i<numberOfMovies; i++){
        const indexFilm = sortingMethod+genre+filmID.toString();
        const film = JSON.parse(window.localStorage.getItem(indexFilm));
        moviesToDisplayList.push(film);
        filmID++;
    }    
    return moviesToDisplayList;
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


async function generateButtonUpDown (divSelectedButton, sortingMethod, genre, startingPosition, numberOfMovies, divSelected){
    let buttonDown = document.createElement('button');
    buttonDown.type = 'button';
    buttonDown.innerHTML = 'Films Précédents';
    buttonDown.className = 'btn-class-down';
    buttonDown.id = divSelectedButton+'__btn-id-down';
    buttonDown.hidden = true;
    buttonDown.onclick = async function(){          
        startingPosition -=7;
        if (startingPosition <=7){
            buttonDown.hidden = true;
        }
        document.querySelector(divSelected).innerHTML= "";
        await recuperationStockageEtAffichageFilm(sortingMethod,genre,startingPosition,numberOfMovies,divSelected);
        };
    let buttonUp = document.createElement('button');
    buttonUp.type = 'button';
    buttonUp.innerHTML = 'Films Suivants';
    buttonUp.className = 'btn-class-up';
    buttonUp.id = divSelectedButton+'__btn-id-up';
    buttonUp.onclick = async function(){          
        startingPosition +=7;
        if (startingPosition >7){
            buttonDown.hidden = false;
        };
        document.querySelector(divSelected).innerHTML= "";
        await recuperationStockageEtAffichageFilm(sortingMethod,genre,startingPosition,numberOfMovies,divSelected);
        };
    let container = document.querySelector(divSelectedButton);
    container.appendChild(buttonDown);
    container.appendChild(buttonUp);
};

async function functionButtonUpDown (sortingMethod, genre, startingPosition, numberOfMovies, divSelected){
    let buttonDown = document.getElementById(divSelected+'__Movie1__Previous');
    console.log(buttonDown);
    buttonDown.onclick = function(){          
        startingPosition -=7;
        for(let k = 1; k<=7; k++){
            document.querySelector('.'+divSelected+'__Movie'+k).innerHTML= "";
        };
        createUpDownButton(sortingMethod, genre, startingPosition, numberOfMovies, divSelected); 
        generateAndDisplayDivsMovies(sortingMethod,genre,startingPosition,numberOfMovies, divSelected);
    };
    let buttonUp = document.getElementById(divSelected+'__Movie7__Next');
    buttonUp.onclick = async function(){          
        startingPosition +=7;
        for(let k = 1; k<=7; k++){
            console.log('.'+divSelected+'__Movie'+k+'__MovieContainer');
            document.querySelector('.'+divSelected+'__Movie'+k).innerHTML= "";
        };
        createUpDownButton(sortingMethod, genre, startingPosition, numberOfMovies, divSelected); 
        await generateAndDisplayDivsMovies(sortingMethod,genre,startingPosition,numberOfMovies, divSelected);
    };
    
};

function createUpDownButton(sortingMethod, genre, startingPosition, numberOfMovies, divSelected){
    const movie1Container = document.querySelector('.'+divSelected+'__Movie1');
    let divButtonDown = document.createElement("div");
    divButtonDown.className = "Movies__Slider__Previous";
    divButtonDown.id = divSelected+"__Movie1__Previous";
    divButtonDown.innerText = '<';
    divButtonDown.style.visibility = 'hidden';
    movie1Container.appendChild(divButtonDown);
    const movie7Container = document.querySelector('.'+divSelected+'__Movie7');
    let divButtonUp = document.createElement("div");
    divButtonUp.className = "Movies__Slider__Next";
    divButtonUp.id = divSelected+"__Movie7__Next";
    divButtonUp.innerText = '>';
    movie7Container.appendChild(divButtonUp);
    if (startingPosition >7){
        divButtonDown.style.visibility = 'visible';
    };
    functionButtonUpDown(sortingMethod, genre, startingPosition, numberOfMovies, divSelected);
}

async function recuperationStockageEtAffichageFilm(sortingMethod, genre, startingPosition, numberOfMovies, divSelected){
    let movieToDisplay = await recuperationFilm(sortingMethod, genre, startingPosition, numberOfMovies);
    for (let film of movieToDisplay){
        await createMovieDiv(divSelected, film);
    };
};

async function generateAndDisplayDivsMovies(sortingMethod, genre, startingPositionArg, numberOfMovies, divSelected){
    let i = 1;
    var startingPosition = startingPositionArg;
    let movieToDisplay = await recuperationFilm(sortingMethod, genre, startingPosition, numberOfMovies);
    for (let film of movieToDisplay){
        await createMovieDivTest('.'+divSelected, film, i);
        i++;
    };
    functionButtonUpDown(sortingMethod,genre,startingPosition,numberOfMovies,divSelected);
};

async function affichagemoviesDiv(divSelectedButtonArg, sortingMethodArg, genreArg,startingPositionArg, numberOfMoviesArg, divSelectedArg){
    let sortingMethod = sortingMethodArg;
    var startingPosition = startingPositionArg;
    let numberOfMovies = numberOfMoviesArg;
    let divSelected = divSelectedArg;
    let divSelectedButton = divSelectedButtonArg;
    let genre=genreArg
    await generateButtonUpDown(divSelectedButton, sortingMethod, genre, startingPosition, numberOfMovies, divSelected);
    await recuperationStockageEtAffichageFilm(sortingMethod, genre, startingPosition,numberOfMovies,divSelected);
};


async function bestMovieDisplay(sortingMethod, genre, startingPosition, numberOfMovies, bestMovieContainer){
    const bestMovieParsed = await recuperationFilm(sortingMethod, genre, startingPosition, numberOfMovies);
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



bestMovieDisplay('-imdb_score', '', 1, 1, '.Movies__BestMovie');
generateAndDisplayDivsMovies('-imdb_score','', 2, 7, 'Movies__PopularMoviesTest__Slider');
affichagemoviesDiv('.Movies__PopularMovies__Scrolling-Btn', '-imdb_score','', 2, 7, '.Movies__PopularMovies__MoviesList');
affichagemoviesDiv('.Movies__ActionMovies__Scrolling-Btn', '-imdb_score','action', 1, 7, '.Movies__ActionMovies__MoviesList');
affichagemoviesDiv('.Movies__RomanticMovies__Scrolling-Btn', '-imdb_score','romance', 1, 7, '.Movies__RomanticMovies__MoviesList');
affichagemoviesDiv('.Movies__Comedies__Scrolling-Btn', '-imdb_score','comedy', 1, 7, '.Movies__Comedies__MoviesList');