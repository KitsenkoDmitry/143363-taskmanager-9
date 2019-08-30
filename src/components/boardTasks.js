import AbstractComponent from "./abstractComponent";

class BoardTasks extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <div class="board__tasks"></div>
    `;
  }
}

export default BoardTasks;
