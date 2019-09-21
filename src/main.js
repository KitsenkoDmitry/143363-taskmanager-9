import {tasksMock, filtersArray} from "./data";
import {render} from './utils';
import Menu from './components/menu';
import BoardController from "./BoardController";
import Search from "./components/search";
import Filters from "./components/filters";
import BoardContainer from "./components/boardContainer";
import Statistic from "./components/statistic";
import SearchController from './SearchController';

const controlElem = document.querySelector(`.control`);
const menuElem = new Menu().getElement();
render(controlElem, menuElem);

const mainElem = document.querySelector(`.main`);
const search = new Search();
render(mainElem, search.getElement());

const filters = new Filters(filtersArray);
render(mainElem, filters.getElement());

const boardContainer = new BoardContainer().getElement();
render(mainElem, boardContainer);

const boardController = new BoardController(boardContainer);
boardController.setTasks(tasksMock);

const onSearchBackButtonClick = () => {
  statistic.hide();
  searchController.hide();
  boardController.show(tasksMock);
};
const searchController = new SearchController(mainElem, search, onSearchBackButtonClick);

const statistic = new Statistic();

render(mainElem, statistic.getElement());
statistic.hide();

menuElem.addEventListener(`change`, (e) => {
  if (!e.target.classList.contains(`control__input`)) return;

  const tasksId = `control__task`;
  const statisticId = `control__statistic`;
  const newTaskId = `control__new-task`;

  switch (e.target.id) {
    case tasksId: {
      boardController.show(tasksMock);
      searchController.hide();
      statistic.hide();
      break;
    }
    case statisticId: {
      boardController.hide();
      searchController.hide();
      statistic.show();
      break;
    }
    case newTaskId: {
      boardController.createTask();
      statistic.hide();
    searchController.hide();
      boardController.show(tasksMock);
      menuElem.querySelector(`#${tasksId}`).checked = true;
      break;
    }
  }
})

search.getElement().addEventListener(`click`, () => {
  statistic.hide();
  boardController.hide();
  searchController.show(tasksMock);
});
