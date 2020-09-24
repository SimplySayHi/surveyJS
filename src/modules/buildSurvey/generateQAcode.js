
import { iterateAnswers } from './generateQAcodeUtils/iterateAnswers';

export const generateQAcode = ( formEl, options, questionsList = [] ) => {

    const qaData = questionsList[0]['sort'] ? questionsList.sort((a, b) => { return a['sort'] > b['sort']; }) : questionsList;
    const qaDataLength = qaData.length;
    
    let qaCodeAll = '';
    
    for(let i=0; i<qaDataLength; i++){
        const item = qaData[i];

        let qaHtml = options.templates.question;
        let answersHtml = iterateAnswers( formEl, options, item, item.id, i );

        if( item.question === 'hidden-privacy' ){
            const bindAnswerEl = formEl.closest('[data-surveyjs-container]').querySelector('[data-name="bind-surveyjs-answer"]');
            if( bindAnswerEl ){
                bindAnswerEl.closest('[data-formjs-question]').setAttribute('data-question-id', item.id);
                continue;
            }
        }

        const maxChoice = item.checks ? JSON.parse(item.checks) : '';
        const checksMin = maxChoice.length > 0 ? maxChoice[0] : '';
        const checksMax = maxChoice.length > 0 ? maxChoice[1] : '';

        const maxChoiceText = maxChoice !== '' ? ' ('+ checksMax +' '+ options.maxChoiceText +')' : '';
        const questionText = item.question + maxChoiceText;
        const fieldErrorTemplate = options.fieldErrorFeedback ? options.templates.fieldError : '';

        // REPLACE QUESTION DATA AND ANSWERS HTML IN LOCAL VARIABLE qaHtml
        qaHtml = qaHtml.replace( /{{questionId}}/g, item.id );
        qaHtml = qaHtml.replace( /{{questionNumber}}/g, (i+1) );
        qaHtml = qaHtml.replace( /{{questionText}}/g, questionText );
        qaHtml = qaHtml.replace( /{{answersHtml}}/g, answersHtml );
        qaHtml = qaHtml.replace( /{{fieldErrorTemplate}}/g, fieldErrorTemplate );
        if( options.fieldErrorFeedback && options.templates.fieldError.indexOf('{{fieldErrorMessage}}') !== -1 ){
            const fieldErrorMessage = maxChoice !== '' ? options.fieldErrorMessageMultiChoice : options.fieldErrorMessage;
            qaHtml = qaHtml.replace( /{{fieldErrorMessage}}/g, fieldErrorMessage )
                            .replace( /{{checksMin}}/g, checksMin )
                            .replace( /{{checksMax}}/g, checksMax );
        }

        qaCodeAll += qaHtml;
    }
    
    return qaCodeAll;

}
