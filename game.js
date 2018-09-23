var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');
var currentSpeed = document.getElementById('currentSpeed');
var currentPosition = document.getElementById('currentPosition');
var moveButton = document.getElementById("moveButton");
var reverseButton = document.getElementById("reverseButton");
var numOfCells;

var marsRover={
    x: 50,
    y: 50,
    width:0,
    height:0,
    speed: 1,
    position:0,
    i:0,
    scaleH:1,
    numOfCells:0,
    move: moveMarsRover,
    reverse: flipMarsRover,
}
loadResources();

function loadResources() {
    let temp = new Image();
    let src = "img/mars-rover.png";
    temp.src = src;
    marsRover["img"] = temp;
    marsRover.img.onload = function() {
        marsRover.height = marsRover.img.height;
        marsRover.width = marsRover.img.width;
        draw();
    }
}
function draw() {
    numOfCells = Math.trunc(cvs.width / marsRover.width) - 1;
    ctx.drawImage(marsRover.img, marsRover.x, marsRover.y);
    ctx.lineWidth = 1;
    ctx.moveTo(50, marsRover.height + 52);
    ctx.lineTo(50 + marsRover.width * numOfCells, marsRover.height + 52);
    ctx.stroke();
    drawFlatness();
    drawFigure(marsRover.i);
}

function drawFigure(firstNumber) {
    let k = firstNumber;
    for(let j = 0; j < numOfCells; j++){
        ctx.font = 'bold 15px sans-serif';
        ctx.textBaseline = "top";
        ctx.clearRect(50 + marsRover.width / 2 + marsRover.width * j, marsRover.height + 60, marsRover.width / 2 - 2, marsRover.width / 2 - 2);
        ctx.fillText(k.toString(), 50 + marsRover.width / 2+marsRover.width * j, marsRover.height + 60);
        k+=1;
    }
}

function drawFlatness() {
    for(let j = 0; j < numOfCells + 1; j++){
        ctx.moveTo(50 + marsRover.width * j, marsRover.height + 51);
        ctx.lineTo(50 + marsRover.width * j, marsRover.height + 70);
        ctx.stroke();
    }
}

moveButton.addEventListener("mousedown", function() {
    marsRover.move();
});
reverseButton.addEventListener("mousedown", function() {
    marsRover.reverse();
});

function flipMarsRover() {
    let width = this.width;
    let height = this.height;
    this.speed = 1;
    this.scaleH = -1 * this.scaleH;
    ctx.save();
    ctx.scale(this.scaleH, 1);
    this.x = -1 * (this.x + width);
    ctx.clearRect(this.x, this.y, width, height);
    ctx.drawImage(this.img, this.x, this.y, width, height);
    ctx.restore();
    currentSpeed.innerText = (this.speed * this.scaleH).toString();
    currentPosition.innerText = this.position.toString();
}

function moveMarsRover() {
    let width = this.width;
    let height = this.height;
    this.position += this.speed * this.scaleH;
    if (this.scaleH === (-1)) {
        if (this.i < this.position) {
            this.x += width * this.speed;
            ctx.clearRect(-this.x + (this.speed-1) * width, this.y, width, height);
        } else {
            let temp = this.i;
            this.i = this.position;
            let newX = -50 - width;
            if (this.x === newX){
                ctx.clearRect(this.x, this.y, width, height);
            } else {
                this.x = newX;
                ctx.clearRect(-this.x + (this.speed + this.i - temp - 1) * width, this.y, width, height);

            }
        }
    } else {
        if (Math.abs(this.i - this.position) <= 7) {
            this.x += width * this.speed;
            ctx.clearRect(this.x - this.speed * width, this.y, width, height);
        } else {
            let k = numOfCells-1;
            this.i = this.position - k;
            let newX = 50 + k * width;
            ctx.clearRect(this.x, this.y, width, height);
            if (this.x !== newX){
                this.x = newX;
            }
        }
    }

    ctx.save();
    if (this.x < 0) {
        ctx.scale(this.scaleH, 1);
    }
    this.speed *= 2;
    ctx.drawImage(this.img, this.x, this.y, width, height);
    ctx.restore();
    drawFigure(this.i);
    currentSpeed.innerText = (this.speed * this.scaleH).toString();
    currentPosition.innerText = this.position.toString();
}
