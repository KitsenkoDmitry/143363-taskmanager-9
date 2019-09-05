import Task from "./components/task";
import EditTask from "./components/editTask";
import {render} from "./utils";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

class TaskController {
  constructor(container, task, onDataChange, onChangeView) {
    this._container = container;
    this._task = task;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;

    this._taskElement = new Task(task).getElement();
    this._editTaskElement = new EditTask(task).getElement();

    this.init();
  }

  init() {
    flatpickr(this._editTaskElement.querySelector(`.card__date`), {
      dateFormat: "d F G:i K",
      altInput: true,
      allowInput: true,
      defaultDate: this._task.dueDate
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container.replaceChild(this._taskElement, this._editTaskElement);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._taskElement
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._container.replaceChild(this._editTaskElement, this._taskElement);
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._editTaskElement.querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._editTaskElement.querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    const onArchiveBtnClick = () => {
      let entry = Object.assign({}, this._task);
      entry[`isArchive`] = !entry[`isArchive`];
      this._onDataChange(entry, this._task);
    }

    const onFavoritesBtnClick = () => {
      let entry = Object.assign({}, this._task);
      entry[`isFavorite`] = !entry[`isFavorite`];
      this._onDataChange(entry, this._task);
    }

    this._editTaskElement.querySelector(`.card__btn--archive`)
      .addEventListener(`click`, onArchiveBtnClick);

    this._editTaskElement.querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, onFavoritesBtnClick);

    this._taskElement.querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, onFavoritesBtnClick);

    this._taskElement.querySelector(`.card__btn--archive`)
      .addEventListener(`click`, onArchiveBtnClick);


    this._editTaskElement
      .querySelector(`.card__save`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();

        const formData = new FormData(this._editTaskElement.querySelector(`.card__form`));

        const entry = {
          description: formData.get(`text`),
          dueDate: new Date(formData.get(`date`)),
          repeatingDays: '',
          color: formData.get(`color`),
          tags: new Set(formData.getAll(`hashtag`)),
          repeatingDays:
            formData.getAll(`repeat`).reduce((acc, day)=>{
              acc[day] = true;
              return acc;
            },{
              mo: false,
              tu: false,
              we: false,
              th: false,
              fr: false,
              sa: false,
              su: false
            }),
          isFavorite: this._task[`isFavorite`],
          isArchive: this._task[`isArchive`]
        }

        this._onDataChange(entry, this._task);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._container, this._taskElement);
  }

  setDefaultView() {
      if (this._container.contains(this._editTaskElement)) {
          this._container
            .replaceChild(this._taskElement, this._editTaskElement);
      }
  }
}

export default TaskController;
