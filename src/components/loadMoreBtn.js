import AbstractComponent from "./abstractComponent";

class LoadMoreBtn extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <button class="load-more" type="button">load more</button>
     `;
  }
}

export default LoadMoreBtn;
