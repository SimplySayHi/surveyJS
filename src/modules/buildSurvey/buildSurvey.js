
import { generateQAcode } from './generateQAcode';

export const buildSurvey = ( data, formEl, options ) => {
    
    const qaHtmlAll = generateQAcode( data.questions, data.id, options );
    formEl.querySelector('[data-surveyjs-body]').insertAdjacentHTML( 'beforeend', qaHtmlAll );

    // MANAGE EXTERNAL QUESTION
    const extQuestions = data.questions.filter(obj => obj.external);
    if( extQuestions.length > 0 ){
        const surveyWrapperEl = formEl.closest('[data-surveyjs-wrapper]');
        extQuestions.forEach((question, qIndex) => {

            const externalCont = surveyWrapperEl.querySelector('[data-surveyjs-external="'+ (qIndex+1) +'"]');
            
            externalCont.setAttribute('data-question-id', question.id);

            question.answers.forEach((answer, aIndex) => {
                const externalField = externalCont.querySelectorAll('[data-field]')[aIndex];
                const fieldProps = {
                        id: `${answer.type}-${data.id}-${question.id}-${answer.id}`,
                        type: answer.type,
                        value: answer.value,
                        required: !!question.required
                    };
                
                Object.keys(fieldProps).forEach(name => {
                    externalField[name] = fieldProps[name];
                });

                const answerCont = externalField.closest('[data-answer]');
                answerCont.querySelector('label').setAttribute('for', fieldProps.id);
                answerCont.querySelector('[data-label]').innerHTML = answer.label;
                externalCont.querySelector('[data-question]').innerHTML = question.question;
            });

        });
    }

}
