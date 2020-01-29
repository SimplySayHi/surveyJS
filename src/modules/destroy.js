
export function destroy(){

    const self = this,
          formEl = self.formEl;

    formEl.formjs.options.fieldOptions.validateOnEvents.split(' ').forEach(eventName => {
        let useCapturing = (eventName === 'blur' ? true : false);
        formEl.removeEventListener(eventName, self.listenerCallbacks.validation, useCapturing);
    });

    delete self.formEl.surveyjs;
    self.formEl.formjs.destroy();
    
}
