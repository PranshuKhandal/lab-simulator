var JSONExport;
const root = document.querySelector( "#root" );

window.addEventListener( "load", function() {
	fetch( "/export.json" )
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
			});
		} );
} );