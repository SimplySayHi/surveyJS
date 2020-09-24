var $surveyCont = $('[data-surveyjs-container]'),
    $surveyForm = $surveyCont.find('[data-surveyjs-form]'),
    $surveyBtn = $surveyForm.find('.surveyjs-submit-btn');

var formEl = document.querySelector('[data-surveyjs-form]');
var options = {
        url: '../json/survey.json',
        // FOR BOOTSTRAP 4 CUSTOM INPUTS
        cssClasses: {
            checkbox:   'custom-control-input',
            radio:      'custom-control-input',
            label:      'custom-control-label',
            select:     'custom-select'
        },
        templates: {
            question:   '<div class="st-item" data-title="#{{questionNumber}}">'+
                            '<div data-question-id="{{questionId}}" data-question-index="{{questionNumber}}" data-formjs-question class="surveyjs-question-box clearfix">'+
                                '<div class="surveyjs-question-body">'+
                                    '<div class="surveyjs-question-text">{{questionText}}</div>'+
                                    '<div class="surveyjs-answers-box form-group clearfix">'+
                                        '{{answersHtml}}'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>',

            // FOR BOOTSTRAP 4 CUSTOM INPUTS
            input:  '<div class="surveyjs-single-answer surveyjs-input-container surveyjs-answer-{{answerType}} custom-control form-check custom-{{answerType}}" data-answer-index="{{answerIndex}}">'+
                        '{{inputTagCode}}'+
                        '{{labelTagCode}}'+
                    '</div>',
            inputGroup: '<div class="surveyjs-single-answer input-group" data-answer-index="{{answerIndex}}">'+
                            '<div class="input-group-prepend">'+
                                '<div class="input-group-text custom-control custom-radio surveyjs-answer-{{answerType}}">'+
                                    '<input type="{{answerType}}" name="surveyjs-answer-{{questionNumber}}" id="{{answerCode}}" data-answer-id="{{answerId}}" value="{{answerIdValue}}" {{attrRequired}} data-require-more="" class="surveyjs-input surveyjs-radio custom-control-input" />'+
                                    '<label for="{{answerCode}}" class="surveyjs-label custom-control-label">{{answerString}}</label>'+
                                '</div>'+
                            '</div>'+
                            '{{relatedAnswerField}}'+
                        '</div>'
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
        console.log('onInitSuccess', ajaxData);

        var surveyFormEl = this.formEl,
            surveyBody = surveyFormEl.querySelector('.surveyjs-body'),
            initStatus = ajaxData.status;
        
        if( initStatus === 'success' ){
            $('.stackSlider').stackslider({ piles : false });
        } else {
            var elemToRemove = surveyFormEl.querySelector('.surveyjs-footer');
            elemToRemove.parentNode.removeChild(elemToRemove);
            surveyBody.innerHTML = '<div class="surveyjs-message">Loading Error. Please, reload the page.</div>';
        }
    },
    onInitError = function( error ){
        var surveyFormEl = this.formEl;

        console.log('onInitError', error);
        console.log('SURVEY init(\''+ surveyFormEl.getAttribute('action') +'\') RETURNED AN ERROR:');
        
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
}, false);

formEl.addEventListener('fjs.form:validation', function(event){
    console.log(event.type);
    onValidation(event.data.fields);
}, false);

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
            var surveyContEl = formEl.closest('[data-surveyjs-container]');
            surveyContEl.innerHTML = surveyContEl.innerHTML + '<div class="alert alert-danger text-center" role="alert"><p class="my-3">Generic error, please retry.</p></div>';
        })
        .finally(function(){
            console.log('finally');
            formEl.querySelector('button[type="submit"]').classList.remove('surveyjs-submit-sending');
        });
}, false);

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
