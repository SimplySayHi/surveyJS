
import { version }      from './modules/version';
import { ajaxCall, checkFormEl, customEvents, deepFreeze, dispatchCustomEvent, isNodeList, mergeObjects } from './modules/helpers';
import { options }      from './modules-lite/options';
import { buildSurvey }  from './modules/buildSurvey/buildSurvey';

class Survey {

    constructor( formEl, optionsObj = {} ){
        const argsL = arguments.length,
              checkFormElem = checkFormEl(formEl);

        if( argsL === 0 || (argsL > 0 && !formEl) ){
            throw new Error('First argument "formEl" is missing or falsy!');
        }
        if( isNodeList(formEl) ){
            throw new Error('First argument "formEl" must be a single DOM node or a form CSS selector, not a NodeList!');
        }
        if( !checkFormElem.result ){
            throw new Error('First argument "formEl" is not a DOM node nor a form CSS selector!');
        }
        if( !optionsObj.url || typeof optionsObj.url !== 'string' ){
            throw new Error('"options.url" is missing or not a string!');
        }

        const self = this;
        self.formEl = checkFormElem.element;
        self.options = mergeObjects( {}, Survey.prototype.options, optionsObj );
        formEl = self.formEl;
        optionsObj = self.options;

        formEl.querySelector('[data-surveyjs-body]').insertAdjacentHTML( 'beforebegin', optionsObj.templates.loading );

        // CREATE SURVEY
        const retrieveSurvey = ajaxCall(optionsObj.url, optionsObj.initAjaxOptions)
            .then(response => {
                if( response.status.toLowerCase() !== 'success' ){
                    return Promise.reject(response);
                }
                if( response.data.questions && response.data.questions.length > 0 ){
                    buildSurvey(response.data, formEl, optionsObj);
                    Object.defineProperty(self, 'data', {
                        value: deepFreeze(response.data)
                    });
                    self.isInitialized = true;
                    formEl.closest('[data-surveyjs-wrapper]').classList.add('surveyjs-init-success');
                }
                return response;
            })
            .finally(() => {
                const loadingBoxEl = formEl.querySelector('[data-surveyjs-loading]');
                if( loadingBoxEl ){
                    loadingBoxEl.parentNode.removeChild(loadingBoxEl);
                }
            });
        
        dispatchCustomEvent( formEl, customEvents.init, retrieveSurvey );
    }

    static setOptions( optionsObj ){
        Survey.prototype.options = mergeObjects({}, Survey.prototype.options, optionsObj);
    }

}

Survey.prototype.isInitialized = false;
Survey.prototype.options = options;
Survey.prototype.version = version;

export default Survey;
