
export const populateAnswers = ( $form, internals ) => {

    const WS = sessionStorage.getObject( internals.storageName );
    if( WS ){
        const $surveyCont = $form.closest('[data-surveyjs-wrapper]');
        WS.forEach(item => {
            const $fieldFirst = $surveyCont.querySelector( '[name="' + item.name + '"]' ),
                  isRadioOrCheckbox = $fieldFirst.matches('[type="radio"], [type="checkbox"]'),
                  $field = ( isRadioOrCheckbox ? $surveyCont.querySelector('[name="' + item.name + '"][value="' + item.value + '"]') : $fieldFirst );
            
            if( isRadioOrCheckbox ){
                $field.checked = true;
            } else {
                $field.value = item.value;
            }
        });
    }

}
