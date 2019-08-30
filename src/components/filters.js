import AbstractComponent from "./abstractComponent";


class Filters extends AbstractComponent {
  constructor(filtersArray) {
    super();
    this._filtersArray = filtersArray;
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
