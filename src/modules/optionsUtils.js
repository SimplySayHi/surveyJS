
import { fieldsStringSelectorSurvey, getQuestionId, isEmptyObject } from './helpers';
import { getQuestionObject } from './utils/getQuestionObject';

export const optionsUtils = {
    formOptions: {

        getFormData: function getFormData_surveyDefault( $filteredFields, trimValues ){
            const instance = this;
            const $form = instance.$form;
            const fieldsList = Array.from( $form.closest('[data-surveyjs-wrapper]').querySelectorAll(fieldsStringSelectorSurvey) );
            const obj = {
                    answers: [],
                    id: instance.data.id
                };
            
            let fieldNameCheck = '';
            let fieldTypeCheck = '';

            fieldsList.forEach($field => {
                const type = $field.type;
                const name = $field.name;

                if( name === fieldNameCheck && type === fieldTypeCheck ){ return; }
                
                if( !$field.matches('[data-required-from]') ){
                    fieldNameCheck = name;
                    fieldTypeCheck = type;
                }

                // EACH QUESTION HAS ITS OWN OBJECT ( qaObj ) THAT CONTAINS THE RELATED DATA:
                // question:    THE QUESTION ID ( undefined FOR QUESTIONS WITH ATTRIBUTE data-required-form - will be skipped later )
                // answer       AN OBJECT THAT CONTAINS THE FOLLOWS:
                //                  value:      THE ANSWER VALUE
                //                  related:    IF THE ANSWER IS REQUIRED FROM ANOTHER ANSWER (SEE BELOW)
                const questionId = getQuestionId($field);
                const qaObj = {
                        question: questionId,
                        answer: {
                            value: trimValues ? $field.value.trim() : ($field.value || '')
                        }
                    };

                // A FIELD WITH ATTRIBUTE 'data-required-from' IS MANAGED TOGETHER WITH ITS RELATED FIELD ( WHICH HAS ATTRIBUTE 'data-require-more' )
                // IF QUESTION ID IS EMPTY -> SKIP THE FIELD ( USEFUL FOR FORM FIELDS OUTSIDE THE SURVEY BODY )
                if(
                    $field.matches('[data-required-from]') || 
                    questionId === '' || 
                    isEmptyObject( getQuestionObject(instance.data.questions, questionId) )
                ){ return; }

                if( type === 'radio' ){
                    const $container = $field.closest('form') ? $form : $field.closest(instance.options.fieldOptions.questionContainer);
                    const $checked = $container.querySelector('[name="'+ name +'"]:checked');

                    qaObj.answer.value = ($checked && $checked.value) || '';

                    // FOR RADIO THAT REQUIRE THE USER TO GIVE ONE MORE ANSWER
                    if( $checked && $checked.matches('[data-require-more]') ){
                        qaObj.answer.related = $form.querySelector('[data-required-from="#'+ $checked.id +'"]').value;
                    }
                }

                if( type === 'checkbox' && $field.matches('[data-checks]') ){
                    qaObj.answer.value = [];
                    Array.from($form.querySelectorAll('[name="'+ name +'"]:checked')).forEach($el => {
                        qaObj.answer.value.push( $el.value );
                    });
                }
                
                obj.answers.push( qaObj );
            });
        
            return obj;
        }
    
    }
}
