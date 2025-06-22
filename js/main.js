const list = document.querySelector(".main-list");
export const apiKey = "kIQL6ZGDiLwlRATyJnfEFaxKyK6k62iQ";

async function getEvents(page = 0) {
  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&size=20&page=${page}`
    );
    const data = await response.json();
    console.log(data);

    const events = Array.from(data._embedded.events);
    console.log(events);

    return events;
  } catch (error) {
    console.log(error);
  }
}
export async function getPages(keyword = "", countryCode = "") {
  try {
    const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");

    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("size", 20); 
    if (keyword) url.searchParams.set("keyword", keyword);
    if (countryCode) url.searchParams.set("countryCode", countryCode);

    const response = await fetch(url);
    const data = await response.json();

    const pages = data.page?.totalPages || 0;
    return pages;
  } catch (error) {
    console.log("Помилка при підрахунку сторінок:", error);
    return 0;
  }
}
export async function renderEvents(num) {
  let events = await getEvents(num);
  list.innerHTML = "";
  events.forEach((el) => {
    list.insertAdjacentHTML(
      "beforeend",
      `
        <li class="main-list__item">
          <div class="main-list__thumb">
            <img
              src="${el.images[0].url}" 
              alt="${el.name}"
              class="main-list__img"
            />
          </div>
          <h3 class="main-list__title">${el.name}</h3>
          <p class="main-list__date">${el.dates.start.localDate}</p>
          <address class="main-list-locate">
            <svg class="main-list-locate__icon">
              <use href="./images/icons/symbol-defs.svg#icon-locate"></use>
            </svg>
            ${el._embedded.venues[0].name}
          </address>
        </li> 
      `
    );
  });
}
export async function renderSearchedEvents(
  keyword = "",
  countryCode = "",
  page = 0
) {
  try {
    const url = new URL(
      "https://app.ticketmaster.com/discovery/v2/events.json"
    );

    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("size", 20);
    url.searchParams.set("page", page);

    if (keyword) url.searchParams.set("keyword", keyword);
    if (countryCode) url.searchParams.set("countryCode", countryCode);

    const response = await fetch(url);
    const data = await response.json();

    const events = data._embedded?.events || [];
    list.innerHTML = "";

    events.forEach((el) => {
      const title = el.name || "Без назви";
      const date = el.dates?.start?.localDate || "Без дати";
      const location = el._embedded?.venues?.[0]?.name || "Без локації";
      const image = el.images?.[0]?.url || "./images/default.jpg";

      list.insertAdjacentHTML(
        "beforeend",
        `
        <li class="main-list__item">
          <div class="main-list__thumb">
            <img
              src="${image}" 
              alt="${title}"
              class="main-list__img"
            />
          </div>
          <h3 class="main-list__title">${title}</h3>
          <p class="main-list__date">${date}</p>
          <address class="main-list-locate">
            <svg class="main-list-locate__icon">
              <use href="./images/icons/symbol-defs.svg#icon-locate"></use>
            </svg>
            ${location}
          </address>
        </li> 
      `
      );
    });
  } catch (error) {
    console.error("Помилка при запиті:", error);
  }
}

renderEvents(1);
