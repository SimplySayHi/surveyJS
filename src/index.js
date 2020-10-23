
import { version }          from './modules/version';
import { ajaxCall, customEvents, deepFreeze, dispatchCustomEvent, mergeObjects, webStorage } from './modules/helpers';
import { options }          from './modules/options';
import { internals }        from './modules/internals';
import { submit, validationEnd } from './modules/listenerCallbacks';
import { buildSurvey }      from './modules/buildSurvey/buildSurvey';
import { populateAnswers }  from './modules/buildSurvey/populateAnswers';
import { destroy }          from './modules/destroy';

import Form from 'formjs-plugin';

class Survey extends Form {

    constructor( formEl, optionsObj = {} ){
        if( !optionsObj.url || typeof optionsObj.url !== 'string' ){
            throw new Error('"options.url" is missing or not a string!');
        }

        optionsObj = mergeObjects( {}, Survey.prototype.options, optionsObj );

        if( !webStorage().isAvailable ){
            optionsObj.useWebStorage = false;
        }

        // CREATE FORM INSTANCE FOR SURVEY
        super( formEl, optionsObj );
        const self = this;
        self.internals = internals;
        formEl = self.formEl;
        optionsObj = self.options;
        const selfInternals = self.internals;

        formEl.querySelector('[data-surveyjs-body]').insertAdjacentHTML( 'beforebegin', optionsObj.templates.loading );

        // CREATE SURVEY
        const retrieveSurvey = ajaxCall(optionsObj.url, optionsObj.initAjaxOptions)
            .then(response => {
                if( response.status.toLowerCase() !== 'success' ){
                    return Promise.reject(response);
                }
                return new Promise(resolve => {
                    if( response.data.questions && response.data.questions.length > 0 ){
    
                        // REPLACE SURVEY ID AND FORM NAME IN WEB STORAGE NAME
                        selfInternals.storageName = selfInternals.storageName.replace( /{{surveyId}}/, response.data.id );
                        selfInternals.storageName = selfInternals.storageName.replace( /{{surveyFormName}}/, (formEl.getAttribute('name') || '') );

                        buildSurvey(response.data, formEl, optionsObj);
                        if( optionsObj.useWebStorage ){
                            populateAnswers(formEl, selfInternals);
                        }
                        Object.defineProperty(self, 'data', {
                            value: deepFreeze(response.data)
                        });
                        formEl.addEventListener('fjs.field:validation', validationEnd);
                        formEl.addEventListener('fjs.form:submit', submit);
                        super.init().then(() => {
                            self.isInitialized = true;
                            formEl.closest('[data-surveyjs-wrapper]').classList.add('surveyjs-init-success');
                            resolve(response);
                        });

                    } else {
                        resolve(response);
                    }
                });
            })
            .finally(() => {
                const loadingBoxEl = formEl.querySelector('[data-surveyjs-loading]');
                if( loadingBoxEl ){
                    loadingBoxEl.parentNode.removeChild(loadingBoxEl);
                }
            });
        
        dispatchCustomEvent( formEl, customEvents.init, retrieveSurvey );
    }

    destroy(){
        destroy(this.formEl);
        super.destroy();
    }

    static setOptions( optionsObj ){
        Survey.prototype.options = mergeObjects({}, Survey.prototype.options, optionsObj);
    }

}

Survey.prototype.isInitialized = false;
Survey.prototype.options = options;
Survey.prototype.version = version;

export default Survey;
