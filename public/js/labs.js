var JSONExport;
var HOME = "";
const validMD = [ "theory", "reference" ];
let hasSimulation = false;
const converter = new Markdown.Converter();
const links = Array.from( document.querySelectorAll( ".links-container" ) );
const linkStyles = document.querySelector( "#link-styles" );
const root = document.querySelector( "#markdown" );

validMD.forEach( item => {
	const a = document.createElement( "a" );
	a.href = "#" + item;
	a.innerText = item;
	const s = document.createElement( "span" );
	s.classList.add( "link-" + item );
	s.appendChild( a );
	links.forEach( elm => elm.appendChild( s.cloneNode( true ) ) );
} );

function add1head( md ) {
	return md.replaceAll( /^#/gm, "##" );
}

window.addEventListener( "load", function() {
	const simName = window.location.search.split( "?" )[ 1 ];
	const name = simName.substring( 0, 3 );
	const id = Number( simName.substring( 3 ) );
	HOME = `${ name }/sim${ id }/`;
	Promise.resolve()
		.then( () => root.classList.add( "loading" ) )
		.then( () => root.innerHTML = "" )
		.then( () => fetch( HOME + "export.json", init ) )
		.then( response => response.json() )
		.then( json => ( JSONExport = json ) )
		.then( () => hasSimulation = JSONExport.simulation !== null )
		.then( () => {
			if ( !hasSimulation ) return;
			const googleIcon = document.createElement( "span" );
			googleIcon.classList.add( "material-icons" );
			googleIcon.innerText = "open_in_new";
			const a = document.createElement( "a" );
			a.innerText = "simulation";
			a.href = HOME + JSONExport.simulation;
			a.target = "_blank";
			a.appendChild( googleIcon );
			const s = document.createElement( "span" );
			s.appendChild( a );
			links.forEach( elm => elm.appendChild( s.cloneNode( true ) ) );
		} )
		.then( () => root.classList.remove( "loading" ) )
		.then( () => document.querySelector( "#nav-title" ).innerText = JSONExport.title )
		.then( () => document.querySelector( "#title" ).innerText = JSONExport.title )
		.then( () => document.querySelector( "#course" ).innerText = JSONExport.course )
		.then( () => document.title = `${ JSONExport.course } Lab | ${ JSONExport.title }` )
		.then( () => window.dispatchEvent( new HashChangeEvent( "hashchange" ) ) );
} );

function loadMD( md ) {
	Promise.resolve()
		.then( () => root.classList.add( "loading" ) )
		.then( () => root.innerHTML = "" )
		.then( () => fetch( HOME + JSONExport[ md ], init ) )
		.then( response => response.text() )
		.then( text => root.innerHTML = converter.makeHtml( add1head( text ) ) )
		.then( () => root.classList.remove( "loading" ) );
}

window.addEventListener( "hashchange", function() {
	let md = "theory";
	const hash = window.location.hash.split( "#" )[ 1 ];
	if ( validMD.indexOf( hash ) > -1 ) md = hash;
	else window.location.hash = md;
	linkStyles.innerHTML = `.link-${ hash } a{color:FireBrick!important;font-weight:bold}`;
	loadMD( md );
} );