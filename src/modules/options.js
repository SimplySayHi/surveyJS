
import { defaultCallbacksInOptions } from './optionsUtils';

export const options = {
    cssClasses: {
        checkbox:           'form-check-input',
        default:            'form-control',
        file:               'form-control-file',
        label:              'form-check-label',
        radio:              'form-check-input',
        select:             'form-control',
        textarea:           'form-control'
    },
    fieldErrorFeedback:     true,
    fieldOptions: {
        validateOnEvents:   'input change'
    },
    formOptions: {
        beforeSend:         [defaultCallbacksInOptions.formOptions.beforeSend],
        getFormData:        defaultCallbacksInOptions.formOptions.getFormData,
        onSubmitSuccess:    [defaultCallbacksInOptions.formOptions.onSubmitSuccess]
    },
    initAjaxOptions:        {
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
    lang:                   'en',
    templates: {
        fieldError: '<div class="surveyjs-field-error-message">{{fieldErrorMessage}}</div>',

        input:      '<div class="surveyjs-single-answer surveyjs-input-container surveyjs-answer-{{answerType}} form-check" data-answer-index="{{answerIndex}}">'+
                        '{{inputTagCode}}'+
                        '{{labelTagCode}}'+
                    '</div>',

        inputGroup: '<div class="surveyjs-single-answer input-group" data-answer-index="{{answerIndex}}">'+
                        '<div class="input-group-prepend">'+
                            '<div class="input-group-text form-check surveyjs-answer-{{answerType}}">'+
                                '<input type="{{answerType}}" name="surveyjs-answer-{{questionNumber}}" id="{{answerCode}}" data-answer-id="{{answerId}}" value="{{answerIdValue}}" {{attrRequired}} data-require-more="" class="surveyjs-input surveyjs-radio form-check-input" />'+
                                '<label for="{{answerCode}}" class="surveyjs-label form-check-label">{{answerString}}</label>'+
                            '</div>'+
                        '</div>'+
                        '{{relatedAnswerField}}'+
                    '</div>',
        
        inputTag:   '<input type="{{answerType}}" {{attrSubtype}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-input surveyjs-{{answerType}} {{fieldClass}}" id="{{answerCode}}" {{nestedAnswer}} data-answer-root="{{progIdsJoined}}" data-answer-id="{{answerId}}" value="{{answerIdValue}}" {{attrRequired}} {{validateIfFilled}} {{attrChecks}} {{attrRequiredFrom}} />',

        labelTag:   '<label for="{{answerCode}}" class="surveyjs-label {{labelClass}}">{{answerString}}</label>',

        question:   '<div data-question-id="{{questionId}}" data-question-index="{{questionNumber}}" data-formjs-question class="surveyjs-question-box clearfix">'+
                        '<div class="surveyjs-question-header">Question {{questionNumber}}</div>'+
                        '<div class="surveyjs-question-body">'+
                            '<div class="surveyjs-question-text">{{questionText}}</div>'+
                            '<div class="surveyjs-answers-box form-group clearfix">'+
                                '{{answersHtml}}'+
                                '{{fieldErrorTemplate}}'+
                            '</div>'+
                        '</div>'+
                    '</div>',

        select:     '<div class="surveyjs-single-answer surveyjs-answer-select" data-answer-index="{{answerIndex}}">'+
                        '{{selectTagCode}}'+
                    '</div>',

        selectTag:  '<select id="{{answerCode}}" name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-select {{fieldClass}}" {{attrRequired}} {{nestedAnswer}} data-answer-root="{{progIdsJoined}}" {{attrRequiredFrom}}>'+
                        '{{optionsHtml}}'+
                    '</select>',

        textarea:   '<div class="surveyjs-single-answer surveyjs-answer-textarea">'+
                        '<textarea id="{{answerCode}}" data-answer-id="{{answerId}}" {{nestedAnswer}} name="surveyjs-answer-{{questionNumber}}" {{attrRequired}} class="surveyjs-textarea {{fieldClass}}" {{answerMaxlength}} rows="6" placeholder="{{answerPlaceholder}}"></textarea>'+
                    '</div>'
    },
    useLocalStorage:        true
}
