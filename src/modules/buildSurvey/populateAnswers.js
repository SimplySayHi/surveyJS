
export const populateAnswers = ( formEl, internals ) => {

    const LS = localStorage.getObject( internals.storageName );
    if( LS ){
        const surveyContEl = formEl.closest('[data-surveyjs-container]');
        internals.storageArray = LS;
        LS.forEach(item => {
            const fieldFirst = surveyContEl.querySelector( '[name="' + item.field + '"]' ),
                  isRadioOrCheckbox = fieldFirst.matches('[type="radio"], [type="checkbox"]'),
                  fieldEl = ( isRadioOrCheckbox ? surveyContEl.querySelector( '[name="' + item.field + '"][value="' + item.value + '"]' ) :   fieldFirst );
            
            if( isRadioOrCheckbox ){
                fieldEl.checked = true;
            } else {
                fieldEl.value = item.value;
            }
        });
    }

}
