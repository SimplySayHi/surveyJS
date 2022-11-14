
import { version }      from '../package.json';
import { ajaxCall, checkFormEl, customEvents, deepFreeze, dispatchCustomEvent, isNodeList, mergeObjects } from './modules/helpers';
import { options }      from './modules-lite/options';
import { buildSurvey }  from './modules/buildSurvey/buildSurvey';

class Survey {

    constructor( $form, optionsObj = {} ){
        const argsL = arguments.length,
              checkFormElem = checkFormEl($form);

        if( argsL === 0 || (argsL > 0 && !$form) ){
            throw new Error('First argument "$form" is missing or falsy!');
        }
        if( isNodeList($form) ){
            throw new Error('First argument "$form" must be a single DOM node or a form CSS selector, not a NodeList!');
        }
        if( !checkFormElem.result ){
            throw new Error('First argument "$form" is not a DOM node nor a form CSS selector!');
        }
        if( !optionsObj.url || typeof optionsObj.url !== 'string' ){
            throw new Error('"options.url" is missing or not a string!');
        }

        const self = this;
        self.$form = checkFormElem.element;
        self.options = mergeObjects( {}, Survey.prototype.options, optionsObj );
        $form = self.$form;
        optionsObj = self.options;

        $form.surveyjs = self;
        $form.querySelector('[data-surveyjs-body]').insertAdjacentHTML( 'beforebegin', optionsObj.templates.loading );

        // CREATE SURVEY
        const retrieveSurvey = ajaxCall(optionsObj.url, optionsObj.initAjaxOptions)
            .then(response => {
                if( response.status.toLowerCase() !== 'success' ){
                    return Promise.reject(response);
                }
                if( response.data.questions && response.data.questions.length > 0 ){
                    buildSurvey(response.data, $form, optionsObj);
                    Object.defineProperty(self, 'data', {
                        value: deepFreeze(response.data)
                    });
                    self.isInitialized = true;
                    $form.closest('[data-surveyjs-wrapper]').classList.add('surveyjs-init-success');
                }
                return response;
            })
            .finally(() => {
                const $loadingBox = $form.querySelector('[data-surveyjs-loading]');
                if( $loadingBox ){
                    $loadingBox.parentNode.removeChild($loadingBox);
                }
            });
        
        dispatchCustomEvent( $form, customEvents.init, { detail: retrieveSurvey } );
    }

    destroy(){
        delete this.$form.surveyjs;
        dispatchCustomEvent( this.$form, customEvents.destroy );
    }

    static setOptions( optionsObj ){
        Survey.prototype.options = mergeObjects({}, Survey.prototype.options, optionsObj);
    }

}

Survey.prototype.isInitialized = false;
Survey.prototype.options = options;
Survey.prototype.version = version;

export default Survey;
