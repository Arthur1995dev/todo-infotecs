const resize = document.querySelector('.resize');//Блок по клику на который будем растягивать контейнер
const resizeBlock = document.querySelector('.task_list');//Контейнер который будем растягивать
let resizeBlockWidthMin = resizeBlock.clientWidth;//Ширина блока, который будем растягивать
                                                    //установим первоначальную ширину как минимальную

resize.onmousedown = newWidth;
document.onmouseup = clearNewWidth;
//Функция измеряющая новую ширину блока
function newWidth() {
    //Ставим обработчик на весь документ, что бы при движении курсора, высчитывалась новая ширина блока
    document.onmousemove = function (ev) {
        let deltaWidth = ev.pageX - resizeBlockWidthMin;//Разница между границей блока растяжения и координатой мыши
        resizeBlock.style.width = resizeBlockWidthMin + deltaWidth + `px`;//Устанавливаем новую ширину блока
        //Установим минимальную ширину растяжения/сжатия
        while(parseInt(resizeBlock.style.width, 10) < resizeBlockWidthMin) {
            resizeBlock.style.width = resizeBlockWidthMin + `px`;
        }
    }
}
//Функция отменяющая обработчик движения мыши
function clearNewWidth() {
    document.onmousemove = null;
}