
import { appendDomStringToNode }from '../helpers';
import { generateQAcode }       from './generateQAcode';
import { populateAnswers }      from './populateAnswers';

export const buildSurvey = ( formEl, options, internals, data ) => {
    
    const self = formEl.formjs,
          formName = formEl.getAttribute('name') || '',
          surveyContEl = formEl.closest('[data-surveyjs-container]');
    
    // REPLACE SURVEY ID AND FORM NAME IN LOCALSTORAGE NAME
    self.internals.storageName = internals.storageName.replace( /{{surveyId}}/g, data.id );
    self.internals.storageName = internals.storageName.replace( /{{surveyFormName}}/g, formName );
    
    // PRINT GENERAL SURVEY DATA: TITLE AND DESCRIPTION
    const checkData = data => { return typeof data !== 'undefined' ? data : ''; };
    if( surveyContEl.querySelector('[data-surveyjs-title]') ){
        surveyContEl.querySelector('[data-surveyjs-title]').textContent = checkData( data.title );
    }
    if( surveyContEl.querySelector('[data-surveyjs-description]') ){
        surveyContEl.querySelector('[data-surveyjs-description]').textContent = checkData( data.description );
    }
    
    // ITERATES THE QUESTIONS ( AND ALSO THEIR ANSWERS )...AND RETURN ALL THE HTML CODE
    const qaHtmlAll = generateQAcode( formEl, options, data.questions );
    // PRINT ALL QUESTIONS & ANSWERS
    appendDomStringToNode( qaHtmlAll, formEl.querySelector('[data-surveyjs-body]') );

    // FILL ANSWERS WITH LOCAL STORAGE ( IF AVAILABLE )
    if( options.useLocalStorage ){
        populateAnswers( formEl, self.internals );
    }

}
