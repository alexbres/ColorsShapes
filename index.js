const Direction = {
    Up: 0,
    Down: 1,
    Left: 2,
	Right: 3,
}

const delta = 20;
const size = 20;

var direction = Direction.Right;	
var x = size; //head current position
var y = size; //head current position
var head;
var canvas;
var ctx;
var intervalID;
var track = new Array();
var tail = new Array();
var rabbit;
	
document.addEventListener('DOMContentLoaded', function() {
	run();
});

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
	switch (e.keyCode){
		case 39: 
			direction = Direction.Right;
			break;
		case 37: 
			direction = Direction.Left;
			break;
		case 40: 
			direction = Direction.Down;
			break;
		case 38: 
			direction = Direction.Up;
			break;
	}
}


//Shape base calss
function Shape(context, color, x, y) {
	this.context = context;
	this.color = color;
	this.x = x;
	this.y = y;
}

Shape.prototype.move = function(x, y) {
	this.x = x;
	this.y = y;
	this.draw();
}

Shape.prototype.draw = function() {
}

Shape.prototype.toString = function() {
	return 'object Shape';
}

Shape.prototype.super = Shape;

//Reactangle 
function Reactangle(context, color, x, y, width, height) {		
	this.super(context, color, x, y);
	
	this.height = height;
	this.width = width;
}

Reactangle.prototype = new Shape();
Reactangle.prototype.constructor = Reactangle;

Reactangle.prototype.draw = function() {
	this.context.fillStyle = this.color;
	this.context.fillRect(this.x, this.y, this.height, this.width);
}

// Circle
function Circle(context, color, x, y, radius) {
	this.super(context, color, x, y);
	this.radius = radius;
}

Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;

Circle.prototype.draw = function() {
	this.context.fillStyle = this.color;
	this.context.beginPath();
	this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
	this.context.fill();
	this.context.closePath();
}

function run() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	intervalID = setInterval(draw, 300);
	
	head = new Reactangle(ctx, 'blue', x, y, size, size);

	tail.push(new Reactangle(ctx, 'blue', x - size, y, size, size));
	tail.push(new Reactangle(ctx, 'blue', x - 2*size, y, size, size));

	setNewRabbitPos();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	calculateNewPosition();
	
	if (wallCollision()) {
		gameOver();
	}

	head.move(x, y);
	for(var i = 0; i < tail.length; i++) {
		var pos = track[track.length - (1 + i)];
		if (typeof pos != 'undefined') {
			tail[i].move(pos.x, pos.y);		
		}
	}
	drawRabbit();
	track.push({x,y});
}

function drawRabbit() {
	rabbit.draw();
}

function setNewRabbitPos() {
	var rabbitX = (canvas.width / size / 2) * size;
	var rabbitY = (canvas.height / size / 2) * size;
	rabbit = new Reactangle(ctx, 'red', rabbitX, rabbitY, size, size);
}

function wallCollision() {
	return x + head.width > canvas.width
		|| x < 0
		|| y < 0
		|| y + head.height > canvas.height;
}
function gameOver() {
	clearInterval(intervalID);
	ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
}

function calculateNewPosition() {
	switch (direction) {
		case Direction.Right:
			x += delta;
			break;
		case Direction.Left:
			x -= delta;
			break;
		case Direction.Up:
			y -= delta;
			break;
		case Direction.Down:
			y += delta;
			break;
	}
}