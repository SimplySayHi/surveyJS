
import { checkFormEl, isNodeList, mergeObjects } from './helpers';
import { internals } from './internals';
import { callbackFns } from './listenerCallbacks';

export function constructorFn( formEl, optionsObj = {} ){

    let self = this,
        argsL = arguments.length,
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
        throw new Error('"options.url" is missing or not valid!');
    }

    self.formEl = checkFormElem.element;
    self.formEl.surveyjs = self;

    formEl = self.formEl;

    // SET THE lang VALUE IN options ( MANDATORY FOR OTHER OPERATIONS )
    if( typeof optionsObj.lang === 'string' ){
        let langValue = optionsObj.lang.toLowerCase();
        if( self.messages[ langValue ] ){
            self.options.lang = langValue;
        }
    }
    
    // MERGE messages OF THE CHOSEN lang INSIDE options
    self.options = mergeObjects( {}, self.options, self.messages[self.options.lang] );
    // MERGE OPTIONS
    self.options = mergeObjects( {}, self.options, optionsObj );

    if( self.options.templates.input.indexOf('{{inputTagCode}}') !== -1 ){
        self.options.templates.input = self.options.templates.input.replace( /{{inputTagCode}}/g, self.options.templates.inputTag );
    }

    self.options.templates.labelTag = self.options.templates.labelTag.replace(/{{labelClass}}/g, self.options.cssClasses.label);

    // SET INTERNAL UTILS
    self.internals = internals;

    if( !self.internals.isAvailableStorage ){
        self.options.useLocalStorage = false;
    }

    self.listenerCallbacks = {
        validation: callbackFns.validation.bind(self)
    };
    Object.freeze(self.listenerCallbacks);
    
}
