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
import BoardContainer from "./components/boardContainer";
import BoardTasks from "./components/boardTasks";

const controlElem = document.querySelector(`.control`);
const menu = new Menu();
render(controlElem, menu.getElement());

const mainElem = document.querySelector(`.main`);
const search = new Search();
render(mainElem, search.getElement());

const filters = new Filters(filtersArray);
render(mainElem, filters.getElement());

const boardContainer = new BoardContainer;
render(mainElem, boardContainer.getElement());

const boardElem = document.querySelector(`.board`);

const renderMessage = () => {
  const messageText = `Congratulations, all tasks were completed!
    To create a new click on «add new task» button.`;
  const messageElem = new Message(messageText).getElement();
  render(boardElem, messageElem);
}
const additionalFilters = new AdditionalFilters();
const boardTasks = new BoardTasks();

if (taskArray.length === 0 ||
    taskArray.length === taskArray.filter(task => task.isArchive).length) {
      renderMessage();
  } else {
    render(boardElem, additionalFilters.getElement());
    render(boardElem, boardTasks.getElement());
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

    if (TASK_COUNT > finishTaskIndex) {
      render(boardElem, loadMoreBtnElem);
      loadMoreBtnElem.addEventListener(`click`, onLoadMoreBtnClick);
    }
  }
