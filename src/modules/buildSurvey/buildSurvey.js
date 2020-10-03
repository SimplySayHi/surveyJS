
import { generateQAcode } from './generateQAcode';

export const buildSurvey = ( data, formEl, options, internals ) => {
    
    const formName = formEl.getAttribute('name') || '';
    
    // REPLACE SURVEY ID AND FORM NAME IN WEB STORAGE NAME
    internals.storageName = internals.storageName.replace( /{{surveyId}}/, data.id );
    internals.storageName = internals.storageName.replace( /{{surveyFormName}}/, formName );
    
    const qaHtmlAll = generateQAcode( data, options );
    formEl.querySelector('[data-surveyjs-body]').insertAdjacentHTML( 'beforeend', qaHtmlAll );

    // MANAGE EXTERNAL QUESTION
    const extQuestion = data.questions.filter(obj => obj.external)[0];
    if( extQuestion ){
        const externalCont = formEl.closest('[data-surveyjs-container]').querySelector('[data-surveyjs-external]');
        
        externalCont.setAttribute('data-question-id', extQuestion.id);
        extQuestion.answers.forEach((answer, index) => {
            const externalField = externalCont.querySelectorAll('[data-field]')[index];
            const fieldProps = {
                    id: `${answer.type}-${data.id}-${extQuestion.id}-${answer.id}`,
                    type: answer.type,
                    value: answer.value,
                    required: !!extQuestion.required
                };
            
            Object.keys(fieldProps).forEach(name => {
                externalField[name] = fieldProps[name];
            });

            const answerCont = externalField.closest('[data-answer]');
            answerCont.querySelector('label').setAttribute('for', fieldProps.id);
            answerCont.querySelector('[data-label]').innerHTML = answer.label;
            externalCont.querySelector('[data-question]').innerHTML = extQuestion.question;
        });
    }

}
