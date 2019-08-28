import {createElement} from '../utils';

class Filters {
  constructor(filtersArray) {
    this._filtersArray = filtersArray;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    if (this._element) {
      this._element = null;
    }
  }

  getTemplate() {
    return `
      <section class="main__filter filter container">
        ${this._filtersArray
        .map((filter) =>
          `<input
            type="radio"
            id="filter__all"
            class="filter__input visually-hidden"
            name="filter"
            checked
            ${!filter.count ? `disabled` : ``}
          />
          <label for="filter__all" class="filter__label">
            ${filter.title}
            <span class="filter__all-count">
              ${filter.count}
            </span>
          </label>`).join(``)}
      </section>`;
  }
}

export default Filters;
