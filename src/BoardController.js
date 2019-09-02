import {render, unrender} from "./utils";
import Sort from "./components/sort";
import EditTask from "./components/editTask";
import Task from "./components/task";
import Message from "./components/message";
import LoadMoreBtn from "./components/loadMoreBtn";
import BoardTasks from "./components/boardTasks";

class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._tasksCount = this._tasks.length;
    this._startTaskIndex = 0;
    // в _intermediateTaskIndex хранится значение startTaskIndex,
    // сделано для правильного рендеринга карточек во время сортировки
    // и при клике на loadMoreBtn
    this._intermediateTaskIndex = this._startTaskIndex;
    this._finishTaskIndex = 7;
    this._loadBlocsQt = 8;
    this._sortElem = new Sort().getElement();
    this._boardTasksElem = new BoardTasks().getElement();
    this._loadMoreBtnElem = new LoadMoreBtn().getElement();
    this._onLoadMoreBtnClick = this._onLoadMoreBtnClick.bind(this);
    this._onSortClick = this._onSortClick.bind(this);
  }

  init() {
    if (!this._tasksCount ||
      this._tasksCount === this._tasks.filter(task => task.isArchive).length) {
        this._renderMessage();
    } else {
      render(this._container, this._sortElem);
      render(this._container, this._boardTasksElem);
      this._renderAllTasks();
      this._renderLoadMoreBtn();

      this._sortElem.addEventListener(`click`, this._onSortClick);
    }
  }

  _onSortClick(e) {
    e.preventDefault();

    if (e.target.tagName !== `A`) {
      return;
    }

    this._boardTasksElem.innerHTML = ``;
    this._startTaskIndex = 0;

    switch (e.target.dataset.sortType) {
      case `date-up`: {
        const sortByDateUpTasks = this._tasks.slice().sort((a, b) => (a.dueDate - b.dueDate));
        sortByDateUpTasks.forEach((tasks, index) => this._renderTask(tasks, index));
        break;
      }
      case `date-down`: {
        const sortByDateDownTasks = this._tasks.slice().sort((a, b) => (b.dueDate - a.dueDate));
        sortByDateDownTasks.forEach((tasks, index) => this._renderTask(tasks, index));
        break;
      }
      case `default`: {
        this._renderAllTasks();
        break;
      }
    }
  }

  _renderLoadMoreBtn() {
    if (this._tasksCount > this._finishTaskIndex) {
      render(this._container, this._loadMoreBtnElem);
      this._loadMoreBtnElem.addEventListener(`click`, this._onLoadMoreBtnClick);
    }
  }

  _onLoadMoreBtnClick() {
    this._startTaskIndex = this._intermediateTaskIndex;
    this._startTaskIndex += this._loadBlocsQt;
    this._finishTaskIndex += this._loadBlocsQt;
    this._intermediateTaskIndex = this._startTaskIndex;
    this._renderAllTasks();

    if (this._finishTaskIndex >= this._tasksCount) {
      unrender(this._loadMoreBtnElem);
    }
  }

  _renderMessage() {
    const messageText = `Congratulations, all tasks were completed!
        To create a new click on «add new task» button.`;
    const messageElem = new Message(messageText).getElement();
    render(this._container, messageElem);
  }

  _renderTask(tasks, index) {
    console.log(`${this._startTaskIndex} : ${this._finishTaskIndex}`)
    if (index < this._startTaskIndex || index > this._finishTaskIndex) return;
    const taskElement = new Task(tasks).getElement();
    const editTaskElement = new EditTask(tasks).getElement();

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._boardTasksElem.replaceChild(taskElement, editTaskElement);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    taskElement
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._boardTasksElem.replaceChild(editTaskElement, taskElement);
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    editTaskElement.querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    editTaskElement.querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    editTaskElement
      .querySelector(`form`)
      .addEventListener(`sumbit`, (e) => {
        e.preventDefault();
        this._boardTasksElem.replaceChild(taskElement, editTaskElement);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._boardTasksElem, taskElement);
  }

  _renderAllTasks() {
    this._tasks.forEach((tasks, index) => this._renderTask(tasks, index));
  }
}

export default BoardController;
