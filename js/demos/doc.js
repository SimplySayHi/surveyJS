
var $surveyCont = $('[data-surveyjs-wrapper]'),
    $surveyForm = $surveyCont.find('[data-surveyjs-form]'),
    $surveyBtn = $surveyForm.find('.surveyjs-submit-btn');

var formEl = document.querySelector('[data-surveyjs-form]');
var options = {
        url: 'json/survey.json',
        cssClasses: {
            select: 'custom-select'
        },
        templates: {
            question:   '<div class="st-item" data-title="#{{questionNumber}}">'+
                            '<div data-question-id="{{questionId}}" data-formjs-question class="surveyjs-question-wrapper">'+
                                '<div class="surveyjs-question-body">'+
                                    '<div class="surveyjs-question-text">{{questionText}}</div>'+
                                    '<div class="surveyjs-answers-wrapper form-group">'+
                                        '{{answersHTML}}'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>',

            wrapper: {
                default: '<div class="surveyjs-field-container surveyjs-wrapper-{{answerType}} abc-{{answerType}}">'+
                            '{{fieldTemplate}}'+
                            '{{labelTemplate}}'+
                        '</div>',
                
                related: '<div class="surveyjs-field-wrapper input-group {{wrapperClasses}}">'+
                            '<div class="input-group-prepend form-check abc-radio surveyjs-answer-radio">'+
                                '<div class="input-group-text">'+
                                    '{{fieldTemplate}}'+
                                    '{{labelTemplate}}'+
                                '</div>'+
                            '</div>'+
                            '{{relatedFieldHTML}}'+
                        '</div>'
            }
        },
        formOptions: {
            beforeSend: function beforeSend_doc( data ){
                console.log('Survey formOptions.beforeSend call...', data);

                if( !data.stopExecution ){
                    $surveyBtn.addClass('surveyjs-submit-sending');
                    $surveyCont.find('.alert').remove();
                }

                return Promise.resolve(data);
            }
        }
};

var onInitSuccess = function( ajaxData ){        
        if( ajaxData.status === 'success' ){
            console.log('init slider');
            $('.stackSlider').stackslider({ piles : false });
        } else {
            onInitError.call(this);
        }
    },
    onInitError = function( error ){
        var surveyFormEl = this.formEl;
        surveyFormEl.querySelector('.surveyjs-body').innerHTML = '<div class="surveyjs-message">Loading Error. Please, reload the page.</div>';
    },
    onValidation = function( fields ){
        console.log( 'onValidation', fields );
        if( fields.length > 1 ){
            if( !formEl.querySelector('[type="submit"]').disabled ){
                return;
            }
            // GO TO THE FIRST UNANSWERED QUESTION
            var $stWrapper = $('.surveyjs-form .st-wrapper'),
                activeIndex = $stWrapper.find('.st-center').index(),
                $invalidField = (function(){
                    for( var f=0; f<fields.length; f++ ){
                        var obj = fields[f];
                        if( !obj.result && !$(obj.fieldEl).is('[data-name="bind-surveyjs-answer"]') ){
                            return $(obj.fieldEl);
                        }
                    }
                    return $();
                })();
            
            if( $invalidField.length ){
                
                var invalidIndex = $invalidField.closest('.st-item').index(),
                    clickDirection = ( activeIndex > invalidIndex ? 'prev' : 'next' ),
                    $btn = ( clickDirection === 'prev' ? $stWrapper.find('nav > span:first-child') : $stWrapper.find('nav > span:last-child') ),
                    clicksLength = ( clickDirection === 'prev' ? activeIndex - invalidIndex : invalidIndex - activeIndex );

                for(var i=0; i<clicksLength; i++){
                    $btn.trigger('click.stackslider');
                }
                
            }
        } else {
            console.log('validating field ', fields[0]);
        }
    }
;

formEl.addEventListener('fjs.field:validation', function(event){
    console.log(event.type);
    onValidation([event.data]);
});

formEl.addEventListener('fjs.form:validation', function(event){
    console.log(event.type);
    onValidation(event.data.fields);
});

formEl.addEventListener('fjs.form:submit', function(event){
    console.log(event.type);
    event.data
        .then(function(ajaxData){
            console.log('then', ajaxData);
            if( typeof ajaxData === 'string' ){
                try{
                    ajaxData = JSON.parse(ajaxData);
                } catch(error){
                    throw new Error('String returned from ajax call to "' + ajaxOptions.url + '" is not a valid JSON string');
                }
            }

            if( $.isPlainObject( ajaxData ) ){
                if( ajaxData.status === 'success' ){
                    // REMOVE THE SURVEY FROM THE PAGE
                    $surveyCont.remove();
                    // OPEN THE BOOTSTRAP MODAL TO SHOW A CONGRATULATION MESSAGE
                    $('#modal-notification').modal('show');
                } else {
                    // PRINT THE ERROR MESSAGE AFTER THE FORM
                    $surveyCont.append( '<div class="alert alert-danger text-center" role="alert"><p class="my-3">Generic error, please retry.</p></div>' );
                }
            }
        })
        .catch(function(error){
            console.log('catch', error);
            // PRINT THE ERROR MESSAGE AFTER THE FORM
            $surveyForm.closest('.surveyjs-wrapper').append( '<div class="alert alert-danger text-center" role="alert"><p class="my-3">Generic error, please retry.</p></div>' );
        })
        .finally(function(){
            console.log('finally');
            $surveyBtn.removeClass('surveyjs-submit-sending');
        });
});

formEl.addEventListener('sjs:init', function(event){
    console.log(event.type);
    event.data
        .then(function( data ){
            console.log('Survey init then');
            console.log(data);
            onInitSuccess.call(mySurvey, data);
        })
        .catch(function( error ){
            console.log('Survey init catch');
            console.log(error);
            onInitError.call(mySurvey, error);
        });
}, false);

var mySurvey = new Survey( formEl, options );
