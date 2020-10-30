
import { arrayMove, getQuestionId, isEmptyObject }  from '../helpers';
import { getQuestionObject }                        from '../utils/getQuestionObject';
import { getAnswerIndex }                           from '../utils/getAnswerIndex';

export function validationEnd( event ){
    const fieldEl = event.data.fieldEl;
    const errors = event.data.errors;
    const instance = fieldEl.closest('form').formjs;
    const options = instance.options;
    const errorsWrapper = fieldEl.closest( options.fieldOptions.questionContainer ).querySelector('[data-surveyjs-errors]');
    
    const questionId = getQuestionId(fieldEl);
    const questionObj = getQuestionObject(instance.data.questions, questionId);

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
            return accHTML += errorMessage ? options.templates.error.replace('{{errorMessage}}', errorMessage) : '';
        }, '');

        errorsWrapper.innerHTML = errorsHTML;
    }

    // MANAGE ITEMS IN LOCAL STORAGE ( IF AVAILABLE AND ACTIVE )
    if( !event.data.isCheckingForm && options.useWebStorage && !fieldEl.matches('[data-exclude-storage]') ){
        const storageName = instance.internals.storageName;
        let storageArray = sessionStorage.getObject( storageName ) || [];

        const name = fieldEl.name;
        const value = fieldEl.value;
        const isRequiredFrom = fieldEl.matches('[data-required-from]');
        const isMultiChoice = fieldEl.matches('[data-checks]');
        const isRequireMore = fieldEl.matches('[data-require-more]');
        const reqMoreEl = isRequiredFrom ? document.querySelector(fieldEl.getAttribute('data-required-from')) : null;

        const inArrayRequireMorePos = getAnswerIndex( storageArray, name + '-more' );            
        if( !isRequireMore && !isRequiredFrom && inArrayRequireMorePos >= 0 ){
            // WHEN CHECKING A RADIO WITHOUT RELATED ANSWER ( IN A LIST OF RADIOS WITH ONE REQ-MORE ) => REMOVE RELATED ANSWER FROM STORAGE
            storageArray.splice(inArrayRequireMorePos, 1);
        }

        const inArrayPos = getAnswerIndex( storageArray, name, (isMultiChoice ? value : false) );
        if( inArrayPos >= 0 ){
            // REMOVE ITEM FROM LS
            storageArray.splice(inArrayPos, 1);
            if( (isMultiChoice && fieldEl.checked) || (!isMultiChoice && value !== '') ){
                // ADD ITEM TO LS
                storageArray.push( { name, value } );
            }
        } else if( value !== '' ){
            if( isRequiredFrom ){
                const reqMorePos = getAnswerIndex( storageArray, reqMoreEl.name );
                if( reqMorePos >= 0 ){
                    storageArray.splice(reqMorePos, 1);
                }
                storageArray.push( { name: reqMoreEl.name, value: reqMoreEl.value } );
            }
            storageArray.push( { name, value } );
        }

        sessionStorage.setObject( storageName, storageArray );
    }

    // BASED ON JSON DATA, FORCE REQUIRED FIELDS TO BE VALIDATED
    if( questionObj.required && !fieldEl.required && !fieldEl.matches('[data-required-from]') ){
        fieldEl.required = true;
        instance.validateField(fieldEl);
    }
}
