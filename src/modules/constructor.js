
import { checkFormEl, isNodeList, mergeObjects } from './helpers';
import { internals } from './internals';
import { webStorage } from './webStorage';

export function constructorFn( self, formEl, optionsObj = {} ){

    const argsL = arguments.length,
          checkFormElem = checkFormEl(formEl);

    if( argsL === 1 || (argsL > 1 && !formEl) ){
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

    // SET THE lang VALUE IN options ( MANDATORY FOR OTHER OPERATIONS )
    const customLang = typeof optionsObj.lang === 'string' && optionsObj.lang.toLowerCase();
    const langValue = customLang && self.constructor.prototype.messages[customLang] ? customLang : self.constructor.prototype.options.lang;
    // MERGE messages OF THE CHOSEN lang INSIDE options
    self.options = mergeObjects( {}, self.constructor.prototype.options, self.constructor.prototype.messages[langValue] );
    // MERGE OPTIONS
    self.options = mergeObjects( {}, self.options, optionsObj );

    if( self.options.templates.input.indexOf('{{inputTagCode}}') !== -1 ){
        self.options.templates.input = self.options.templates.input.replace( /{{inputTagCode}}/g, self.options.templates.inputTag );
    }

    self.options.templates.labelTag = self.options.templates.labelTag.replace(/{{labelClass}}/g, self.options.cssClasses.label);
    self.internals = internals;

    if( !webStorage().isAvailable ){
        self.options.useLocalStorage = false;
    }
    
}
