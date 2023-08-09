const listBook = document.querySelector('.js-list');
const listCategory = document.querySelector('.js-container-category');
const newTitle = document.querySelector('.title');
listBook.addEventListener('click', handlerClickBook);
// -----------------запит на всі категоріі-----
function serviceBook() {
  return fetch('https://books-backend.p.goit.global/books/top-books').then(
    (resp) => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    }
  );
}
// -------------------category list request-----

function serviceCategory() {
  return fetch('https://books-backend.p.goit.global/books/category-list').then(
    (resp) => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    }
  );
}
// -----------------------request for the selected category -----
function serviceThisCategory(res) {
  return fetch(
    `https://books-backend.p.goit.global/books/category?category=${res}`
  ).then((resp) => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}
// ----------------------- request for the selected book-------
function servicesSelectedBook(idBook) {
  return fetch(`https://books-backend.p.goit.global/books/${idBook}`).then(
    (resp) => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    }
  );
}
serviceBook()
  .then((data) => {
    listBook.insertAdjacentHTML('beforeend', createMarcup(data));
    const itemCategory = document.querySelectorAll('.js-add-list');
    for (let i = 0; i < data.length; i += 1) {
      itemCategory[i].insertAdjacentHTML(
        'beforeend',
        createBooks(data[i].books)
      );
    }
  })
  .catch((err) => console.log(err));

serviceCategory()
  .then((data) => {
    listCategory.insertAdjacentHTML('beforeend', createCategory(data));
    listCategory.addEventListener('click', onClick);
  })
  .catch((err) => console.log(err));

function onClick(evt) {
  let result = evt.target.textContent;
  result = result.trimStart();
  console.log(result);
  serviceThisCategory(result)
    .then((data) => {
      listBook.innerHTML = createBooks(data);
      const row = data[0].list_name;
      const textElement = row.split(' ');
      const titleCategory = textElement
        .splice(0, textElement.length - 1)
        .join(' ');
      const spanCategory = textElement[textElement.length - 1];
      newTitle.innerHTML = `${titleCategory} <span class="books">${spanCategory}</span>`;
    })
    .catch((err) => console.log(err));
}

function createMarcup(arr) {
  return arr
    .map(
      ({ books: [{ list_name }] }) => `
  <li class="js-item item-list">
        <h3 class="category-name">${list_name}</h3>
        <ul class="category-menu js-add-list"></ul>
        <button class="see-more-btn" type="button">See more</button>
      </li>`
    )
    .join('');
}

function createCategory(arr) {
  return arr
    .map(
      ({ list_name }) => `<li class="js-item-category">
  ${list_name}</li>`
    )
    .join('');
}

function handlerClickBook(evt) {
  const bookItem = evt.target.closest('.js-book-item');
  if (bookItem) {
    const { id } = bookItem.dataset;
    servicesSelectedBook(id).then(({ _id, book_image, author, title }) => {
      const instance = basicLightbox.create(`<div class="modal">
               <img src="${book_image}" alt="${_id}"width="335" height="485">
                <h3>${title}</h3>
                <p>${author}</p>
              </div>`);
      instance.show();
    });
  }
}

function createBooks(arr) {
  return arr
    .map(
      ({ _id, book_image, author, title }) =>
        `<li class="item-image js-book-item" data-id="${_id}" >
        <img class="book-image"  src="${book_image}" width="335" height="485" alt="${title}">
    <h3 class="book-title">${title}</h3>
    <p class="author-name">${author}</p>
      </li>`
    )
    .join('');
}

function createNewBooks(arr) {
  return arr
    .map(
      ({ books: [{ book_image, author, title }] }) => `
  <li>
        <img src="${book_image}" alt="${title}">
        <h3>${title}</h3>
        <p>${author}</p>
      </li>`
    )
    .join('');
}
// --------------scrolling--
const btnUp = {
  el: document.querySelector('.btn-up'),
  show() {
    // удалим у кнопки класс btn-up_hide
    this.el.classList.remove('btn-up_hide');
  },
  hide() {
    // добавим к кнопке класс btn-up_hide
    this.el.classList.add('btn-up_hide');
  },
  addEventListener() {
    // при прокрутке содержимого страницы
    window.addEventListener('scroll', () => {
      // определяем величину прокрутки
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
      scrollY > 400 ? this.show() : this.hide();
    });
    // при нажатии на кнопку .btn-up
    document.querySelector('.btn-up').onclick = () => {
      // переместим в начало страницы
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    };
  },
};

btnUp.addEventListener();
