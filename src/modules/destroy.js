
import { callbackFns } from './listenerCallbacks';

export const destroy = formEl => {

    formEl.formjs.options.fieldOptions.validateOnEvents.split(' ').forEach(eventName => {
        const useCapturing = eventName === 'blur' ? true : false;
        formEl.removeEventListener(eventName, callbackFns.validation, useCapturing);
    });
    
}
