
import { version }          from '../package.json';
import { ajaxCall, customEvents, deepFreeze, dispatchCustomEvent, mergeObjects, webStorage } from './modules/helpers';
import { options }          from './modules/options';
import { internals }        from './modules/internals';
import { submit, validationEnd } from './modules/listenerCallbacks';
import { buildSurvey }      from './modules/buildSurvey/buildSurvey';
import { populateAnswers }  from './modules/buildSurvey/populateAnswers';
import { destroy }          from './modules/destroy';

import Form from 'formjs-plugin';

class Survey extends Form {

    constructor( form, optionsObj = {} ){
        if( !optionsObj.url || typeof optionsObj.url !== 'string' ){
            throw new Error('"options.url" is missing or not a string!');
        }

        optionsObj = mergeObjects( {}, Survey.prototype.options, optionsObj );

        if( !webStorage().isAvailable ){
            optionsObj.useWebStorage = false;
        }

        // CREATE FORM INSTANCE FOR SURVEY
        super( form, optionsObj );
        const self = this;
        self.internals = internals;
        const $form = self.$form;
        optionsObj = self.options;
        const selfInternals = self.internals;

        $form.surveyjs = self;
        $form.querySelector('[data-surveyjs-body]').insertAdjacentHTML( 'beforebegin', optionsObj.templates.loading );

        // CREATE SURVEY
        const retrieveSurvey = ajaxCall(optionsObj.url, optionsObj.initAjaxOptions)
            .then(response => {
                if( response.status.toLowerCase() !== 'success' ){
                    return Promise.reject(response);
                }

                if( response.data.questions && response.data.questions.length > 0 ){
                    // REPLACE SURVEY ID AND FORM NAME IN WEB STORAGE NAME
                    selfInternals.storageName = selfInternals.storageName.replace( /{{surveyId}}/, response.data.id );
                    selfInternals.storageName = selfInternals.storageName.replace( /{{surveyFormName}}/, ($form.getAttribute('name') || '') );

                    buildSurvey(response.data, $form, optionsObj);
                    
                    if( optionsObj.useWebStorage ){
                        populateAnswers($form, selfInternals);
                    }
                    
                    Object.defineProperty(self, 'data', {
                        value: deepFreeze(response.data)
                    });
                    
                    $form.addEventListener('fjs.field:validation', validationEnd);
                    $form.addEventListener('fjs.form:submit', submit);

                    if( optionsObj.formOptions.onInitCheckFilled ){
                        if( self._ && typeof self._.asyncInitEnd === 'function' ){
                            return self._.asyncInitEnd()
                                    .then(() => {
                                        self.isInitialized = true;
                                        $form.closest('[data-surveyjs-wrapper]').classList.add('surveyjs-init-success');
                                        return response
                                    });
                        }

                        return super.validateFilledFields().then(() => {
                            self.isInitialized = true;
                            $form.closest('[data-surveyjs-wrapper]').classList.add('surveyjs-init-success');
                            return response
                        });
                    }

                    self.isInitialized = true;
                    $form.closest('[data-surveyjs-wrapper]').classList.add('surveyjs-init-success');
                    return response
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
        super.destroy();
        destroy(this.$form);
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
