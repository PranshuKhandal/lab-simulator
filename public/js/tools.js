var delay = ms => new Promise( res => window.setTimeout( res, ms ) );

function range( a, b, c ) {
	const result = [];
	if ( typeof b === "undefined" ) [ a, b ] = [ 0, a ];
	if ( typeof c === "undefined" ) c = 1;
	if ( c < 0 && a <= b ) return result;
	if ( c > 0 && a >= b ) return result;
	for ( let i = 0; c > 0 ? i < b : i > b; i += c ) result.push( i );
	return result;
}