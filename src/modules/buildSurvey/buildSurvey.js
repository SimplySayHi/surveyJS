
import { appendDomStringToNode }from '../helpers';

import { generateQAcode }       from './generateQAcode';
import { populateAnswers }      from './populateAnswers';
import { callbackFns }          from '../listenerCallbacks';

import Form from 'formjs-plugin';

export const buildSurvey = ( formEl, options, internals, data ) => {
    
    const self = formEl.surveyjs,
          formName = formEl.getAttribute('name') || '',
          surveyContEl = formEl.closest('[data-surveyjs-container]');
    
    // REPLACE SURVEY ID AND FORM NAME IN LOCALSTORAGE NAME
    self.internals.localStorageName = internals.localStorageName.replace( /{{surveyId}}/g, data.id );
    self.internals.localStorageName = internals.localStorageName.replace( /{{surveyFormName}}/g, formName );
    
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
    } else { console.warn('LOCAL STORAGE IS NOT SUPPORTED!'); }

    // INIT FIELDS VALIDATION
    // THIS WILL RUN BEFORE FORMJS VALIDATION FUNCTION SO THAT USERS CANNOT SKIP REQUIRED FIELDS VALIDATION
    const validateOnEvents = (options.fieldOptions && options.fieldOptions.validateOnEvents) || Form.prototype.options.fieldOptions.validateOnEvents;
    validateOnEvents.split(' ').forEach(eventName => {
        const useCapturing = eventName === 'blur' ? true : false;
        formEl.addEventListener(eventName, callbackFns.validation, useCapturing);
    });

    // CREATE & INITIALIZE FORMJS INSTANCE FOR SURVEY
    const formJSoptions = {
            fieldOptions: options.fieldOptions || {},
            formOptions: options.formOptions
        };
    const formInstance = new Form( formEl, formJSoptions );

    formEl.addEventListener('fjs.form:submit', event => {
        event.data.then(() => {
            // REMOVE SURVEY LOCAL STORAGE
            if( options.useLocalStorage ){
                localStorage.removeItem( self.internals.localStorageName );
            }
        });
    });

    return new Promise(resolve => {
        resolve( formInstance.init() );
    }).then(() => {
        surveyContEl.classList.add('surveyjs-init-success');
    });

}
