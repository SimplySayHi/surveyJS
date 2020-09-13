
import { isPlainObject } from './isPlainObject';

export const mergeObjects = function( out = {} ){
    for(let i=1; i<arguments.length; i++){
        const obj = arguments[i];

        if(!obj){ continue; }

        for(let key in obj){
            const obj_isArray = Array.isArray(obj[key]);
            const obj_isObject = isPlainObject(obj[key]);

            // COPY ONLY ENUMERABLE PROPERTIES
            if( obj.hasOwnProperty(key) ){
                if( obj_isArray ){

                    if( typeof out[key] === 'undefined' ){
                        out[key] = [];
                    }
                    out[key] = out[key].concat( obj[key].slice(0) );

                } else if( obj_isObject ){

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
