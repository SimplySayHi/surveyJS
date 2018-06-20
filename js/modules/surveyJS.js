/**
 * @version     1.5.2
 * @file        Generate and manage a survey from a JSON object ( with JS validation )
 * @author      Valerio Di Punzio <sayhi@valeriodipunzio.com>
 * @doc         http://valeriodipunzio.com/plugins/surveyJS/
 * 
 * Dependencies:
 * jQuery
 * FORM ( module - form utils functions, validation etc )
 * WEB_STORAGE ( module - functions to use and extend web storage )
 *
 */



var SURVEY = (function( $, modulesArray ){
    
    //  modules          MAKE ALL MODULES ( FOUND IN modulesArray ) AVAILABLE LOCALLY
    var modules = (function(){
            var modulesObj = {};
            
            if( $.isArray( modulesArray ) ){
                var modL = modulesArray.length;
                
                for(var m=0; m<modL; m++){
                    var mod = modulesArray[m];
                    
                    if( window[mod] ){
                        modulesObj[mod] = $.extend(true, {}, window[mod] );
                    }
                }
            }
            
            return modulesObj;
        })(),
        isAvailableStorage = modules.WEB_STORAGE.isAvailable,
     
    //  GENERAL VARS - JQUERY OBJECTS
    //  $surveyCont     THE MAIN CONTAINER OF THE SURVEY
    //  $surveyImg      IMG TAG FOR THE SURVEY ( THE SRC ATTRIBUTE WILL BE CHENGED )
    //  $surveyTitle    THE TITLE OF THE SURVEY
    //  $surveyDesc     THE DESCRIPTION OF THE SURVEY
    //  $surveyForm     THE FORM USED FOR THE SURVEY
    //  $surveyBody     WHERE THE QUESTION AND ANSWERS HTML WILL BE PRINTED (MUST BE INSIDE THE SURVEY FORM)
        $surveyCont =   $('[data-surveyjs-cont]'),
        $surveyImg =    $surveyCont.find('[data-surveyjs-img]'),
        $surveyTitle =  $surveyCont.find('[data-surveyjs-title]'),
        $surveyDesc =   $surveyCont.find('[data-surveyjs-desc]'),
        $surveyForm =   $surveyCont.find('[data-surveyjs-form]'),
        $surveyBody =   $surveyForm.find('[data-surveyjs-body]'),
        
        defaultFieldClass = 'form-control',
        _generateOptionTags = function( options ){
            var optLength = options.length,
                optionsHtml = ( options[0].id === '' ? '' : '<option value="">'+ settings.selectFirstOption +'</option>' );

            for(var o=0; o<optLength; o++){
                var opt = options[o],
                    optId = opt.id;

                optionsHtml += '<option value="'+ optId +'" data-answer-id="'+ optId +'">'+ opt.answer +'</option>';
            }

            return optionsHtml;
        },
        _setInputLabelCode = function(){
            return (settings.graphicInput === true ? (settings.inputTagCode + settings.labelTagCode) : settings.labelTagCode.replace( /{{answerString}}/g, settings.inputTagCode + '{{answerString}}' ));
        },
        
        localStorageArray = [],
        localStorageName = 'SURVEY_' + location.href + '_' + $surveyForm.attr('name') + '_surveyID[{{surveyID}}]',
        progIds = [],
        surveyJSON = {},
        
        messages = {
            it: {
                loadingBox:         '<div class="survey-loading" data-surveyjs-loading><i class="glyphicon glyphicon-refresh icon-spin"></i> Caricamento in corso...</div>',
                selectFirstOption:  'Seleziona una risposta...',
                textareaPlaceholder:'Scrivi la tua risposta...',
                maxChoiceText:      'RISPOSTE MAX',
                fieldErrorMessage:  '&Egrave; necessario rispondere.',
                fieldErrorMessageMultiChoice:  'Puoi scegliere al massimo {{maxChoiceNum}} risposte.'
            },
            en: {
                loadingBox:         '<div class="survey-loading" data-surveyjs-loading><i class="glyphicon glyphicon-refresh icon-spin"></i> Loading...</div>',
                selectFirstOption:  'Select your answer...',
                textareaPlaceholder:'Write here your answer...',
                maxChoiceText:      'ANSWERS MAX',
                fieldErrorMessage:  'Answer is necessary.',
                fieldErrorMessageMultiChoice:  'You can choose at maximum {{maxChoiceNum}} answers.'
            }
        },
    
        settings = {
            lang:                   'en',
            
            onInitError:            null,
            onInitComplete:         null,
            onInitSuccess:          null,
            
            onValidation:           null,
            beforeSend:             null,
            onSubmitComplete:       null,
            onSubmitError:          null,
            onSubmitSuccess:        null,
            
            fieldOptions:           {
                                        validateOnEvents:'input change'
                                    },
            
            fieldErrorFeedback:     true,
            fieldErrorTemplate:     '<div class="field-error-message">{{fieldErrorMessage}}</div>',
            
            questionTemplate:       '<div data-question-id="{{questionId}}" data-question-index="{{questionNumber}}" data-formjs-question="" class="question-box clearfix" {{maxChoice}}>'+
                                        '<div class="question-header">Question {{questionNumber}}</div>'+
                                        '<div class="question-body">'+
                                            '<div class="question-text">{{questionText}}</div>'+
                                            '<div class="answers-box form-group clearfix">'+
                                                '{{answersHtml}}'+
                                                '{{fieldErrorTemplate}}'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>',
            
            labelTagCode:           '<label for="{{answerCode}}">{{answerString}}</label>',
            
            textareaTemplate:       '<div class="row">'+
                                        '<div class="col-xs-12 textarea-box">'+
                                            '<textarea id="{{answerCode}}" data-answer-id="{{answerId}}" {{nestedAnswer}} name="user-text-answer-{{questionNumber}}" {{attrRequired}} class="{{fieldClass}}" maxlength="250" rows="6" placeholder="{{answerPlaceholder}}"></textarea>'+
                                        '</div>'+
                                     '</div>',
            
            selectTagCode:          '<select id="{{answerCode}}" name="survey-answer-{{questionNumber}}{{addMoreName}}" class="{{fieldClass}}" {{attrRequired}} {{nestedAnswer}} data-answer-root="{{progIdsJoined}}" {{attrRequiredFrom}}>'+
                                        '{{optionsHtml}}'+
                                    '</select>',
            selectTemplate:         '<div class="single-answer" data-answer-index="{{answerIndex}}">'+
                                         '{{selectTagCode}}'+
                                     '</div>',
            
            graphicInput:           false,
            inputTagCode:           '<input type="{{answerType}}" name="survey-answer-{{questionNumber}}{{addMoreName}}" class="{{fieldClass}}" id="{{answerCode}}" {{nestedAnswer}} data-answer-root="{{progIdsJoined}}" data-answer-id="{{answerId}}" value="{{answerIdValue}}" {{attrRequired}} {{attrRequiredFrom}}/>',
            inputTemplate:          '<div class="single-answer input-container {{answerType}}" data-answer-index="{{answerIndex}}">'+
                                        '{{inputLabelTagCode}}'+
                                    '</div>',
            inputGroupTemplate:     '<div class="single-answer input-group" data-answer-index="{{answerIndex}}">'+
                                        '<span class="input-group-addon {{inputTypeClass}}">'+
                                            '<input type="{{answerType}}" name="survey-answer-{{questionNumber}}" id="{{answerCode}}" data-answer-id="{{answerId}}" value="{{answerIdValue}}" {{attrRequired}} data-require-more=""/>'+
                                                '<label for="{{answerCode}}">&nbsp;{{answerString}}</label>'+
                                        '</span>'+
                                        '{{relatedAnswerField}}'+
                                    '</div>'
        },
        
    //  _setJSONurl         URL FOR THE AJAX CALL TO GET THE JSON TO CREATE THE SURVEY
    //  _init               AFTER GETTING THE JSON FROM THE AJAX CALL ( SEE _setJSONurl ), INITIALIZES THE SURVEY ( PRINT GENERAL DATA, Q&A )
        _isInSurvey = function( questionID ){
            var questions = surveyJSON.survey.questions,
                qLength = questions.length,
                index = -1;
            
            for(var q=0; q<qLength; q++){
                var question = questions[q];
                if( question.id == questionID ){
                    index = q;
                    break;
                }
            }
            
            return index;
        },
        _isRequired = function( questionID ){
            
            var questionPos = _isInSurvey( questionID ),
                isSurveyEl = (questionPos !== -1);
            
            return (isSurveyEl ? typeof surveyJSON.survey.questions[questionPos].required !== 'undefined' : false);
        },
        _setJSONurl = function( JSONurl ){
            $surveyBody.before( settings.loadingBox );
            
            $.ajax({
                cache: false,
                url: JSONurl,
                method: 'POST',
                dataType: 'json'
            })
            .always(function(){
                $surveyForm.find('[data-surveyjs-loading]').remove();
                
                if( typeof settings.onInitComplete === 'function' ){
                    settings.onInitComplete( $surveyForm );
                }
            })
            .done(function( data ){
                if( $.isPlainObject( data ) ){
                    var callResult = data.result;

                    if( callResult === 'OK' ){
                        surveyJSON = data;
                        _init( data.survey );
                    }

                    if( typeof settings.onInitSuccess === 'function' ){
                        settings.onInitSuccess( data, $surveyForm );
                    }
                }
            })
            .fail(function( jqXHR, textStatus, errorThrown ){
                if( typeof settings.onInitError === 'function' ){
                    settings.onInitError( jqXHR, textStatus, errorThrown, $surveyForm );
                }
            });
        },
        _printSurveyInfos = function( surveyInfos ){
            var checkData = function( data ){ return (typeof data !== 'undefined' ? data : ''); };
            
            $surveyForm.attr('data-survey-id', surveyInfos.id);
            if( checkData( surveyInfos.image ) ){
                $surveyImg.attr( 'src', surveyInfos.image );
            } else {
                $surveyImg.remove();
            }
            $surveyTitle.text( checkData( surveyInfos.title ) );
            $surveyDesc.text( checkData( surveyInfos.description ) );
        },
        _generateQAcode = function( qaData ){
            var qaData = ( qaData[0]['sort'] ? qaData.sort(function(a, b){ return a['sort'] > b['sort']; }) : qaData ),
                qaCodeAll = '',
                qaDataLength = qaData.length;
            
            for(var i=0; i<qaDataLength; i++){
                var item = qaData[i],
                    maxChoice = item.maxChoice || '',
                    fieldErrorMessage = '',
                    aHtml = '',
                    qaHtml = settings.questionTemplate;

                // HTML CODE FOR THE ANSWER/S
                aHtml += _iterateAnswers( item, item.id, i );

                if( item.question === 'hidden-privacy' ){
                    $surveyCont.find('[data-name="bind-survey-answer"]').closest('[data-formjs-question]').attr({ 'data-question-id': item.id });
                    continue;
                }

                // REPLACE QUESTION DATA AND ANSWERS HTML IN LOCAL VARIABLE qaHtml
                qaHtml = qaHtml.replace( /{{questionId}}/g, item.id );
                qaHtml = qaHtml.replace( /{{questionNumber}}/g, (i+1) );
                qaHtml = qaHtml.replace( /{{questionText}}/g, item.question + ( maxChoice !== '' ? ' ('+ maxChoice +' '+ settings.maxChoiceText +')' : '' ) );
                qaHtml = qaHtml.replace( /{{answersHtml}}/g, aHtml );
                qaHtml = qaHtml.replace( /{{maxChoice}}/g, ( maxChoice !== '' ? 'data-max-check="' + maxChoice + '"' : '' ) );
                qaHtml = qaHtml.replace( /{{fieldErrorTemplate}}/g, ( settings.fieldErrorFeedback ? settings.fieldErrorTemplate : '' ) );
                if( settings.fieldErrorFeedback && settings.fieldErrorTemplate.indexOf('{{fieldErrorMessage}}') !== -1 ){
                    var message = ( maxChoice ? '<span>' + settings.fieldErrorMessage + '</span><span>' + settings.fieldErrorMessageMultiChoice + '</span>' : settings.fieldErrorMessage );
                    qaHtml = qaHtml.replace( /{{fieldErrorMessage}}/g, message ).replace( /{{maxChoiceNum}}/g, maxChoice );
                }

                qaCodeAll += qaHtml;
            }
            
            return qaCodeAll;
        },
        _init = function( surveyData ){
                // ITERATES THE QUESTIONS ( AND ALSO THEIR ANSWERS )...AND RETURN ALL THE HTML CODE
                var qaHtmlAll = _generateQAcode( surveyData.questions );
                
                // REPLACE SURVEY ID IN LOCALSTORAGE NAME
                localStorageName = localStorageName.replace( /{{surveyID}}/g, surveyData.id );
                
                // PRINT GENERAL SURVEY DATA: ID, IMAGE, TITLE AND DESCRIPTION
                _printSurveyInfos( surveyData );
                
                // PRINT ALL QUESTIONS & ANSWERS
                $surveyBody.append( qaHtmlAll );
                
                // FILL ANSWERS WITH LOCAL STORAGE ( IF AVAILABLE )
                _populateSurvey();
                
                // INIT FIELDS AND SURVEY-FORM VALIDATION
                _initValidationEvents();
                
                $surveyForm.addClass('survey-init-success');           
        },
        
    //  _iterateAnswers   THIS FUNCTION ITERATES THE ANSWERS AND PUTS THE CODE TOGETHER
        _iterateAnswers = function( obj, qID, qIdx, attrReq ){
                // obj          MUST BE AN ARRAY OF STRINGS OR AN OBJECT THAT CONTAINS 'answers' AS ARRAY (THE FUNCTION _iterateAnswers LOOPS UNTIL A STRING IS FOUND, AND PRINTS IT)
                // qIdx         INDEX OF THE QUESTION
                // attrReq      HTML REQUIRED ATTRIBUTE THAT WILL BE PRINTED (THIS PARAMETER MUST NOT BE PASSED INITIALLY. IT IS AUTOMATICALLY PASSED INSIDE THE LOOP IF NECESSARY)
                // aLoopHtml    THE CODE OF ALL ANSWERS ( PRINTED ONLY AT THE END )
                var list = ( $.isArray( obj ) ? obj : obj.answers ),
                    listL = list.length,
                    qID = (obj.id ? obj.id : (qID ? qID : 0)),
                    i = qIdx || 0,
                    aLoopHtml = '',
                    needsBinding = (obj.question === 'hidden-privacy' ? true : false);
            
                if( list[0]['sort'] ){
                    list.sort(function(a, b){
                        return a['sort'] > b['sort'];
                    });
                }

                for(var a=0; a<listL; a++){
                    // beforeCode       MANAGE FIELD INDENT ( FOR NESTED ANSWERS - SEE BELOW )
                    // afterCode        MANAGE FIELD INDENT ( FOR NESTED ANSWERS - SEE BELOW )
                    var aHtml = '',
                        answer = ( $.isArray( obj ) ? obj[a] : obj.answers[a] ),
                        aNum = (a+1),
                        qNum = (i+1),
                        aType = answer.type,
                        aId = answer.id,
                        progIdsJoined = ( progIds.length > 0 ? progIds.join('-') : '' ),
                        beforeCode = ( progIds.length > 0 && a === 0 ? '<div class="field-indent">' : '' ),
                        afterCode = ( progIds.length > 0 && a === listL-1 ? '</div>' : '' ),
                        relatedAnswerField = '';
                    
                    var objData = {
                        // answerId         ANSWER ID AS FROM THE JSON. THIS IS USED AS VALUE ATTRIBUTE OF THE ANSWER
                        // answerType       ANSWER TYPE AS FROM THE JSON. USED TO CHECK WHICH FIELD MUST BE CREATED ( EG: text, radio, checkbox, select, textarea )
                        // nestedAnswer     CREATES THE data-nested-index ATTRIBUTE TO PRINT IF AN ANSWER IS NESTED ( SEE BELOW FOR NESTED ANSWERS )
                        // answerCode       ID ATTRIBUTE OF THE ANSWER
                        //                  ( BUILT AS: "answerType-questionID-answerID-questionNumber[-nestingLevels]-answerNumber" )
                        //                  ONLY AN ATTRIBUTE-ANSWER DOES NOT USE THE answerCode
                            answerId: aId,
                            answerIdValue: (aType === 'text' ? '' : aId),
                            answerIndex: aNum,
                            answerName: 'survey-answer-'+qNum,
                            answerPlaceholder: '',
                            answerString: (typeof answer.answer === 'string' ? answer.answer : ''),
                            answerType: aType,
                            attrRequired: ( typeof obj.required !== 'undefined' ? 'required=""' : (typeof attrReq !== 'undefined' ? attrReq : '') ),
                            fieldClass: ( aType !== 'checkbox' && aType !== 'radio' ? defaultFieldClass : '' ),
                            nestedAnswer: ( progIdsJoined !== '' ? 'data-nested-index="'+ aNum +'"' : '' ),
                            optionsHtml: '',
                            progIdsJoined: progIdsJoined,
                            questionNumber: qNum,
                            answerCode: (aType === 'option' ? 'select' : aType) +'-' + qID +'-'+ (aId || 0) + '-' + qNum + (progIdsJoined !== '' ? '-'+progIdsJoined : '') +'-'+ aNum
                        };
                    
                    if( needsBinding ){
                        
                        var $boundedField = $surveyCont.find('[data-name="bind-survey-answer"]').eq( a ),
                            fieldProps = {
                                id: objData.answerCode,
                                name: objData.answerName,
                                type: aType,
                                value: objData.answerId
                            };
                        
                        if( typeof obj.required !== 'undefined' ){ fieldProps.required = true; }
                        
                        $boundedField.prop( fieldProps ).attr('data-answer-id', objData.answerId);
                        $boundedField.closest('div').find('label').attr({ for: objData.answerCode }).find('span').text( answer.answer );
                        
                        continue;
                        
                    }
                    
                    if( typeof answer.answer === 'string' ){

                            // RELATED ANSWER
                            // IF AN ANSWER REQUIRE TO FILL OR SELECT ANOTHER RELATED ANSWER
                            if( answer.attribute ){
                                
                                var attr = answer.attribute,
                                    attributeIsArray = $.isArray( attr );
                                
                                aHtml = settings.inputGroupTemplate;
                                relatedAnswerField = ( attributeIsArray ? settings.selectTagCode : settings.inputTagCode );
                                
                                if( attributeIsArray ){
                                    // CREATE A GROUP WITH A RADIO INPUT AND ITS RELATED ANSWER (A SELECT FIELD)
                                    objData.optionsHtml = _generateOptionTags( attr );
                                }
                                
                            }
                            
                            // NESTED ANSWER -> IT IS A CHILD ANSWER OF ITS PARENT
                            // EXAMPLE:
                            // IF 'WEBSITE' IS THE PARENT ANSWER
                            // IT CAN HAVE THESE CHILDREN ANSWERS: PC - SMARTPHONE - TABLET
                            // SO THE PARENT ANSWER IS PRINTED AS TEXT ( WITHOUT THE INPUT FIELD ) AND ITS nested ANSWERS WILL BE LOOPED
                            else if( answer.nested ){
                                
                                aLoopHtml += beforeCode+'<div class="'+ aType +'"><label for="'+ objData.answerCode +'" class="field-no-indent">' + answer.answer +'</label></div>'+afterCode;
                                progIds.push( aNum );
                                aLoopHtml += _iterateAnswers( answer.nested, qID, i, objData.attrRequired );
                                continue;
                                
                            }

                            // IF AN ANSWER IS A TEXTAREA
                            // ELSE ( THIS MEANS THAT THE ANSWER IS A SIMPLE STRING WITH NO OTHER FEATURES ) PRINT THE ANSWER AS IT IS
                            else if( aType === 'textarea' ){
                                
                                aHtml = settings.textareaTemplate;
                                objData.answerPlaceholder = answer.placeholder || settings.textareaPlaceholder;
                                
                            } else if( aType !== 'checkbox' && aType !== 'radio' && aType !== 'option' ){
                                
                                // EVERY FIELD THAT IS NOT A TEXTAREA, CHECKBOX, RADIO, SELECT (-> OPTION), SO:
                                // TEXT, EMAIL, NUMBER, PASSWORD, RANGE AND SO ON...
                                aHtml = beforeCode + settings.inputTemplate + afterCode;
                                objData.nestedAnswer += ' class="'+ defaultFieldClass +'"';
                                
                            } else {
                                
                                if( aType === 'option' ){
                                    aHtml = beforeCode + settings.selectTemplate + afterCode;
                                    objData.optionsHtml = _generateOptionTags( obj.answers );

                                } else {
                                    // FOR CHECKBOX AND RADIO
                                    aHtml = beforeCode + settings.inputTemplate + afterCode;
                                }
                                
                            }

                            // IF LOOPING A NESTED ANSWER AND THE END OF THAT ARRAY IS REACHED
                            // REMOVE THE LAST ITEM OF progIds ( SO AT THE NEXT LOOP IT WILL NOT INDENT THE ANSWER )
                            if( progIds.length > 0 && a === listL-1 ){ progIds.pop(); }

                    }
                    
                    if( objData.optionsHtml !== '' ){
                        aHtml = aHtml.replace( /{{selectTagCode}}/g, settings.selectTagCode );
                    }
                    if( relatedAnswerField !== '' ){
                        relatedAnswerField = relatedAnswerField.replace( /{{answerCode}}/g, '' );
                        relatedAnswerField = relatedAnswerField.replace( /{{answerType}}/g, 'text' );
                        relatedAnswerField = relatedAnswerField.replace( /{{fieldClass}}/g, defaultFieldClass );
                        relatedAnswerField = relatedAnswerField.replace( /{{answerIdValue}}/g, '' );
                        relatedAnswerField = relatedAnswerField.replace( /{{attrRequired}}/g, '' );
                        relatedAnswerField = relatedAnswerField.replace( /{{addMoreName}}/g, '-more' );
                        relatedAnswerField = relatedAnswerField.replace( /{{attrRequiredFrom}}/g, 'data-required-from="#'+ objData.answerCode +'"' );
                        
                        aHtml = aHtml.replace( /{{relatedAnswerField}}/g, relatedAnswerField );
                    } else {
                        aHtml = aHtml.replace( /{{addMoreName}}/g, '' );
                        aHtml = aHtml.replace( /{{attrRequiredFrom}}/g, '' );
                    }
                    
                    for( var key in objData ){
                        var regexStr = new RegExp( '{{' + key + '}}', 'g' );
                        aHtml = aHtml.replace( regexStr, objData[key] );
                    }

                    aLoopHtml += aHtml;
                    
                    if( aType === 'option' ){
                        a = a + obj.answers.length;
                    }
                    
                } // close of for loop

                return aLoopHtml;
        },
        
    //  _isInLocalStorage   CHECK IF THE ITEM IS ALREADY IN THE LOCAL STORAGE: RETURNS ITS POSITION INSIDE THE ARRAY ( RETURNS -1 IF NOT FOUND)
    //  _populateSurvey     SET THE USER'S ANSWERS FOUND IN LOCAL STORAGE
        _isInLocalStorage = function( fieldName, multiChoiceValue ){
            var lsSurvey = localStorage.getObject( localStorageName );
            
            if( lsSurvey ){
                var lsSurveyLength = lsSurvey.length;
                
                for(var ls=0; ls<lsSurveyLength; ls++){
                    var lsItem = lsSurvey[ls];
                    
                    if( lsItem.field === fieldName ){
                        if( typeof multiChoiceValue !== 'undefined' && multiChoiceValue ){
                            if( lsItem.value !== multiChoiceValue ){
                                continue;
                            }
                        }
                        return ls;
                    }
                }
            }
            
            return -1;
        },
        _populateSurvey = function(){
            if( isAvailableStorage && localStorage.getObject( localStorageName ) ){
                var LS = localStorage.getObject( localStorageName ),
                    LSlength = LS.length,
                    fieldOptions = $.extend( true, {}, {focusOnRelated: false}, settings.fieldOptions );
                
                localStorageArray = LS;
                
                for(var i=0; i<LSlength; i++){
                    var item = LS[i],
                        $fieldWithName = $surveyCont.find( '[name="' + item.field + '"]' ),
                        $fieldFirst = ( $fieldWithName.length > 1 ? $fieldWithName.first() : $fieldWithName ),
                        isRadioOrCheckbox = $fieldFirst.is('[type="radio"], [type="checkbox"]'),
                        $field = ( isRadioOrCheckbox ? $surveyCont.find( '[name="' + item.field + '"][value="' + item.value + '"]' ) : $fieldFirst );
                    
                    if( isRadioOrCheckbox ){
                        $field.prop('checked', true);
                    } else {
                        $field.val( item.value );
                    }

                    modules.FORM.isValidField( $field, fieldOptions );
                }
            } else {
                if( !isAvailableStorage ){ console.warn('LOCAL STORAGE IS NOT SUPPORTED!'); }
            }
        },
        _initValidationEvents = function(){
            // VALIDATE A FIELD WHEN input blur change EVENTS OCCUR ( ONLY IF IT HAS THE REQUIRED ATTRIBUTE )
            // IF THE FIELD HAS THE ATTRIBUTE data-required-from ( AND IT IS NOT EMPTY ):
            // SET IT AS REQUIRED AND SET THE RELATED FIELD ( WITH ATTRIBUTE data-required-from ) AS CHECKED
            $surveyCont.on(
                settings.fieldOptions.validateOnEvents,
                '[data-surveyjs-form] input:not([type="reset"]):not([type="submit"]), [data-surveyjs-form] select, [data-surveyjs-form] textarea, [data-name="bind-survey-answer"]',
            function( event ){
                var eventType = event.originalEvent.type,
                    $this = $(this),
                    fieldValue = $this.val().trim(),
                    isMultiChoice = $this.closest('[data-max-check]').length > 0,
                    isRequireMore = $this.is('[data-require-more]'),
                    isRequiredFrom = $this.is('[data-required-from]');

                // VARS USED TO VALIDATE THE FILED IF IT IS REQUIRED
                var $item = ( $this.is('[data-required-from]') ? $($this.data('required-from')) : $this ),
                    questionID = ($item.attr('id') ? $item.attr('id').split('-')[1] : 'id-not-found'),
                    isFieldForChangeEvent = ($this.is('select, [type="radio"], [type="checkbox"]'));

                if( _isInSurvey( questionID ) === -1 ){ return true; }
                
                // MANAGE ITEMS IN LOCAL STORAGE ( IF AVAILABLE AND USABLE )  
                if( isAvailableStorage && eventType === 'input' && !$this.is('[data-exclude-storage]') ){
                    var inArrayPos = _isInLocalStorage( $this.attr('name'), (isMultiChoice ? fieldValue : false) ),
                        inArrayRequireMorePos = _isInLocalStorage( $this.attr('name')+'-more' );

                    if( !isRequireMore && !isRequiredFrom && inArrayRequireMorePos !== -1 ){
                        localStorageArray.splice(inArrayRequireMorePos, 1);
                    }

                    if( inArrayPos !== -1 ){
                        if( isMultiChoice ){
                            if( $this.prop('checked') === false && localStorageArray[inArrayPos].value === fieldValue ){
                                // REMOVE ITEM FROM LS
                                localStorageArray.splice(inArrayPos, 1);
                            } else {
                                // ADD ITEM TO LS
                                localStorageArray.push( { field: $this.attr('name'), value: fieldValue } );
                            }
                        } else {
                            if( fieldValue !== '' ){
                                localStorageArray[inArrayPos].value = fieldValue;
                            } else {
                                localStorageArray.splice(inArrayPos, 1); 
                            }
                        }
                    } else {
                        if( fieldValue !== '' ){
                            if( isRequiredFrom && fieldValue !== '' ){
                                var $elReqMore = $( $this.attr('data-required-from') ),
                                    oldFieldNamePos = _isInLocalStorage( $elReqMore.attr('name') );

                                if( oldFieldNamePos !== -1 ){
                                    localStorageArray.splice(oldFieldNamePos, 1);
                                }
                                localStorageArray.push( { field: $elReqMore.attr('name'), value: $elReqMore.val().trim() } );
                            }
                            localStorageArray.push( { field: $this.attr('name'), value: fieldValue } );
                            if( isRequireMore ){
                                var $elReqFrom = $surveyForm.find( '[data-required-from="#' + $this.attr('id') + '"]' );
                                localStorageArray.push( { field: $elReqFrom.attr('name'), value: $elReqFrom.val().trim() } );
                            }
                        }
                    }

                    localStorage.setObject( localStorageName, localStorageArray );
                }

                if(
                    _isRequired( questionID ) &&
                    (
                        ( isFieldForChangeEvent && eventType === 'change' ) ||
                        ( !isFieldForChangeEvent && eventType === 'input' ) ||
                        ( eventType !== 'change' && eventType !== 'input' )
                    )
                ){
                    var fieldOptions = settings.fieldOptions,
                        validationResult = modules.FORM.isValidField( $this, fieldOptions );
                    
                    if( typeof settings.onValidation === 'function' ){

                        var callbackData = {
                                event: event,
                                fields: [ { $field: $this, result: validationResult } ]
                            };
                        settings.onValidation( callbackData );

                    }
                }
            });

            $surveyForm.on('submit', function( event ){
                event.preventDefault();
                _sendSurvey();
            });
        },
        
    //  _checkAnswers     CHECK IF ANSWERS ARE FILLED AND CREATE THE JS OBJECT WITH THE DATA TO SEND
    //  _sendSurvey       CHECK & PUTS TOGETHER ALL THE ANSWERS DATA AND SEND THEM WITH THE AJAX CALL
        _checkAnswers = function(){
                var obj = {
                        isValid: true,
                        callbackData: {
                            event: 'submit',
                            fields: []
                        },
                        answersArray: []
                    },
                    fieldNameCheck = '',
                    fieldTypeCheck = '';
                
                $surveyForm
                    .find('input:not([type="reset"]):not([type="submit"]), select, textarea')
                    .add( $surveyCont.find('[data-name="bind-survey-answer"]') )
                .each(function(){
                    var $field = $(this),
                        type = $field.attr('type'),
                        name = $field.attr('name');

                    // IF A FIELD HAS THE SAME NAME ATTRIBUTE AND IT IS OF THE SAME TYPE
                    // SKIP THE REST OF THE CODE FOR THIS FIELD AND GO TO THE NEXT
                    if( (name === fieldNameCheck && type === fieldTypeCheck) ){ return true; }
                    
                    if( !$field.is('[data-required-from]') ){
                        fieldNameCheck = name;
                        fieldTypeCheck = type;
                    }

                    // EACH QUESTION HAS ITS OWN OBJECT ( qaObj ) THAT CONTAINS THE RELATED DATA:
                    // question:    THE QUESTION ID ( undefined FOR QUESTIONS WITH ATTRIBUTE data-required-form - will be skipped later )
                    // answer       AN OBJECT THAT CONTAINS THE FOLLOWS:
                    //                  id_answer:      THE ANSWER ID
                    //                  text:           IF THE FIELD IS A TEXTAREA
                    //                  attributes:     IF THE ANSWER IS NESTED OR IS REQUIRED FROM ANOTHER ANSWER (SEE BELOW)
                    var questionId = $field.closest('[data-question-id]').data('question-id') || '',
                        fieldValue = $field.val().trim(),
                        qaObj = {
                            question: questionId,
                            answer: {
                                id_answer: [ fieldValue ]
                            }
                        },
                        callbackField = {
                            $field: $field,
                            result: true
                        };

                    // VALIDATE THE FILED IF IT IS REQUIRED
                    if( questionId !== '' && _isRequired(questionId) ){
                        
                        var fieldOptions = $.extend( true, {}, {focusOnRelated: false}, settings.fieldOptions );
                        
                        if( !modules.FORM.isValidField( $field, fieldOptions ) ){
                            callbackField.result = false;
                            obj.callbackData.fields.push( callbackField );
                            obj.isValid = false;
                            return true;
                        }
                        
                    }

                    // A FIELD WITH ATTRIBUTE 'data-required-from' IS MANAGED TOGETHER WITH ITS RELATED FIELD ( WHICH HAS ATTRIBUTE 'data-require-more' )
                    // IF QUESTION ID IS EMPTY -> SKIP THE FIELD ( USEFUL FOR FORM FIELDS OUTSIDE THE SURVEY BODY )
                    if( $field.is('[data-required-from]') || questionId === '' || _isInSurvey( questionId ) === -1 ){ return true; }
                    
                    obj.callbackData.fields.push( callbackField );
                    
                    if( $field.is('textarea') ){
                        qaObj.answer.text = fieldValue;
                    }

                    if( type === 'radio' ){
                        var $container = ($field.closest('form').length ? $surveyForm : $field.closest('[data-formjs-question]') ),
                            $elem = $container.find('[name="'+ name +'"]:checked');
                        
                        // FOR RADIO THAT REQUIRE THE USER TO GIVE ONE MORE ANSWER
                        if( $elem.is('[data-require-more]') ){
                            qaObj.answer.attributes = $('[data-required-from="#'+ $elem.attr('id') +'"]').val().trim();
                        }
                        
                        if( $elem.is('[data-nested-index]') ){
                            qaObj.answer.attributes = $elem.attr('data-nested-index');
                        }
                        
                        qaObj.answer.id_answer = [ $elem.val().trim() ];
                    }

                    if( type === 'checkbox' && $field.closest('[data-max-check]').length > 0 ){
                        qaObj.answer.id_answer = [];
                        $surveyForm.find('[name="'+ name +'"]:checked').each(function(id, el){
                            qaObj.answer.id_answer.push( $(el).val().trim() );
                        });
                    }
                    
                    obj.answersArray.push( qaObj );
                });
            
                return obj;
        },
        _sendSurvey = function(){
                var $btn = $surveyForm.find('[type="submit"]');

                if( $btn.is(':disabled') ){ return false; }
                
                // answersOBJ       THE JS OBJECT THAT WILL CONTAIN ALL THE QUESTIONS & ANSWERS ( AS OBJECTS {} )
                var checkAnswers = _checkAnswers(),
                    answersOBJ = {
                        id: $surveyForm.attr('data-survey-id'),
                        answers: checkAnswers.answersArray
                    },
                    ajaxUrl = $surveyForm.attr('action');
            
                if( typeof settings.onValidation === 'function' ){
                    settings.onValidation( checkAnswers.callbackData );
                }

                if( checkAnswers.isValid ) {
                    // SUBMIT BUTTON IS DISABLED SO TH USER CANNOT PRESS IT UNTIL THE CALL HAS FINISHED
                    $btn.prop('disabled', true);
                    
                    // REMOVE ALERTS BOXES ( IN CASE THE AJAX CALL WENT TO ERROR AND THE USER RE-SUBMIT THE FORM )
                    $surveyCont.find('.alert').remove();
                    
                    if( typeof settings.beforeSend === 'function' ){
                        answersOBJ = settings.beforeSend( answersOBJ, $surveyForm ) || answersOBJ;
                    }
                    
                    // AJAX CALL TO SEND THE DATA
                    $.ajax({
                        cache: false,
                        url: ajaxUrl,
                        dataType: 'json',
                        type: 'POST',
                        data: 'surveyJSON=' + JSON.stringify( answersOBJ )
                    })
                    .always(function(){
                        // RE-ENABLE THE SUBMIT BUTTON
                        $btn.prop('disabled', false);
                        
                        if( typeof settings.onSubmitComplete === 'function' ){
                            settings.onSubmitComplete( $surveyForm );
                        }
                    })
                    .done(function( data ){
                        if( $.isPlainObject( data ) ){
                            // REMOVE LOCAL STORAGE FOR THE SURVEY
                            if( isAvailableStorage ){
                                localStorage.removeItem( localStorageName );
                            }

                            // EXECUTE THE CALLLBACK FUNCTION
                            if( typeof settings.onSubmitSuccess === 'function' ){
                                settings.onSubmitSuccess( data, $surveyForm );
                            }
                        }
                    })
                    .fail(function( jqXHR, textStatus, errorThrown ){
                        if( typeof settings.onSubmitError === 'function' ){
                            settings.onSubmitError( jqXHR, textStatus, errorThrown, $surveyForm );
                        }
                    });
                    
                }
        },
    
        
        
    //////////////////////
    //  PUBLIC METHODS
    //  addLanguage      TO ADD A NEW LANGUAGE OR OVERRIDE AN EXISTING ONE ( MUST CONTAIN ALL THE KEY-VALUE PAIRS AS IN messages )
    //  setup            TO INITIALIZE THE SURVEY ( PASSING AT LEAST setJSONurl AS STRING ) TO OVERRIDE THE DEFAULT SETTINGS ( SEE settings ABOVE )
        addLanguage = function( newLang, newMessages ){
            var langValue = newLang.toLowerCase();
            
            messages[ langValue ] = newMessages;
            settings.lang = langValue;
        },
        setup = function( options ){
            if( typeof options !== 'undefined' && $.isPlainObject( options ) ){
                if( typeof options.setJSONurl === 'string' ){
                    // SET THE lang VALUE ( MANDATORY FOR OTHER OPERATIONS )
                    if( typeof options.lang === 'string' ){
                        var langValue = options.lang.toLowerCase();
                        if( messages[ langValue ] ){
                            settings.lang = langValue;
                        }
                    }
                    
                    // SET THE graphicInput VALUE ( MANDATORY FOR OTHER OPERATIONS )
                    if( typeof options.graphicInput === 'boolean' ){
                        settings.graphicInput = options.graphicInput;
                    }
                    
                    settings = $.extend( true, settings, messages[settings.lang] );
                    settings = $.extend( true, settings, options );

                    if( settings.inputTemplate.indexOf('{{inputLabelTagCode}}') !== -1 ){
                        settings.inputTemplate = settings.inputTemplate.replace( /{{inputLabelTagCode}}/g, _setInputLabelCode() );
                    }
                    
                    if( settings.inputGroupTemplate.indexOf('{{inputTypeClass}}') !== -1 ){
                        var inputTypeClass = ( settings.graphicInput === true ? 'radio' : '' );
                        settings.inputGroupTemplate = settings.inputGroupTemplate.replace( /{{inputTypeClass}}/g, inputTypeClass );
                    }

                    _setJSONurl( options.setJSONurl );
                } else {
                    console.error('SURVEY.setup > setJSONurl IS MANDATORY TO INITIALIZE THE SURVEY');
                }
            }
        };
    //////////////////////

    
    
    return {
        addLanguage: addLanguage,
        setup: setup
    };
    
})( jQuery, ['WEB_STORAGE', 'FORM'] );