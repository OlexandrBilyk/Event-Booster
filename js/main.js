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
export async function getPages() {
  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}`
    );
    const data = await response.json();

    const pages = data.page.totalPages;

    return pages;
  } catch (error) {
    console.log(error);
  }
}
export async function renderEvents(num) {
  const events = await getEvents(num - 1);
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
async function searchEvents(keyword, countryCode, page = 0) {
  try {
    const url = new URL(
      "https://app.ticketmaster.com/discovery/v2/events.json"
    );
    url.searchParams.set("apikey", apiKey);
    if (keyword) url.searchParams.set("keyword", keyword);
    if (countryCode) url.searchParams.set("countryCode", countryCode);
    url.searchParams.set("page", page);
    url.searchParams.set("size", 20);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Помилка: ${response.status}`);

    const data = await response.json();

    return data._embedded?.events || [];
  } catch (err) {
    console.error("Не вдалося завантажити події:", err);
    return [];
  }
}

renderEvents(1);
