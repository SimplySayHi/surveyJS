
import { iterateAnswers } from './generateQAcodeUtils/iterateAnswers';

export const generateQAcode = ( formEl, options, questionsList = [] ) => {

    const qaData = questionsList[0]['sort'] ? questionsList.sort((a, b) => { return a['sort'] > b['sort']; }) : questionsList,
          qaDataLength = qaData.length;
    
    let qaCodeAll = '';
    
    for(let i=0; i<qaDataLength; i++){
        const item = qaData[i],
              maxChoice = item.checks ? JSON.parse(item.checks) : '',
              checksMin = maxChoice.length > 0 ? maxChoice[0] : '',
              checksMax = maxChoice.length > 0 ? maxChoice[1] : '';

        let aHtml = '',
            qaHtml = options.templates.question;

        // HTML CODE FOR THE ANSWER/S
        aHtml += iterateAnswers( formEl, options, item, item.id, i );

        if( item.question === 'hidden-privacy' ){
            const bindAnswerEl = formEl.closest('[data-surveyjs-container]').querySelector('[data-name="bind-surveyjs-answer"]');
            if( bindAnswerEl ){
                bindAnswerEl.closest('[data-formjs-question]').setAttribute('data-question-id', item.id);
                continue;
            }
        }

        // REPLACE QUESTION DATA AND ANSWERS HTML IN LOCAL VARIABLE qaHtml
        qaHtml = qaHtml.replace( /{{questionId}}/g, item.id );
        qaHtml = qaHtml.replace( /{{questionNumber}}/g, (i+1) );
        qaHtml = qaHtml.replace( /{{questionText}}/g, item.question + ( maxChoice !== '' ? ' ('+ checksMax +' '+ options.maxChoiceText +')' : '' ) );
        qaHtml = qaHtml.replace( /{{answersHtml}}/g, aHtml );
        qaHtml = qaHtml.replace( /{{fieldErrorTemplate}}/g, ( options.fieldErrorFeedback ? options.templates.fieldError : '' ) );
        if( options.fieldErrorFeedback && options.templates.fieldError.indexOf('{{fieldErrorMessage}}') !== -1 ){
            const message = maxChoice !== '' ? options.fieldErrorMessageMultiChoice : options.fieldErrorMessage;
            qaHtml = qaHtml.replace( /{{fieldErrorMessage}}/g, message ).replace( /{{checksMin}}/g, checksMin ).replace( /{{checksMax}}/g, checksMax );
        }

        qaCodeAll += qaHtml;
    }
    
    return qaCodeAll;

}
