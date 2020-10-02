
import { defaultCallbacksInOptions } from './optionsUtils';

export const options = {
    cssClasses: {
        checkbox:           'form-check-input',
        default:            'form-control',
        file:               'form-control-file',
        label:              'form-check-label',
        radio:              'form-check-input',
        wrapper: {
            checkbox:       'form-check',
            default:        '',
            radio:          'form-check'
        }
    },
    fieldErrorFeedback:     true,
    formOptions: {
        beforeSend:         [defaultCallbacksInOptions.formOptions.beforeSend],
        getFormData:        defaultCallbacksInOptions.formOptions.getFormData
    },
    initAjaxOptions: {
        cache:              'no-store',
        credentials:        'same-origin',
        headers: {
                            'Content-Type': 'application/json',
                            'Accept':       'application/json'
        },
        method:             'GET',
        mode:               'same-origin',
        redirect:           'follow',
        timeout:            0
    },
    messages:{
        maxChoice:                 'ANSWERS MAX',
        errorMessage:              'Answer is necessary.',
        errorMessageMultiChoice:   'You must choose from {{checksMin}} to {{checksMax}} answers.'
    },
    templates: {
        error:      '<div class="surveyjs-field-error-message">{{errorMessage}}</div>',
        
        input:      '<input {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-input surveyjs-{{answerType}} {{fieldClasses}}" />',

        label:      '<label for="{{answerCode}}" class="surveyjs-label {{labelClasses}}">{{labelString}}</label>',

        loading:    '<div class="surveyjs-loading" data-surveyjs-loading>Loading...</div>',

        question:   '<div data-question-id="{{questionId}}" data-formjs-question class="surveyjs-question-box">'+
                        '<div class="surveyjs-question-header">Question {{questionNumber}}</div>'+
                        '<div class="surveyjs-question-body">'+
                            '<div class="surveyjs-question-text">{{questionText}}</div>'+
                            '<div class="surveyjs-answers-box form-group">'+
                                '{{answersHTML}}'+
                                '{{errorsHTML}}'+
                            '</div>'+
                        '</div>'+
                    '</div>',
        
        select:     '<select {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-select {{fieldClasses}}">'+
                        '{{optionsHtml}}'+
                    '</select>',
        
        textarea:   '<textarea {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}" class="surveyjs-textarea {{fieldClasses}}"></textarea>',

        wrapper: {
            default:    '<div class="surveyjs-single-answer surveyjs-field-container surveyjs-answer-{{answerType}} {{wrapperClasses}}">'+
                            '{{fieldTemplate}}'+
                            '{{labelTemplate}}'+
                        '</div>',

            errors:     '<div class="surveyjs-errors-wrapper" data-surveyjs-errors>{{errorTemplates}}</div>',
            
            nested:     '<div class="surveyjs-nested-parent surveyjs-single-answer surveyjs-field-container surveyjs-answer-{{answerType}}">'+
                            '{{labelTemplate}}'+
                            '<div class="surveyjs-nested-container surveyjs-field-indent">'+
                                '{{nestedFieldsHTML}}'+
                            '</div>'+
                        '</div>',
            
            related:    '<div class="surveyjs-single-answer surveyjs-field-container input-group {{wrapperClasses}}">'+
                            '<div class="input-group-prepend">'+
                                '<div class="input-group-text form-check surveyjs-answer-radio">'+
                                    '{{fieldTemplate}}'+
                                    '{{labelTemplate}}'+
                                '</div>'+
                            '</div>'+
                            '{{relatedFieldHTML}}'+
                        '</div>'
        }
    },
    useWebStorage:          true
}
