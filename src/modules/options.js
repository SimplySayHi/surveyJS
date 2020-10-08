
import { optionsUtils } from './optionsUtils';

export const options = {
    cssClasses: {
        checkbox:           'form-check-input',
        field:              'form-control',
        file:               'form-control-file',
        label:              'form-check-label',
        radio:              'form-check-input',
        wrapper: {
            checkbox:       'form-check',
            field:          '',
            radio:          'form-check'
        }
    },
    fieldErrorFeedback:     true,
    formOptions: {
        getFormData:        optionsUtils.formOptions.getFormData
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
        error:      '<div class="surveyjs-error-message">{{errorMessage}}</div>',
        
        input:      '<input {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-input surveyjs-{{answerType}} {{fieldClasses}}" />',

        label:      '<label for="{{answerCode}}" class="surveyjs-label {{labelClasses}}">{{labelString}}</label>',

        loading:    '<div class="surveyjs-loading" data-surveyjs-loading>Loading...</div>',
        
        select:     '<select {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-select {{fieldClasses}}">'+
                        '{{optionsHtml}}'+
                    '</select>',
        
        textarea:   '<textarea {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}" class="surveyjs-textarea {{fieldClasses}}"></textarea>',

        wrapper: {
            field:      '<div class="surveyjs-field-wrapper surveyjs-wrapper-{{answerType}} {{wrapperClasses}}">'+
                            '{{fieldTemplate}}'+
                            '{{labelTemplate}}'+
                        '</div>',

            errors:     '<div class="surveyjs-errors-wrapper" data-surveyjs-errors>{{errorTemplates}}</div>',
            
            nested:     '<div class="surveyjs-field-wrapper surveyjs-nested-parent surveyjs-wrapper-{{answerType}}">'+
                            '{{labelTemplate}}'+
                            '<div class="surveyjs-nested-container surveyjs-field-indent">'+
                                '{{nestedFieldsHTML}}'+
                            '</div>'+
                        '</div>',

            question:   '<div class="surveyjs-question-wrapper" data-question-id="{{questionId}}" data-formjs-question>'+
                            '<div class="surveyjs-question-body">'+
                                '<div class="surveyjs-question-text">{{questionText}}</div>'+
                                '<div class="surveyjs-answers-wrapper form-group">'+
                                    '{{answersHTML}}'+
                                    '{{errorsHTML}}'+
                                '</div>'+
                            '</div>'+
                        '</div>',
            
            related:    '<div class="surveyjs-field-wrapper input-group {{wrapperClasses}}">'+
                            '<div class="input-group-prepend">'+
                                '<div class="input-group-text form-check surveyjs-wrapper-radio">'+
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
