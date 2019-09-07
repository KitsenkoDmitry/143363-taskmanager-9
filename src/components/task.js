import AbstractComponent from './abstractComponent';
class Task extends AbstractComponent {
  constructor(data) {
    super();
    this._description = data.description;
    this._dueDate = new Date(data.dueDate);
    this._repeatingDays = data.repeatingDays;
    this._tags = data.tags;
    this._color = data.color;
    this._isArchive = data.isArchive;
    this._isFavorite = data.isFavorite;
  }

  getTemplate() {
    return `
      <article class="card card--${this._color}
        ${Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day]) ? `card--repeat` : ``}">
        <div class="card__form">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--edit">
                edit
              </button>
              <button type="button" class="card__btn card__btn--archive
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
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>

            <div class="card__textarea-wrap">
              <p class="card__text">${this._description}</p>
            </div>

            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <div class="card__date-deadline">
                    <p class="card__input-deadline-wrap">
                      <span class="card__date">
                        ${this._dueDate.toDateString()}
                      </span>
                      <span class="card__time">
                        ${this._dueDate.getHours()}:${this._dueDate.getMinutes()}
                        ${this._dueDate.getHours() < 12 ? `AM` : `PM`}
                      </span>
                    </p>
                  </div>
                </div>

                <div class="card__hashtag">
                  <div class="card__hashtag-list">
                  ${Array.from(this._tags).map((tag) => `<span class="card__hashtag-inner">
                        <span class="card__hashtag-name">
                          #${tag}
                        </span>
                      </span>`).join(``)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>`;
  }
}

export default Task;
