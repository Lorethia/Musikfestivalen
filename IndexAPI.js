const baseUrl = "https://cdn.contentful.com/spaces/";
const spaceId = localStorage.getItem("space_id");
const accessToken = localStorage.getItem("access_token");
const apiURL = `https://cdn.contentful.com/spaces/${spaceId}/entries/?access_token=${accessToken}&content_type=artist`;

const dataContainer = document.querySelector("#cardContainer");

const fetchData = async () => {
  const response = await fetch(apiURL);

  if (!response.ok) {
    throw new Error("HTTP-fel!");
  }

  const data = await response.json();
  console.log(data);

  const artistHTML = data.items
    .map((artist) => {
      const stageId = artist.fields.stage.sys.id;
      const dayId = artist.fields.day.sys.id;
      const genreId = artist.fields.genre.sys.id;
      const stage = data.includes.Entry.find(
        (entry) => entry.sys.id === stageId
      );
      const day = data.includes.Entry.find((entry) => entry.sys.id === dayId);

      const genre = data.includes.Entry.find(
        (entry) => entry.sys.id === genreId
      );

      let dateTime = "Inget datum";
      if (item.fields.day) {
        const dayId = item.fields.day.sys.id;
        const dayEntry = entries.find((entry) => entry.sys.id === dayId);
      }
      if (dayEntry && dayEntry.fields.date) {
        dateTime = formatDateTime(dayEntry.fields.date);
      }
      return `<div class="artistCard">
          <h2>${artist.fields.name}</h2>
          <p>${artist.fields.description}</p>
          <p><strong>Genre: </strong>${genre.fields.name}</p>
          <p><strong>Stage: </strong>${stage.fields.name} ${stage.fields.description}
          </p>
          <p><strong>Day: </strong>${day.fields.description}</p>
        </div>`;
    })
    .join("");

  dataContainer.innerHTML = artistHTML;

  console.log(artistHTML);
};

fetchData();
