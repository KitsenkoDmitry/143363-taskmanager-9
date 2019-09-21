import {render, unrender, Mode} from "./utils";
import Sort from "./components/sort";
import Message from "./components/message";
import LoadMoreBtn from "./components/loadMoreBtn";
import BoardTasks from "./components/boardTasks";
import TaskListController from "./TaskListController";

const TASKS_IN_ROW = 8;
class BoardController {
  constructor(container) {
    this._container = container;
    this._tasks = [];
    this._creatingTask = null;
    this._sort = new Sort();
    this._boardTasks = new BoardTasks();
    this._loadMoreBtn = new LoadMoreBtn();
    this._onLoadMoreBtnClick = this._onLoadMoreBtnClick.bind(this);
    this._onSortClick = this._onSortClick.bind(this);
    this._subscriptions = [];
    this._showedTasks = TASKS_IN_ROW;
    this._taskListController = new TaskListController(this._boardTasks.getElement());

    this._init();
  }

  _init() {
    render(this._container, this._sort.getElement());
    render(this._container, this._boardTasks.getElement());
    this._sort.getElement().addEventListener(`click`, this._onSortClick);
  }

  show(tasks) {
    if (tasks !== this._tasks) this.setTasks(tasks);
    this._container.classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  createTask() {
    this._taskListController.createTask();
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._showedTasks = TASKS_IN_ROW;

    this._renderBoard();
  }

  _renderBoard() {
    if (!this._tasks.length ||
      this._tasks.length === this._tasks.filter(task => task.isArchive).length) {
      this._renderMessage();
    } else {
      this._unrenderLoadMoreBtn();
      if (this._showedTasks < this._tasks.length) {
        render(this._container, this._loadMoreBtn.getElement());
        this._loadMoreBtn.getElement().addEventListener(`click`, this._onLoadMoreBtnClick);
      }

      this._taskListController.setTasks(this._tasks.slice(0, this._showedTasks));
    }
  }

  _onSortClick(e) {
    e.preventDefault();

    if (e.target.className !== `board__filter`) {
      return;
    }
    this._boardTasks.getElement().innerHTML = ``;

    switch (e.target.dataset.sortType) {
      case `date-up`: {
        const sortByDateUpTasks = this._tasks.slice().sort((a, b) => (a.dueDate - b.dueDate));
        this.setTasks(sortByDateUpTasks);
        break;
      }
      case `date-down`: {
        const sortByDateDownTasks = this._tasks.slice().sort((a, b) => (b.dueDate - a.dueDate));
        this.setTasks(sortByDateDownTasks);
        break;
      }
      case `default`: {
        this.setTasks(this._tasks);
        break;
      }
    }
  }

  _onLoadMoreBtnClick() {
    this._taskListController.addTasks(this._tasks.slice(this._showedTasks, this._showedTasks + TASKS_IN_ROW));
    this._showedTasks += TASKS_IN_ROW;

    if (this._showedTasks > this._tasks.length) {
      this._unrenderLoadMoreBtn();
    }
  }

  _unrenderLoadMoreBtn() {
      unrender(this._loadMoreBtn.getElement());
      this._loadMoreBtn.removeElement();
  }

  _renderMessage() {
    const messageText = `Congratulations, all tasks were completed!
        To create a new click on «add new task» button.`;
    const messageElem = new Message(messageText).getElement();
    render(this._container, messageElem);
  }
}

export default BoardController;
