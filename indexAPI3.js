
const baseUrl = "https://cdn.contentful.com/spaces/";
const spaceId = localStorage.getItem("space_id");
const accessToken = localStorage.getItem("access_token");
const apiURL = `https://cdn.contentful.com/spaces/${spaceId}/entries/?access_token=${accessToken}&content_type=artist`;


const dataContainer = document.querySelector("#cardContainer");
const genreFilter = document.querySelector("#genreFilter");
const dayFilter = document.querySelector("#dayFilter");
const stageFilter = document.querySelector("#stageFilter");


let artistsData = [];
let entries = [];

const fetchData = async () => {
  const response = await fetch(apiURL);

  if (!response.ok) {
    throw new Error("HTTP-fel!");
  }

  const data = await response.json();
  artistsData = data.items;
  entries = data.includes.Entry;

  populateFilters(entries);
  renderArtists();
};

const populateFilters = (entries) => {
  //En funktion som använder datan från entries som olika parametrar för att sedan sortera i fack.
  const genres = new Set(); //Ett tomt fack för genre
  const days = new Set(); //Ett tomt fack för dagar
  const stages = new Set(); //Ett tomt fack för scen

  entries.forEach((entry) => {
    //Loop funktion. //om id och genra, stage eller day är samma som namnet så läggs de till i rätt fack.
    if (entry.sys.contentType.sys.id === "genre") genres.add(entry.fields.name);
    if (entry.sys.contentType.sys.id === "day")
      days.add(entry.fields.description);
    if (entry.sys.contentType.sys.id === "stage") stages.add(entry.fields.name);
  });

  genres.forEach((genre) => {
    //Varje genre loopas. För varje genre ska vi göra något med den...
    const option = document.createElement("option"); //Skapar ett alternativ i filter dropdown-listan.
    option.value = genre; //värdet på genre t ex rock till namnet på genre.
    option.textContent = genre; //Här sätter vi texten som visas i dropdown-menyn till namnet på genren.
    genreFilter.appendChild(option); //Här lägger vi till den nya <option>-elementet i själva dropdown-menyn.
  });

  days.forEach((day) => {
    const option = document.createElement("option");
    option.value = day;
    option.textContent = day;
    dayFilter.appendChild(option);
  });

  stages.forEach((stage) => {
    const option = document.createElement("option");
    option.value = stage;
    option.textContent = stage;
    stageFilter.appendChild(option);
  });
};

//För varje gång användaren filterar visas artisterna på nytt.
const renderArtists = () => {
  //Här hämtas det som användaren har valt.
  const selectedGenre = genreFilter.value;
  const selectedDay = dayFilter.value;
  const selectedStage = stageFilter.value;

  //Filtrerar bort det som användaren inte valt och visar bara det som användaren valt.
  const filteredArtists = artistsData.filter((artist) => {
    const genreId = artist.fields.genre.sys.id; //För varje artist hämtar vi genren de är associerade med, via deras genre-fält. Detta ger oss ID:t för genren.
    const dayId = artist.fields.day.sys.id;
    const stageId = artist.fields.stage.sys.id;

    //Nu när vi har id försöker vi hitta den fullständiga informationen.
    const genre = entries.find((entry) => entry.sys.id === genreId);
    const day = entries.find((entry) => entry.sys.id === dayId);
    const stage = entries.find((entry) => entry.sys.id === stageId);

    //Om genre, dag, eller scen matchar den aktuella artistens data, returneras den här artisten, annars inte.
    return (
      (!selectedGenre || genre.fields.name === selectedGenre) &&
      (!selectedDay || day.fields.description === selectedDay) &&
      (!selectedStage || stage.fields.name === selectedStage)
    );
  });
  //Här använder vi map() för att omvandla varje filtrerad artist till ett HTML-element som vi kan lägga in på sidan.
  const artistHTML = filteredArtists
    .map((artist) => {
      const genreId = artist.fields.genre.sys.id;
      const dayId = artist.fields.day.sys.id;
      const stageId = artist.fields.stage.sys.id;

      const genre = entries.find((entry) => entry.sys.id === genreId);
      const day = entries.find((entry) => entry.sys.id === dayId);
      const stage = entries.find((entry) => entry.sys.id === stageId);

      return `<div class="artistCard">
          <h2>${artist.fields.name}</h2>
          <p>${artist.fields.description}</p>
          <p><strong>Genre: </strong>${genre.fields.name}</p>
          <p><strong>Stage: </strong>${stage.fields.name}</p>
          <p><strong>Day: </strong>${day.fields.description}</p>
        </div>`;
    })
    .join("");

  dataContainer.innerHTML = artistHTML;
};
//Varje gång användaren ändrar ett val i dropdown-menyn för genre, day eller stage,körs renderArtists-funktionen igen för att uppdatera listan.
genreFilter.addEventListener("change", renderArtists);
dayFilter.addEventListener("change", renderArtists);
stageFilter.addEventListener("change", renderArtists);

fetchData();
