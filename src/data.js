const getTask = () => ({
  description: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
  ][Math.floor(Math.random() * 3)],
  dueDate:
    Date.now() +
    1 +
    Math.floor(-7 + Math.random() * (7 + 1 - -7)) * 24 * 60 * 60 * 1000,
  repeatingDays: {
    mo: false,
    tu: false,
    we: Boolean(Math.round(Math.random())),
    th: false,
    fr: false,
    sa: false,
    su: false
  },
  tags: new Set(
    [
      `homework`,
      `theory`,
      `practice`,
      `intensive`,
      `keks`,
      `js`,
      `es6`,
      `html`,
      `academy`
    ]
      .sort(() => Math.random() - 0.5)
      .slice(9 - Math.floor(Math.random() * 4))
  ),
  color: [`black`, `yellow`, `blue`, `green`, `pink`][
    Math.floor(Math.random() * 5)
  ],
  isFavorite: Boolean(Math.round(Math.random())),
  isArchive: Boolean(Math.round(Math.random()))
});

export const TASK_COUNT = 10;
export const taskArray = new Array(TASK_COUNT).fill(``).map(getTask);

export const filtersArray = [
  {
    title: `All`,
    count: taskArray.length
  },
  {
    title: `Overdue`,
    count: taskArray.filter(task => task.dueDate < Date.now()).length
  },
  {
    title: `Today`,
    count: taskArray.filter(
      task => new Date(task.dueDate).getDay() === new Date().getDay()
    ).length
  },
  {
    title: `Favorites`,
    count: taskArray.filter(task => task.isFavorite).length
  },
  {
    title: `Repeating`,
    count: taskArray.filter(task => {
      for (const day in task.repeatingDays) {
        if (task.repeatingDays[day]) return true;
      }
    }).length
  },
  {
    title: `Tags`,
    count: taskArray.filter(task => task[`tags`].size > 0).length
  },
  {
    title: `Archive`,
    count: taskArray.filter(task => task.isArchive).length
  }
];
