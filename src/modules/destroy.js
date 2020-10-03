
import { submit, validationEnd } from './listenerCallbacks';

export const destroy = formEl => {

    formEl.removeEventListener('fjs.field:validation', validationEnd);
    formEl.removeEventListener('fjs.form:submit', submit);
    
}
