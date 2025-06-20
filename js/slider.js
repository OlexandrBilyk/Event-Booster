import { renderEvents, getPages } from "./main.js";

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
    text: await getPages() ,
    isActive: false,
  },
//   {
//     text: 13700 ,
//     isActive: false,
//   },
];
const btnsContainer = document.querySelector(".slider");
function renderBtns() {
  btnsContainer.innerHTML = "";
  btns.forEach((el, i) => {
    if (i === btns.length - 1) {
      btnsContainer.insertAdjacentHTML(
        "beforeend",
        `
            <li class="slider__item">
            <p type="button" class="slider__text
            }">...</p>
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
  });
}
function addListeners() {
  const Dombtns = document.querySelectorAll(".slider__btn");

  Dombtns.forEach((btn, i) => {
    btn.addEventListener("click", (event) => {
      const num = Number(btn.textContent);

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

        renderBtns();
        addListeners();
      }

      renderBtns();
      addListeners();

      renderEvents(num);
    });
  });
}
renderBtns();
addListeners();
