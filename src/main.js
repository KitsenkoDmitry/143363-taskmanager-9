import {tasksMock, filtersArray} from "./data";
import {render} from './utils';
import Menu from './components/menu';
import BoardController from "./BoardController";
import Search from "./components/search";
import Filters from "./components/filters";
import BoardContainer from "./components/boardContainer";

const controlElem = document.querySelector(`.control`);
const menu = new Menu();
render(controlElem, menu.getElement());

const mainElem = document.querySelector(`.main`);
const search = new Search();
render(mainElem, search.getElement());

const filters = new Filters(filtersArray);
render(mainElem, filters.getElement());

const boardContainer = new BoardContainer();
render(mainElem, boardContainer.getElement());

const boardElem = document.querySelector(`.board`);

const boardController = new BoardController(boardElem, tasksMock);
boardController.init();
