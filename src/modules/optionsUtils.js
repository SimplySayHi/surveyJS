
import { fieldsStringSelectorSurvey, getQuestionId, isEmptyObject } from './helpers';
import { getQuestionObject } from './utils/getQuestionObject';

export const optionsUtils = {
    formOptions: {

        getFormData: function getFormData_surveyDefault(){
            const instance = this;
            const formEl = instance.formEl;
            const fieldsList = Array.from( formEl.closest('[data-surveyjs-wrapper]').querySelectorAll(fieldsStringSelectorSurvey) );
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
                //                  value:      THE ANSWER VALUE
                //                  related:    IF THE ANSWER IS REQUIRED FROM ANOTHER ANSWER (SEE BELOW)
                const questionId = getQuestionId(fieldEl),
                      qaObj = {
                        question: questionId,
                        answer: {
                            value: fieldEl.value || ''
                        }
                    };

                // A FIELD WITH ATTRIBUTE 'data-required-from' IS MANAGED TOGETHER WITH ITS RELATED FIELD ( WHICH HAS ATTRIBUTE 'data-require-more' )
                // IF QUESTION ID IS EMPTY -> SKIP THE FIELD ( USEFUL FOR FORM FIELDS OUTSIDE THE SURVEY BODY )
                if(
                    fieldEl.matches('[data-required-from]') || 
                    questionId === '' || 
                    isEmptyObject( getQuestionObject(instance.data.questions, questionId) )
                ){ return; }

                if( type === 'radio' ){
                    const containerEl = fieldEl.closest('form') ? formEl : fieldEl.closest(instance.options.fieldOptions.questionContainer);
                    const checkedEl = containerEl.querySelector('[name="'+ name +'"]:checked');

                    qaObj.answer.value = (checkedEl && checkedEl.value) || '';

                    // FOR RADIO THAT REQUIRE THE USER TO GIVE ONE MORE ANSWER
                    if( checkedEl && checkedEl.matches('[data-require-more]') ){
                        qaObj.answer.related = formEl.querySelector('[data-required-from="#'+ checkedEl.id +'"]').value;
                    }
                }

                if( type === 'checkbox' && fieldEl.matches('[data-checks]') ){
                    qaObj.answer.value = [];
                    Array.from(formEl.querySelectorAll('[name="'+ name +'"]:checked')).forEach(el => {
                        qaObj.answer.value.push( el.value );
                    });
                }
                
                obj.answers.push( qaObj );
            });
        
            return obj;
        }
    
    }
}
