
import { fieldsStringSelectorSurvey, isEmptyObject, mergeObjects } from './helpers';
import { getQuestionObject } from './utils/getQuestionObject';

export const defaultCallbacksInOptions = {
    formOptions: {

        beforeSend: function beforeSend_surveyDefault( data ){
            const surveyjs = this.formEl.surveyjs;
            const surveyContEl = this.formEl.closest('[data-surveyjs-container]');
            const formInstance = surveyjs.internals.formInstance;
            const fieldsList = Array.from( surveyContEl.querySelectorAll(fieldsStringSelectorSurvey) );

            let fieldNameCheck = '',
                fieldTypeCheck = '';

            fieldsList.forEach(function( fieldEl ){
                
                const type = fieldEl.type,
                      name = fieldEl.name;

                // IF A FIELD HAS THE SAME NAME ATTRIBUTE AND IT IS OF THE SAME TYPE
                // SKIP THE REST OF THE CODE FOR THIS FIELD AND GO TO THE NEXT
                if( (name === fieldNameCheck && type === fieldTypeCheck) ){ return; }
                
                if( !fieldEl.matches('[data-required-from]') ){
                    fieldNameCheck = name;
                    fieldTypeCheck = type;
                }

                const questionIdEl = fieldEl.closest('[data-question-id]');
                const questionId = questionIdEl ? questionIdEl.getAttribute('data-question-id') : '';
                const questionObj = getQuestionObject.call( surveyjs, questionId );

                // BASED ON SURVEY JSON FILE, FORCE REQUIRED FIELDS TO BE VALIDATED
                // THIS AVOIDS USERS TO HACK THE SURVEY, FOR EXAMPLE REMOVING required ATTRIBUTE FROM THE HTML
                if( questionId !== '' && questionObj && typeof questionObj.required !== 'undefined' ){

                    const isRequiredFrom = fieldEl.matches('[data-required-from]');
                    const reqMoreEl = document.querySelector(fieldEl.getAttribute('data-required-from'));
                    if( !isRequiredFrom || ( isRequiredFrom && reqMoreEl.checked ) ){
                        fieldEl.required = true;
                    }
                    
                }

            });

            const fieldOptions = mergeObjects({}, surveyjs.options.fieldOptions, {focusOnRelated: false});
            return new Promise(resolve => {
                formInstance.validateForm( fieldOptions ).then(formRes => {
                    if( !formRes.result ){
                        data.stopExecution = true;
                    }
                    resolve( data );
                });
            });
        },

        getFormData: function getFormData_surveyDefault(){
            const formEl = this.formEl;
            const survey = formEl.surveyjs;
            const fieldsList = Array.from( formEl.closest('[data-surveyjs-container]').querySelectorAll(fieldsStringSelectorSurvey) );
            let obj = {
                    answers: [],
                    id: survey.data.id
                },
                fieldNameCheck = '',
                fieldTypeCheck = '';

            fieldsList.forEach(fieldEl => {
                const type = fieldEl.type,
                      name = fieldEl.name;

                // IF A FIELD HAS THE SAME NAME ATTRIBUTE AND IT IS OF THE SAME TYPE
                // SKIP THE REST OF THE CODE FOR THIS FIELD AND GO TO THE NEXT
                if( (name === fieldNameCheck && type === fieldTypeCheck) ){ return; }
                
                if( !fieldEl.matches('[data-required-from]') ){
                    fieldNameCheck = name;
                    fieldTypeCheck = type;
                }

                // EACH QUESTION HAS ITS OWN OBJECT ( qaObj ) THAT CONTAINS THE RELATED DATA:
                // question:    THE QUESTION ID ( undefined FOR QUESTIONS WITH ATTRIBUTE data-required-form - will be skipped later )
                // answer       AN OBJECT THAT CONTAINS THE FOLLOWS:
                //                  id_answer:      THE ANSWER ID
                //                  text:           IF THE FIELD IS A TEXTAREA
                //                  attributes:     IF THE ANSWER IS NESTED OR IS REQUIRED FROM ANOTHER ANSWER (SEE BELOW)
                var questionIdEl = fieldEl.closest('[data-question-id]'),
                    questionId = questionIdEl ? questionIdEl.getAttribute('data-question-id') : '',
                    fieldValue = fieldEl.value,
                    qaObj = {
                        question: questionId,
                        answer: {
                            id_answer: [ fieldValue ]
                        }
                    };

                // A FIELD WITH ATTRIBUTE 'data-required-from' IS MANAGED TOGETHER WITH ITS RELATED FIELD ( WHICH HAS ATTRIBUTE 'data-require-more' )
                // IF QUESTION ID IS EMPTY -> SKIP THE FIELD ( USEFUL FOR FORM FIELDS OUTSIDE THE SURVEY BODY )
                if( fieldEl.matches('[data-required-from]') || questionId === '' || isEmptyObject(getQuestionObject.call( survey, questionId )) ){ return; }
                                    
                if( fieldEl.matches('textarea') ){
                    qaObj.answer.id_answer = [ '' ];
                    qaObj.answer.text = fieldValue;
                }

                if( type === 'radio' ){
                    var containerEl = (fieldEl.closest('form') ? formEl : fieldEl.closest('[data-formjs-question]') ),
                        elem = containerEl.querySelector('[name="'+ name +'"]:checked');
                    
                    if( elem ){
                        // FOR RADIO THAT REQUIRE THE USER TO GIVE ONE MORE ANSWER
                        if( elem.matches('[data-require-more]') ){
                            qaObj.answer.attributes = formEl.querySelector('[data-required-from="#'+ elem.id +'"]').value.trim();
                        }
                        
                        if( elem.matches('[data-nested-index]') ){
                            qaObj.answer.attributes = elem.getAttribute('data-nested-index');
                        }
                        
                        qaObj.answer.id_answer = [ elem.value.trim() ];
                    } else {
                        qaObj.answer.id_answer = [ '' ];
                    }
                }

                if( type === 'checkbox' && fieldEl.matches('[data-checks]') ){
                    qaObj.answer.id_answer = [];
                    Array.from(formEl.querySelectorAll('[name="'+ name +'"]:checked')).forEach(el => {
                        qaObj.answer.id_answer.push( el.value.trim() );
                    });
                }
                
                obj.answers.push( qaObj );
            });
        
            return obj;
        },

        onSubmitSuccess: function onSubmitSuccess_surveyDefault(){
            // REMOVE SURVEY LOCAL STORAGE
            const survey = this.formEl.surveyjs;
            if( self.options.useLocalStorage ){
                localStorage.removeItem( survey.internals.localStorageName );
            }
        }
    
    }
}
