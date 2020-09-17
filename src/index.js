
import { checkFormEl, deepFreeze, isNodeList, mergeObjects, webStorage } from './modules/helpers';
import { messages }             from './modules/messages';
import { options }              from './modules/options';
import { internals }            from './modules/internals';
import { retrieveSurvey }       from './modules/retrieveSurvey';
import { destroy }              from './modules/destroy';

import './index.css';

const version = '3.0.0';

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

        this.formEl = checkFormElem.element;
        this.formEl.surveyjs = this;

        // SET THE lang VALUE IN options ( MANDATORY FOR OTHER OPERATIONS )
        const customLang = typeof optionsObj.lang === 'string' && optionsObj.lang.toLowerCase();
        const langValue = customLang && Survey.prototype.messages[customLang] ? customLang : Survey.prototype.options.lang;
        // MERGE OPTIONS AND messages OF THE CHOSEN lang INSIDE options
        this.options = mergeObjects( {}, Survey.prototype.options, Survey.prototype.messages[langValue], optionsObj );

        if( this.options.templates.input.indexOf('{{inputTagCode}}') !== -1 ){
            this.options.templates.input = this.options.templates.input.replace( /{{inputTagCode}}/g, this.options.templates.inputTag );
        }

        this.options.templates.labelTag = this.options.templates.labelTag.replace(/{{labelClass}}/g, this.options.cssClasses.label);
        this.internals = internals;

        if( !webStorage().isAvailable ){
            this.options.useLocalStorage = false;
        }
    }

    destroy(){
        destroy(this.formEl);
    }

    init(){
        return retrieveSurvey(this.formEl, this.options, this.internals)
        .then(response => {
            this.isInitialized = true;
            this.data = deepFreeze(response.data);
            return response;
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
