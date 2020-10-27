
export const populateAnswers = ( formEl, internals ) => {

    const WS = sessionStorage.getObject( internals.storageName );
    if( WS ){
        const surveyContEl = formEl.closest('[data-surveyjs-wrapper]');
        WS.forEach(item => {
            const fieldFirst = surveyContEl.querySelector( '[name="' + item.name + '"]' ),
                  isRadioOrCheckbox = fieldFirst.matches('[type="radio"], [type="checkbox"]'),
                  fieldEl = ( isRadioOrCheckbox ? surveyContEl.querySelector('[name="' + item.name + '"][value="' + item.value + '"]') : fieldFirst );
            
            if( isRadioOrCheckbox ){
                fieldEl.checked = true;
            } else {
                fieldEl.value = item.value;
            }
        });
    }

}
