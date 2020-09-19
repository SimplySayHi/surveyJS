
import { ajaxCall, deepFreeze, mergeObjects, webStorage } from './modules/helpers';
import { messages }             from './modules/messages';
import { options }              from './modules/options';
import { internals }            from './modules/internals';
import { callbackFns }          from './modules/listenerCallbacks';
import { buildSurvey }          from './modules/buildSurvey/buildSurvey';
import { destroy }              from './modules/destroy';

import Form from 'formjs-plugin';

import './index.scss';

const version = '3.0.0';

class Survey extends Form {

    constructor( formEl, optionsObj = {} ){
        if( !optionsObj.url || typeof optionsObj.url !== 'string' ){
            throw new Error('"options.url" is missing or not a string!');
        }

        // SET THE lang VALUE IN options ( MANDATORY FOR OTHER OPERATIONS )
        const customLang = typeof optionsObj.lang === 'string' && optionsObj.lang.toLowerCase();
        const langValue = customLang && Survey.prototype.messages[customLang] ? customLang : Survey.prototype.options.lang;
        
        // MERGE OPTIONS AND messages OF THE CHOSEN lang INSIDE options
        const options = mergeObjects( {}, Survey.prototype.options, Survey.prototype.messages[langValue], optionsObj );

        if( options.templates.input.indexOf('{{inputTagCode}}') !== -1 ){
            options.templates.input = options.templates.input.replace( /{{inputTagCode}}/g, options.templates.inputTag );
        }

        options.templates.labelTag = options.templates.labelTag.replace(/{{labelClass}}/g, options.cssClasses.label);

        if( !webStorage().isAvailable ){
            options.useLocalStorage = false;
        }

        super( formEl, options );

        this.internals = internals;

        // INIT FIELDS VALIDATION
        // THIS WILL RUN BEFORE FORMJS VALIDATION FUNCTION SO THAT USERS CANNOT SKIP REQUIRED FIELDS VALIDATION
        this.options.fieldOptions.validateOnEvents.split(' ').forEach(eventName => {
            const useCapturing = eventName === 'blur' ? true : false;
            formEl.addEventListener(eventName, callbackFns.validation, useCapturing);
        });

        formEl.addEventListener('fjs.form:submit', event => {
            event.data.then(() => {
                // REMOVE SURVEY LOCAL STORAGE
                if( options.useLocalStorage ){
                    localStorage.removeItem( this.internals.storageName );
                }
            });
        });
    }

    destroy(){
        destroy(this.formEl);
        super.destroy();
    }

    init(){
        const self = this;
        const formEl = self.formEl;
        const options = self.options;

        formEl.querySelector('[data-surveyjs-body]').insertAdjacentHTML( 'beforebegin', options.loadingBox );

        return ajaxCall(options.url, options.initAjaxOptions)
            .then(response => {
                if( response.status.toLowerCase() === 'success' && response.data.questions && response.data.questions.length > 0 ){
                    return new Promise(resolve => {

                        buildSurvey(formEl, options, self.internals, response.data);
                        super.init().then(() => {
                            self.isInitialized = true;
                            self.data = response.data;
                            deepFreeze(self.data);
                            formEl.closest('[data-surveyjs-container]').classList.add('surveyjs-init-success');
                            resolve(response);
                        });

                    });
                }
                return Promise.reject(response);
            });
    }
    
    static addLanguage( langString, langObject ){
        const langValue = langString.toLowerCase();
        Survey.prototype.messages[langValue] = mergeObjects({}, Survey.prototype.messages[langValue], langObject);
    }

    static setOptions( optionsObj ){
        Survey.prototype.options = mergeObjects({}, Survey.prototype.options, optionsObj);
    }

}

Survey.prototype.isInitialized = false;
Survey.prototype.messages = messages;
Survey.prototype.options = options;
Survey.prototype.version = version;

export default Survey;
