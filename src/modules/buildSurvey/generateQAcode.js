
import { isPlainObject, replaceObjectKeysInString, sortList } from '../helpers';
import { generateAnswers } from './generateQAcodeUtils/generateAnswers';

export const generateQAcode = ( questions, surveyId, options ) => {

    return sortList( questions ).reduce((accCode, questionObj, index) => {
        if( questionObj.external ){ return accCode; }

        let qaHtml = options.templates.question;
        const questionId = questionObj.id;
        const questionNumber = index + 1;
        const extraData = {
            surveyId,
            question: {
                id: questionId,
                index,
                isRequired: !!questionObj.required
            }
        };

        if( questionObj.checks ){
            extraData.question.checks = questionObj.checks;
        }
        
        let answersHTML = generateAnswers( questionObj.answers, extraData, options );

        const maxChoice = questionObj.checks ? JSON.parse(questionObj.checks) : '';
        const checksMin = maxChoice[0] || '';
        const checksMax = maxChoice[1] || '';
        const maxChoiceText = maxChoice && options.messages.maxChoice ? ' ('+ checksMax +' '+ options.messages.maxChoice +')' : '';

        const questionData = {
            questionId,
            questionNumber,
            questionText: questionObj.question + maxChoiceText,
            answersHTML,
            errorsHTML: options.fieldErrorFeedback ? options.templates.wrapper.errors : ''
        };
        qaHtml = replaceObjectKeysInString(questionData, qaHtml);

        if( options.fieldErrorFeedback ){
            let errorMessage = maxChoice !== '' ? options.messages.errorMessageMultiChoice : (questionObj.errorMessage || options.messages.errorMessage);

            // CASE OF MULTIPLE ERROR MESSAGES FROM JSON DATA => DYNAMICALLY MANAGED VIA EVENT LISTENER IN CONSTRUCTOR
            if( isPlainObject(errorMessage) ){
                errorMessage = '';
            }

            qaHtml = qaHtml.replace( /{{errorTemplates}}/g, errorMessage );
        }

        return accCode += replaceObjectKeysInString({checksMin, checksMax}, qaHtml);
    }, '');

}
