
var $form = document.querySelector('[data-surveyjs-form]');
var options = { url: '../json/survey-simple.json' };

$form.addEventListener('fjs.form:submit', function(event){
    console.log(event.type);
    event.detail
        .then(function(response){
            console.log('then', response);
            if( response.status !== 'success' ){
                return Promise.reject(response);
            }
            $('#modal-notification').modal('show');
        })
        .catch(function(error){
            console.log('catch', error);
            var surveyContEl = $form.closest('[data-surveyjs-wrapper]');
            surveyContEl.innerHTML = surveyContEl.innerHTML + '<div class="alert alert-danger text-center mx-3 mb-2" role="alert"><p class="my-3">Generic error, please retry.</p></div>';
        })
        .finally(function(){
            console.log('finally');
        });
});

var mySurvey = new Survey( $form, options );
