
import { isEmptyObject, isFieldForChangeEvent } from './helpers';
import { getAnswerIndexInLocalStorage }         from './utils/getAnswerIndexInLocalStorage';
import { getQuestionObject }                    from './utils/getQuestionObject';

export const callbackFns = {

    // THIS WILL RUN BEFORE FORMJS VALIDATION FUNCTION SO THAT USERS CANNOT SKIP REQUIRED FIELDS VALIDATION ( WHILE TYPING )
    validation: function( event ){

        const self = this,
              eventName = event.type,
              fieldEl = event.target,
              containerEl = fieldEl.closest('[data-formjs-question]'),
              fieldValue = ( fieldEl.value ? fieldEl.value.trim() : fieldEl.value ),
              isMultiChoice = fieldEl.matches('[data-checks]'),
              isRequireMore = fieldEl.matches('[data-require-more]'),
              isRequiredFrom = fieldEl.matches('[data-required-from]'),
              reqMoreEl = ( isRequiredFrom ? containerEl.querySelector( fieldEl.getAttribute('data-required-from') ) : null );

        // VARS USED TO VALIDATE THE FILED IF IT IS REQUIRED
        const itemEl = ( isRequiredFrom ? reqMoreEl : fieldEl ),
              questionId = (itemEl.id ? itemEl.id.split('-')[1] : 'id-not-found'),
              isFieldForChangeEventBoolean = isFieldForChangeEvent(fieldEl),
              questionObj = getQuestionObject.call( self, questionId );

        // IF IT'S NOT A SURVEY QUESTION -> SKIP
        if( isEmptyObject(questionObj) ){ return true; }

        if(
            (isFieldForChangeEventBoolean && eventName === 'change') ||
            (!isFieldForChangeEventBoolean && eventName !== 'change')
        ){
            
            // MANAGE ITEMS IN LOCAL STORAGE ( IF AVAILABLE AND USABLE )
            if( self.options.useLocalStorage && !fieldEl.matches('[data-exclude-storage]') ){
                const inArrayPos = getAnswerIndexInLocalStorage.call( self, fieldEl.name, (isMultiChoice ? fieldValue : false) ),
                    inArrayRequireMorePos = getAnswerIndexInLocalStorage.call( self, fieldEl.name + '-more' );

                let localStorageArray = self.internals.localStorageArray;

                if( !isRequireMore && !isRequiredFrom && inArrayRequireMorePos !== -1 ){
                    localStorageArray.splice(inArrayRequireMorePos, 1);
                }

                if( inArrayPos !== -1 ){
                    if( isMultiChoice ){
                        if( !fieldEl.checked && localStorageArray[inArrayPos].value === fieldValue ){
                            // REMOVE ITEM FROM LS
                            localStorageArray.splice(inArrayPos, 1);
                        } else {
                            // ADD ITEM TO LS
                            localStorageArray.push( { field: fieldEl.name, value: fieldValue } );
                        }
                    } else {
                        if( fieldValue !== '' ){
                            localStorageArray[inArrayPos].value = fieldValue;
                        } else {
                            localStorageArray.splice(inArrayPos, 1); 
                        }
                    }
                } else {
                    if( fieldValue !== '' ){
                        if( isRequiredFrom && fieldValue !== '' ){
                            const oldFieldNamePos = getAnswerIndexInLocalStorage.call( self, reqMoreEl.name );

                            if( oldFieldNamePos !== -1 ){
                                localStorageArray.splice(oldFieldNamePos, 1);
                            }
                            localStorageArray.push( { field: reqMoreEl.name, value: reqMoreEl.value.trim() } );
                        }
                        localStorageArray.push( { field: fieldEl.name, value: fieldValue } );
                        if( isRequireMore ){
                            const elReqFromEl = fieldEl.closest('form').querySelector( '[data-required-from="#' + fieldEl.id + '"]' );
                            localStorageArray.push( { field: elReqFromEl.name, value: elReqFromEl.value.trim() } );
                        }
                    }
                }

                localStorage.setObject( self.internals.localStorageName, localStorageArray );
            }

            // BASED ON JSON DATA, FORCE REQUIRED FIELDS TO BE VALIDATED
            if( typeof questionObj.required !== 'undefined' ){
                fieldEl.required = true;
            }

        }
        
    }

}
