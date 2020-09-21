
import { isPlainObject } from './isPlainObject';

export const mergeObjects = function( out = {} ){
    Array.from(arguments).slice(1).filter(arg => !!arg).forEach(arg => {
        Object.keys(arg).forEach(key => {
            if( Array.isArray(arg[key]) ){
                out[key] = (out[key] || []).concat( arg[key].slice(0) );
            } else if( isPlainObject(arg[key]) ){
                out[key] = mergeObjects((out[key] || {}), arg[key]);
            } else {
                // * STRING | NUMBER | BOOLEAN | FUNCTION
                if( Array.isArray(out[key]) ){
                    // IF THIS IS ONE OF ABOVE (*) AND THE DESTINATION OBJECT IS AN ARRAY
                    out[key].push(arg[key]);
                } else {
                    out[key] = arg[key];
                }
            }
        });
    });

    return out;
}
