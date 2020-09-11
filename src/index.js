
import { mergeObjects }         from './modules/helpers';
import { messages }             from './modules/messages';
import { options }              from './modules/options';

// CONSTRUCTOR FUNCTION & PUBLIC METHODS
import { constructorFn }        from './modules/constructor';
import { retrieveSurvey }       from './modules/retrieveSurvey';
import { destroy }              from './modules/destroy';

import './index.css';

const version = '3.0.0';

class Survey {

    constructor( formEl, optionsObj ){
        return constructorFn(this, formEl, optionsObj);
    }

    destroy(){
        destroy(this.formEl);
    }

    init(){
        return retrieveSurvey(this.formEl, this.options, this.internals)
        .then(response => {
            this.isInitialized = true;
            this.data = response.data;
            Object.freeze(this.data);
            return response;
        });
    }
    
    static addLanguage( langString, langObject ){
        const langValue = langString.toLowerCase();
        this.prototype.messages[langValue] = mergeObjects({}, this.prototype.messages[langValue], langObject);
    }

    static setOptions( optionsObj ){
        this.prototype.options = mergeObjects({}, this.prototype.options, optionsObj);
    }

}

Survey.prototype.isInitialized = false;
Survey.prototype.messages = messages;
Survey.prototype.options = options;
Survey.prototype.version = version;

export default Survey;
