import AbstractComponent from "./abstractComponent";

class SearchResultInfo extends AbstractComponent {
  constructor({searchLine, resultCount}) {
    super();
    this._searchLine = searchLine;
    this._resultCount = resultCount;
  }

  getTemplate() {
    return `
        <h2 class="result__title">
          ${this._searchLine}<span class="result__count">${this._resultCount}</span>
        </h2>
     `;
  }
}

export default SearchResultInfo;
