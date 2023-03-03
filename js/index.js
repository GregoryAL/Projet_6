// Classes definition

class infoFilm {
    // Create Object with a movie's usable informations 
    constructor(position, id, title, image)  {
        this.position = position;
        this.id = id;
        this.title = title;
        this.image = image;
    };

};

// Display functions

function createMovieDiv(divSelected, film, i){
    // Select the right div 
    const moviesDiv = document.getElementById(divSelected+'__Movie'+i);
    // Create containers that will hold image, title and a button
    const elementDiv = document.createElement("div");
    elementDiv.className = divSelected+'__Movie'+i+'__MovieContainer';
    const movieImage = document.createElement("img");
    if (film.image === null){
        // Will display a default image if there was no image url
        movieImage.src = 'img/default_image.jpg';
        movieImage.alt = 'Default Movie Jacket picture';
    }else{
        movieImage.src = film.image;
        movieImage.alt = 'Movie jacket picture';
    };
    // Will display a default image picture is url doesnt work
    movieImage.onerror = function(){
        this.src='img/default_image.jpg';
        this.alt = 'Default Movie Jacket picture';
    };
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
    if (idMovie.image_url === null){
        // Will display a default image if there was no image url
        movieImageElement.src = 'img/default_image.jpg';
        movieImageElement.alt = 'Default Movie Jacket picture'
    }else{
        movieImageElement.src = idMovie.image_url;
        movieImageElement.alt = 'Movie jacket picture';
    };
    movieImageElement.style.cursor = 'default';
    // Will display a default image if image url doesnt work
    movieImageElement.onerror = function(){
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
    // check if there s more than 1 entry in the list for display purpose
    if (source.length > 1){
        // if more than one entry, add them with a ',' and go to next line but for the last one
        let i = 0;
        if (i < (source.length-1)){
            let ListElement = document.createElement("span");
            ListElement.innerText = source[i]+', \n';
            ListConteneur.appendChild(ListElement);
            i++;
        };
        // add the last entry with a '.' at the end
        let ListElement = document.createElement("span");
        ListElement.innerText = source[i]+'.';
        ListConteneur.appendChild(ListElement);
    }else{
        // add the only entry with a '.' a the end
        const ListElement = document.createElement("span");
        ListElement.innerText = source[0]+'.';
        ListConteneur.appendChild(ListElement);
    };
    return ListConteneur;
};

function generateButtonInfo (divButton, idMovie){
    let buttonInfo = document.createElement('button');
    buttonInfo.type = 'button';
    buttonInfo.innerHTML = "Plus d'informations";
    buttonInfo.className = 'ButtoninfoFilm';
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
};

function clearSlidersView(divSelected, sortingMethod, genre, startingPosition, numberOfMovies) {
    // Erase the categorie s grid content
    const allDivSelected = document.querySelectorAll('.'+divSelected+'__Movie');
    allDivSelected.forEach(div => {
        div.innerHTML= ""
    });
    // Recreate the buttons
    createLeftRightButton(sortingMethod, genre, startingPosition, numberOfMovies, divSelected); 
};

function createLeftRightButton(sortingMethod, genre, startingPosition, numberOfMovies, divSelected){
    // Create the Left and Right button
    const movie1Container = document.getElementById(divSelected+'__Movie1');
    let divButtonDown = document.createElement("div");
    divButtonDown.className = "Movies__Slider__Previous";
    divButtonDown.id = divSelected+"__Movie1__Previous";
    divButtonDown.innerText = '<';
    divButtonDown.style.visibility = 'hidden';
    movie1Container.appendChild(divButtonDown);
    const movie7Container = document.getElementById(divSelected+'__Movie7');
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
    if (infoBestMovie.image_url === null){
        // Will display a default image if there was no image url
        bestMovieImageContainer.src = 'img/default_image.jpg';
        bestMovieImageContainer.alt = 'Default Movie Jacket picture'
    }else{
        bestMovieImageContainer.src = infoBestMovie.image_url;
        bestMovieImageContainer.alt = 'Movie jacket picture';
    };
    // Will display a default image if image url doesnt work
    bestMovieImageContainer.onerror = function(){
        this.src='img/default_image.jpg';
    }
    // Generate a button to open the modal that will display detailed information page
    generateButtonInfo(divButton, idBestMovie);

};

function reloadPage(){
    // Erase local storage
    localStorage.clear();
    // get back on top
    document.body.scrollIntoView();
    // reload page
    window.location.reload(true);
};

function displayCategoriesMenu(){
    // Display or hide all the categories available
    if (document.getElementById('Header__Menu__Categories__List').style.visibility === 'visible'){
        document.getElementById('Header__Menu__Categories__List').style.visibility = 'hidden';
    }else{
        document.getElementById('Header__Menu__Categories__List').style.visibility = 'visible';
    };
};

function categorieSelection(categoryIdClicked){
    // Display the category selected
    // extract the genre
    const categoryClicked = categoryIdClicked.replace('Header__Menu__Categories__List__', '');
    const categorieName = document.getElementById(categoryIdClicked).innerText;
    // extract the name of the previous category selected
    let categorieAlreadySelected = document.getElementById('Movies__Selectedgenre__TitleCategorie').innerText
    categorieAlreadySelected = categorieAlreadySelected.replace('Films catégorie ', '').replace(' les mieux notés :', '');
    // store the main div name
    const divSelected = 'Movies__Selectedgenre__Slider'
    
    if (document.querySelector('.Movies__Selectedgenre').style.visibility === 'visible' && categorieName === categorieAlreadySelected){
        // if the selected categorie is already in display, do nothing
    }else{
        // if not clear the slider in case another categorie was displayed
        clearSlidersView(divSelected, '-imdb_score', categoryClicked, 1, 7);
        // hide all the divs but the header and the one where the categorie selected will be displayed
        document.getElementById('Header__Menu__Categories__List').style.visibility='hidden';
        document.querySelector('.Movies__BestMovie').style.visibility='hidden';
        document.querySelector('.Movies__PopularMovies').style.visibility='hidden';
        document.querySelector('.Movies__ActionMovies').style.visibility='hidden';
        document.querySelector('.Movies__RomanticMovies').style.visibility='hidden';
        document.querySelector('.Movies__Comedies').style.visibility='hidden';
        document.querySelector('.Movies__Selectedgenre').style.visibility='visible';
        // change the category title to reflect user s choice
        document.getElementById('Movies__Selectedgenre__TitleCategorie').innerText='Films catégorie '+categorieName+' les mieux notés :';
        // fetch organise and display the category selected
        generateAndDisplayDivsMovies('-imdb_score',categoryClicked, 1, 7, divSelected);
    };    
};

// Fetching functions

async function getMovieInfoAndReturnItParsed(idFilm){
    // get the informations for one movie through its id then parse and return it
    const reponse = await fetch('http://localhost:8000/api/v1/titles/'+idFilm.toString());
    let infoFilmParsed = await reponse.json();
    return infoFilmParsed;
};

async function getMoviesFromPageAndStockThemParsed(sortingMethod, genre, page){
    // check if the information from a page result is already stored, if so it parses it, if not, it gets, stringify  and store it
    const reponse = await fetch('http://localhost:8000/api/v1/titles/?genre='+genre+'&page='+page.toString()+'&sort_by='+sortingMethod);
    const moviesPage = await reponse.json();
    return moviesPage;
};

// Organising data functions

function pagesToBrowse(firstMovieID, numberOfMovies){
    // Calculate and return which page will be needed to get, to later extract each movie informations
    let pageToAdd= (Math.trunc((firstMovieID-1)/5)+1);
    const numberOfPages  = (Math.trunc((numberOfMovies-1) / 5) + 1);
    let PagesList = [];
    for(let j=0; j <= numberOfPages; j++){
        PagesList.push(pageToAdd);
        pageToAdd++;
    };
    return PagesList;
};

function createMovieObjectAndStoreThem( moviesPage, moviePosition, sortingMethod, genre){
    // create the needed information for each movie of the page and store them 
    for (let movie of moviesPage.results) {
        const movieObject = new infoFilm(moviePosition, movie.id, movie.title, movie.image_url);
        const storageName = sortingMethod+genre+moviePosition.toString();
        let movieInStock = localStorage.getItem(storageName);
        if (movieInStock === null){
            const movieObjectStringified = JSON.stringify(movieObject);
            localStorage.setItem(storageName, movieObjectStringified);
        };
        moviePosition++;
    };
};

async function getMoviesAndStockThemParsed(sortingMethod, genre, page){
    const moviesPage = await getMoviesFromPageAndStockThemParsed(sortingMethod, genre, page);
    let moviePosition = (page*5)-4;
    // create the needed information for each movie of the page and store them 
    createMovieObjectAndStoreThem(moviesPage, moviePosition, sortingMethod, genre);
    
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
        const film = JSON.parse(localStorage.getItem(indexFilm));
        moviesToDisplayList.push(film);
        filmID++;
    }    
    return moviesToDisplayList;
};

function popMovieFromStorage(moviePosition, genre, sortingMethod){
    // free storage space
    const storageNameToPop = sortingMethod+genre+moviePosition.toString();
    localStorage.removeItem(storageNameToPop)
};

function functionButtonLeftRight(sortingMethod, genre, startingPosition, numberOfMovies, divSelected){
    // Assign function to both arrow left and right
    // Focus on the Previous button div
    let buttonDown = document.getElementById(divSelected+'__Movie1__Previous');
    buttonDown.onclick = function(){
        // Change the starting position to display the previous 7 movies          
        startingPosition -=7;
        // Remove information from the slider grid
        clearSlidersView(divSelected, sortingMethod, genre, startingPosition, numberOfMovies);
        // Display the previous 7 movies
        generateAndDisplayDivsMovies(sortingMethod,genre,startingPosition,numberOfMovies, divSelected);
        // manage localStorage by removing unused entries
        for (let i=1; i<=7; i++){
            popMovieFromStorage(startingPosition+(i+6), genre, sortingMethod);
        };
    };
    // focus on the Next button div
    let buttonUp = document.getElementById(divSelected+'__Movie7__Next');
    buttonUp.onclick = async function(){  
        // change the starting position to display the previous 7 movies         
        startingPosition +=7;
        // Remove information from the slider grid
        clearSlidersView(divSelected, sortingMethod, genre, startingPosition, numberOfMovies);
        // Display the next 7 movies
        generateAndDisplayDivsMovies(sortingMethod,genre,startingPosition,numberOfMovies, divSelected);
        // manage localStorage by removing unused entries
        for (let i=1; i<=7; i++){
            popMovieFromStorage(startingPosition-(i+6), genre, sortingMethod);
        };
    };
    
};

async function generateAndDisplayDivsMovies(sortingMethod, genre, startingPosition, numberOfMovies, divSelected){
    // Browse through the categorie's 7 slots and get and display the movie informations
    let i = 1;
    let movieToDisplay = await getMoviesAndReturnThemParsed(sortingMethod, genre, startingPosition, numberOfMovies);
    for (let film of movieToDisplay){
        createMovieDiv(divSelected, film, i);
        i++;
    };
    // Assign function to both button
    functionButtonLeftRight(sortingMethod,genre,startingPosition,numberOfMovies,divSelected);
};

// listening events functions

function accueilButtonListened(selectedDiv){
    // Listen for a click on Accueil button
    const accueilButton = document.querySelector(selectedDiv);
    accueilButton.addEventListener('click', reloadPage);
};

function categoriesButtonListened(categorieDiv){
    // Listen for a click on Categories Button
    const categoriesButton = document.querySelector(categorieDiv);
    categoriesButton.addEventListener('click', displayCategoriesMenu);
};


function singleCategorieButtonListened(){
    // add a listener to categorie button
    document.getElementById('Header__Menu__Categories__List').addEventListener('click', function(categorie){
        if(categorie.target && categorie.target.nodeName == "LI") {
            categorieSelection(categorie.target.id);
        };
    });
};

// Call the main functions

// Listen to a click on Accueil Button and reload the page if clicked
accueilButtonListened('.Header__Menu__Accueil');
// Listen to a click on Categories Button and Display the categories if clicked
categoriesButtonListened('.Header__Menu__Categories')
// add an event listener on the click of a single categorie
singleCategorieButtonListened();
// Generation the best movie display
bestMovieDisplay('-imdb_score', '', 1, 1, '.Movies__BestMovie');
// Generate the 4 differents categories display
generateAndDisplayDivsMovies('-imdb_score','', 2, 7, 'Movies__PopularMovies__Slider');
generateAndDisplayDivsMovies('-imdb_score','action', 1, 7, 'Movies__ActionMovies__Slider');
generateAndDisplayDivsMovies('-imdb_score','romance', 1, 7, 'Movies__RomanticMovies__Slider');
generateAndDisplayDivsMovies('-imdb_score','comedy', 1, 7, 'Movies__Comedies__Slider');