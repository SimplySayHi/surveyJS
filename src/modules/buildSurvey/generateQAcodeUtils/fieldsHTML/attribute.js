
import { generateOptionTags } from './generateOptionTags';

// RELATED ANSWER
// IF AN ANSWER REQUIRE TO FILL OR SELECT ANOTHER RELATED ANSWER
export const attribute = function( data ){

    const self = this,
          answer = data.answer,
          objData = data.objData,
          aHtml = self.options.templates.inputGroup,
          attr = answer.attribute,
          attributeIsArray = Array.isArray( attr );
    
    let relatedAnswerField = ( attributeIsArray ? self.options.templates.selectTag : self.options.templates.inputTag );
    
    objData.fieldClass = self.options.cssClasses.default;
    
    if( attributeIsArray ){
        // CREATE A GROUP WITH A RADIO INPUT AND ITS RELATED ANSWER (A SELECT FIELD)
        objData.fieldClass = self.options.cssClasses.select;
        objData.optionsHtml = generateOptionTags.call( self, attr );
    }

    return { aHtml, relatedAnswerField, objData };
}
