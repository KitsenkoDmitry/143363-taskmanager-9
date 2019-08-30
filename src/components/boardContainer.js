import AbstractComponent from "./abstractComponent";

class BoardContainer extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <section class="board container"></section>
    `;
  }
}

export default BoardContainer;
