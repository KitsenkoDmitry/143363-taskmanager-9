import AbstractComponent from "./abstractComponent";

class SearchResult extends AbstractComponent {
  getTemplate() {
    return `
      <section class="result container">
        <button class="result__back">back</button>
      </section>`;
  }
}

export default SearchResult;
