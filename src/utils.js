const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
}

export const render = (container, element, position = Position.BEFOREEND) => {
  switch (position) {
    case Position.AFTERBEGIN: {
      container.prepend(element);
      break;
    }
    case Position.BEFOREEND: {
      container.append(element);
      break;
    }
  }
}

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
}

export const createElement = (template) => {
  const newElem = document.createElement(`div`);
  newElem.innerHTML = template;
  return newElem.firstElementChild;
}

export const getRepeatingDays = (formData) => {
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
