
export const replaceTemplateStrings = ( options, fieldData, objData ) => {

    if( objData.optionsHtml !== '' ){
        fieldData.aHtml = fieldData.aHtml.replace( /{{selectTagCode}}/g, options.templates.selectTag );
    }

    if( fieldData.relatedAnswerField ){
        const relatedAnswerKeys = {
              answerCode: '', answerType: 'text', fieldClass: objData.fieldClass,
              answerIdValue: '', attrRequired: '', addMoreName: '-more',
              attrRequiredFrom: 'data-required-from="#'+ objData.answerCode +'"'
            };
            
        for(let reKey in relatedAnswerKeys){
            const regexStrRe = new RegExp( '{{' + reKey + '}}', 'g' );
            fieldData.relatedAnswerField = fieldData.relatedAnswerField.replace( regexStrRe, relatedAnswerKeys[reKey] );    
        }
        
        fieldData.aHtml = fieldData.aHtml.replace( /{{relatedAnswerField}}/g, fieldData.relatedAnswerField );
    } else {
        fieldData.aHtml = fieldData.aHtml.replace( /{{addMoreName}}/g, '' );
        fieldData.aHtml = fieldData.aHtml.replace( /{{attrRequiredFrom}}/g, '' );
    }
    
    for( let key in objData ){
        const regexStr = new RegExp( '{{' + key + '}}', 'g' );
        fieldData.aHtml = fieldData.aHtml.replace( regexStr, objData[key] );
    }

    return fieldData.aHtml;

}