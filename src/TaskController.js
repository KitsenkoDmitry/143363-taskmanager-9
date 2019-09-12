import Task from "./components/task";
import EditTask from "./components/editTask";
import {render, Position, Mode} from "./utils";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

/**
 * Логика взаимодействия с карточкой задачи
 */
class TaskController {
  constructor(container, task, mode, onDataChange, onChangeView) {
    this._container = container;
    this._task = task;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;

    this._taskElement = new Task(task).getElement();
    this._editTaskElement = new EditTask(task).getElement();

    this._init(mode);
  }

  _init(mode) {
    let currentView = mode === Mode.ADDING ? this._editTaskElement : this._taskElement;
    let renderPosition = mode === Mode.ADDING ? Position.AFTERBEGIN : Position.BEFOREEND;

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

    this._editTaskElement.querySelector(`.card__delete`).addEventListener(`click`, ()=> {
      this._onDataChange(null, this._task);
    })

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
      .querySelector(`form`)
      .addEventListener(`submit`, (e) => {
        e.preventDefault();

        const formData = new FormData(this._editTaskElement.querySelector(`.card__form`));

        const entry = {
          description: formData.get(`text`),
          dueDate: new Date(formData.get(`date`)),
          repeatingDays: '',
          color: formData.get(`color`),
          tags: new Set(formData.getAll(`hashtag`)),
          repeatingDays: getRepeatingDays(formData),
          isFavorite: this._task[`isFavorite`],
          isArchive: this._task[`isArchive`]
        }

        this._onDataChange(entry, mode === Mode.DEFAULT ? this._task : null);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._container, currentView, renderPosition);
  }

  setDefaultView() {
    if (this._container.contains(this._editTaskElement)) {
        this._container
          .replaceChild(this._taskElement, this._editTaskElement);
    }
  }
}

export default TaskController;

function getRepeatingDays(formData) {
  return formData.getAll(`repeat`).reduce((acc, day)=>{
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
  })
}
