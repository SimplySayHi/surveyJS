
var $form = document.querySelector('[data-surveyjs-form]');
var options = { url: '../json/survey-simple.json' };

$form.addEventListener('submit', function( event ){
    event.preventDefault();
    console.log('FORM SUBMIT');
    // FORM VALIDATION IS UP TO YOU :)
});

var mySurvey = new Survey( $form, options );
