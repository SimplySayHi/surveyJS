
import { generateOptionTags } from './generateOptionTags';

// RELATED ANSWER
// IF AN ANSWER REQUIRE TO FILL OR SELECT ANOTHER RELATED ANSWER
export const attribute = ( options, data ) => {

    const objData = data.objData,
          aHtml = options.templates.inputGroup,
          attr = data.answer.attribute,
          attributeIsArray = Array.isArray(attr),
          relatedAnswerField = attributeIsArray ? options.templates.selectTag : options.templates.inputTag;
    
    objData.fieldClass = options.cssClasses.default;
    
    if( attributeIsArray ){
        // CREATE A GROUP WITH A RADIO INPUT AND ITS RELATED ANSWER (A SELECT FIELD)
        objData.fieldClass = options.cssClasses.select;
        objData.optionsHtml = generateOptionTags(attr, options);
    }

    return { aHtml, relatedAnswerField, objData };
}
