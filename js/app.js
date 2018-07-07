// Init http
const http = new Http();
// Init UI
const ui = new UI();
// Api key
const apiKey = "2e6dc33b3f184a6db04ec92b5013dad7";


// Init elements
const select = document.getElementById("country");
const selectSources = document.getElementById("newsSource");
const selectCategory = document.getElementById("category");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");

// All events
select.addEventListener("change", onChangeCountryAndCategory);
selectCategory.addEventListener("change", onChangeCountryAndCategory);
selectSources.addEventListener("change", onChangeSources);
searchBtn.addEventListener("click", onSearch);

// Event handlers
function onChangeCountryAndCategory(e) {
  // Показываю прелодер
  ui.showLoader();
  // Делаем запрос на получение новостей по выбранной стране
  http.get(`https://newsapi.org/v2/top-headlines?country=${select.value}&category=${selectCategory.value}&apiKey=${apiKey}`, function (err, res) {
      const response = JSON.parse(res);
      if (response.totalResults) {
          // Удаляем разметку из контейнера
          ui.clearContainer();
          // перебираем новости из поля articles в объекте response
          response.articles.forEach(news => ui.addNews(news));
      } else {
          ui.showInfo(`Новости по стране ${select.value} ${select.value !== '' ? ' и по данной категории' : ''}  не найдены`);
      }
  });
}

function onChangeSources(e) {
    // Показываю прелодер
    ui.showLoader();
    // Делаем запрос на получение новостей по выбранной стране
    http.get(`https://newsapi.org/v2/top-headlines?sources=${selectSources.value}&apiKey=${apiKey}`, function (err, res) {
        if (!err) {
            // Пробразовываем из JSON в обычный объект
            const response = JSON.parse(res);
            // Удаляем разметку из контейнера
            ui.clearContainer();
            // перебираем новости из поля articles в объекте response
            response.articles.forEach(news => ui.addNews(news));
        } else {
            // Выводим ошибку
            ui.showError(err);
        }
    });
}


function onSearch(e) {
  // Делаем запрос на получение новостей по тому что введено в инпут
  http.get(`https://newsapi.org/v2/everything?q=${searchInput.value}&apiKey=${apiKey}`, function (err, res) {
    if (err) return ui.showError(err);

    const response = JSON.parse(res);
      console.log(res);

    if (response.totalResults) {
      // Удаляем разметку из контейнера
      ui.clearContainer();
      // перебираем новости из поля articles в объекте response
      response.articles.forEach(news => ui.addNews(news));
    } else {
      ui.showInfo("По вашему запросу новостей не найдено!");
    }
  });
}

// Отдельный запрос на получение ресурсов
// генерируем селект с ресурсами
// <option value="abc-news">Abc News</option>
// при выборе ресурса подгружаете новости с этим ресурсом
// возможность выбора новостей по категории и стране
// Если новостей нет по выбранной категоррии нужно вывести что "Новости по категории такой то по стране такойто не найдены"