
export const ajaxCall = ( url = location.href, options = {} ) => {

    let timeoutTimer;

    options.headers = new Headers( options.headers );

    /* SET AbortController FOR timeout */
    if ( options.timeout > 0 ) {
        const controller = new AbortController();
        const signal = controller.signal;

        options.signal = signal;

        timeoutTimer = window.setTimeout(() => {
            controller.abort();
        }, options.timeout);
    }

    return fetch( url, options )
        .then(response => {
            if( !response.ok ){
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            throw new Error(error.message);
        })
        .finally(() => {
            if( timeoutTimer ){
                window.clearTimeout( timeoutTimer );
            }
        });
        
}
