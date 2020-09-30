
export const replaceObjectKeysInString = (obj, stringHTML) => {
    return Object.keys(obj).reduce((accString, name) => {
        const regexStr = new RegExp( '{{' + name + '}}', 'g' );
        return accString.replace(regexStr, obj[name]);
    }, stringHTML);
}
