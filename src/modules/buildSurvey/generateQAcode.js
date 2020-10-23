
import { isPlainObject, replaceObjectKeysInString, sortList } from '../helpers';
import { generateAnswers } from './generateQAcodeUtils/generateAnswers';

export const generateQAcode = ( questions, surveyId, options ) => {

    return sortList( questions ).reduce((accCode, questionObj, index) => {
        if( questionObj.external ){ return accCode; }

        let questionHTML = options.templates.wrapper.question;
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
        
        const answersHTML = generateAnswers( questionObj.answers, extraData, options );

        const maxChoice = questionObj.checks ? JSON.parse(questionObj.checks) : '';
        const checksMin = maxChoice[0] || '';
        const checksMax = maxChoice[1] || '';
        const maxChoiceText = maxChoice && options.messages.maxChoice ? ' ('+ checksMax +' '+ options.messages.maxChoice +')' : '';

        const questionData = {
            questionId,
            questionNumber,
            questionText: questionObj.question + maxChoiceText,
            answersHTML
        };
        questionHTML = replaceObjectKeysInString(questionData, questionHTML);

        if( options.showErrorMessage ){
            let errorMessage = maxChoice !== '' ? options.messages.errorMultiChoice : (questionObj.errorMessage || options.messages.error);

            // CASE OF MULTIPLE ERROR MESSAGES FROM JSON DATA => DYNAMICALLY MANAGED VIA EVENT LISTENER IN CONSTRUCTOR
            if( isPlainObject(errorMessage) ){
                errorMessage = '';
            }

            questionHTML = questionHTML.replace( /{{errorTemplates}}/g, errorMessage );
        }

        return accCode += replaceObjectKeysInString({checksMin, checksMax}, questionHTML);
    }, '');

}
