
import { iterateAnswers } from './generateQAcodeUtils/iterateAnswers';

export function generateQAcode( questionsList = [] ){

    const self = this;
    let qaData = ( questionsList[0]['sort'] ? questionsList.sort((a, b) => { return a['sort'] > b['sort']; }) : questionsList ),
        qaCodeAll = '',
        qaDataLength = qaData.length;
    
    for(let i=0; i<qaDataLength; i++){
        let item = qaData[i],
            maxChoice = (item.checks ? JSON.parse(item.checks) : ''),
            checksMin = (maxChoice.length > 0 ? maxChoice[0] : ''),
            checksMax = (maxChoice.length > 0 ? maxChoice[1] : ''),
            aHtml = '',
            qaHtml = self.options.templates.question;

        // HTML CODE FOR THE ANSWER/S
        aHtml += iterateAnswers.call( self, item, item.id, i );

        if( item.question === 'hidden-privacy' ){
            let bindAnswerEl = self.formEl.closest('[data-surveyjs-container]').querySelector('[data-name="bind-surveyjs-answer"]');
            if( bindAnswerEl ){
                bindAnswerEl.closest('[data-formjs-question]').setAttribute('data-question-id', item.id);
                continue;
            }
        }

        // REPLACE QUESTION DATA AND ANSWERS HTML IN LOCAL VARIABLE qaHtml
        qaHtml = qaHtml.replace( /{{questionId}}/g, item.id );
        qaHtml = qaHtml.replace( /{{questionNumber}}/g, (i+1) );
        qaHtml = qaHtml.replace( /{{questionText}}/g, item.question + ( maxChoice !== '' ? ' ('+ checksMax +' '+ self.options.maxChoiceText +')' : '' ) );
        qaHtml = qaHtml.replace( /{{answersHtml}}/g, aHtml );
        qaHtml = qaHtml.replace( /{{fieldErrorTemplate}}/g, ( self.options.fieldErrorFeedback ? self.options.templates.fieldError : '' ) );
        if( self.options.fieldErrorFeedback && self.options.templates.fieldError.indexOf('{{fieldErrorMessage}}') !== -1 ){
            let message = ( maxChoice !== '' ? self.options.fieldErrorMessageMultiChoice : self.options.fieldErrorMessage );
            qaHtml = qaHtml.replace( /{{fieldErrorMessage}}/g, message ).replace( /{{checksMin}}/g, checksMin ).replace( /{{checksMax}}/g, checksMax );
        }

        qaCodeAll += qaHtml;
    }
    
    return qaCodeAll;

}
