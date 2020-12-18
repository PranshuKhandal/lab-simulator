const canvas2 = document.querySelector( "#animations" );
const context2 = canvas2.getContext( "2d" );
context2.fillStyle = "#795548";

/*

27, 28
74, 40

28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40

[ 28, 30, 32, 34, 36, 38, 40 ]
[ 29, 31, 33, 35, 37, 39 ]

*/

const electronLength = 2;
const seperations = 2;
const freq = 1000 / cellPerSecond;

const yArray = [ 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40 ];
const structure = [ [], [ 2 ], [ 1, 3 ], [ 0, 2, 4 ] ];

const start = [
	[ 46, 9, ],
	[ 47, 10, ],
	[ 48, 11, ],
	[ 49, 12, ],
	[ 50, 13, ]
];

const end = [
	[ 27, 28, ],
	[ 27, 30, ],
	[ 27, 32, ],
	[ 27, 34, ],
	[ 27, 36, ]
];
function lightColor() {
	return waveColor;
}

/*

type time = number;
interface animation {
	start: time,
	y: number,
	cellPerSecond: number
}

*/

const animations = [];
let toDelete = [];

function clearAnimations() {
	animations.splice( 0, animations.length );
}

function linear( a, b, frac ) {
	return a + ( b - a ) * frac;
}

function getSecond( time ) {
	return 1000 * Math.floor( time / 1000 );
}

function fillCell2( x, y ) {
	context2.fillRect( ...cellToPixel( x, y ), 5, 5 );
}

function addAnimations( now ) {
	yArray.forEach( y => Math.random() < equalizer * intensity3() / 3 && animations.push( { y, start: now, cellPerSecond: linear( 0, cellPerSecond, Math.random() / 2 + .5 ) } ) );
};

function workOutAnimation( animation, now, i ) {
	let x = 24 + ( ( now - animation.start ) * animation.cellPerSecond / 1000 - ( ( now - animation.start ) ** 2 ) * repel / repelConst ), y = animation.y + ( ( animation.y - 34.5 ) * ( ( now - animation.start ) ** 2 ) * repel / repelConst );
	if ( ( 27 <= y && y <= 41 ) && ( ( x < 24 ) || (  77 - electronLength + 1 < x ) ) ) {
		toDelete.push( i );
		return;
	} else if ( x < 20 || 81 < x || y < 25 || 43 < y ) {
		toDelete.push( i );
		return;
	}
	fillCell2( x, y );
	fillCell2( x + 1, y );
}

function drawLine( start, end ) {
	const length = start[ 0 ] - end[ 0 ];
	for ( let i = 0; i < length; ++ i ) {
		fillCell2( start[ 0 ] - i, start[ 1 ] + i );
	}
}

function drawLightRays() {
	context2.save();
	context2.fillStyle = lightColor();
	structure[ intensity3() ].forEach( index => drawLine( start[ index ], end[ index ] ) );
	context2.restore();
}

function frame() {
	const now = Date.now();
	addAnimations( now );
	context2.clearRect( 0, 0, 500, 500 );
	animations.forEach( ( animation, i ) => workOutAnimation( animation, now, i ) );
	toDelete.sort( ( a, b ) => b - a ).forEach( i => animations.splice( i, 1 ) );
	toDelete = [];
	drawLightRays();
	window.requestAnimationFrame( frame );
}

frame();