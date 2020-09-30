
import { toKebabCase } from '../../helpers';

export const getAttributesStringHTML = ( answerObj, answerCode, isRequired ) => {
    const excludedAttrs = ['data', 'id', 'label', 'nested', 'related', 'sort'];
    
    if( /^(option|textarea)$/.test(answerObj.type) ){
        excludedAttrs.push('type');
    }

    let string = '';

    Object.keys(answerObj)
        .filter(name => excludedAttrs.indexOf(name) === -1)
        .forEach(name => {
            string += ` ${name}="${answerObj[name]}"`;
        });

    if( answerObj.data ){
        Object.keys(answerObj.data).forEach(name => {
            string += ` data-${toKebabCase(name)}="${answerObj.data[name]}"`;
        });
    }

    if( isRequired ){
        string += ' required';
    }

    if( answerObj.related ){
        string += ' data-require-more';
    }

    string += ` id="${answerCode}"`;
    string += ` data-answer-id="${answerObj.id}"`;

    return string.trim();
}
