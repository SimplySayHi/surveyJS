
var $surveyCont = $('[data-surveyjs-wrapper]');
var formEl = document.querySelector('[data-surveyjs-form]');
var options = {
        url: '../json/survey.json',
        cssClasses: {
            select: 'custom-select'
        },
        formOptions: {
            beforeSend: function beforeSend_surveyDemo_1( data ){
                console.log('Survey beforeSend_surveyDemo_1', data);

                var surveyContEl = this.formEl.closest('[data-surveyjs-wrapper]');
                var surveyBtn = this.formEl.querySelector('button[type="submit"]');

                if( !data.stopExecution ){
                    surveyBtn.classList.add('surveyjs-submit-sending');
                    var elemToRemove = surveyContEl.querySelector('.alert');
                    if(elemToRemove){
                        elemToRemove.parentNode.removeChild(elemToRemove);
                    }
                }

                return Promise.resolve(data);
            }
        }
    };

var onInitSuccess = function( response ){
        if( response.status !== 'success' ){
            onInitError.call(mySurvey, response);
        }
    },
    onInitError = function( error ){
        var surveyFormEl = this.formEl;                
        surveyFormEl.querySelector('.surveyjs-body').innerHTML = '<div class="surveyjs-message">Loading Error. Please, reload the page.</div>';
    },
    onValidation = function( fields ){
        console.log( 'onValidation', fields );
        if( fields.length > 1 ){
            var isFormSubmitting = formEl.classList.contains('is-submitting');
            var submitDisabled = formEl.querySelector('[type="submit"]').disabled;

            if( (submitDisabled && !isFormSubmitting) || !isFormSubmitting ){
                return;
            }
            
            var unanswered = fields.filter(function(obj){
                return !obj.result
            });
            if( unanswered.length > 0 ){
                var contEl = unanswered[0].fieldEl.closest('[data-formjs-question]');
                scrollToElement(contEl);
            }
            
        } else {
            var fieldObj = fields[0];
            if( fieldObj.fieldEl.name === 'prova-00' ){
                var btn = fieldObj.fieldEl.closest('form').querySelector('[type="submit"]'),
                    isValidValue = fieldObj.fieldEl.value.trim().length > 0;

                btn.disabled = !isValidValue;
            }
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
        .then(function(response){
            console.log('then', response);
            if( response.status !== 'success' ){
                return Promise.reject(response);
            }
            // REMOVE THE SURVEY FROM THE PAGE
            $surveyCont.remove();
            // OPEN THE BOOTSTRAP MODAL TO SHOW A CONGRATULATION MESSAGE
            $('#modal-notification').modal('show');
        })
        .catch(function(error){
            console.log('catch', error);
            // PRINT THE ERROR MESSAGE AFTER THE FORM
            var surveyContEl = formEl.closest('[data-surveyjs-wrapper]');
            surveyContEl.innerHTML = surveyContEl.innerHTML + '<div class="alert alert-danger text-center mx-3 mb-2" role="alert"><p class="my-3">Generic error, please retry.</p></div>';
        })
        .finally(function(){
            console.log('finally');
            formEl.querySelector('button[type="submit"]').classList.remove('surveyjs-submit-sending');
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
});

var mySurvey = new Survey( formEl, options );
