
export const isPlainObject = object => {
    return Object.prototype.toString.call( object ) === '[object Object]';
}
