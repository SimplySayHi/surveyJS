
var formEl = document.querySelector('[data-surveyjs-form]');
var options = { url: '../json/survey-simple.json' };

formEl.addEventListener('fjs.form:submit', function( event ){
    event.data
        .then(function(response){
            // FORM VALIDATION AND SUBMIT ARE UP TO YOU :)
        })
        .catch(function(error){})
        .finally(function(){});
});

var mySurvey = new Survey( formEl, options );
