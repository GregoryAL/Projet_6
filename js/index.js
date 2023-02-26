class infoFilm {
    // Create Object with a movie's usable informations 
    constructor(position, id, title, image)  {
        this.position = position;
        this.id = id;
        this.title = title;
        this.image = image;
    };

};

function createMovieDiv(divSelected, film, i){
    // Select the right div 
    const moviesDiv = document.querySelector(divSelected+'__Movie'+i);
    // Create containers that will hold image, title and a button
    const elementDiv = document.createElement("div");
    elementDiv.className = divSelected+'__Movie'+i+'__MovieContainer';
    const movieImage = document.createElement("img");
    movieImage.src = film.image;
    // Will display a default image if image url doesnt work
    movieImage.onerror = function(){
        this.onerror=null;
        this.src='img/default_image.jpg';
    }
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
    // Make the image clickable, and open a modal with the movie's detailed informations
    modalOpening(movieImage, '.Movies__ModalMovie', '.Movies__ModalMovie__Content', film.id)
};

function CreateDisplayModal(divSelected, idMovie){
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
    // Will display a default image if image url doesnt work
    movieImageElement.onerror = function(){
        this.onerror=null;
        this.src='img/default_image.jpg';
    }
    
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

function pagesToBrowse(firstMovieID, numberOfMovies){
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

async function getMovieInfoAndReturnItParsed(idFilm){
    // get the informations for one movie through its id then parse and return it
    const reponse = await fetch('http://localhost:8000/api/v1/titles/'+idFilm.toString());
    let infoFilmParsed = await reponse.json();
    return infoFilmParsed;
};

async function getMoviesAndStockThemParsed(sortingMethod, genre, page){
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



async function getMoviesAndReturnThemParsed(sortingMethod, genre, firstMovieID, numberOfMovies){
    const PagesList = pagesToBrowse(firstMovieID, numberOfMovies);
    let moviesToDisplayList = [];
    // Browse through results pages
    for (let page of PagesList) {
        // Get all the pages needed and stock them
        await getMoviesAndStockThemParsed(sortingMethod, genre, page);
    };
    let filmID = firstMovieID;
    for(let i=0; i<numberOfMovies; i++){
        // Get all the movies needed and stock them
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
    buttonInfo.innerHTML = "Plus d'information";
    buttonInfo.className = 'infoFilm';
    // When the button is clicked, open a modal with the movie's detailed informations
    modalOpening(buttonInfo, '.Movies__ModalMovie', '.Movies__ModalMovie__Content', idMovie)
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
            const movieInfo = await getMovieInfoAndReturnItParsed(idMovie); 
            CreateDisplayModal(modalContent, movieInfo);
        };
            
    };
}

async function functionButtonLeftRight(sortingMethod, genre, startingPosition, numberOfMovies, divSelected){
    // Assign function to both arrow left and right
    // Focus on the Previous button div
    let buttonDown = document.getElementById(divSelected+'__Movie1__Previous');
    buttonDown.onclick = function(){
        // Change the starting position to display the previous 7 movies          
        startingPosition -=7;
        // Erase the categorie s grid content
        for(let k = 1; k<=7; k++){
            document.querySelector('.'+divSelected+'__Movie'+k).innerHTML= "";
        };
        // Recreate the buttons
        createLeftRightButton(sortingMethod, genre, startingPosition, numberOfMovies, divSelected); 
        // Display the previous 7 movies
        generateAndDisplayDivsMovies(sortingMethod,genre,startingPosition,numberOfMovies, divSelected);
    };
    // focus on the Next button div
    let buttonUp = document.getElementById(divSelected+'__Movie7__Next');
    buttonUp.onclick = async function(){  
        // change the starting position to display the previous 7 movies         
        startingPosition +=7;
        // Erase the categorie s grid content
        for(let k = 1; k<=7; k++){
            document.querySelector('.'+divSelected+'__Movie'+k).innerHTML= "";
        };
        // Recreate the buttons
        createLeftRightButton(sortingMethod, genre, startingPosition, numberOfMovies, divSelected); 
        // Display the next 7 movies
        await generateAndDisplayDivsMovies(sortingMethod,genre,startingPosition,numberOfMovies, divSelected);
    };
    
};

function createLeftRightButton(sortingMethod, genre, startingPosition, numberOfMovies, divSelected){
    // Create the Left and Right button
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
    // Assign a function to both button
    functionButtonLeftRight(sortingMethod, genre, startingPosition, numberOfMovies, divSelected);
};

async function generateAndDisplayDivsMovies(sortingMethod, genre, startingPosition, numberOfMovies, divSelected){
    // Browse through the categorie's 7 slots and get and display the movie informations
    let i = 1;
    let movieToDisplay = await getMoviesAndReturnThemParsed(sortingMethod, genre, startingPosition, numberOfMovies);
    for (let film of movieToDisplay){
        await createMovieDiv('.'+divSelected, film, i);
        i++;
    };
    // Assign function to both button
    functionButtonLeftRight(sortingMethod,genre,startingPosition,numberOfMovies,divSelected);
};

async function bestMovieDisplay(sortingMethod, genre, startingPosition, numberOfMovies, bestMovieContainer){
    // Get the best movie info and display it 
    // Get the movie info from the first page listing the best rated movies
    const bestMovieParsed = await getMoviesAndReturnThemParsed(sortingMethod, genre, startingPosition, numberOfMovies);
    // Get the best movie ID
    const idBestMovie = bestMovieParsed[0].id;
    // Get the best movie detailed informations
    const infoBestMovie = await getMovieInfoAndReturnItParsed(idBestMovie);
    // Display basic informations
    const bestMovieResumeContainer = document.querySelector(bestMovieContainer+'__MovieInfo__Resume');
    bestMovieResumeContainer.innerText = infoBestMovie.description;
    const bestMovieTitleContainer = document.querySelector(bestMovieContainer+'__MovieInfo__Title');
    bestMovieTitleContainer.innerText = infoBestMovie.title;
    const divButton = document.querySelector(bestMovieContainer+'__MovieInfo__BtnContainer');
    
    const bestMovieImageContainer = document.querySelector(bestMovieContainer+'__Image');
    bestMovieImageContainer.src = infoBestMovie.image_url;
    // Will display a default image if image url doesnt work
    bestMovieImageContainer.onerror = function(){
        this.onerror=null;
        this.src='img/default_image.jpg';
    }
    // Generate a button to open the modal that will display detailed information page
    generateButtonInfo(divButton, idBestMovie, bestMovieImageContainer);

};

const AccueilButton = document.querySelector('.Header__Menu__Accueil');
AccueilButton.onclick = function(){
    window.location.reload(true);
}
// Generation the best movie display
bestMovieDisplay('-imdb_score', '', 1, 1, '.Movies__BestMovie');
// Generate the 4 differents categories display
generateAndDisplayDivsMovies('-imdb_score','', 2, 7, 'Movies__PopularMovies__Slider');
generateAndDisplayDivsMovies('-imdb_score','action', 1, 7, 'Movies__ActionMovies__Slider');
generateAndDisplayDivsMovies('-imdb_score','romance', 1, 7, 'Movies__RomanticMovies__Slider');
generateAndDisplayDivsMovies('-imdb_score','comedy', 1, 7, 'Movies__Comedies__Slider');