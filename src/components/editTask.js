import AbstractComponent from "./abstractComponent";

class EditTask extends AbstractComponent {
  constructor(data) {
    super();
    this._description = data.description;
    this._dueDate = new Date(data.dueDate);
    this._repeatingDays = data.repeatingDays;
    this._tags = data.tags;
    this._color = data.color;
    this._isFavorite = data.isFavorite;
    this._isArchive = data.isArchive;

    this._toggleDateSelection = this._toggleDateSelection.bind(this);
    this._toggleRepeat = this._toggleRepeat.bind(this);
    this._changeColor = this._changeColor.bind(this);
    this._subscribeOnEvents();
  }

  _toggleDateSelection(e) {
    const btn = e.currentTarget;
    const dateStatusElem = btn.querySelector(`.card__date-status`);
    const dateInput = this.getElement().querySelector(`.card__date`);
    if (dateStatusElem.innerText === `YES`) {
      dateInput.style.display = `none`;
      dateInput.value = ``;
      dateStatusElem.innerText = `No`;
    } else {
      dateInput.style.display = `block`;
      dateStatusElem.innerText = `Yes`;
    }
  }

  _toggleRepeat(e) {
    const editTaskElem = this.getElement();
    const btn = e.currentTarget;
    const repeatStatusElem = btn.querySelector(`.card__repeat-status`);
    const repeatDaysElem = editTaskElem.querySelector(`.card__repeat-days`);

    if (repeatStatusElem.innerText === `YES`) {
      repeatDaysElem.style.display = `none`;
      repeatStatusElem.innerText = ` No`;

      repeatDaysElem.querySelectorAll(`.card__repeat-day-input`).forEach((it) => {
        it.checked = false;
      });
    } else {
      repeatDaysElem.style.display = `block`;
      repeatStatusElem.innerText = ` Yes`;
    }

    editTaskElem.classList.toggle(`card--repeat`);
  }

  _changeColor({currentTarget}) {
    if (currentTarget.checked) {
      const color = currentTarget.value;
      this.getElement().classList.remove(`card--black`, `card--yellow`, `card--blue`, `card--green`, `card--pink`);
      this.getElement().classList.add(`card--${color}`);
    }
  }

  _subscribeOnEvents() {
    // добавление хештега
    this.getElement().querySelector(`.card__hashtag-input`).addEventListener(`keydown`, (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();

        this.getElement().querySelector(`.card__hashtag-list`).insertAdjacentHTML(`beforeend`, `<span class="card__hashtag-inner">
            <input
              type="hidden"
              name="hashtag"
              value="${e.target.value}"
              class="card__hashtag-hidden-input"
            />
            <p class="card__hashtag-name">
              #${e.target.value}
            </p>
            <button type="button" class="card__hashtag-delete">
              delete
            </button>
          </span>`);

        e.target.value = ``;
      }
    });

    // удаление хештега
    this.getElement().querySelector(`.card__hashtag-list`).addEventListener(`click`, (e) => {
      if (e.target.classList.contains(`card__hashtag-delete`)) {
        e.target.parentNode.remove();
      }
    });

    this.getElement().querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._toggleDateSelection);

    this.getElement().querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._toggleRepeat);

    this.getElement().querySelectorAll(`.card__color-input`).forEach((it) => {
      it.addEventListener(`change`, this._changeColor);
    });
  }

  getTemplate() {
    return `
      <article class="card card--edit card--${this._color}
      ${Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day]) ? `card--repeat` : ``}">
        <form class="card__form" method="get">
          <div class="card__inner">
            <div class="card__control">
              <button
                type="button"
                class="card__btn card__btn--archive
                ${this._isArchive ? `` : `card__btn--disabled`}">
                archive
              </button>
              <button
                type="button"
                class="card__btn card__btn--favorites
                ${this._isFavorite ? `` : `card__btn--disabled`}"
              >
                favorites
              </button>
            </div>
            <div class="card__color-bar">
              <div class="card__color-bar-wave">
                <svg width="100%" height="10">
                  <use xlink:href="#wave"></use>
                </svg>
              </div>
            </div>

            <div class="card__textarea-wrap">
              <label>
                <textarea
                  class="card__text"
                  placeholder="Start typing your text here..."
                  name="text"
                >${this._description}</textarea>
              </label>
            </div>

            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <button class="card__date-deadline-toggle" type="button">
                    date: <span class="card__date-status">
                      ${this._dueDate ? ` yes` : ` no`}
                    </span>
                  </button>

                  <fieldset class="card__date-deadline"
                    ${this._dueDate ? `` : `disabled`}>
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__date"
                        type="text"
                        placeholder="23 September"
                        name="date"
                        value="${this._dueDate}"
                      />
                    </label>
                  </fieldset>

                  <button class="card__repeat-toggle" type="button">
                    repeat:<span class="card__repeat-status">
                    ${Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day]) ? `yes` : `no`}
                    </span>
                  </button>

                  <fieldset class="card__repeat-days"
                    ${Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day]) ? `` : `style: "display: none"`}>
                    <div class="card__repeat-days-inner">
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-mo-1"
                        name="repeat"
                        value="mo"
                        ${this._repeatingDays[`mo`] ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-mo-1"
                        >mo</label
                      >
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-tu-1"
                        name="repeat"
                        value="tu"
                        ${this._repeatingDays[`tu`] ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-tu-1"
                        >tu</label
                      >
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-we-1"
                        name="repeat"
                        value="we"
                        ${this._repeatingDays[`we`] ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-we-1"
                        >we</label
                      >
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-th-1"
                        name="repeat"
                        value="th"
                        ${this._repeatingDays[`th`] ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-th-1"
                        >th</label
                      >
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-fr-1"
                        name="repeat"
                        value="fr"
                        ${this._repeatingDays[`fr`] ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-fr-1"
                        >fr</label
                      >
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        name="repeat"
                        value="sa"
                        id="repeat-sa-1"
                        ${this._repeatingDays[`fr`] ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-sa-1"
                        >sa</label
                      >
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-su-1"
                        name="repeat"
                        value="su"
                        ${this._repeatingDays[`su`] ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-su-1"
                        >su</label
                      >
                    </div>
                  </fieldset>
                </div>

                <div class="card__hashtag">
                  <div class="card__hashtag-list">
                    ${Array.from(this._tags).map((tag) => `
                    <span class="card__hashtag-inner">
                      <input
                        type="hidden"
                        name="hashtag"
                        value="${tag}"
                        class="card__hashtag-hidden-input"
                      />
                      <p class="card__hashtag-name">
                        #${tag}
                      </p>
                      <button type="button" class="card__hashtag-delete">
                        delete
                      </button>
                    </span>`).join(``)}
                  </div>

                  <label>
                    <input
                      type="text"
                      class="card__hashtag-input"
                      name="hashtag-input"
                      placeholder="Type new hashtag here"
                    />
                  </label>
                </div>
              </div>

              <div class="card__colors-inner">
                <h3 class="card__colors-title">Color</h3>
                <div class="card__colors-wrap">
                  <input
                    type="radio"
                    id="color-black-1"
                    class="card__color-input card__color-input--black visually-hidden"
                    name="color"
                    value="black"
                    ${this._color === `black` ? `checked` : ``}
                  />
                  <label
                    for="color-black-1"
                    class="card__color card__color--black"
                    >black</label
                  >
                  <input
                    type="radio"
                    id="color-yellow-1"
                    class="card__color-input card__color-input--yellow visually-hidden"
                    name="color"
                    value="yellow"
                    ${this._color === `yellow` ? `checked` : ``}
                  />
                  <label
                    for="color-yellow-1"
                    class="card__color card__color--yellow"
                    >yellow</label
                  >
                  <input
                    type="radio"
                    id="color-blue-1"
                    class="card__color-input card__color-input--blue visually-hidden"
                    name="color"
                    value="blue"
                    ${this._color === `blue` ? `checked` : ``}
                  />
                  <label
                    for="color-blue-1"
                    class="card__color card__color--blue"
                    >blue</label
                  >
                  <input
                    type="radio"
                    id="color-green-1"
                    class="card__color-input card__color-input--green visually-hidden"
                    name="color"
                    value="green"
                    ${this._color === `green` ? `checked` : ``}
                  />
                  <label
                    for="color-green-1"
                    class="card__color card__color--green"
                    >green</label
                  >
                  <input
                    type="radio"
                    id="color-pink-1"
                    class="card__color-input card__color-input--pink visually-hidden"
                    name="color"
                    value="pink"
                    ${this._color === `pink` ? `checked` : ``}
                  />
                  <label
                    for="color-pink-1"
                    class="card__color card__color--pink"
                    >pink</label
                  >
                </div>
              </div>
            </div>

            <div class="card__status-btns">
              <button class="card__save" type="submit">save</button>
              <button class="card__delete" type="button">delete</button>
            </div>
          </div>
        </form>
      </article>
    `;
  }
}

export default EditTask;
