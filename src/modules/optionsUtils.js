
import { fieldsStringSelectorSurvey, isEmptyObject, mergeObjects } from './helpers';
import { getQuestionObject } from './utils/getQuestionObject';

export const defaultCallbacksInOptions = {
    formOptions: {

        beforeSend: function beforeSend_surveyDefault( data ){
            let isHacking = false;
            const instance = this;
            const surveyContEl = instance.formEl.closest('[data-surveyjs-container]');
            const fieldsList = Array.from( surveyContEl.querySelectorAll(fieldsStringSelectorSurvey) );

            let fieldNameCheck = '',
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

                const questionIdEl = fieldEl.closest('[data-question-id]');
                const questionId = questionIdEl ? questionIdEl.getAttribute('data-question-id') : '';
                const questionObj = getQuestionObject( instance.data, questionId );

                // BASED ON SURVEY JSON FILE, FORCE REQUIRED FIELDS TO BE VALIDATED
                // THIS AVOIDS USERS TO HACK THE SURVEY, FOR EXAMPLE REMOVING required ATTRIBUTE FROM THE HTML
                if( questionId !== '' && questionObj && typeof questionObj.required !== 'undefined' ){

                    const isRequiredFrom = fieldEl.matches('[data-required-from]');
                    const reqMoreEl = document.querySelector(fieldEl.getAttribute('data-required-from'));
                    if( !isRequiredFrom || ( isRequiredFrom && reqMoreEl.checked ) ){
                        if( !fieldEl.required ){
                            // FIELD IS NOT REQUIRED BUT IT SHOULD => USER HACKED FIELD
                            isHacking = true;
                        }
                        fieldEl.required = true;
                    }
                    
                }

            });

            if( isHacking ){
                // USER IS HACKING FORM ( REMOVING ATTRIBUTE required FROM A FIELD )
                // => FORCE VALIDATION TO SHOW ERROR AND STOP SUBMIT
                const fieldOptions = mergeObjects({}, instance.options.fieldOptions, {focusOnRelated: false});
                return instance.validateForm( fieldOptions )
                    .then(formRes => {
                        data.stopExecution = true;
                        return data;
                    });
            }
            return data;
        },

        getFormData: function getFormData_surveyDefault(){
            const formEl = this.formEl;
            const instance = formEl.formjs;
            const fieldsList = Array.from( formEl.closest('[data-surveyjs-container]').querySelectorAll(fieldsStringSelectorSurvey) );
            const obj = {
                    answers: [],
                    id: instance.data.id
                };
            let fieldNameCheck = '',
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
                const questionIdEl = fieldEl.closest('[data-question-id]'),
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
                if( fieldEl.matches('[data-required-from]') || questionId === '' || isEmptyObject(getQuestionObject( instance.data, questionId )) ){ return; }
                                    
                if( fieldEl.matches('textarea') ){
                    qaObj.answer.id_answer = [ '' ];
                    qaObj.answer.text = fieldValue;
                }

                if( type === 'radio' ){
                    const containerEl = (fieldEl.closest('form') ? formEl : fieldEl.closest('[data-formjs-question]') ),
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
        }
    
    }
}
