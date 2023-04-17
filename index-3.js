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
            let movie = document.createElement("li");
            let rank = document.createElement("li");
            let year = document.createElement("li");
            let count = index + 1;
            let movieYear = results[index].release_date.slice(0, 4);
            rank.innerHTML = `<div class="rankFromJs">${count}</div><br>`
            movie.innerHTML = `<div class="movieFromJs">
                <img src="https://image.tmdb.org/t/p/w45${results[index].poster_path}">
                <div class="movietitlefromJS">
                    <h4 style="margin: 0px 0px 10px 0px;"><a target="_blank" style="color: black" href="https://www.imdb.com/title/${results[index].external_ids.imdb_id}">${results[index].title}</a></h4>
                    <div>
                        <span class="certificationspanstyle">${results[index].certification}</span>
                        <span style="display:inline-block;width:60%;border: 1px solid black;">${results[index].genres.toString(", ")}</span>
                    </div>
                    <div style="height: 100%;position:absolute; right: 2px; top:2px">
                        <h5 class="ratingDuration">Movie Rating:</h5>
                        <p class="ratingDurationAns">${results[index].vote_average}</p>
                        <h5 class="ratingDuration">Watch Time:</h5>
                        <p class="ratingDurationAns">${calculateRunTime(results[index].runtime)}</p>
                    </div>
                </div>
            </div>
            <br>`
            year.innerHTML = `<div class="rankFromJs">${movieYear}</div><br>`
            rankColumnList.appendChild(rank);
            movieDetailsColumnList.appendChild(movie);
            yearColumnList.appendChild(year);
        }
    }
})();