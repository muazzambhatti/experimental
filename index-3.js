(async function () {
    const yearPicker = document.getElementById("year-picker");
    const currentYear = new Date().getFullYear();
    const minYear = 1902;
    for (let year = currentYear; year >= minYear; year--) {
        const option = document.createElement("option");
        option.value = year;
        option.text = year;
        yearPicker.appendChild(option);
    }

    const response = await fetch("data.json");
    const allMovies = await response.json();

    let searchButton = document.getElementById("searchbutton");
    searchButton.addEventListener("click", searchByName);

    let rankColumnList = document.getElementById("rankColumnList");
    let movieDetailsColumnList = document.getElementById("movieDetailsColumnList");
    let yearColumnList = document.getElementById("yearColumnList");

    let Genre = document.getElementById("genres");
    let Year = document.getElementById("year-picker");
    let Language = document.getElementById("languages");
    let Rating = document.getElementById("bottomMenu");

    Rating.addEventListener("change", dropDownChange);
    Genre.addEventListener("change", dropDownChange);
    Language.addEventListener("change", dropDownChange);
    Year.addEventListener("change", dropDownChange);

    function searchByName() {
        rankColumnList.innerHTML = "";
        movieDetailsColumnList.innerHTML = "";
        yearColumnList.innerHTML = "";
        let searchString = document.getElementById("searchText").value.toLowerCase();
        let results = allMovies.filter(function (movieName) {
            return movieName.title.toLowerCase().includes(searchString);
        })
        if (results.length == 0) {
            let newParagraph = document.createElement("li");
            newParagraph.innerHTML = `<p class="detailBox">No movies match your query.</p>`;
            movieDetailsColumnList.appendChild(newParagraph);
        } else {
            createMovieCards(results);
        }
    }

    dropDownChange()

    function dropDownChange() {
        rankColumnList.innerHTML = "";
        movieDetailsColumnList.innerHTML = "";
        yearColumnList.innerHTML = "";

        let results;

        requiredLanguage = Language.value;
        if (requiredLanguage == "All") {
            requiredLanguage = "";
        }
        results = allMovies.filter(function (movieName) {
            return movieName.original_language.includes(requiredLanguage);
        })

        requiredRating = Rating.value;
        if (requiredRating == "All") {
            requiredRating = 0;
            results = results.filter(function (movieName) {
                return movieName.vote_average >= requiredRating;
            })
        } else {
            results = results.filter(function (movieName) {
                return movieName.vote_average == requiredRating;
            })
        }

        requiredYear = Year.value;
        if (requiredYear != "All") {
            results = results.filter(function (movieName) {
                return movieName.release_date.includes(requiredYear);
            })
        }


        requiredGenre = Genre.value;
        if (requiredGenre != "All") {
            results = results.filter(function (movieName) {
                return movieName.genres.includes(requiredGenre);
            })
        }

        if (results.length == 0) {
            let newParagraph = document.createElement("li");
            newParagraph.innerHTML = `<p class="detailBox">No movies match your query.</p>`;
            movieDetailsColumnList.appendChild(newParagraph);
        } else {
            createMovieCards(results);
        }
    }

    function calculateRunTime(time) {
        let timeInHours = Math.floor(time / 60);
        let timeInMinutes = time - (60 * timeInHours);
        let timeString = timeInHours + " Hours " + timeInMinutes + " Mins";
        return timeString;
    }

    function createMovieCards(results) {
        for (let index = 0; index < results.length; index++) {
            // let movieHeight = "0px";
            let movie = document.createElement("li");
            let rank = document.createElement("li");
            let year = document.createElement("li");
            let count = index + 1;
            let movieYear = results[index].release_date.slice(0, 4);

            rank.innerHTML = `<div id="rank${index}" class="rankFromJs">${count}</div><br>`

            movie.innerHTML = `
            <div class="main" id="main${index}">  
                <img style="margin-left: 5px" src="https://image.tmdb.org/t/p/w45${results[index].poster_path}">
                <div id="movie">
                    <div id="movie1">
                        <a target="_blank" style="font-weight:bold;font-size:larger;color: black" href="https://www.imdb.com/title/${results[index].external_ids.imdb_id}">${results[index].title}</a>
                    </div>
                    <div id="movie2">
                        <span class="certificationspanstyle">${results[index].certification}</span>
                        <span class="genreSpanStyle">${results[index].genres.join(", ") + "."}</span>
                    </div>
                </div>
                <div id="extraDetailBox">
                    <h5 class="sideH5">Movie Rating:</h5>
                    <p class="sideP">${results[index].vote_average}</p>
                    <h5 class="sideH5">Watch Time:</h5>
                    <p class="sideP">${calculateRunTime(results[index].runtime)}</p>
                </div>
            </div><br>`
            year.innerHTML = `<div id="movieYear${index}" class="rankFromJs">${movieYear}</div><br>`

            rankColumnList.appendChild(rank);
            movieDetailsColumnList.appendChild(movie);
            yearColumnList.appendChild(year);
            
            let thisRank = "rank" + index;
            let thisMovie = "main" + index;
            let thisYear = "movieYear" + index;
            
            changeHeight(thisRank, thisMovie, thisYear);
        }
    }

    function changeHeight(rank, movie, year) {
        let changeFromMovie = "";
        let changeOfRank = "";
        let changeOfYear = "";
        changeFromMovie = getComputedStyle(document.getElementById(movie)).height;
        changeOfRank = document.getElementById(rank);
        changeOfYear = document.getElementById(year);
        changeOfRank.style.height = changeFromMovie;
        changeOfYear.style.height = changeFromMovie;
    }
})();