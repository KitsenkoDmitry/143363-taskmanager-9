import AbstractComponent from "./abstractComponent";

class SearchResultGroup extends AbstractComponent {
  getTemplate() {
    return `
      <section class="result__group">
        <div class="result__cards">
          <!--Append tasks here-->
        </div>
      </section>
     `;
  }
}

export default SearchResultGroup;
