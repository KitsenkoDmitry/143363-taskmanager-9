import {createElement} from '../utils';

class Message {
  constructor(text) {
    this._element = null;
    this._text = text;
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
      <p class="board__no-tasks">${this._text}</p>
    `;
  }
}

export default Message;
