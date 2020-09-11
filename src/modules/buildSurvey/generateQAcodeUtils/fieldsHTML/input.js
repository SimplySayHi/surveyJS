
export const input = ( options, data ) => {

    const objData = data.objData,
          aHtml = data.beforeCode + options.templates.input + data.afterCode;

    if( objData.answerType !== 'checkbox' && objData.answerType !== 'radio' ){
        // EVERY INPUT FIELD THAT IS NOT A CHECKBOX OR RADIO ( TEXT, EMAIL, NUMBER, PASSWORD, RANGE AND SO ON... )
        objData.nestedAnswer += ' class="' + objData.fieldClass + '"';
    }
    
    return { aHtml, objData };
}
