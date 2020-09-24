
import { appendDomStringToNode }from '../helpers';
import { generateQAcode }       from './generateQAcode';
import { populateAnswers }      from './populateAnswers';

export const buildSurvey = ( formEl, options, internals, data ) => {
    
    const self = formEl.formjs,
          formName = formEl.getAttribute('name') || '';
    
    // REPLACE SURVEY ID AND FORM NAME IN LOCALSTORAGE NAME
    self.internals.storageName = internals.storageName.replace( /{{surveyId}}/g, data.id );
    self.internals.storageName = internals.storageName.replace( /{{surveyFormName}}/g, formName );
    
    // ITERATES THE QUESTIONS ( AND ALSO THEIR ANSWERS )...AND RETURN ALL THE HTML CODE
    const qaHtmlAll = generateQAcode( formEl, options, data.questions );
    // PRINT ALL QUESTIONS & ANSWERS
    appendDomStringToNode( qaHtmlAll, formEl.querySelector('[data-surveyjs-body]') );

    // FILL ANSWERS WITH LOCAL STORAGE ( IF AVAILABLE )
    if( options.useLocalStorage ){
        populateAnswers( formEl, self.internals );
    }

}
