
export const isDOMNode = node => {
    return Element.prototype.isPrototypeOf( node );
}
