
export const

fieldsStringSelectorSurvey = '[data-surveyjs-form] input:not([type="reset"]):not([type="submit"]):not([type="button"]), [data-surveyjs-form] select, [data-surveyjs-form] textarea, [data-name="bind-surveyjs-answer"]',

ajaxCall = ( url = location.href, options = {} ) => {
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

            let getFetchMethod = function( response ){
                const accept = options.headers.get('Accept');
                const contentType = response.headers.get('Content-Type');
                const headerOpt = accept || contentType || '';

                if( headerOpt.indexOf('application/json') > -1 || headerOpt === '' ){
                    return 'json';
                } else if( headerOpt.indexOf('text/') > -1 ){
                    return 'text';
                } else {
                    return 'blob';
                }
            };
            let fetchMethod = getFetchMethod( response );

            return response[fetchMethod]();

        })
        .catch(error => {
            return Promise.reject(error);
        })
        .finally(function(){

            if( timeoutTimer ){
                window.clearTimeout( timeoutTimer );
            }

        });
},

appendDomStringToNode = ( HTMLstring, parentNode ) => {

    const tmpEl = document.createElement('div');
    tmpEl.innerHTML = HTMLstring;
    Array.from( tmpEl.childNodes ).forEach((elem) => {
        parentNode.appendChild( elem );
    });

},

checkFormEl = ( formEl ) => {
    let isString = typeof formEl,
        isValidNodeSelector = isString === 'string' && isDOMNode(document.querySelector(formEl)),
        isFormSelector = isValidNodeSelector && document.querySelector(formEl).tagName.toLowerCase() === 'form',
        obj = {
            result: isDOMNode(formEl) || isFormSelector,
            element: (isString === 'string' ? document.querySelector(formEl) : formEl)
        };

    return obj;
},

concatFieldsLists = function () {
    return Array.from(arguments).reduce((argAcc, list) => {
        return list.reduce((listAcc, elem) => {
            if( listAcc.indexOf(elem) === -1 ){
                listAcc.push(elem);
            }
            return listAcc;
        }, argAcc);
    }, []);
},

isDOMNode = ( node ) => {
    return Element.prototype.isPrototypeOf( node );
},

isEmptyObject = ( object ) => {
    return isPlainObject(object) && Object.getOwnPropertyNames(object).length === 0;
},

isFieldForChangeEvent = ( fieldEl ) => {
    return fieldEl.matches('select, [type="radio"], [type="checkbox"], [type="file"]');
},

isNodeList = ( nodeList ) => {
    return NodeList.prototype.isPrototypeOf( nodeList );
},

isPlainObject = ( object ) => {
    return Object.prototype.toString.call( object ) === '[object Object]';
},

mergeObjects = function( out = {} ){
    for(let i=1; i<arguments.length; i++){
        let obj = arguments[i];

        if(!obj){ continue; }

        for(let key in obj){
            let isArray = Object.prototype.toString.call(obj[key]) === "[object Array]";
            let isObject = Object.prototype.toString.call(obj[key]) === "[object Object]";

            // COPY ONLY ENUMERABLE PROPERTIES
            if( obj.hasOwnProperty(key) ){
                if( isArray ){

                    if( typeof out[key] === 'undefined' ){
                        out[key] = [];
                    }
                    out[key] = out[key].concat( obj[key].slice(0) );

                } else if( isObject ){

                    out[key] = mergeObjects(out[key], obj[key]);

                } else {

                    // * STRING | NUMBER | BOOLEAN | FUNCTION
                    if( Array.isArray(out[key]) ){
                        // IF THIS IS ONE OF ABOVE (*) AND THE DESTINATION OBJECT IS AN ARRAY
                        out[key].push(obj[key]);
                    } else {
                        out[key] = obj[key];
                    }

                }
            }
        }
    }

    return out;
}
