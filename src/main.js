import { renderAdditionalFilters } from "./components/additionalFilters";
import { renderBoardContainer } from "./components/boardContainer";
import { renderBoardTasksWrapper } from "./components/boardTaskWrapper";
import { renderEditTaskCard } from "./components/editTaskCard";
import { renderFilters } from "./components/filters";
import { renderLoadMoreBtn } from "./components/loadMoreBtn";
import { renderMenu } from "./components/menu";
import { renderSearch } from "./components/search";
import { makeTask } from "./components/taskCard";
import { taskArray, filtersArray, TASK_COUNT } from "./data";
import { renderComponent } from "./helpers";

const controlElem = document.querySelector(`.control`);
renderComponent(controlElem, renderMenu());

const mainElem = document.querySelector(`.main`);
renderComponent(mainElem, renderSearch());
renderComponent(mainElem, renderFilters(filtersArray));
renderComponent(mainElem, renderBoardContainer());

const boardElem = document.querySelector(`.board`);
renderComponent(boardElem, renderAdditionalFilters());
renderComponent(boardElem, renderBoardTasksWrapper());

const tasksContainer = document.querySelector(`.board__tasks`);
renderComponent(tasksContainer, renderEditTaskCard(taskArray[0]));
renderComponent(boardElem, renderLoadMoreBtn());
const loadMoreBtn = document.querySelector(`.load-more`);

// количество подгружаемых блоков
const LOAD_BLOCS_QT = 8;
let startTaskIndex = 1;
let finishTaskIndex = 8;

renderTasks(startTaskIndex, finishTaskIndex);

loadMoreBtn.addEventListener(`click`, onLoadMoreBtnClick);

/**
 * Рендер карточек
 *
 * @param {Number} startIndex Начальный индекс в массиве для рендера
 * @param {Number} finishIndex Конечный индекс в массиве для рендера
 */
function renderTasks(startIndex, finishIndex) {
  renderComponent(
    tasksContainer,
    taskArray
      .map((item, index) => {
        if (index >= startIndex && index < finishIndex) {
          return makeTask(item);
        }
      })
      .join(``)
  );
}

/**
 * Колбэк обработчика на клик по кнопке Load more
 *
 * @param {*} param0 Curent target
 */
function onLoadMoreBtnClick({ currentTarget }) {
  startTaskIndex = finishTaskIndex;
  finishTaskIndex += LOAD_BLOCS_QT;

  renderTasks(startTaskIndex, finishTaskIndex);

  if (finishTaskIndex >= TASK_COUNT) {
    currentTarget.style.display = `none`;
  }
}
