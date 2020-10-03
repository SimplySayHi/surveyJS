
import { arrayMove, getQuestionId } from '../helpers';
import { getQuestionObject } from '../utils/getQuestionObject';

export function validationEnd( event ){
    const fieldEl = event.data.fieldEl;
    const errors = event.data.errors;
    const instance = event.target.formjs;
    
    const questionId = getQuestionId(fieldEl);
    const questionObj = getQuestionObject(instance.data, questionId);

    if( errors && isPlainObject(questionObj.errorMessage) ){
        let errorsList = Object.keys(errors);
        if( errors.rule ){
            // PUT ERROR "rule" AS FIRST, SO THAT A GENERIC ERROR IS SHOWN BEFORE ALL OTHERS
            const ruleIndex = errorsList.indexOf('rule');
            errorsList = arrayMove(errorsList, ruleIndex, 0);
        }
        const errorsWrapper = fieldEl.closest( instance.options.fieldOptions.questionContainer ).querySelector('[data-surveyjs-errors]');
        const errorsHTML = errorsList.reduce((accHTML, name) => {
            const errorMessage = questionObj.errorMessage[name] || '';
            return accHTML += errorMessage ? instance.options.templates.error.replace('{{errorMessage}}', errorMessage) : '';
        }, '');

        errorsWrapper.innerHTML = errorsHTML;
    }
}
