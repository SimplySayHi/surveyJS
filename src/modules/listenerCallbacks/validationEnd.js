
import { arrayMove, getQuestionId, isEmptyObject } from '../helpers';
import { getQuestionObject }            from '../utils/getQuestionObject';
import { getAnswerIndexInWebStorage }   from '../utils/getAnswerIndexInWebStorage';

export function validationEnd( event ){
    const fieldEl = event.data.fieldEl;
    const errors = event.data.errors;
    const instance = fieldEl.closest('form').formjs;
    const errorsWrapper = fieldEl.closest( instance.options.fieldOptions.questionContainer ).querySelector('[data-surveyjs-errors]');
    
    const questionId = getQuestionId(fieldEl);
    const questionObj = getQuestionObject(instance.data, questionId);

    // IF IT'S NOT A SURVEY QUESTION -> SKIP
    if( isEmptyObject(questionObj) ){ return true; }

    // MANAGE MULTIPLE ERROR MESSAGES
    if( errorsWrapper && errors && isPlainObject(questionObj.errorMessage) ){
        let errorsList = Object.keys(errors);
        if( errors.rule ){
            // PUT ERROR "rule" AS FIRST, SO THAT A GENERIC ERROR IS SHOWN BEFORE ALL OTHERS
            const ruleIndex = errorsList.indexOf('rule');
            errorsList = arrayMove(errorsList, ruleIndex, 0);
        }
        const errorsHTML = errorsList.reduce((accHTML, name) => {
            const errorMessage = questionObj.errorMessage[name] || '';
            return accHTML += errorMessage ? instance.options.templates.error.replace('{{errorMessage}}', errorMessage) : '';
        }, '');

        errorsWrapper.innerHTML = errorsHTML;
    }

    // MANAGE ITEMS IN LOCAL STORAGE ( IF AVAILABLE AND ACTIVE )
    if( instance.options.useWebStorage && !fieldEl.matches('[data-exclude-storage]') ){
        const internals = instance.internals;

        const fieldValue = fieldEl.value;
        const isRequiredFrom = fieldEl.matches('[data-required-from]');
        const isMultiChoice = fieldEl.matches('[data-checks]');
        const isRequireMore = fieldEl.matches('[data-require-more]');
        const reqMoreEl = isRequiredFrom ? document.querySelector(fieldEl.getAttribute('data-required-from')) : null;

        const inArrayPos = getAnswerIndexInWebStorage( internals, fieldEl.name, (isMultiChoice ? fieldValue : false) );
        const inArrayRequireMorePos = getAnswerIndexInWebStorage( internals, fieldEl.name + '-more' );

        let storageArray = internals.storageArray;

        if( !isRequireMore && !isRequiredFrom && inArrayRequireMorePos !== -1 ){
            storageArray.splice(inArrayRequireMorePos, 1);
        }

        if( inArrayPos !== -1 ){
            if( isMultiChoice ){
                if( !fieldEl.checked && storageArray[inArrayPos].value === fieldValue ){
                    // REMOVE ITEM FROM LS
                    storageArray.splice(inArrayPos, 1);
                } else {
                    // ADD ITEM TO LS
                    storageArray.push( { name: fieldEl.name, value: fieldValue } );
                }
            } else {
                if( fieldValue !== '' ){
                    storageArray[inArrayPos].value = fieldValue;
                } else {
                    storageArray.splice(inArrayPos, 1); 
                }
            }
        } else {
            if( fieldValue !== '' ){
                if( isRequiredFrom && fieldValue !== '' ){
                    const oldFieldNamePos = getAnswerIndexInWebStorage( internals, reqMoreEl.name );
                    if( oldFieldNamePos !== -1 ){
                        storageArray.splice(oldFieldNamePos, 1);
                    }
                    storageArray.push( { name: reqMoreEl.name, value: reqMoreEl.value } );
                }
                storageArray.push( { name: fieldEl.name, value: fieldValue } );
                if( isRequireMore ){
                    const elReqFromEl = fieldEl.closest('form').querySelector( '[data-required-from="#' + fieldEl.id + '"]' );
                    storageArray.push( { name: elReqFromEl.name, value: elReqFromEl.value } );
                }
            }
        }

        sessionStorage.setObject( internals.storageName, storageArray );
    }

    // BASED ON JSON DATA, FORCE REQUIRED FIELDS TO BE VALIDATED
    if( questionObj.required && !fieldEl.required && !fieldEl.matches('[data-required-from]') ){
        fieldEl.required = true;
        instance.validateField(fieldEl);
    }
}
