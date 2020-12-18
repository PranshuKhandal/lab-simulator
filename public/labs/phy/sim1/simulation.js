const controls = {};

/*

interface controls {
	material: "copper" | "sodium" | "zinc" | "platinum",
	area: [ .1 : .5 : .1 ],                         // area of plate:           cm^2
	intensity: [ 0, 5, 10, 15, 20, 25, 30 ],        // intensity of light:      w/m^2
	voltage: [ -10 : 0 : .1 ],                      // voltage applied:         V
	wavelength: [ 100 : 750 : 1 ],                  // wavelength of light:     nm
	light: boolean
}

*/

/*

Source
62, 3

Ammeter
45, 59
48, 60

Voltmeter
29, 76
32, 77

*/

var waveColor = "black";
var cellPerSecond = 40;
const repelConst = 500000;
var repel = 5;
const baseEqualizer = .01;
var equalizer = .01;
const Source = [ 62, 3 ];
const Ammeter = [ 48, 60 ];
const Voltmeter = [ 32, 77 ];

const asBinary = {
	" ": "0000 0000 0000 0000 0000",
    "0": "0110 1001 1001 1001 0110",
    "1": "0100 1100 0100 0100 1110",
    "2": "0110 1001 0010 0100 1111",
    "3": "0110 1001 0010 1001 0110",
    "4": "0010 0110 1010 1111 0010",
    "5": "1111 1000 1110 0001 1110",
    "6": "0110 1000 1110 1001 0110",
    "7": "1110 0001 0001 0010 0010",
    "8": "0110 1001 0110 1001 0110",
    "9": "0110 1001 0111 0001 0010",
    "+": "0000 0100 1110 0100 0000",
    "-": "0000 0000 1110 0000 0000",
    "×": "0000 1010 0100 1010 0000",
    ".": "0000 0000 0000 0000 0100",
    "^": "0100 1010 0000 0000 0000",
    "S": "0111 1000 0110 0001 1110",
    "O": "0110 1001 1001 1001 0110",
    "U": "1001 1001 1001 1001 0110",
    "R": "1110 1001 1110 1010 1001",
    "C": "0110 1001 1000 1001 0110",
	"E": "1111 1000 1110 1000 1111",
	"V": "1001 1001 1111 0110 0110",
};

const asDecimal = {};

for ( const key in asBinary ) asDecimal[ key ] = asBinaryToDecimal( asBinary[ key ] );

function asBinaryToDecimal( number ) { /* string => number */
	return parseInt( number.split( "" ).reverse().join( "" ).split( /[\s\n]/g ).join( "" ), 2 );
}

function checkBit( number, bit ) { /* ( number, number ) => boolean */
	return !!( number & ( 1 << bit ) );
}

function cellToPixel( x, y ) {
	return [ 5 * x - 5, 5 * y - 5 ];
}

function fillCell( x, y ) {
	context.fillRect( ...cellToPixel( x, y ), 5, 5 );
}

function cellPostionFromBit( bit ) {
	let x, y;
	x = bit % 4;
	y = ( bit - x ) / 4;
	return [ x, y ];
}

function letterAt( char, x, y ) {
	if ( !asDecimal.hasOwnProperty( char ) ) {
		console.log( new Error( `Tried to write unrecognized char "${ char }"` ) );
		return;
	}
	for ( let i = 0; i < 20; ++ i ) {
		if ( !checkBit( asDecimal[ char ], i ) ) continue;
		const arr = cellPostionFromBit( i );
		fillCell( x + arr[ 0 ], y + arr[ 1 ] )
	}
}

function writeAt( string, x, y ) {
	string.split( "" ).forEach( ( char, i ) => letterAt( char, x + 5 * i, y ) );
}

function clearLine( color, x, y, l ) {
	context.save();
	context.clearRect( ...cellToPixel( x, y ), 25 * l, 25 );
	context.fillStyle = color;
	context.fillRect( ...cellToPixel( x, y ), 25 * l, 25 );
	context.restore();
}

function writeAmmeter( string ) {
	clearLine( "#9e9e9e", ...Ammeter, 8 );
	writeAt( string, ...Ammeter );
}

function writeVoltmeter( string ) {
	clearLine( "#9e9e9e", ...Voltmeter, 8 );
	writeAt( string, ...Voltmeter );
}

loadImage( "assets/static-bg.png" )
	.then( image => {
		context.drawImage( image, 0, 0 );
	} )
	.then( valueChange )
	.then( () => writeAt( "0", ...Ammeter ) )
	.then( () => writeVoltmeter( - voltage.value + "" ) )
	.catch( console.log );

const area = document.querySelector( "#range-area" );
const intensity = document.querySelector( "#range-intensity" );
const voltage = document.querySelector( "#range-voltage" );
const wavelength = document.querySelector( "#range-wavelength" );
const varea = document.querySelector( "#value-area" );
const vintensity = document.querySelector( "#value-intensity" );
const vvoltage = document.querySelector( "#value-voltage" );
const vwavelength = document.querySelector( "#value-wavelength" );

function valueChange() {
	varea.innerText = area.value + " cm^2";
	vintensity.innerText = intensity.value + " w/m^2";
	vvoltage.innerText = voltage.value + " V";
	const wl = + wavelength.value;
	vwavelength.innerText = wl + " nm" + ( wl <= 380 ? " Ah, ha! Ultraviolet light!" : "" );
	writeVoltmeter( - voltage.value + "" );
	waveColor = wavelengthToColor( wl );
	cellPerSecond = 80 * ( 850 - wl ) / ( 750 - 100 );
	equalizer = baseEqualizer * cellPerSecond * .1;
	repel = - voltage.value;
	clearAnimations();
}

function intensity3() {
	const value = intensity.value;
	return Math.floor( ( Number( value ) + 5 ) / 10 );
}

area.addEventListener( "change", valueChange );
area.addEventListener( "input", valueChange );
intensity.addEventListener( "change", valueChange );
intensity.addEventListener( "input", valueChange );
voltage.addEventListener( "change", valueChange );
voltage.addEventListener( "input", valueChange );
wavelength.addEventListener( "change", valueChange );
wavelength.addEventListener( "input", valueChange );

// takes wavelength in nm and returns an rgba value
function wavelengthToColor(wavelength) {
	var R, G, B, alpha, colorSpace, wl = wavelength, gamma = 1;

	if ( ltex( 380, wl, 440 ) ) {
		R = -1 * ( wl - 440 ) / ( 440 - 380 );
		G = 0;
		B = 1;
	} else if ( ltex( 440, wl, 490 ) ) {
		R = 0;
		G = ( wl - 440 ) / ( 490 - 440 );
		B = 1;  
	} else if ( ltex( 490, wl, 510 ) ) {
		R = 0;
		G = 1;
		B = -1 * ( wl - 510 ) / ( 510 - 490 );
	} else if ( ltex( 510, wl, 580 ) ) {
		R = ( wl - 510 ) / ( 580 - 510 );
		G = 1;
		B = 0;
	} else if ( ltex( 580, wl, 645 ) ) {
		R = 1;
		G = -1 * ( wl - 645 ) / ( 645 - 580 );
		B = 0.0;
	} else if ( ltex( 645, wl, 780 ) ) {
		R = 1;
		G = 0;
		B = 0;
	} else {
		R = 0;
		G = 0;
		B = 0;
	}

	// intensty is lower at the edges of the visible spectrum.
	if ( wl > 780 || wl < 380 ) {
		alpha = 0;
	} else if ( wl > 700 ) {
		alpha = ( 780 - wl ) / ( 780 - 700 );
	} else if ( wl < 420 ) {
		alpha = ( wl - 380 ) / ( 420 - 380 );
	} else {
		alpha = 1;
	}

	// to show ultraviolet in the specific program.
	// not right, i know
	if ( ltex( 100, wl, 380 ) ) {
		return "#EE82EE44";
	}

	return `rgba( ${ R * 255 }, ${ G * 255 }, ${ B * 255 }, ${ alpha } )`;
}

function ltex( a, b, c ) {
	return a <= b && b < c;
}