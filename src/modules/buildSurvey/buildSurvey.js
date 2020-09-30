
import { generateQAcode }       from './generateQAcode';
import { populateAnswers }      from './populateAnswers';

export const buildSurvey = ( formEl, options, internals, data ) => {
    
    const formName = formEl.getAttribute('name') || '';
    
    // REPLACE SURVEY ID AND FORM NAME IN WEB STORAGE NAME
    internals.storageName = internals.storageName.replace( /{{surveyId}}/, data.id );
    internals.storageName = internals.storageName.replace( /{{surveyFormName}}/, formName );
    
    const qaHtmlAll = generateQAcode( formEl, options, data );
    formEl.querySelector('[data-surveyjs-body]').insertAdjacentHTML( 'beforeend', qaHtmlAll );

    // FILL ANSWERS WITH LOCAL STORAGE ( IF AVAILABLE )
    if( options.useWebStorage ){
        populateAnswers( formEl, internals );
    }

}
