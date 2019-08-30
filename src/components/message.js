
import AbstractComponent from './abstractComponent';

class Message extends AbstractComponent {
  constructor(text) {
    this._element = null;
  }

  getTemplate() {
    return `
      <p class="board__no-tasks">${this._text}</p>
    `;
  }
}

export default Message;
