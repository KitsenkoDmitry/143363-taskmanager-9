import {render, unrender} from "./utils";
import Sort from "./components/sort";
import Message from "./components/message";
import LoadMoreBtn from "./components/loadMoreBtn";
import BoardTasks from "./components/boardTasks";
import TaskController from './TaskController';

class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._tasksCount = this._tasks.length;
    this._startTaskIndex = 0;
    // в _intermediateTaskIndex хранится значение startTaskIndex,
    // сделано для правильного рендеринга карточек во время сортировки
    // и при клике на loadMoreBtn
    this._intermediateTaskIndex = 0;
    this._finishTaskIndex = 7;
    this._loadBlocsQt = 8;
    this._sortElem = new Sort().getElement();
    this._boardTasks = new BoardTasks();
    this._loadMoreBtnElem = new LoadMoreBtn().getElement();
    this._onLoadMoreBtnClick = this._onLoadMoreBtnClick.bind(this);
    this._onSortClick = this._onSortClick.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);

    this._subscriptions = [];
  }

  init() {
    if (!this._tasksCount ||
      this._tasksCount === this._tasks.filter(task => task.isArchive).length) {
        this._renderMessage();
    } else {
      render(this._container, this._sortElem);
      render(this._container, this._boardTasks.getElement());
      this._renderAllTasks();
      this._renderLoadMoreBtn();

      this._sortElem.addEventListener(`click`, this._onSortClick);
    }
  }

  _onDataChange(newData, oldData) {
    this._startTaskIndex = 0;
    this._tasks[this._tasks.findIndex((task) => task === oldData)] = newData;
    this._boardTasks.getElement().innerHTML = ``;

    this._renderAllTasks();
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onSortClick(e) {
    e.preventDefault();

    if (e.target.className !== `board__filter`) {
      return;
    }

    this._boardTasks.getElement().innerHTML = ``;
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

  _renderTask(task, index) {
    if (index < this._startTaskIndex || index > this._finishTaskIndex) return;
    const taskController = new TaskController(
      this._boardTasks.getElement(),
      task,
      this._onDataChange,
      this._onChangeView);

    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
    console.log(this._subscriptions);
  }

  _renderAllTasks() {
    this._tasks.forEach((tasks, index) => this._renderTask(tasks, index));
  }
}

export default BoardController;
