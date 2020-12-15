var JSON;
var HOME = "";
const validMD = [ "theory", "reference" ];
let hasSimulation = false;
const converter = new Markdown.Converter();
const links = Array.from( document.querySelectorAll( ".links-container" ) );
const linkStyles = document.querySelector( "#link-styles" );

var headers = new Headers();
headers.append( "pragma", "no-cache" );
headers.append( "cache-control", "no-cache" );

var init = { method: 'GET', headers: headers };

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
    fetch( HOME + "export.json", init )
        .then( response => response.json() )
        .then( json => ( JSON = json ) )
        .then( () => hasSimulation = JSON.simulation !== null )
        .then( () => {
            if ( !hasSimulation ) return;
            const googleIcon = document.createElement( "span" );
            googleIcon.classList.add( "material-icons" );
            googleIcon.innerText = "open_in_new";
            const a = document.createElement( "a" );
            a.innerText = "simulation";
            a.href = HOME + JSON.simulation;
            a.target = "_blank";
            a.appendChild( googleIcon );
            const s = document.createElement( "span" );
            s.appendChild( a );
            links.forEach( elm => elm.appendChild( s.cloneNode( true ) ) );
        } )
        .then( () => document.querySelector( "#nav-title" ).innerText = JSON.title )
        .then( () => document.querySelector( "#title" ).innerText = JSON.title )
        .then( () => document.querySelector( "#course" ).innerText = JSON.course )
        .then( () => document.title = `${ JSON.course } Lab | ${ JSON.title }` )
        .then( () => window.dispatchEvent( new HashChangeEvent( "hashchange" ) ) );
} );

function loadMD( md ) {
    fetch( HOME + JSON[ md ], init )
        .then( response => response.text() )
        .then( text => document.querySelector( "#markdown" ).innerHTML = converter.makeHtml( add1head( text ) ) );
}

window.addEventListener( "hashchange", function() {
    let md = "theory";
    const hash = window.location.hash.split( "#" )[ 1 ];
    if ( validMD.indexOf( hash ) > -1 ) md = hash;
    else window.location.hash = md;
    linkStyles.innerHTML = `.link-${ hash } a{color:FireBrick!important;font-weight:bold}`;
    loadMD( md );
} );