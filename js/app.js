'use strict'

let imgCont = document.getElementById('imgCont');
let leftImg = document.getElementById('leftImg');
let middleImg = document.getElementById('middleImg');
let rightImg = document.getElementById('rightImg');
let listCont = document.getElementById('listCont');
let count = 0;
let isButtonClicked = false;
let isImgClicked = false;
let entry = 25;
let imgArray = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];

let leftIndex;
let middleIndex;
let rightIndex;

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
}

function render () {
    leftIndex = randomNumber(0, imgArray.length -1 );

    do {
        middleIndex = randomNumber(0, imgArray.length -1 );
        rightIndex = randomNumber(0, imgArray.length -1 );
    } while (leftIndex === middleIndex || rightIndex === leftIndex || rightIndex === middleIndex)
    leftImg.src = Img.arr[leftIndex].path;
    middleImg.src = Img.arr[middleIndex].path;
    rightImg.src = Img.arr[rightIndex].path;
    Img.arr[leftIndex].view++;
    Img.arr[middleIndex].view++;
    Img.arr[rightIndex].view++;

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
        render()
        if (isButtonClicked){
        result()
        }
    }
    else if (count >= entry) {
        imgCont.removeEventListener('click', pickAndChoose);
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

imgCont.addEventListener('click',pickAndChoose);
render();

function randomNumber( min, max ) {
    min = Math.ceil( min );
    max = Math.floor( max );
    return Math.floor( Math.random() * ( max - min + 1 ) + min );
  }

function trail () {
    if (isImgClicked) {
        alert('You have started the game already refresh the page and choose number before starting the game')
    }
    else {
    entry = parseInt(prompt('Enter number of trails you want to play'));
    }
}
