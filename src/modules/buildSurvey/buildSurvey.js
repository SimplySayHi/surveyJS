
import { appendDomStringToNode }from '../helpers';

import { generateQAcode }       from './generateQAcode';
import { populateAnswers }      from './populateAnswers';

import Form from 'formjs-plugin';

export function buildSurvey(){
    
    const self = this,
          data = self.data,
          formEl = self.formEl,
          formName = formEl.getAttribute('name') || '',
          surveyContEl = formEl.closest('[data-surveyjs-container]');
    
    // REPLACE SURVEY ID AND FORM NAME IN LOCALSTORAGE NAME
    self.internals.localStorageName = self.internals.localStorageName.replace( /{{surveyId}}/g, data.id );
    self.internals.localStorageName = self.internals.localStorageName.replace( /{{surveyFormName}}/g, formName );
    
    // PRINT GENERAL SURVEY DATA: TITLE AND DESCRIPTION
    const checkData = data => { return (typeof data !== 'undefined' ? data : ''); };
    if( surveyContEl.querySelector('[data-surveyjs-title]') ){
        surveyContEl.querySelector('[data-surveyjs-title]').textContent = checkData( data.title );
    }
    if( surveyContEl.querySelector('[data-surveyjs-description]') ){
        surveyContEl.querySelector('[data-surveyjs-description]').textContent = checkData( data.description );
    }
    
    // ITERATES THE QUESTIONS ( AND ALSO THEIR ANSWERS )...AND RETURN ALL THE HTML CODE
    const qaHtmlAll = generateQAcode.call( self, data.questions );
    // PRINT ALL QUESTIONS & ANSWERS
    appendDomStringToNode( qaHtmlAll, formEl.querySelector('[data-surveyjs-body]') );

    // FILL ANSWERS WITH LOCAL STORAGE ( IF AVAILABLE )
    populateAnswers.call( self );

    // INIT FIELDS VALIDATION
    // THIS WILL RUN BEFORE FORMJS VALIDATION FUNCTION SO THAT USERS CANNOT SKIP REQUIRED FIELDS VALIDATION
    self.options.fieldOptions.validateOnEvents.split(' ').forEach((eventName) => {
        let useCapturing = (eventName === 'blur' ? true : false);
        formEl.addEventListener(eventName, self.listenerCallbacks.validation, useCapturing);
    });

    // CREATE & INITIALIZE FORMJS INSTANCE FOR SURVEY
    const formJSoptions = {
            fieldOptions: self.options.fieldOptions,
            formOptions: self.options.formOptions
        };
    self.internals.formInstance = new Form( formEl, formJSoptions );
    return new Promise(resolve => {
        resolve( self.internals.formInstance.init() );
    }).then(() => {
        self.isInitialized = true;
        surveyContEl.classList.add('surveyjs-init-success');
    });

}
