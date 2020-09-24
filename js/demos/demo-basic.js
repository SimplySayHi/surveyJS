
var $surveyCont = $('[data-surveyjs-container]');

/* ADD A NEW LANGUAGE */
/* var myLang = {
    loadingBox:         '<div class="surveyjs-loading" data-surveyjs-loading><i class="glyphicon glyphicon-refresh icon-spin"></i> DE Caricamento in corso...</div>',
    selectFirstOption:  'DE Seleziona una risposta...',
    textareaPlaceholder:'DE Scrivi la tua risposta...',
    maxChoiceText:      'DE RISPOSTE MAX',
    fieldErrorMessage:  'DE &Egrave; necessario rispondere.',
    fieldErrorMessageMultiChoice:  'DE &Egrave; necessario rispondere max-choice.'
};
Survey.addLanguage( 'de', myLang ); */


/* OVERRIDE SOME VALUES OF AN EXISTING LANGUAGE */
/* var myLang = {
    selectFirstOption:  'IT Seleziona una risposta...',
    textareaPlaceholder:'IT Scrivi la tua risposta...',
    maxChoiceText:      'IT RISPOSTE MAX',
};
Survey.addLanguage( 'it', myLang ); */

var formEl = document.querySelector('[data-surveyjs-form]');
var options = {
        //lang: 'de',
        url: '../json/survey.json',
        cssClasses: {
            select: 'custom-select'
        },
        // initAjaxOptions: { timeout: 1 },
        fieldOptions: {
            onValidationCheckAll: false
        },
        formOptions: {
            beforeSend: [
                function beforeSend_surveyDemo_1( data ){
                    console.log('Survey beforeSend_surveyDemo_1', data);

                    var surveyContEl = this.formEl.closest('[data-surveyjs-container]');
                    var surveyBtn = this.formEl.querySelector('button[type="submit"]');

                    if( !data.stopExecution ){
                        surveyBtn.classList.add('surveyjs-submit-sending');
                        var elemToRemove = surveyContEl.querySelector('.alert');
                        if(elemToRemove){
                            elemToRemove.parentNode.removeChild(elemToRemove);
                        }
                    }

                    return Promise.resolve(data);
                },
                function beforeSend_surveyDemo_2( data ){
                    console.log('Survey beforeSend_surveyDemo_2', data);
                    data.formData.prova = 'ciao';
                    //data.stopExecution = true;
                    return Promise.resolve(data);
                },
                function beforeSend_surveyDemo_3( data ){
                    console.log('Survey beforeSend_surveyDemo_3', data);
                    return Promise.all( [1, 2, 3].map(function( fieldEl ){
                        return new Promise(resolve => {
                            setTimeout(function(){
                                fieldEl = fieldEl + 1;
                                resolve({fieldEl: fieldEl});
                            }, 3000);
                        });
                    }) ).then(list => {

                        console.log('beforeSendTest_3 list', list);
                        return data;

                    });
                },
                function beforeSend_surveyDemo_4( data ){
                    console.log('Survey beforeSend_surveyDemo_4', data);
                    data.formData.prova2 = 'ahahahahah';
                    return Promise.resolve(data);
                }
            ]
        }
    };

var onInitSuccess = function( ajaxData ){
        var surveyFormEl = this.formEl,
            surveyBody = surveyFormEl.querySelector('.surveyjs-body'),
            initStatus = ajaxData.status;
        
        if( initStatus === 'success' ){
            // SUCCESS CODE
        } else {
            var elemToRemove = surveyFormEl.querySelector('.surveyjs-footer');
            elemToRemove.parentNode.removeChild(elemToRemove);
            surveyBody.innerHTML = '<div class="surveyjs-message">Loading Error. Please, reload the page.</div>';
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
