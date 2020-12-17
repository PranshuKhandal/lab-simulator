const needHeaders = false;

var init = { method: 'GET' };

if ( needHeaders ) {
    const headers = new Headers();
    headers.append( "pragma", "no-cache" );
    headers.append( "cache-control", "no-cache" );
    Object.assign( init, { headers } );
}