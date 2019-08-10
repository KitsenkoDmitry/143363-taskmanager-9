import { renderAdditionalFilters } from "./components/additionalFilters";
import { renderBoardContainer } from "./components/boardContainer";
import { renderBoardTasksWrapper } from "./components/boardTaskWrapper";
import { renderEditTaskCard } from "./components/editTaskCard";
import { renderFilters } from "./components/filters";
import { renderLoadMoreBtn } from "./components/loadMoreBtn";
import { renderMenu } from "./components/menu";
import { renderSearch } from "./components/search";
import { renderTaskCard } from "./components/taskCard";

/**
 * Рендерит верстку в конец контейнера
 *
 * @param {Element} containerElem Обертка, куда вставляется верстка
 * @param {String} componentLayout Верстка
 */
const renderComponent = (containerElem, componentLayout) => {
  containerElem.insertAdjacentHTML(`beforeend`, componentLayout);
};

// Рендерим все компоненты
const controlElem = document.querySelector(`.control`);
renderComponent(controlElem, renderMenu());

const mainElem = document.querySelector(`.main`);
renderComponent(mainElem, renderSearch());
renderComponent(mainElem, renderFilters());

renderComponent(mainElem, renderBoardContainer());

const boardElem = document.querySelector(`.board`);
renderComponent(boardElem, renderAdditionalFilters());

renderComponent(boardElem, renderBoardTasksWrapper());

const boardTasksElem = document.querySelector(`.board__tasks`);
renderComponent(boardTasksElem, renderEditTaskCard());
renderComponent(boardTasksElem, renderTaskCard());
renderComponent(boardTasksElem, renderTaskCard());
renderComponent(boardTasksElem, renderTaskCard());

// добавляем кнопку Load More
renderComponent(boardElem, renderLoadMoreBtn());
