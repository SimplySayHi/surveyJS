/**
 * @version     1.6.0
 * @file        Javascript Survey Creation & Management. Made Easy
 * @author      Valerio Di Punzio <sayhi@valeriodipunzio.com>
 * @doc         http://valeriodipunzio.com/plugins/surveyJS/
 * 
 * Dependencies:
 * jQuery 1.12.4+
 * formJS 2.3.2 ( module - form utils functions, validation etc )
 * WEB_STORAGE ( module - functions to use and extend web storage )
 *
 */



var SURVEY = (function( $ ){
    
    var 
    //  GENERAL VARS - JQUERY OBJECTS
    //  $surveyCont     THE MAIN CONTAINER OF THE SURVEY
    //  $surveyImg      IMG TAG FOR THE SURVEY ( THE SRC ATTRIBUTE WILL BE CHENGED )
    //  $surveyTitle    THE TITLE OF THE SURVEY
    //  $surveyDesc     THE DESCRIPTION OF THE SURVEY
    //  $surveyForm     THE FORM USED FOR THE SURVEY
    //  $surveyBody     WHERE THE QUESTION AND ANSWERS HTML WILL BE PRINTED (MUST BE INSIDE THE SURVEY FORM)
        $surveyCont =   $('[data-surveyjs-container]'),
        $surveyImg =    $surveyCont.find('[data-surveyjs-img]'),
        $surveyTitle =  $surveyCont.find('[data-surveyjs-title]'),
        $surveyDesc =   $surveyCont.find('[data-surveyjs-description]'),
        $surveyForm =   $surveyCont.find('[data-surveyjs-form]'),
        $surveyBody =   $surveyForm.find('[data-surveyjs-body]'),
        
        _getAnswersJSON = function( fields ){
                // obj -> JSON object sent to the server
                var obj = {
                        answers: [],
                        id: surveyID
                    },
                    fieldNameCheck = '',
                    fieldTypeCheck = '';
                
                $(fields).add( $surveyCont.find('[data-name="bind-surveyjs-answer"]') )
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
                    var questionId = $field.closest('[data-question-id]').attr('data-question-id') || '',
                        fieldValue = $field.val(),
                        qaObj = {
                            question: questionId,
                            answer: {
                                id_answer: [ fieldValue ]
                            }
                        };

                    // A FIELD WITH ATTRIBUTE 'data-required-from' IS MANAGED TOGETHER WITH ITS RELATED FIELD ( WHICH HAS ATTRIBUTE 'data-require-more' )
                    // IF QUESTION ID IS EMPTY -> SKIP THE FIELD ( USEFUL FOR FORM FIELDS OUTSIDE THE SURVEY BODY )
                    if( $field.is('[data-required-from]') || questionId === '' || _isInSurvey( questionId ) === -1 ){ return true; }
                                        
                    if( $field.is('textarea') ){
                        qaObj.answer.id_answer = [ '' ];
                        qaObj.answer.text = fieldValue;
                    }

                    if( type === 'radio' ){
                        var $container = ($field.closest('form').length ? $surveyForm : $field.closest('[data-formjs-question]') ),
                            $elem = $container.find('[name="'+ name +'"]:checked');
                        
                        if( $elem.length > 0 ){
                            // FOR RADIO THAT REQUIRE THE USER TO GIVE ONE MORE ANSWER
                            if( $elem.is('[data-require-more]') ){
                                qaObj.answer.attributes = $('[data-required-from="#'+ $elem.attr('id') +'"]').val().trim();
                            }
                            
                            if( $elem.is('[data-nested-index]') ){
                                qaObj.answer.attributes = $elem.attr('data-nested-index');
                            }
                            
                            qaObj.answer.id_answer = [ $elem.val().trim() ];
                        } else {
                            qaObj.answer.id_answer = [ '' ];
                        }
                    }

                    if( type === 'checkbox' && $field.is('[data-checks]') ){
                        qaObj.answer.id_answer = [];
                        $surveyForm.find('[name="'+ name +'"]:checked').each(function(id, el){
                            qaObj.answer.id_answer.push( $(el).val().trim() );
                        });
                    }
                    
                    obj.answers.push( qaObj );
                });
            
                return obj;
        },

        isAvailableStorage = WEB_STORAGE.isAvailable,
        formJSinstance,
        surveyID,
        localStorageArray = [],
        localStorageName = 'SURVEY_' + location.href + '_' + $surveyForm.attr('name') + '_surveyID[{{surveyID}}]',
        progIds = [],
        surveyJSON = {},
        
        messages = {
            it: {
                loadingBox:         '<div class="surveyjs-loading" data-surveyjs-loading><i class="glyphicon glyphicon-refresh icon-spin"></i> Caricamento in corso...</div>',
                selectFirstOption:  'Seleziona una risposta...',
                textareaPlaceholder:'Scrivi la tua risposta...',
                maxChoiceText:      'RISPOSTE MAX',
                fieldErrorMessage:  '&Egrave; necessario rispondere.',
                fieldErrorMessageMultiChoice:  'Puoi scegliere da {{checksMin}} a {{checksMax}} risposte.'
            },
            en: {
                loadingBox:         '<div class="surveyjs-loading" data-surveyjs-loading><i class="glyphicon glyphicon-refresh icon-spin"></i> Loading...</div>',
                selectFirstOption:  'Select your answer...',
                textareaPlaceholder:'Write here your answer...',
                maxChoiceText:      'ANSWERS MAX',
                fieldErrorMessage:  'Answer is necessary.',
                fieldErrorMessageMultiChoice:  'You can choose from {{checksMin}} to {{checksMax}} answers.'
            }
        },
    
        settings = {
            cssClasses: {
                checkbox:           'form-check-input',
                default:            'form-control',
                file:               'form-control-file',
                label:              'form-check-label',
                radio:              'form-check-input',
                select:             'form-control',
                textarea:           'form-control'
            },
            fieldErrorFeedback:     true,
            fieldOptions: {
                validateOnEvents:   'input change'
            },
            formOptions: {
                ajaxOptions: {
                    method:         ($surveyForm.attr('method') ? $surveyForm.attr('method').toUppercase() : 'POST'),
                    url:            $surveyForm.attr('action') || ''
                },
                getFormJSON:        _getAnswersJSON
            },
            lang:                   'en',
            onInitComplete:         null,
            onInitError:            null,
            onInitSuccess:          null,
            templates: {
                fieldError: '<div class="surveyjs-field-error-message">{{fieldErrorMessage}}</div>',

                input:      '<div class="surveyjs-single-answer surveyjs-input-container surveyjs-answer-{{answerType}} form-check" data-answer-index="{{answerIndex}}">'+
                                '{{inputTagCode}}'+
                                '{{labelTagCode}}'+
                            '</div>',

                inputGroup: '<div class="surveyjs-single-answer input-group" data-answer-index="{{answerIndex}}">'+
                                '<div class="input-group-prepend">'+
                                    '<div class="input-group-text form-check surveyjs-answer-{{answerType}}">'+
                                        '<input type="{{answerType}}" name="surveyjs-answer-{{questionNumber}}" id="{{answerCode}}" data-answer-id="{{answerId}}" value="{{answerIdValue}}" {{attrRequired}} data-require-more="" class="surveyjs-input surveyjs-radio form-check-input" />'+
                                        '<label for="{{answerCode}}" class="surveyjs-label form-check-label">{{answerString}}</label>'+
                                    '</div>'+
                                '</div>'+
                                '{{relatedAnswerField}}'+
                            '</div>',
                
                inputTag:   '<input type="{{answerType}}" name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-input surveyjs-{{answerType}} {{fieldClass}}" id="{{answerCode}}" {{nestedAnswer}} data-answer-root="{{progIdsJoined}}" data-answer-id="{{answerId}}" value="{{answerIdValue}}" {{attrRequired}} {{attrChecks}} {{attrRequiredFrom}} />',

                labelTag:   '<label for="{{answerCode}}" class="surveyjs-label {{labelClass}}">{{answerString}}</label>',

                question:   '<div data-question-id="{{questionId}}" data-question-index="{{questionNumber}}" data-formjs-question class="surveyjs-question-box clearfix">'+
                                '<div class="surveyjs-question-header">Question {{questionNumber}}</div>'+
                                '<div class="surveyjs-question-body">'+
                                    '<div class="surveyjs-question-text">{{questionText}}</div>'+
                                    '<div class="surveyjs-answers-box form-group clearfix">'+
                                        '{{answersHtml}}'+
                                        '{{fieldErrorTemplate}}'+
                                    '</div>'+
                                '</div>'+
                            '</div>',

                select:     '<div class="surveyjs-single-answer surveyjs-answer-select" data-answer-index="{{answerIndex}}">'+
                                '{{selectTagCode}}'+
                            '</div>',

                selectTag:  '<select id="{{answerCode}}" name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-select {{fieldClass}}" {{attrRequired}} {{nestedAnswer}} data-answer-root="{{progIdsJoined}}" {{attrRequiredFrom}}>'+
                                '{{optionsHtml}}'+
                            '</select>',

                textarea:   '<div class="surveyjs-single-answer surveyjs-answer-textarea">'+
                                '<textarea id="{{answerCode}}" data-answer-id="{{answerId}}" {{nestedAnswer}} name="surveyjs-answer-{{questionNumber}}" {{attrRequired}} class="surveyjs-textarea {{fieldClass}}" {{answerMaxlength}} rows="6" placeholder="{{answerPlaceholder}}"></textarea>'+
                            '</div>'
            },
            useLocalStorage:        true
        },
        
    //  _init               AFTER GETTING THE JSON FROM THE AJAX CALL ( SEE _setJSONurl ), INITIALIZES THE SURVEY ( PRINT GENERAL DATA, Q&A )
    //  _isInLocalStorage   CHECK IF THE ITEM IS ALREADY IN THE LOCAL STORAGE: RETURNS ITS POSITION INSIDE THE ARRAY ( RETURNS -1 IF NOT FOUND)
    //  _iterateAnswers   THIS FUNCTION ITERATES THE ANSWERS AND PUTS THE CODE TOGETHER
    //  _populateSurvey     SET THE USER'S ANSWERS FOUND IN LOCAL STORAGE
    //  _setJSONurl         URL FOR THE AJAX CALL TO GET THE JSON TO CREATE THE SURVEY
        _callbackFns = {
            formOptions: {
                beforeSend: function beforeSendSurveyDefault ( data ){
                        var fieldNameCheck = '',
                            fieldTypeCheck = '';

                        $surveyForm
                            .find('input:not([type="reset"]):not([type="submit"]):not([type="button"]), select, textarea')
                            .add( $surveyCont.find('[data-name="bind-surveyjs-answer"]') )
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

                            var questionId = $field.closest('[data-question-id]').attr('data-question-id') || '';

                            // BASED ON SURVEY JSON FILE, FORCE REQUIRED FIELDS TO BE VALIDATED
                            // THIS AVOIDS USERS TO HACK THE SURVEY, FOR EXAMPLE REMOVING required ATTRIBUTE FROM THE HTML
                            if( questionId !== '' && _isRequired(questionId) /* && $field.val().trim().length === 0 */ ){

                                var isRequiredFrom = $field.is('[data-required-from]');
                                if( !isRequiredFrom || ( isRequiredFrom && $($field.data('required-from')).is(':checked') ) ){
                                    $field.prop('required', true);
                                }
                                
                                var fieldOptions = $.extend( true, {}, {focusOnRelated: false}, settings.fieldOptions );
                                
                                if( !formJSinstance.isValidField( $field[0], fieldOptions ) ){
                                    data.stopExecution = true;
                                }
                                
                            }
                        });
                    
                        return data;
                },
                onSubmitSuccess: function onSubmitSuccessSurveyDefault (){
                    // REMOVE SURVEY LOCAL STORAGE
                    if( isAvailableStorage ){
                        localStorage.removeItem( localStorageName );
                    }
                }
            }
        },
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
        _generateQAcode = function( qaData ){
            var qaData = ( qaData[0]['sort'] ? qaData.sort(function(a, b){ return a['sort'] > b['sort']; }) : qaData ),
                qaCodeAll = '',
                qaDataLength = qaData.length;
            
            for(var i=0; i<qaDataLength; i++){
                var item = qaData[i],
                    maxChoice = (item.checks ? JSON.parse(item.checks) : ''),
                    checksMin = (maxChoice.length > 0 ? maxChoice[0] : ''),
                    checksMax = (maxChoice.length > 0 ? maxChoice[1] : ''),
                    aHtml = '',
                    qaHtml = settings.templates.question;

                // HTML CODE FOR THE ANSWER/S
                aHtml += _iterateAnswers( item, item.id, i );

                if( item.question === 'hidden-privacy' ){
                    $surveyCont.find('[data-name="bind-surveyjs-answer"]').closest('[data-formjs-question]').attr({ 'data-question-id': item.id });
                    continue;
                }

                // REPLACE QUESTION DATA AND ANSWERS HTML IN LOCAL VARIABLE qaHtml
                qaHtml = qaHtml.replace( /{{questionId}}/g, item.id );
                qaHtml = qaHtml.replace( /{{questionNumber}}/g, (i+1) );
                qaHtml = qaHtml.replace( /{{questionText}}/g, item.question + ( maxChoice !== '' ? ' ('+ checksMax +' '+ settings.maxChoiceText +')' : '' ) );
                qaHtml = qaHtml.replace( /{{answersHtml}}/g, aHtml );
                qaHtml = qaHtml.replace( /{{fieldErrorTemplate}}/g, ( settings.fieldErrorFeedback ? settings.templates.fieldError : '' ) );
                if( settings.fieldErrorFeedback && settings.templates.fieldError.indexOf('{{fieldErrorMessage}}') !== -1 ){
                    var message = ( maxChoice !== '' ? settings.fieldErrorMessageMultiChoice : settings.fieldErrorMessage );
                    qaHtml = qaHtml.replace( /{{fieldErrorMessage}}/g, message ).replace( /{{checksMin}}/g, checksMin ).replace( /{{checksMax}}/g, checksMax );
                }

                qaCodeAll += qaHtml;
            }
            
            return qaCodeAll;
        },
        _init = function( surveyData ){
                surveyID = surveyData.id;
                
                // ITERATES THE QUESTIONS ( AND ALSO THEIR ANSWERS )...AND RETURN ALL THE HTML CODE
                var qaHtmlAll = _generateQAcode( surveyData.questions );
                
                // REPLACE SURVEY ID IN LOCALSTORAGE NAME
                localStorageName = localStorageName.replace( /{{surveyID}}/g, surveyID );
                
                // PRINT GENERAL SURVEY DATA: ID, IMAGE, TITLE AND DESCRIPTION
                _printSurveyInfos( surveyData );
                
                // PRINT ALL QUESTIONS & ANSWERS
                $surveyBody.append( qaHtmlAll );

                // CREATE FORMJS INSTANCE FOR SURVEY
                var formJSoptions = {
                        fieldOptions: settings.fieldOptions,
                        formOptions: settings.formOptions
                    };
                formJSinstance = new Form( $surveyForm[0], formJSoptions );
                
                // FILL ANSWERS WITH LOCAL STORAGE ( IF AVAILABLE )
                _populateSurvey();

                formJSinstance.init();
                
                // INIT FIELDS AND surveyjs-form VALIDATION
                _initValidationEvents();
                
                $surveyCont.addClass('surveyjs-init-success');
        },
        _initValidationEvents = function(){
            // VALIDATE A FIELD WHEN input blur change EVENTS OCCUR ( ONLY IF IT HAS THE REQUIRED ATTRIBUTE )
            // IF THE FIELD HAS THE ATTRIBUTE data-required-from ( AND IT IS NOT EMPTY ):
            // SET IT AS REQUIRED AND SET THE RELATED FIELD ( WITH ATTRIBUTE data-required-from ) AS CHECKED
            $surveyCont.on(
                settings.fieldOptions.validateOnEvents,
                '[data-surveyjs-form] input:not([type="reset"]):not([type="submit"]):not([type="button"]), [data-surveyjs-form] select, [data-surveyjs-form] textarea, [data-name="bind-surveyjs-answer"]',
            function( event ){
                var eventType = event.type,
                    $this = $(this),
                    fieldValue = $this.val().trim(),
                    isMultiChoice = $this.is('[data-checks]'),
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
                    !$this.prop('required') &&
                    _isRequired( questionID ) &&
                    (
                        ( isFieldForChangeEvent && eventType === 'change' ) ||
                        ( !isFieldForChangeEvent && eventType === 'input' ) ||
                        ( eventType !== 'change' && eventType !== 'input' )
                    )
                ){
                    // BASED ON JSON FILE, FORCE REQUIRED FIELDS TO BE VALIDATED
                    $this.prop('required', true);

                    var fieldEvent = new Event(eventType, {'bubbles': (eventType !== 'blur')});
                    $this[0].dispatchEvent(fieldEvent);
                }
            });
        },
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
                        beforeCode = ( progIds.length > 0 && a === 0 ? '<div class="surveyjs-field-indent">' : '' ),
                        afterCode = ( progIds.length > 0 && a === listL-1 ? '</div>' : '' ),
                        relatedAnswerField = '',
                        getSettingsFieldClass = function(){
                            var aType = ( answer.type === 'option' ? 'select' : answer.type );
                            return settings.cssClasses[aType] || settings.cssClasses.default;
                        };
                    
                    var objData = {
                        // answerId         ANSWER ID AS FROM THE JSON. THIS IS USED AS VALUE ATTRIBUTE OF THE ANSWER
                        // answerType       ANSWER TYPE AS FROM THE JSON. USED TO CHECK WHICH FIELD MUST BE CREATED ( EG: text, radio, checkbox, select, textarea )
                        // nestedAnswer     CREATES THE data-nested-index ATTRIBUTE TO PRINT IF AN ANSWER IS NESTED ( SEE BELOW FOR NESTED ANSWERS )
                        // answerCode       ID ATTRIBUTE OF THE ANSWER
                        //                  ( BUILT AS: "answerType-questionID-answerID-questionNumber[-nestingLevels]-answerNumber" )
                        //                  ONLY AN ATTRIBUTE-ANSWER DOES NOT USE THE answerCode
                            labelTagCode: (aType === 'checkbox' || aType === 'radio' ? settings.templates.labelTag : ''),
                            answerId: aId,
                            answerIdValue: (aType === 'text' ? '' : aId),
                            answerIndex: aNum,
                            answerName: 'surveyjs-answer-'+qNum,
                            answerPlaceholder: '',
                            answerMaxlength: (answer.maxlength ? 'maxlength="' + answer.maxlength + '"' : ''),
                            answerString: (typeof answer.answer === 'string' ? answer.answer : ''),
                            answerType: aType,
                            attrRequired: ( typeof obj.required !== 'undefined' ? 'required=""' : (typeof attrReq !== 'undefined' ? attrReq : '') ),
                            fieldClass: getSettingsFieldClass(),
                            nestedAnswer: ( progIdsJoined !== '' ? 'data-nested-index="'+ aNum +'"' : '' ),
                            optionsHtml: '',
                            progIdsJoined: progIdsJoined,
                            questionNumber: qNum,
                            answerCode: (aType === 'option' ? 'select' : aType) +'-' + qID +'-'+ (aId || 0) + '-' + qNum + (progIdsJoined !== '' ? '-'+progIdsJoined : '') +'-'+ aNum,
                            attrChecks: (obj.checks ? 'data-checks="' + obj.checks + '"' : '')
                        };
                    
                    if( needsBinding ){
                        
                        var $boundedField = $surveyCont.find('[data-name="bind-surveyjs-answer"]').eq( a ),
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
                    
                    if( typeof answer.answer === 'string' || typeof answer.answer === 'number' ){

                            // RELATED ANSWER
                            // IF AN ANSWER REQUIRE TO FILL OR SELECT ANOTHER RELATED ANSWER
                            if( answer.attribute ){
                                
                                var attr = answer.attribute,
                                    attributeIsArray = $.isArray( attr );
                                
                                aHtml = settings.templates.inputGroup;
                                relatedAnswerField = ( attributeIsArray ? settings.templates.selectTag : settings.templates.inputTag );
                                objData.fieldClass = settings.cssClasses.default;
                                
                                if( attributeIsArray ){
                                    // CREATE A GROUP WITH A RADIO INPUT AND ITS RELATED ANSWER (A SELECT FIELD)
                                    objData.fieldClass = settings.cssClasses.select;
                                    objData.optionsHtml = _generateOptionTags( attr );
                                }
                                
                            }
                            
                            // NESTED ANSWER -> IT IS A CHILD ANSWER OF ITS PARENT
                            // EXAMPLE:
                            // IF 'WEBSITE' IS THE PARENT ANSWER
                            // IT CAN HAVE THESE CHILDREN ANSWERS: PC - SMARTPHONE - TABLET
                            // SO THE PARENT ANSWER IS PRINTED AS TEXT ( WITHOUT THE INPUT FIELD ) AND ITS nested ANSWERS WILL BE LOOPED
                            else if( answer.nested ){
                                
                                var labelForNested = settings.templates.labelTag;
                                labelForNested = labelForNested.replace(/{{answerCode}}/g, objData.answerCode);
                                labelForNested = labelForNested.replace(/{{labelClass}}/g, settings.cssClasses.label + ' surveyjs-field-indent-0');
                                labelForNested = labelForNested.replace(/{{answerString}}/g, answer.answer);

                                aLoopHtml += beforeCode+'<div class="surveyjs-'+ aType +'">'+ labelForNested +'</div>'+afterCode;
                                progIds.push( aNum );
                                aLoopHtml += _iterateAnswers( answer.nested, qID, i, objData.attrRequired );
                                continue;
                                
                            }

                            // IF AN ANSWER IS A TEXTAREA
                            // ELSE ( THIS MEANS THAT THE ANSWER IS A SIMPLE STRING WITH NO OTHER FEATURES ) PRINT THE ANSWER AS IT IS
                            else if( aType === 'textarea' ){
                                
                                aHtml = settings.templates.textarea;
                                objData.answerPlaceholder = answer.placeholder || settings.textareaPlaceholder;
                                
                            } else if( aType !== 'checkbox' && aType !== 'radio' && aType !== 'option' ){
                                
                                // EVERY FIELD THAT IS NOT A TEXTAREA, CHECKBOX, RADIO, SELECT (-> OPTION), SO:
                                // TEXT, EMAIL, NUMBER, PASSWORD, RANGE AND SO ON...
                                aHtml = beforeCode + settings.templates.input + afterCode;
                                objData.nestedAnswer += ' class="'+ objData.fieldClass +'"';
                                
                            } else {
                                
                                if( aType === 'option' ){
                                    aHtml = beforeCode + settings.templates.select + afterCode;
                                    objData.optionsHtml = _generateOptionTags( obj.answers );

                                } else {
                                    // FOR CHECKBOX AND RADIO
                                    aHtml = beforeCode + settings.templates.input + afterCode;
                                }
                                
                            }

                            // IF LOOPING A NESTED ANSWER AND THE END OF THAT ARRAY IS REACHED
                            // REMOVE THE LAST ITEM OF progIds ( SO AT THE NEXT LOOP IT WILL NOT INDENT THE ANSWER )
                            if( progIds.length > 0 && a === listL-1 ){ progIds.pop(); }

                    }
                    
                    if( objData.optionsHtml !== '' ){
                        aHtml = aHtml.replace( /{{selectTagCode}}/g, settings.templates.selectTag );
                    }
                    if( relatedAnswerField !== '' ){
                        relatedAnswerField = relatedAnswerField.replace( /{{answerCode}}/g, '' );
                        relatedAnswerField = relatedAnswerField.replace( /{{answerType}}/g, 'text' );
                        relatedAnswerField = relatedAnswerField.replace( /{{fieldClass}}/g, objData.fieldClass );
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
        _populateSurvey = function(){
            if( isAvailableStorage && localStorage.getObject( localStorageName ) ){
                var LS = localStorage.getObject( localStorageName ),
                    LSlength = LS.length;
                
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
                }
            } else {
                if( !isAvailableStorage && settings.useLocalStorage ){ console.warn('LOCAL STORAGE IS NOT SUPPORTED!'); }
            }
        },
        _printSurveyInfos = function( surveyInfos ){
            var checkData = function( data ){ return (typeof data !== 'undefined' ? data : ''); };

            if( $surveyImg-length > 0 && checkData( surveyInfos.image ) ){
                $surveyImg.attr( 'src', surveyInfos.image );
            }
            $surveyTitle.text( checkData( surveyInfos.title ) );
            $surveyDesc.text( checkData( surveyInfos.description ) );
        },
        _setFormjsCallbackFunctions = function(){
            var formjsCallbacks = {
                    fieldOptions: ['onPastePrevented', 'onValidation'],
                    formOptions: ['beforeSend', 'onSubmitComplete', 'onSubmitError', 'onSubmitSuccess']
                };

            for(var opt in formjsCallbacks){
                var fjsOpt = formjsCallbacks[opt];

                fjsOpt.forEach(function(fnName){
                    fnInSettings = settings[opt][fnName];
                    fnList = [];

                    if( typeof fnInSettings === 'function' ){
                        fnList.push(fnInSettings);
                    } else if( Array.isArray(fnInSettings) ) {
                        fnList.concat(fnInSettings);
                    }/*  else {
                        return;
                    } */

                    if( typeof _callbackFns[opt] !== 'undefined' && typeof _callbackFns[opt][fnName] === 'function' ){
                        fnList.unshift(_callbackFns[opt][fnName]);
                    }

                    settings[opt][fnName] = fnList;
                });
            }
        },
        _setJSONurl = function( url ){
            $surveyBody.before( settings.loadingBox );
            
            $.ajax({
                cache:      false,
                dataType:   'json',
                method:     'POST',
                url:        url
            })
            .always(function(){
                $surveyForm.find('[data-surveyjs-loading]').remove();
                
                if( typeof settings.onInitComplete === 'function' ){
                    settings.onInitComplete( $surveyForm );
                }
            })
            .done(function( data ){
                var data = data;

                if( typeof data === 'string' ){
                    try{
                        data = JSON.parse(data);
                    } catch(error){
                        throw new Error('String returned from ajax call to "' + url + '" is not a valid JSON string');
                    }
                }

                if( $.isPlainObject( data ) ){
                    var callStatus = data.status.toLowerCase();

                    if( callStatus === 'success' ){
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
        
        

    //////////////////////
    //  PUBLIC METHODS
    //  addLanguage      TO ADD A NEW LANGUAGE OR OVERRIDE AN EXISTING ONE ( FOR NEW LANG: MUST CONTAIN ALL THE KEY-VALUE PAIRS AS IN messages )
    //  setup            TO INITIALIZE THE SURVEY ( PASSING AT LEAST url AS STRING ) TO OVERRIDE THE DEFAULT SETTINGS ( SEE settings ABOVE )
        addLanguage = function( newLang, newMessages ){
            var langValue = newLang.toLowerCase();
            
            messages[ langValue ] = $.extend( true, (messages[langValue] || {}), newMessages );
            settings.lang = langValue;
        },
        setup = function( options ){
            if( typeof options !== 'undefined' && $.isPlainObject( options ) ){
                if( typeof options.url !== 'string' ){
                    throw new Error('url IS MANDATORY IN SURVEY.setup() TO INITIALIZE THE SURVEY');
                }

                // SET THE lang VALUE ( MANDATORY FOR OTHER OPERATIONS )
                if( typeof options.lang === 'string' ){
                    var langValue = options.lang.toLowerCase();
                    if( messages[ langValue ] ){
                        settings.lang = langValue;
                    }
                }
                
                settings = $.extend( true, settings, messages[settings.lang] );
                settings = $.extend( true, settings, options );

                if( settings.templates.input.indexOf('{{inputTagCode}}') !== -1 ){
                    settings.templates.input = settings.templates.input.replace( /{{inputTagCode}}/g, settings.templates.inputTag );
                }

                settings.templates.labelTag = settings.templates.labelTag.replace(/{{labelClass}}/g, settings.cssClasses.label);

                _setFormjsCallbackFunctions();

                if( !settings.useLocalStorage ) {
                    isAvailableStorage = false;
                }

                _setJSONurl( options.url );
            }
        };
    //////////////////////

    
    return {
        addLanguage:    addLanguage,
        setup:          setup
    };
    
})( jQuery );