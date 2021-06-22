'use strict'

let imgCont = document.getElementById('imgCont');
let leftImg = document.getElementById('leftImg');
let middleImg = document.getElementById('middleImg');
let rightImg = document.getElementById('rightImg');
let listCont = document.getElementById('listCont');
let graph = document.getElementById('graph');
let chartCont = document.getElementById('chartCont');
let chart;
let count;
let isButtonClicked = false;
let isImgClicked = false;
let entry;
let imgArray = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
let leftIndex;
let middleIndex;
let rightIndex;
let currentElement = [];
let previousElement = [];
let names = []
let views = []
let fav = []
function Img (name,path) {
    this.name = name
    this.path = `./img/${path}`
    this.view = 0;
    this.fav = 0;
    Img.arr.push(this);
}

Img.arr = [];

for (let i=0; i<imgArray.length; i++) {
    new Img (imgArray[i].split('.')[0], imgArray[i]);
    names.push(imgArray[i].split('.')[0]);
}

function render () {


    do {
        leftIndex = randomNumber(0, imgArray.length -1 );
        middleIndex = randomNumber(0, imgArray.length -1 );
        rightIndex = randomNumber(0, imgArray.length -1 );
        currentElement = [leftIndex, middleIndex, rightIndex];
    } while (leftIndex === middleIndex || rightIndex === leftIndex || rightIndex === middleIndex || previousElement.some(i => currentElement.includes(i)));
    previousElement = [leftIndex,middleIndex,rightIndex];
    leftImg.src = Img.arr[leftIndex].path;
    middleImg.src = Img.arr[middleIndex].path;
    rightImg.src = Img.arr[rightIndex].path;
    Img.arr[leftIndex].view++;
    Img.arr[middleIndex].view++;
    Img.arr[rightIndex].view++;
    localStorage.setItem('track', [leftIndex,middleIndex,rightIndex,count,entry, isImgClicked, isButtonClicked]);
    localStorage.setItem('gameState', JSON.stringify(Img.arr));

}

function pickAndChoose (e) {
    if ((e.target.id === 'leftImg' || e.target.id === 'middleImg' || e.target.id === 'rightImg') && count < entry) {
        isImgClicked = true;
        if (e.target.id === 'leftImg') {
            Img.arr[leftIndex].fav++;
        }
        else if (e.target.id === 'middleImg') {
            Img.arr[middleIndex].fav++;
        }
        else if (e.target.id === 'rightImg') {
            Img.arr[rightIndex].fav++;
        }
        count++;
        if (isButtonClicked){
        result()
        }
        render()
    }
    if (count >= entry) {
        imgCont.removeEventListener('click', pickAndChoose);
        Img.arr[leftIndex].view--;
        Img.arr[middleIndex].view--;
        Img.arr[rightIndex].view--;
        draw();
    }
}

function result () {
    isButtonClicked = true;
    listCont.innerHTML = ''
    let list = document.createElement('ul');
    listCont.appendChild(list);
    let listItem;
    for (let i = 0; i<Img.arr.length; i++) {
        listItem = document.createElement('li');
        listItem.innerHTML = `${Img.arr[i].name} had ${Img.arr[i].fav} votes, and was seen ${Img.arr[i].view} times.`
        list.appendChild(listItem);
    }
}

function randomNumber( min, max ) {
    min = Math.ceil( min );
    max = Math.floor( max );
    return Math.floor( Math.random() * ( max - min + 1 ) + min );
  }

function trail () {
    if (isImgClicked) {
        alert('You have started the game already. \n Restart The Game and choose number before starting the game')
    }
    else {
        do {
    entry = prompt('Enter number of trails you want to play');
        } while (isNaN(entry))
    }
}

function draw () {
    for (let i = 0; i<Img.arr.length; i++) {
        fav.push(Img.arr[i].fav);
        views.push(Img.arr[i].view);
    }

    chart =   new Chart("graph", {
        type: "bar",
        data: {
            datasets: [{
                label: 'Views',
                data: views,
                order: 1,
                backgroundColor: 'red'
            }, {
                label: 'Click',
                data: fav,
                type: 'bar',
                backgroundColor: 'green',
                order: 2
            }],
            labels: names
        },
          options: {
            responsive: true,
            plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Views VS Clicks'
                }
          }
        }
        });
}

function startGame () {
    if (localStorage.getItem('track') === null) {
        count = 0;
        entry = 25;
        render();

    }
    else {
    let track = localStorage.getItem('track').split(',');
    let index = [parseInt(track[0]),parseInt(track[1]),parseInt(track[2]),parseInt(track[3]),parseInt(track[4]), (track[5]), (track[6])];
    let gameState = JSON.parse(localStorage.getItem('gameState'));
    for (let i=0 ; i<gameState.length ; i++) {
        Img.arr[i].view = gameState[i].view;
        Img.arr[i].fav = gameState[i].fav;
        fav.push(Img.arr[i].fav);
        views.push(Img.arr[i].view);
    }
    leftIndex = index[0];
    middleIndex = index[1];
    rightIndex = index[2];
    count = index[3];
    entry = index[4];
    isImgClicked=index[5];
    leftImg.src = Img.arr[index[0]].path;
    middleImg.src = Img.arr[index[1]].path;
    rightImg.src = Img.arr[index[2]].path;
    if (count >= entry) {
        chart =   new Chart('graph');
        chart.destroy();
        draw();
    }
    }
}

function reset () {
    localStorage.clear();
    isImgClicked = false;
    listCont.innerHTML = '';
    isButtonClicked = false;
    for (let i=0 ; i<Img.arr.length ; i++) {
        Img.arr[i].view = 0;
        Img.arr[i].fav = 0;
    }
    chart.destroy();
    startGame();
    imgCont.addEventListener('click',pickAndChoose);

}

chart =   new Chart('graph');
chart.destroy();
startGame();
imgCont.addEventListener('click',pickAndChoose);