/**
 * Рендерит верстку в конец контейнера
 *
 * @param {Element} containerElem Обертка, куда вставляется верстка
 * @param {String} componentLayout Верстка
 * @param {String} position Место вставки
 */
export const renderComponent = (
  containerElem,
  componentLayout,
  position = `beforeend`
) => {
  containerElem.insertAdjacentHTML(position, componentLayout);
};
