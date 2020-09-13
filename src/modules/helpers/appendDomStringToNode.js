
export const appendDomStringToNode = ( HTMLstring, parentNode ) => {

    const tmpEl = document.createElement('div');
    tmpEl.innerHTML = HTMLstring;
    Array.from( tmpEl.childNodes ).forEach((elem) => {
        parentNode.appendChild( elem );
    });

}
