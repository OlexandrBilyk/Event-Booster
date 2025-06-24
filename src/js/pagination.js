import { renderEvents, getPages, renderSearchedEvents } from "./main.js";
const select = document.querySelector("#countrySelect");
const countries = [
  { name: "Україна", code: "UA" },
  { name: "США", code: "US" },
  { name: "Велика Британія", code: "GB" },
  { name: "Канада", code: "CA" },
  { name: "Німеччина", code: "DE" },
  { name: "Франція", code: "FR" },
  { name: "Японія", code: "JP" },
  { name: "Іспанія", code: "ES" },
];
const input = document.querySelector(".header-search__input--event");
const btnsContainer = document.querySelector(".slider");

const btns = [
  {
    text: 1,
    isActive: true,
  },
  {
    text: 2,
    isActive: false,
  },
  {
    text: 3,
    isActive: false,
  },
  {
    text: 4,
    isActive: false,
  },
  {
    text: 5,
    isActive: false,
  },
  {
    text: await getPages(),
    isActive: false,
  },
];
countries.forEach((country) => {
  const option = document.createElement("option");
  option.value = country.code;
  option.textContent = country.name;
  select.appendChild(option);
});
const isCountrySelected = function () {
  return select.value !== "";
};

function renderBtns() {
  btnsContainer.innerHTML = "";

  const addedBtns = [];
  const maxText = btns[btns.length - 1].text;

  btns.forEach((el, i) => {
    if (el.text >= maxText && i !== btns.indexOf(btns[btns.length - 1])) return;
    console.log(addedBtns, "Кнопочки");

    if (i === btns.length - 1 && addedBtns.length !== 0) {
      btnsContainer.insertAdjacentHTML(
        "beforeend",
        `
          <li class="slider__item">
            <p type="button" class="slider__text">...</p>
          </li>
        `
      );
    }

    btnsContainer.insertAdjacentHTML(
      "beforeend",
      `
        <li class="slider__item">
          <button type="button" class="slider__btn ${
            el.isActive ? "active" : ""
          }">${el.text}</button>
        </li>
      `
    );
    addedBtns.push(el.text);
  });
}

function addListeners() {
  const Dombtns = document.querySelectorAll(".slider__btn");

  Dombtns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      const num = Number(btn.textContent);
      const page = num - 1;

      btns.forEach((el) => {
        el.isActive = el.text === num;
      });

      const lastNum = btns.length - 2;
      if (i === lastNum) {
        const newBtn = {
          text: lastNum + 2,
          isActive: false,
        };
        btns.splice(btns.length - 1, 0, newBtn);
      }

      renderBtns();
      addListeners();

      const keyword = input.value.trim();
      const country = select.value;
      const hasKeyword = keyword !== "";
      const hasCountry = isCountrySelected();

      if (hasKeyword || hasCountry) {
        renderSearchedEvents(keyword, country, page);
      } else {
        renderEvents(page);
      }
    });
  });
}
async function performSmartSearch(page = 0) {
  const keyword = input.value.trim();
  const country = select.value;

  const hasKeyword = keyword !== "";
  const hasCountry = isCountrySelected();

  if (hasKeyword || hasCountry) {
    const events = await renderSearchedEvents(keyword, country, page);
    btns[btns.length - 1].text = await getPages(keyword, country);
    renderBtns();
    addListeners();
  } else {
    btns[btns.length - 1].text = await getPages();
    renderEvents(page);
    renderBtns();
    addListeners();
  }
}
const searchInput = _.debounce(() => {
  performSmartSearch(0);
}, 500);

input.addEventListener("input", searchInput);
select.addEventListener("change", searchInput);
renderBtns();
addListeners();
