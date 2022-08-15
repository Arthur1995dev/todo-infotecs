'use strict'
//--------------App--------------
const app = document.getElementById('app');

//Функция конструктор задач
function Task(name, status = "waiting", description = "") {
    this.name = name;
    this.status = status;
    this.description = description;

    Task.prototype.toHTML = function () {
        return `
            <li class='task'>
                <p class="task_title">${this.name}</p>
                <button id="complited"><i class="fa-solid fa-check"></i></button>
                <button id="play"><i class="fa-solid fa-play"></i></button>
                <button id="remove"><i class="fa-solid fa-xmark"></i></button>
            </li>
        `
    }
}

//Функции создания компонентов taskList(список задач) и taskEdit(редактирвоание задач)
function taskListCreate() {
    return `
        <div class="task_list">
            <ul class="tasks"></ul>
            <div class="resize"></div>
            <button class="reset button">Сбросить фильтр</button>
        </div>
    `
}
function taskEditCreate() {
    return `
        <div class="task_edit">
            <form class="form_edit" method="post" action="#">
                <h2>Редактировать задачу</h2>
                <div class="title_edit_container">
                    <label for="input_title">Изменить заголовок</label>
                    <input id="input_title" class="input_title" type="text" placeholder="Заголовок...">
                    <button class="title_submit button">Изменить заголовок</button>
                </div>
                <div class="description_edit_container">
                    <label for="description_title">Изменить описание</label>
                    <textarea 
                    name="description_task"
                    id="description_title"
                    class="description_task"
                    placeholder="Введите описание заголовка"></textarea>
                    <button class="description_submit button">Изменить описание</button>
                </div>
                <div class="form-menu_container">
                    <ul class="task_menu">
                        <li class="menu_item input_add"><input type="text" id="input_add" placeholder="Введите имя задачи"></li>
                        <li class="menu_item"><button id="add" class="button">Добавить задачу</button></li>
                        <li class="menu_item"><button id="search" class="button">Поиск</button></li>
                    </ul>
                </div>
            </form>
        </div>
    `
}

//Добавляем компоненты на страницу
app.insertAdjacentHTML('beforeend', taskListCreate());
app.insertAdjacentHTML('beforeend', taskEditCreate());

//--------------Находим элементы интерфейса--------------

//Контейнер для задач(сюда будем добавлять задачи)
const tasks = document.querySelector('.tasks');

//Меню добавления и поиска задач
const addTask = document.getElementById('add');//Кнопка добавления задач
const searchTask = document.getElementById('search');//Кнопка поиска
const resetSearch = document.querySelector('.reset');//Кнопка сброса фильтра поиска
const addInput = document.getElementById('input_add');//Поле ввода

//Меню изменения заголовка
const titleInput = document.getElementById('input_title');//Поле ввода
const titleSubmit = document.querySelector('.title_submit');//Кнопка изменения заголовка

//Меню добавления/изменения описания задачи
const descriptionInput = document.querySelector('.description_task');//Textarea, для ввода описания
const descriptionSubmit = document.querySelector('.description_submit');//Кнопка изменения/добавления описания


//Presenter хранит массив задач, функции работы с задачами
const presenter = {
    tasksArr: [],//Массив задач
    addToModel(task) {
        this.tasksArr.push(task)//Добавляем в массив
    },
    addToUI(task) {
        tasks.insertAdjacentHTML('beforeend', task.toHTML())//Добавляем в UI
    },
    statusToggle(target) {
        //Находим индекс задачи, через функцию
        let indexTask = findIndex(target);
        //Обрабатываем второй клик на кнопку выполнена и в процессе
        //Если при клике на кнопку у неё уже есть статус, тогда возвращаем всё обратно
        if (this.tasksArr[indexTask].status === target.id) {
            tasks.children[indexTask].classList.remove(target.id);
            this.tasksArr[indexTask].status = 'waiting';
        } else {//Если нету статуса, добавляем статус и класс
            tasks.children[indexTask].removeAttribute('class');
            tasks.children[indexTask].classList.add('task', target.id);
            this.tasksArr[indexTask].status = target.id;
        }
    },//Меняе статус
    removeTask(target) {
        let taskIndex = findIndex(target);//Находим index задачи и записывыем в переменную
        this.tasksArr.splice(taskIndex, 1);//Удаляем из массива задач
        tasks.children[taskIndex].remove();//Удаляем из UI
    }//Удаляем задачу
}

//Функция нахождения элемента по клику на кнопки(удаление, выполнена, выполняется)
function findIndex (target) {
    //Находим родитель, саму задачу
    const targetTask = target.closest('.task');
    //Находим заголовок задачи
    const taskContent = targetTask.querySelector('.task_title').textContent;
    //По заголовоку находим индекс задачи в массиве и возвращаем его
    return presenter.tasksArr.findIndex(item => item.name === taskContent);
}

//Подгружаем из localStorage задачи
if(localStorage.getItem('tasks')) {
    //Если в lS есть данные, парсим JSON, проходим по массиву
    //и создаём задачи
    JSON.parse(localStorage.getItem('tasks')).forEach(function(item) {
        presenter.addToModel(new Task(item.name, item.status, item.description));
        presenter.addToUI(new Task(item.name, item.status, item.description));
    })
    //Добавляем задачам соответствующий статус и классы
    for (let i = 0; i < presenter.tasksArr.length; i++) {
        if(presenter.tasksArr[i].status === 'complited') {
            tasks.children[i].classList.add('complited');
        } else if (presenter.tasksArr[i].status === 'play') {
            tasks.children[i].classList.add('play');
        }
    }
}

//Добавляем задачу
addTask.addEventListener('click', function (e) {
    e.preventDefault();
    if (!addInput.value.length) return;

    //Создаем задачу и добавляем в массив
    presenter.addToModel(new Task(addInput.value));

    //Добавляем задачу в UI
    presenter.addToUI(presenter.tasksArr[presenter.tasksArr.length - 1]);

    //Очищаем инпут и возвращаем фокус
    addInput.value = "";
    addInput.focus();

    //Сохраняем в localStorage
    localStorage.setItem('tasks', JSON.stringify(presenter.tasksArr));
    console.log(presenter.tasksArr);
})

//Обрабатываем клики на задачу!
tasks.addEventListener('click', function (e) {
    //Проверяем клик в пустое пространство, клик обязательно по задаче(класс task), либо по кнопке(id)
    if (!e.target.id && !e.target.classList.contains('task')) return;
    //Проверяем по какой кнопке был клик(по id кнопки)
    //Меняем статус в зависимости от типа кнопки
    if (e.target.id === 'complited' || e.target.id === 'play') {
        presenter.statusToggle(e.target);
        console.log(presenter.tasksArr);
    } else if (e.target.id === 'remove') { //Если клик по кнопке удалить
        presenter.removeTask(e.target); //Удаляем задачу
        console.log(presenter.tasksArr);
        localStorage.setItem('tasks', JSON.stringify(presenter.tasksArr));//Сохраняем в ls
        return;
    }
    for (let i = 0; i < tasks.children.length; i++) {
        tasks.children[i].classList.remove('selected_task');
    }
    //Добавляем класс, так как был клик по задаче, перед этим удалив класс у других задач
    tasks.children[findIndex(e.target)].classList.add('selected_task');
    //Устанавливаем в inputы данные задачи для редактирования
    titleInput.value = presenter.tasksArr[findIndex(e.target)].name;//Устанавливаем заголовок
    descriptionInput.value = presenter.tasksArr[findIndex(e.target)].description;//Устанавливаем описание
    localStorage.setItem('tasks', JSON.stringify(presenter.tasksArr));//Сохраняем в lS
})

//Добавляем обработчик для изменения заголовка выбранной задачи
titleSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    if (!titleInput.value.length) return;
    //Находим задачу в массиве и в UI по заголовку
    const selectedTask = document.querySelector('.selected_task');
    const selectedTaskTitle = selectedTask.querySelector('.task_title');
    const indexTask = presenter.tasksArr.findIndex(item => item.name === selectedTaskTitle.textContent);
    //Меняем заголовок в объекте, в массиве
    presenter.tasksArr[indexTask].name = titleInput.value;
    //Меняем заголовок в UI
    selectedTaskTitle.textContent = titleInput.value;
    titleInput.value = "";
    titleInput.focus();
    //Сохраняем в lS
    localStorage.setItem('tasks', JSON.stringify(presenter.tasksArr));
    console.log(presenter.tasksArr);
})

//Добавляем обработчик для добавления/изменения описания задачи
descriptionSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    const selectedTask = document.querySelector('.selected_task');
    const selectedTaskTitle = selectedTask.querySelector('.task_title');
    const indexTask = presenter.tasksArr.findIndex(item => item.name === selectedTaskTitle.textContent);
    presenter.tasksArr[indexTask].description = descriptionInput.value;
    descriptionInput.focus();
    localStorage.setItem('tasks', JSON.stringify(presenter.tasksArr));
})

//Добавляем обработчик на поиск задач по имени, остальные задачи скрываем display:none
searchTask.addEventListener('click', function (e) {
    e.preventDefault();
    for (let i = 0; i < presenter.tasksArr.length; i++) {
        if (!presenter.tasksArr[i].name.includes(addInput.value)) {
            tasks.children[i].classList.add('hidden');
        }
    }
})

//Добавляем обработчик для очистки фильтра, убираем класс hidden с display:none
resetSearch.addEventListener('click', function () {
    for (let i = 0; i < tasks.children.length; i++) {
        tasks.children[i].classList.remove('hidden');
    }
})

