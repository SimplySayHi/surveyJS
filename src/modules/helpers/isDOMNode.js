/* eslint-disable no-prototype-builtins */

export const isDOMNode = node => {
    return Element.prototype.isPrototypeOf( node );
}
