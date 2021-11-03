
import { submit, validationEnd } from './listenerCallbacks';

export const destroy = $form => {

    $form.removeEventListener('fjs.field:validation', validationEnd);
    $form.removeEventListener('fjs.form:submit', submit);

    delete $form.surveyjs;
    
}
