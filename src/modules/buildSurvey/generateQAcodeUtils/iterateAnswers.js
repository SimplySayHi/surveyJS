
import { generateFieldHTML } from './generateFieldHTML';
import { replaceTemplateStrings } from './replaceTemplateStrings';

export function iterateAnswers( obj, qID, qIdx, attrReq ){

    const self = this;
    let progIds = self.internals.progIds;

    // obj          MUST BE AN ARRAY OF STRINGS OR AN OBJECT THAT CONTAINS 'answers' AS ARRAY (THE FUNCTION iterateAnswers LOOPS UNTIL A STRING IS FOUND, AND PRINTS IT)
    // qIdx         INDEX OF THE QUESTION
    // attrReq      HTML REQUIRED ATTRIBUTE THAT WILL BE PRINTED (THIS PARAMETER MUST NOT BE PASSED INITIALLY. IT IS AUTOMATICALLY PASSED INSIDE THE LOOP IF NECESSARY)
    // aLoopHtml    THE CODE OF ALL ANSWERS ( PRINTED ONLY AT THE END )
    var list = ( Array.isArray( obj ) ? obj : obj.answers ),
        listL = list.length,
        qID = (obj.id ? obj.id : (qID ? qID : 0)),
        i = qIdx || 0,
        aLoopHtml = '',
        needsBinding = (obj.question === 'hidden-privacy' ? true : false);

    if( list[0]['sort'] ){
        list.sort((a, b) => {
            return a['sort'] > b['sort'];
        });
    }

    for(let a=0; a<listL; a++){

        let answer = list[a],
            aNum = (a+1),
            qNum = (i+1),
            aType = answer.type,
            aId = answer.id,
            progIdsLength = progIds.length,
            progIdsJoined = ( progIdsLength > 0 ? self.internals.progIds.join('-') : '' ),
            getSettingsFieldClass = () => {
                let aType = ( answer.type === 'option' ? 'select' : answer.type );
                return self.options.cssClasses[aType] || self.options.cssClasses.default;
            };

        let fieldData = { aHtml: '' };
        
        // ALL THESE OBJECT KEYS WILL REPLACE {{key}} WITH objData.KEY IN HTML STRING
        let objData = {
            // answerId         ANSWER ID AS FROM THE JSON. THIS IS USED AS VALUE ATTRIBUTE OF THE ANSWER
            // answerType       ANSWER TYPE AS FROM THE JSON. USED TO CHECK WHICH FIELD MUST BE CREATED ( EG: text, radio, checkbox, select, textarea )
            // nestedAnswer     CREATES THE data-nested-index ATTRIBUTE TO PRINT IF AN ANSWER IS NESTED ( SEE BELOW FOR NESTED ANSWERS )
            // answerCode       ID ATTRIBUTE OF THE ANSWER
            //                  ( BUILT AS: "answerType-questionID-answerID-questionNumber[-nestingLevels]-answerNumber" )
            //                  ONLY AN ATTRIBUTE-ANSWER DOES NOT USE THE answerCode
                labelTagCode: (aType === 'checkbox' || aType === 'radio' ? self.options.templates.labelTag : ''),
                answerId: aId,
                answerIdValue: (aType === 'text' ? '' : aId),
                answerIndex: aNum,
                answerName: 'surveyjs-answer-'+qNum,
                answerPlaceholder: '',
                answerMaxlength: (answer.maxlength ? 'maxlength="' + answer.maxlength + '"' : ''),
                answerString: (typeof answer.answer === 'string' ? answer.answer : ''),
                answerType: aType,
                attrRequired: ( typeof obj.required !== 'undefined' ? 'required' : (typeof attrReq !== 'undefined' ? attrReq : '') ),
                fieldClass: getSettingsFieldClass(),
                nestedAnswer: ( progIdsJoined !== '' ? 'data-nested-index="'+ aNum +'"' : '' ),
                optionsHtml: '',
                progIdsJoined: progIdsJoined,
                questionNumber: qNum,
                answerCode: (aType === 'option' ? 'select' : aType) +'-' + qID +'-'+ (aId || 0) + '-' + qNum + (progIdsJoined !== '' ? '-'+progIdsJoined : '') +'-'+ aNum,
                attrChecks: (obj.checks ? 'data-checks="' + obj.checks + '"' : ''),
                attrSubtype: (answer.subtype ? 'data-subtype="' + answer.subtype + '"' : ''),
                validateIfFilled: (typeof obj.validateIfFilled !== 'undefined' ? 'data-validate-if-filled' : '')
            };
        
        if( needsBinding ){
            
            let boundedFieldEl = self.formEl.closest('[data-surveyjs-container]').querySelectorAll('[data-name="bind-surveyjs-answer"]')[a],
                fieldProps = {
                    id: objData.answerCode,
                    name: objData.answerName,
                    type: aType,
                    value: objData.answerId
                };
            
            if( typeof obj.required !== 'undefined' ){ fieldProps.required = true; }
            
            for(let key in fieldProps){
                boundedFieldEl[key] = fieldProps[key];
            }
            boundedFieldEl.setAttribute('data-answer-id', objData.answerId);
            boundedFieldEl.closest('div').querySelector('label').setAttribute('for', objData.answerCode);
            boundedFieldEl.closest('div').querySelector('label span').textContent = answer.answer;
            
            continue;
            
        }
        
        if( typeof answer.answer === 'string' || typeof answer.answer === 'number' ){

                // beforeCode       MANAGE FIELD INDENT ( FOR NESTED ANSWERS - SEE BELOW )
                // afterCode        MANAGE FIELD INDENT ( FOR NESTED ANSWERS - SEE BELOW )
                let surveyFieldType = ( answer.attribute ? 'attribute' : (answer.nested ? 'nested' : ( aType === 'option' ? 'select' : aType )) ),
                    beforeCode = ( progIdsLength > 0 && a === 0 ? '<div class="surveyjs-field-indent">' : '' ),
                    afterCode = ( progIdsLength > 0 && a === listL - 1 ? '</div>' : '' ),
                    data = { answer, objData, beforeCode, afterCode, obj };

                if( typeof generateFieldHTML[surveyFieldType] === 'undefined' ){
                    surveyFieldType = 'input';
                }

                // GENERATE FIELD HTML CODE FROM surveyFieldType
                fieldData = generateFieldHTML[surveyFieldType].call( self, data );
                
                objData = fieldData.objData;

                if( answer.nested ){
                    self.internals.progIds.push( aNum );
                    aLoopHtml += fieldData.aHtml;
                    aLoopHtml += iterateAnswers.call( self, answer.nested, qID, i, objData.attrRequired );
                    continue;
                }

                // IF LOOPING A NESTED ANSWER AND THE END OF THAT ARRAY IS REACHED
                // REMOVE THE LAST ITEM OF progIds ( SO AT THE NEXT LOOP IT WILL NOT INDENT THE ANSWER )
                if( progIdsLength > 0 && a === listL-1 ){ self.internals.progIds.pop(); }

        }

        fieldData.aHtml = replaceTemplateStrings.call(self, fieldData, objData);
        aLoopHtml += fieldData.aHtml;
        
        if( aType === 'option' ){
            a = a + obj.answers.length;
        }
        
    }

    return aLoopHtml;

}
