
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
        maxChoice:          'answers max',
        error:              'Answer is necessary.',
        errorMultiChoice:   'You must choose from {{checksMin}} to {{checksMax}} answers.'
    },
    showErrorMessage:       true,
    templates: {
        error:              '<div class="surveyjs-error-message">{{errorMessage}}</div>',
        
        input:              '<input {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-input surveyjs-{{answerType}} {{fieldClasses}}" />',

        label:              '<label for="{{answerCode}}" class="surveyjs-label {{labelClasses}}">{{labelString}}</label>',

        loading:            '<div class="surveyjs-loading" data-surveyjs-loading>Loading...</div>',
        
        select:             '<select {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-select {{fieldClasses}}">'+
                                '{{optionsHtml}}'+
                            '</select>',
        
        textarea:           '<textarea {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}" class="surveyjs-textarea {{fieldClasses}}"></textarea>',

        wrapper: {
            field:          '<div class="surveyjs-field-wrapper surveyjs-{{answerType}}-wrapper {{wrapperClasses}}">'+
                                '{{fieldTemplate}}'+
                                '{{labelTemplate}}'+
                            '</div>',
            
            nested:         '<div class="surveyjs-field-wrapper surveyjs-nested-wrapper">'+
                                '{{labelTemplate}}'+
                                '<div class="surveyjs-nested-inner">'+
                                    '{{nestedFieldsHTML}}'+
                                '</div>'+
                            '</div>',

            question:       '<div class="surveyjs-question-wrapper" data-question-id="{{questionId}}">'+
                                '<div class="surveyjs-question-text">{{questionText}}</div>'+
                                '<div class="surveyjs-answers-wrapper">'+
                                    '{{answersHTML}}'+
                                '</div>'+
                                '<div class="surveyjs-errors-wrapper" data-surveyjs-errors>{{errorTemplates}}</div>'+
                            '</div>',
            
            related:        '<div class="surveyjs-field-wrapper surveyjs-related-wrapper input-group">'+
                                '<div class="input-group-prepend">'+
                                    '<div class="surveyjs-radio-wrapper input-group-text form-check">'+
                                        '{{fieldTemplate}}'+
                                        '{{labelTemplate}}'+
                                    '</div>'+
                                '</div>'+
                                '{{relatedFieldHTML}}'+
                            '</div>'
        }
    }
}
