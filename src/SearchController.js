import {render, unrender, Position} from "./utils";
import SearchResult from "./components/searchResult";
import SearchResultGroup from "./components/searchResultGroup";
import SearchResultInfo from "./components/searchResultInfo";
import TaskListController from "./TaskListController";
import moment from 'moment';

const Pattern = {
  WORD: /^[A-zА-я]{2,}/,
  TAG: /^#[A-z]{2,}/,
  DATE: /^D\d{2}\.\d{2}\.\d{4}$/
}

const testPattern = (pattern, string) => {
  return new RegExp(pattern).test(string);
}

class SearchController {
  constructor(container, search, onBackBtnClick) {
    this._container = container;
    this._search = search;
    this._onBackBtnClick = onBackBtnClick;

    this._tasks = [];
    this._searchResult = new SearchResult();
    this._searchResultGroup = new SearchResultGroup();
    this._searchResultInfo = new SearchResultInfo({});
    this._taskListController = new TaskListController(this._searchResultGroup.getElement().querySelector(`.result__cards`), this._onDataChange.bind(this))

    this._init();
  }

  _init() {
    this.hide();

    render(this._container, this._searchResult.getElement());
    render(this._searchResult.getElement(), this._searchResultGroup.getElement());
    render(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), Position.AFTERBEGIN);

    this._searchResult.getElement().querySelector(`.result__back`).addEventListener(`click`, () => {
      this._search.getElement().querySelector('input').value = ``;
      this._onBackBtnClick();
    })

    this._search.getElement().querySelector(`input`).addEventListener(`keyup`, (e) => {
      const {value} = e.target;
      if (value.length < 3) return;

      let tasks = [];
      if (testPattern(Pattern.TAG, value)) {
        tasks = this._tasks.filter((task) => {
          return Array.from(task.tags).join(` `).toLocaleLowerCase().includes(value.replace(`#`, ``));
        })
      } else if (testPattern(Pattern.DATE, value)) {
        tasks = this._tasks.filter((task) => {
          return moment(task.dueDate).format(`DD.MM.YYYY`) === value.replace('D', '');
        })
      } else if (testPattern(Pattern.WORD, value)) {
        tasks = this._tasks.filter((task) => {
          return task.description.includes(value);
        })
      };

      this._showSearchResult(value, tasks);
    });
  }

  show(tasks) {
    this._tasks = tasks;

    if (this._searchResult.getElement().classList.contains(`visually-hidden`)) {
      this._showSearchResult(``, this._tasks);
      this._searchResult.getElement().classList.remove(`visually-hidden`);
    }
  }

  hide() {
    this._searchResult.getElement().classList.add(`visually-hidden`);
  }

  _showSearchResult(text, tasks) {
    if (this._searchResultInfo) {
      unrender(this._searchResultInfo.getElement());
      this._searchResultInfo.removeElement();
    }

    this._searchResultInfo = new SearchResultInfo({
      searchLine: text,
      resultCount: tasks.length
    })

    render(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), Position.AFTERBEGIN);

    this._taskListController.setTasks(tasks);
  }

  _onDataChange(tasks) {
    this._tasks = tasks;
  }

}

export default SearchController;
