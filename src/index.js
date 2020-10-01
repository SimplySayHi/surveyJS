
import { ajaxCall, customEvents, deepFreeze, dispatchCustomEvent, mergeObjects, webStorage } from './modules/helpers';
import { options }      from './modules/options';
import { internals }    from './modules/internals';
import { callbackFns }  from './modules/listenerCallbacks';
import { buildSurvey }  from './modules/buildSurvey/buildSurvey';
import { destroy }      from './modules/destroy';

import Form from 'formjs-plugin';

import './index.scss';

const version = '3.0.0';

class Survey extends Form {

    constructor( formEl, optionsObj = {} ){
        if( !optionsObj.url || typeof optionsObj.url !== 'string' ){
            throw new Error('"options.url" is missing or not a string!');
        }

        const options = mergeObjects( {}, Survey.prototype.options, optionsObj );

        if( !webStorage().isAvailable ){
            options.useWebStorage = false;
        }

        // CREATE FORM INSTANCE FOR SURVEY
        super( formEl, options );
        const self = this;
        self.internals = internals;
        self.options.fieldOptions.validateOnEvents.split(' ').forEach(eventName => {
            const useCapturing = eventName === 'blur' ? true : false;
            self.formEl.addEventListener(eventName, callbackFns.validation, useCapturing);
        });
        self.formEl.addEventListener('fjs.form:submit', callbackFns.submit);

        self.formEl.querySelector('[data-surveyjs-body]').insertAdjacentHTML( 'beforebegin', self.options.templates.loading );

        // CREATE SURVEY
        const retrieveSurvey = ajaxCall(self.options.url, self.options.initAjaxOptions)
            .then(response => {
                if( response.status.toLowerCase() !== 'success' ){
                    return Promise.reject(response);
                }
                return new Promise(resolve => {
                    if( response.data.questions && response.data.questions.length > 0 ){
                        buildSurvey(self.formEl, self.options, self.internals, response.data);
                        super.init().then(() => {
                            self.isInitialized = true;
                            self.data = response.data;
                            deepFreeze(self.data);
                            self.formEl.closest('[data-surveyjs-container]').classList.add('surveyjs-init-success');
                            resolve(response);
                        });
                    } else {
                        resolve(response);
                    }
                });
            })
            .finally(() => {
                const loadingBoxEl = self.formEl.querySelector('[data-surveyjs-loading]');
                if( loadingBoxEl ){
                    loadingBoxEl.parentNode.removeChild(loadingBoxEl);
                }
            });
        
        dispatchCustomEvent( self.formEl, customEvents.init, retrieveSurvey );
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
