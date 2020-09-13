
export const ajaxCall = ( url = location.href, options = {} ) => {

    let timeoutTimer;

    options.headers = new Headers( options.headers );

    /* SET AbortController FOR timeout */
    if ( options.timeout > 0 ) {
        const controller = new AbortController();
        const signal = controller.signal;

        options.signal = signal;

        timeoutTimer = window.setTimeout(function() {
            controller.abort();
        }, options.timeout);
    }

    return fetch( url, options )
        .then(response => {
            if( !response.ok ){
                return Promise.reject(response);
            }
            return response.json();
        })
        .catch(error => {
            return Promise.reject(error);
        })
        .finally(function(){
            if( timeoutTimer ){
                window.clearTimeout( timeoutTimer );
            }
        });
        
}
