const baseUrl = "https://cdn.contentful.com/spaces/";
const spaceId = localStorage.getItem("space_id");
const accessToken = localStorage.getItem("access_token");
const apiURL = `https://cdn.contentful.com/spaces/${spaceId}/entries/?access_token=${accessToken}&content_type=artist`;

//hämta API data
const fetchApiData = async () => {
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av data.");
    }
    const data = await response.json(); //formaterar till Json
    console.log("Hämtad data:", data); // Logga den råa API-responsen för att felsöka

    return data;
  } catch (error) {
    console.error("Fel vid hämtning av API-data:", error);
  }
};

// Funktion för att formatera datum och klockslag
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("sv-SE", options); // Format: 6 juni 2025, 15:30
};

const buildHtmlStructure = (data) => {
  const includes = data.includes || {}; // Se till att includes existerar
  const entries = includes.Entry || []; // Få all Entry-data från includes (t.ex. scen eller genre)
  // Skapa en funktion för att hitta genre-namnet från genre-id
  const getGenreName = (genreId) => {
    const genreEntry = entries.find((entry) => entry.sys.id === genreId);
    return genreEntry ? genreEntry.fields.name : "Ingen genre";
  };

  const artistsHTML = data.items
    .map((item) => {
      // Hantera genre
      const genreId = item.fields.genre?.sys?.id || null;
      const genre = genreId ? getGenreName(genreId) : "Ingen genre"; // Hämta genre-namn om id finns
      // Hantera scen (om scen är en länk till en Entry)
      const sceneId = item.fields.stage?.sys?.id;
      const scene = sceneId
        ? entries.find((entry) => entry.sys.id === sceneId)?.fields.name ||
          "Ingen scen"
        : "Ingen scen";
      // Hantera datum och klockslag (om day finns som en länk)
      let dateTime = "Inget datum"; // Standardvärde om inget datum finns
      if (item.fields.day) {
        const dayId = item.fields.day.sys.id;
        const dayEntry = entries.find((entry) => entry.sys.id === dayId);
        if (dayEntry && dayEntry.fields.date) {
          dateTime = formatDateTime(dayEntry.fields.date); // Hämta och formatera datum och klockslag
        }
      }
      return `
      <div class="artistCard">
        <h2>${item.fields.name}</h2>
        <p>${item.fields.description}</p>
        <p><strong>Genre:</strong> ${genre}</p>
        <p><strong>Scene:</strong> ${scene}</p>
        <p><strong>Date & time:</strong> ${dateTime}</p>
      </div>
    `;
    })

    //För att inte ha komma separerade strängar, annars går det inte aTT ANVÄNDA I INNERHTML.
    .join("");
  const container = document.getElementById("cardContainer");
  if (container) {
    container.innerHTML = artistsHTML;
  } else {
    console.error("Elementet med ID 'cardContainer' hittades inte.");
  }
};
// Huvudfunktion för att hämta och visa artister
const fetchData = async () => {
  const data = await fetchApiData();
  if (data) {
    buildHtmlStructure(data); // Bygg HTML med den hämtade datan
  }
};
// Kör funktionen
fetchData();
