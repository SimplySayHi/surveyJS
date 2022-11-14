
import { arrayMove, getQuestionId, isEmptyObject, isPlainObject }  from '../helpers';
import { getQuestionObject }                        from '../utils/getQuestionObject';
import { getAnswerIndex }                           from '../utils/getAnswerIndex';

export function validationEnd( event ){
    const $field = event.detail.$field;
    const errors = event.detail.errors;
    const instance = $field.closest('form').surveyjs;
    const options = instance.options;
    const $errorsWrapper = $field.closest( options.fieldOptions.questionContainer ).querySelector('[data-surveyjs-errors]');
    
    const questionId = getQuestionId($field);
    const questionObj = getQuestionObject(instance.data.questions, questionId);

    // IF IT'S NOT A SURVEY QUESTION -> SKIP
    if( isEmptyObject(questionObj) ){ return true; }

    // MANAGE MULTIPLE ERROR MESSAGES
    if( $errorsWrapper && errors && isPlainObject(questionObj.errorMessage) ){
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

        $errorsWrapper.innerHTML = errorsHTML;
    }

    // MANAGE ITEMS IN LOCAL STORAGE ( IF AVAILABLE AND ACTIVE )
    if( !event.detail.isCheckingForm && options.useWebStorage && !$field.matches('[data-exclude-storage]') ){
        const storageName = instance.internals.storageName;
        let storageArray = sessionStorage.getObject( storageName ) || [];

        const name = $field.name;
        const value = $field.value;
        const isRequiredFrom = $field.matches('[data-required-from]');
        const isMultiChoice = $field.matches('[data-checks]');
        const isRequireMore = $field.matches('[data-require-more]');
        const $reqMore = isRequiredFrom ? document.querySelector($field.getAttribute('data-required-from')) : null;

        const inArrayRequireMorePos = getAnswerIndex( storageArray, name + '-more' );            
        if( !isRequireMore && !isRequiredFrom && inArrayRequireMorePos >= 0 ){
            // WHEN CHECKING A RADIO WITHOUT RELATED ANSWER ( IN A LIST OF RADIOS WITH ONE REQ-MORE ) => REMOVE RELATED ANSWER FROM STORAGE
            storageArray.splice(inArrayRequireMorePos, 1);
        }

        const inArrayPos = getAnswerIndex( storageArray, name, (isMultiChoice ? value : false) );
        if( inArrayPos >= 0 ){
            // REMOVE ITEM FROM LS
            storageArray.splice(inArrayPos, 1);
            if( (isMultiChoice && $field.checked) || (!isMultiChoice && value !== '') ){
                // ADD ITEM TO LS
                storageArray.push( { name, value } );
            }
        } else if( value !== '' ){
            if( isRequiredFrom ){
                const reqMorePos = getAnswerIndex( storageArray, $reqMore.name );
                if( reqMorePos >= 0 ){
                    storageArray.splice(reqMorePos, 1);
                }
                storageArray.push( { name: $reqMore.name, value: $reqMore.value } );
            }
            storageArray.push( { name, value } );
        }

        sessionStorage.setObject( storageName, storageArray );
    }

    // BASED ON JSON DATA, FORCE REQUIRED FIELDS TO BE VALIDATED
    if( questionObj.required && !$field.required && !$field.matches('[data-required-from]') ){
        $field.required = true;
        instance.validateField($field);
    }
}
