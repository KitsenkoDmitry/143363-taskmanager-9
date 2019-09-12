import TaskController from './TaskController';
import {render, unrender, Mode} from "./utils";

class TaskListController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;

    this._creatingTask = null;
    this._subscriptions = [];
    this._tasks = [];

    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._subscriptions = [];

    this._container.innerHTML = ``;
    this._tasks.forEach((task) => this._renderTask(task));
  }

  addTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
    this._tasks = this._tasks.concat(tasks);
  }

  createTask() {
    if (this._creatingTask) return;

    const defaultTask = {
      description: `Lorem ipsum`,
      color: `black`,
      repeatingDays: {},
      dueDate: Date.now(),
      tags: new Set(),
      isFavorite: false,
      isArchive: false,
    }

    this._creatingTask = new TaskController(
      this._container,
      defaultTask,
      Mode.ADDING,
      this._onDataChange,
      this._onChangeView
    );
  }

  _renderTask(task) {
    const taskController = new TaskController(
      this._container,
      task,
      Mode.DEFAULT,
      this._onDataChange,
      this._onChangeView);

    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onDataChange(newData, oldData) {
    if (newData === null) {
      this._creatingTask = null;
      this._tasks = [...this._tasks.slice(0, index), ...this._tasks.slice(index + 1)];
    } else if (oldData === null) {
      this._creatingTask = null;
      this._tasks = [newData , ...this._tasks];
    } else {
      this._tasks[index] = newData;
    }
    this._container.innerHTML = ``;

    this._renderAllTasks();
  }

  _renderAllTasks() {
    this._tasks.forEach((tasks) => this._renderTask(tasks));
  }
}

export default TaskListController;
