import {render, unrender} from "./utils";
import AdditionalFilters from "./components/additionalFilters";
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
    this._finishTaskIndex = 7;
    this._loadBlocsQt = 8;
    this._additionalFiltersElem = new AdditionalFilters().getElement();
    this._boardTasksElem = new BoardTasks().getElement();
    this._loadMoreBtnElem = new LoadMoreBtn().getElement();
    this._onLoadMoreBtnClick = this._onLoadMoreBtnClick.bind(this);
  }

  init() {
    if (!this._tasksCount ||
      this._tasksCount === this._tasks.filter(task => task.isArchive).length) {
        this._renderMessage();
    } else {
      render(this._container, this._additionalFiltersElem);
      render(this._container, this._boardTasksElem);
      this._renderAllTasks();
      this._renderLoadMoreBtn();
    }
  }

  _renderLoadMoreBtn() {
    if (this._tasksCount > this._finishTaskIndex) {
      render(this._container, this._loadMoreBtnElem);
      this._loadMoreBtnElem.addEventListener(`click`, this._onLoadMoreBtnClick);
    }
  }

  _onLoadMoreBtnClick() {
    this._startTaskIndex += this._loadBlocsQt;
    this._finishTaskIndex += this._loadBlocsQt;

    this._renderAllTasks();

    if (this._finishTaskIndex >= this._tasksCount) {
      unrender(this._loadMoreBtnElem);
    }
  }

  _getTasksContainer() {
    return document.querySelector(`.board__tasks`);
  }

  _renderMessage() {
    const messageText = `Congratulations, all tasks were completed!
        To create a new click on «add new task» button.`;
    const messageElem = new Message(messageText).getElement();
    render(this._container, messageElem);
  }

  _renderTask(taskMock, index) {
    if (index < this._startTaskIndex || index > this._finishTaskIndex) return;
    const taskElement = new Task(taskMock).getElement();
    const editTaskElement = new EditTask(taskMock).getElement();
    const tasksContainer = this._getTasksContainer();

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        tasksContainer.replaceChild(taskElement, editTaskElement);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    taskElement
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        tasksContainer.replaceChild(editTaskElement, taskElement);
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
        tasksContainer.replaceChild(taskElement, editTaskElement);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(tasksContainer, taskElement);
  }

  _renderAllTasks() {
    this._tasks.forEach((taskMock, index) => this._renderTask(taskMock, index));
  }
}

export default BoardController;
