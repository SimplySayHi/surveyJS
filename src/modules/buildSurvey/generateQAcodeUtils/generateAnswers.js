
import { mergeObjects, replaceObjectKeysInString, sortList } from '../../helpers';
import { generateOptionTags }       from './generateOptionTags';
import { getAttributesStringHTML }  from './getAttributesStringHTML';
import { getTemplates }             from './getTemplates';

export const generateAnswers = ( answersList, extraData, options ) => {

    let allAnswersHTML = '';
    let previousType = '';

    sortList( answersList ).forEach((answer, index) => {

        let answerHTML = '';

        // COLLECT USEFUL DATA
        // answerType => checkbox, date, email, radio, select, text, textarea, etc...
        const answerType = answer.type === 'option' ? 'select' : answer.type;
        
        if( answerType === 'select' && previousType === answerType ){ return; }

        previousType = answerType;

        if( extraData.question.checks ){
            answer = mergeObjects({}, answer, {data:{checks:extraData.question.checks}});
        }
        
        const answerCode = `${answerType}-${extraData.surveyId}-${extraData.question.id}-${answerType === 'select' ? (index + 1) : answer.id}`;
        const answerData = {
            questionNumber: extraData.question.index + 1,
            wrapperClasses: options.cssClasses.wrapper[answerType] || options.cssClasses.wrapper.field,
            fieldAttributes: getAttributesStringHTML( answer, answerCode, extraData.question.isRequired ),
            fieldClasses: options.cssClasses[answerType] || options.cssClasses.field,

            answerType,
            answerCode,
            addMoreName: '',

            labelString: answer.label || '',
            labelClasses: options.cssClasses.label
        };

        let relatedFieldHTML = '';
        if( answer.related ){
            const relatedType = answer.related.type || 'select';
            const relatedIsSelect = relatedType === 'select';
            const relatedObj = relatedIsSelect ? mergeObjects({}, answer) : answer.related;

            relatedObj.type = relatedIsSelect ? 'option' : relatedType;
            relatedObj.id = '';
            relatedObj.data = mergeObjects({}, relatedObj.data, {requiredFrom:'#'+answerCode});
            delete relatedObj.related;

            const answerDataRelated = {
                fieldAttributes: getAttributesStringHTML(relatedObj, '', false),
                answerType: relatedType,
                addMoreName: '-more',
                fieldClasses: relatedIsSelect ? options.cssClasses.select : (options.cssClasses[relatedType] || options.cssClasses.field)
            };

            relatedFieldHTML = options.templates[relatedType] || options.templates.input;
            if( relatedIsSelect ){
                const optionsHtml = generateOptionTags( answer.related );
                relatedFieldHTML = relatedFieldHTML.replace('{{optionsHtml}}', optionsHtml);
            }

            relatedFieldHTML = replaceObjectKeysInString(answerDataRelated, relatedFieldHTML);
        }
        
        // TAKE RIGHT TEMPLATES ( wrapper, field and label ) AND PUT ALL TOGETHER
        // answerTypeForTemplate => related, input, nested, select, textarea, etc...
        const answerTypeForTemplate = answer.related ? 'related' : (answer.nested ? 'nested' : answerType);
        const templates = getTemplates( answerTypeForTemplate, options.templates );

        let nestedFieldsHTML = '';
        if( answer.nested ){
            nestedFieldsHTML = generateAnswers( answer.nested, extraData, options );
        }

        let optionsHtml = '';
        if( answerType === 'select' ){
            optionsHtml = generateOptionTags( answersList );
        }

        answerHTML = templates.wrapper
                        .replace('{{relatedFieldHTML}}', relatedFieldHTML)
                        .replace('{{fieldTemplate}}', templates.field)
                        .replace('{{optionsHtml}}', optionsHtml)
                        .replace('{{labelTemplate}}', templates.label)
                        .replace('{{nestedFieldsHTML}}', nestedFieldsHTML);
        allAnswersHTML += replaceObjectKeysInString(answerData, answerHTML);

    });

    return allAnswersHTML;

}
