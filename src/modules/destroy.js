
import { submit, validation, validationEnd } from './listenerCallbacks';

export const destroy = formEl => {

    formEl.formjs.options.fieldOptions.validateOnEvents.split(' ').forEach(eventName => {
        const useCapturing = eventName === 'blur' ? true : false;
        formEl.removeEventListener(eventName, validation, useCapturing);
    });
    formEl.removeEventListener('fjs.field:validation', validationEnd);
    formEl.removeEventListener('fjs.form:submit', submit);
    
}
