var JSONExport;
const unsafeProbability = 1;
const root = document.querySelector( "#root" );

window.addEventListener( "load", function() {
	Promise.resolve()
		.then( () => root.classList.add( "loading" ) )
		.then( () => fetch( "export.json" ) )
		.then( response => response.json() )
		.then( json => JSONExport = json )
		.then( () => {
			JSONExport.forEach( courseObject => {
				const h3 = document.createElement( "h3" );
				h3.innerText = courseObject.course + " laboratory";
				const ol = document.createElement( "ol" );
				ol.classList.add( "toc" );
				courseObject.content.forEach( ( item, i ) => {
					const a = document.createElement( "a" );
					a.innerText = item;
					a.href = "labs/laboratory.html?" + courseObject.course.slice( 0, 3 ) + ( i + 1 );
					const title = document.createElement( "span" );
					title.classList.add( "title" );
					title.appendChild( a );
					const number = document.createElement( "span" );
					number.classList.add( "number" );
					number.textContent = i + 1;
					const li = document.createElement( "li" );
					li.appendChild( title );
					li.appendChild( number );
					ol.appendChild( li);
				} );
				root.appendChild( h3 );
				root.appendChild( ol );
			} );
		} )
		.then( () => root.classList.remove( "loading" ) );
} );

const quotes = [
	{
		"content": "I am a lazy person, which is why I like open source, for other people to do work for me.",
		"creator": "Linus Torvalds",
		"probability": 1
	},
	{
		"content": "Software is like sex: it's better when it's free.",
		"creator": "Linus Torvalds",
		"probability": unsafeProbability
	}
];

const total = quotes.reduce( ( ( a, c )  => a + c.probability ), 0 );

const prob = Math.random() * total;

const quote = quotes.reduce( ( a, c ) => {
	if ( typeof a === "number" ) {
		if ( a + c.probability < prob ) return a + c.probability;
		return c;
	}
	return a;
}, 0 );

document.querySelector( "#quote-content" ).innerText = quote.content.replaceAll( /'/g, "\u2019" );
document.querySelector( "#quote-creator" ).innerText = quote.creator;