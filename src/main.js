import {taskArray, filtersArray, TASK_COUNT} from "./data";
import Menu from "./components/menu";
import Search from "./components/search";
import Filters from "./components/filters";
import AdditionalFilters from "./components/additionalFilters";
import EditTask from "./components/editTask";
import LoadMoreBtn from "./components/loadMoreBtn";

import Task from "./components/task";
import {render} from "./utils";
import Message from "./components/message";

const controlElem = document.querySelector(`.control`);
const menu = new Menu();
render(controlElem, menu.getElement());

const mainElem = document.querySelector(`.main`);
const search = new Search();
render(mainElem, search.getElement());

const filters = new Filters(filtersArray);
render(mainElem, filters.getElement());

mainElem.insertAdjacentHTML(`beforeend`, `<section class="board container"></section>`)
const boardElem = document.querySelector(`.board`);

if (taskArray.length === 0 ||
    taskArray.length === taskArray.filter(task => task.isArchive).length) {
      const messageText = `Congratulations, all tasks were completed! To create a new click on «add new task» button.`;
      const messageElem = new Message(messageText).getElement();
      render(boardElem, messageElem);
  } else {
    const additionalFilters = new AdditionalFilters();
    render(boardElem, additionalFilters.getElement());

    boardElem.insertAdjacentHTML(`beforeend`, `<div class="board__tasks"></div>`)
    const tasksContainer = document.querySelector(`.board__tasks`);

    // количество подгружаемых блоков
    const LOAD_BLOCS_QT = 8;
    let startTaskIndex = 0;
    let finishTaskIndex = 7;

    const renderTask = (taskMock, index) => {
      if (index < startTaskIndex || index > finishTaskIndex) return;
      const task = new Task(taskMock);
      const editTask = new EditTask(taskMock);

      const taskElement = task.getElement();
      const editTaskElement = editTask.getElement();

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

    const getTasks = () => {
      taskArray.forEach((taskMock, index) => renderTask(taskMock, index));
    }
    getTasks();

    const loadMoreBtn = new LoadMoreBtn();
    const loadMoreBtnElem = loadMoreBtn.getElement();
    const onLoadMoreBtnClick = ({ currentTarget }) => {
      startTaskIndex = finishTaskIndex;
      finishTaskIndex += LOAD_BLOCS_QT;

      getTasks();

      if (finishTaskIndex >= TASK_COUNT) {
        currentTarget.style.display = `none`;
      }
    }
    render(boardElem, loadMoreBtnElem);
    loadMoreBtnElem.addEventListener(`click`, onLoadMoreBtnClick);
  }
