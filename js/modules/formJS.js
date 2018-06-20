/**
 * @version     1.1.1
 * @file        formJS - for forms validation
 * @author      Valerio Di Punzio <sayhi@valeriodipunzio.com>
 * @doc         http://valeriodipunzio.com/plugins/formJS/
 * 
 * Dependencies:
 * jQuery
 *
 */

var FORM = (function( $ ){
    
        // ------------------------------------------------------------
        // PLUGIN OPTIONS ( DEFAULT )
        // ------------------------------------------------------------
    var defaultFieldOptions = {
            checkDirtyField:        false,
            cssClasses: {
                dirty:              'dirty-field',
                error:              'has-error',
                errorMultiChoice:   'has-error-switch',
                valid:              'is-valid'
            },
            focusOnRelated:         true,
            maxFileSize:            10,
            onValidation:           null,
            preventPasteFields:     '[type="password"], [data-equal-to]',
            skipUIfeedback:         false,
            strictHtmlValidation:   false,
            validateOnEvents:       'input change'
        },
        
        defaultFormOptions = {
            beforeSend:             null,
            manageFileUpload:       true,
            onSubmitComplete:       null,
            onSubmitError:          null,
            onSubmitSuccess:        null
        },
        
        
        
        // ------------------------------------------------------------
        // VALIDATION RULES
        // ------------------------------------------------------------
        validationRules = {
            
            cap: function( string ){
                // VALID ITALIAN CAP WITH 5 DIGITS
                return /[0-9]{5}$/.test( string );
            },
            
            date: function( string ){
                // DATE AS ITALIAN SYNTAX WITH/WITHOUT TIME
                // dd mm yyyy | dd/mm/yyyy | dd.mm.yyyy | dd-mm-yyyy | dd/mm/yyyy-hh:mm:ss ( WITH SPACE / . - AS SEPARATOR FOR THE DATE )
                return /^(0?[1-9]|[12][0-9]|3[01])([ \/\-.])(0?[1-9]|1[012])\2([0-9][0-9][0-9][0-9])(([ -])([0-1]?[0-9]|2[0-3]):[0-5]?[0-9]:[0-5]?[0-9])?$/.test( string );
            },
            
            email: function( string ){
                // EMAIL MUST BE AT LEAST ( FOR EXAMPLE ):
                // a@a.a
                return /(\w+)\@(\w+)\.[a-zA-Z]/.test( string );
            },
            
            fiscalCode: function( string ){
                // http://blog.marketto.it/2016/01/regex-validazione-codice-fiscale-con-omocodia/
                return /^(?:[B-DF-HJ-NP-TV-Z](?:[AEIOU]{2}|[AEIOU]X)|[AEIOU]{2}X|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[\dLMNP-V][1-9MNP-V]|[1-9MNP-V][0L]))[A-Z]$/i.test( string );
            },
            
            hexColor: function( string ){
                // HEX COLOR WITH/WITHOUT #
                // CAN BE 3 OR 6 CHARACTERS ( fff | FFF | ffffff | FFFFFF )
                return /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test( string );
            },
            
            landlineNumber: function( string ){
                // LANDLINE PREFIX:
                // +39 | 0039 | not-set ( ALSO WITH INTERNATIONAL PREFIXES WITH 2 DIGITS )
                // LANDLINE NUMBER MUST START WITH 0 ( AS FOR ITALIAN ONES ):
                // 1234567890 | 12 34567890 | 123456789 | 1234 56789 ( ALSO WITH . - / AS SEPARATOR )
                return /^((00|\+)\d{2}[\-\. ]??)??(((0[\d]{1,4}))([\/\-\. ]){0,1}([\d, ]{5,10}))$/.test( string ); 
            },
            
            mobileNumber: function( string ){
                // +39 | 0039 | 39 | not-set ( ALSO WITH ALL INTERNATIONAL PREFIXES WITH 2 DIGITS )
                // MOBILE NUMBER MUST START WITH 3
                // 3234567890 | 323 4567890 | 323 45 67 890 ( ALSO WITH . OR - AS SEPARATOR )
                return /^((00|\+)??\d{2}[\-\. ]??)??3\d{2}[\-\. ]??(\d{6,7}|\d{2}[\-\. ]??\d{2}[\-\. ]??\d{3})$/.test( string );
            },
            
            number: function( string ){
                // ALL NUMBERS ( INTEGERS AND FLOATING )
                // VALID NUMBERS: 123 | 123.456 | .123                
                return /[+-]?([0-9]*[.])?[0-9]+/.test( string );
            },
            
            numberFloat: function( string ){
                // ONLY FLOATING NUMBERS
                // VALID NUMBERS: 123.456 | .123                
                return /[+-]?([0-9]*[.])[0-9]+/.test( string );
            },
            
            numberInteger: function( string ){
                // ONLY INTEGER NUMBERS                
                return /^\d+$/.test( string );
            },
            
            password: function( string ){
                // PASSWORD ( NO SPECIAL CHARACTERS ) WITH AT LEAST:
                // ONE DIGIT + ONE LOWERCASE + ONE UPPERCASE + MIN LENGTH OF 8 CHARACTERS
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test( string );
            },
            
            url: function( string ){
                // MUST NOT CONTAIN PARAMETERS:
                // www.mysite.com/index.html         --> VALID URL
                // www.mysite.com/index.html?v=hello --> INVALID URL
                return /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test( string );
            },
            
            username: function( string ){
                // USERNAME WITH LETTERS/NUMBERS AND - OR _ WITH MIN LENGTH 3 AND MAX LENGTH 24
                return /^[a-zA-Z0-9_-]{3,24}$/.test( string );
            },
            
            vatNumber: function( string ){
                // VAT NUMBER CAN CONTAIN OR NOT THE 'IT' STRING AND THEN 11 NUMBERS
                return /^(IT){0,1}[0-9]{11}$/i.test( string );
            }
            
        },
        
        
        
        // ------------------------------------------------------------
        // INTERNAL VARIABLES AND METHODS
        // ------------------------------------------------------------
        _fieldsStringSelector = 'input:not([type="reset"]):not([type="submit"]):not([type=button]):not([type=hidden]), select, textarea',
        
        _validationRules = {
            
            exactLength: function( value, validationValue ){
                return value.length === (validationValue*1);
            },
            
            max: function( value, validationValue ){
                var value = value * 1,
                    maxVal = validationValue * 1;
                
                return value <= maxVal;
            },
            
            maxlength: function( value, validationValue ){
                return value.length <= (validationValue*1);
            },
            
            min: function( value, validationValue ){
                var value = value * 1,
                    minVal = validationValue * 1;
                
                return value >= minVal;
            }
            
        },
        
        _isFieldChecked = function( $field, fieldOptions ){
            var $container = ($field.closest('form').length > 0 ? $field.closest('form') : $field.closest('[data-formjs-question]')),
                sameInputName = '[name="' + $field.attr('name') + '"]';
                        
            if( $field.is('[type="radio"]') ){
        
                var $fieldChecked = $container.find( sameInputName + ':checked' ),
                    $requireMore = $container.find( sameInputName + '[data-require-more]' ),
                    validReqFrom = true;
                
                if( $requireMore.length > 0 ){
                    $requireMore.each(function(idx, el){
                        var $reqMore = $(el),
                            $reqFrom = $container.find('[data-required-from="#'+ $reqMore.attr('id') +'"]');
                        
                        $reqFrom.prop('required', false);

                        if( $reqMore.is(':checked') ){
                            $reqFrom.prop('required', true);
                            
                            if( fieldOptions.focusOnRelated ){
                                $reqFrom.focus();
                            } else {
                                if( $reqMore.is('[required]') && $reqFrom.val().trim().length === 0 ){
                                    validReqFrom = false;
                                }
                            }
                        } else {
                            $reqFrom.val('');
                        }
                    });
                }

                return ($field.is('[required]') ? $fieldChecked.length > 0 && $fieldChecked.val().trim().length > 0 && validReqFrom : true);

            } else if( $field.is('[type="checkbox"]') ) {
                
                if( $field.closest('[data-max-check]').length > 0 ){
                    
                    var maxCheck = $field.closest('[data-max-check]').data('max-check'),
                        checkedLength = $container.find('[name="' + $field.attr('name') + '"]:checked').length,
                        obj = {
                            isChecked: (checkedLength > 0 && checkedLength <= maxCheck),
                            exceedMaxCheck: checkedLength > maxCheck
                        };
                    return obj;
                    
                } else {

                    return $field.prop('checked');
                    
                }
                
            }
        },
        
        _isValid = function( $field, addedValidations ){
            var fieldType = ( $field.is('[data-subtype]') ? 
                              $field.data('subtype').replace(/-([a-z])/ig, function(all, letter){ return letter.toUpperCase(); }) : 
                              $field.attr('type')
                            ),
                extraValidations = addedValidations || {},
                extraValidationsResult = true,
                fieldValue = $field.val().trim();
            
            for(var val in addedValidations){
                var extraVal = _validationRules[val]( fieldValue, addedValidations[val] );
                if( !extraVal ){ extraValidationsResult = false; }
            }
            
            return (
                typeof validationRules[fieldType] === 'function' ? 
                validationRules[fieldType]( fieldValue ) : 
                fieldValue.length > 0
            ) && extraValidationsResult;
        },
        
        _mergeObjects = function( out ){
            var out = out || {};

            for(var i=1; i<arguments.length; i++){
                var obj = arguments[i];

                if(!obj){ continue; }

                for(var key in obj){
                    if( !out.hasOwnProperty(key) || Object.prototype.toString.call(obj[key]) === "[object Array]" ){
                        out[key] = obj[key];
                    } else {
                        if( Object.prototype.toString.call(obj[key]) === "[object Object]" ){
                            out[key] = _mergeObjects(out[key], obj[key]);
                        }
                    }
                }
            }

            return out;  
        },
        
        
        
        // ------------------------------------------------------------
        // PUBLIC METHODS
        // ------------------------------------------------------------
        addValidationRules = function( newRules ){
            validationRules = _mergeObjects( newRules, validationRules );
        },
        
        checkDirtyField = function( $fields, cssClass ){
            var cssClass = cssClass || defaultFieldOptions.cssClasses.dirty;
            
            $fields.each(function(){
                var $field = $(this); 
                
                if( !$field.is('[type="checkbox"], [type="radio"]') ){
                    if( $field.val() ){
                        
                        $field.addClass( cssClass );
                        
                    } else {
                        
                        $field.removeClass( cssClass );
                        
                    }
                }
            });
        },
        
        getFormJSON = function( $form ){
            var formData = {};
            
            $form.find('input, select, textarea')
                .not('[type="reset"], [type="submit"], [type="button"], [type="file"], [data-exclude-json]')
            .each(function(){
                var $field = $(this),
                    isCheckbox = $field.is('[type="checkbox"]'),
                    isRadio = $field.is('[type="radio"]'),
                    name = $field.attr('name'),
                    value = ( isCheckbox ? [] : $field.val() );
                
                if( isCheckbox || isRadio ){
                    var $form = $field.closest('form'),
                        $checkedfields = $form.find('[name="'+ name +'"]:checked');
                    
                    if( isRadio ){
                        
                        value = ($checkedfields.length === 0 ? null : $checkedfields.val());
                        
                    } else {
                        
                        $checkedfields.each(function(){
                            value.push( $(this).val() );
                        });
                        
                    }
                }

                formData[ name ] = value;
            });
            
            return formData;
        },
        
        init = function( $form, options ){            
            var $forms = $( $form || $('form') ).filter('[novalidate]'),
                options = options || {};
            
            if( !$forms.length ){ return false; }
            
            var formOptions = _mergeObjects( options.formOptions || {}, defaultFormOptions ),
                fieldOptions = _mergeObjects( options.fieldOptions || {}, defaultFieldOptions );
            
            $forms.each(function(){
                var $thisForm = $(this);
                
                $thisForm.find( _fieldsStringSelector ).not('[type="radio"], [type="checkbox"]').each(function(){
                    var $field = $(this);
                    
                    if( fieldOptions.checkDirtyField ){
                        checkDirtyField( $field, fieldOptions.cssClasses.dirty );
                    }
                    
                    if( $field.is('[data-char-count]') ){
                        var printCharLength = function( $field ){
                            var usedChars = $field.val().length;
                            $field.closest('[data-formjs-question]').find('[data-char-length]').text( usedChars );
                        };
                        
                        if( $field.is('[maxlength]') ){
                            var maxlength = $field.attr('maxlength');
                            $field.closest('[data-formjs-question]').find('[data-char-maxlength]').text( maxlength );
                        }
                        
                        printCharLength( $field );
                        
                        $field.on('input', function(){
                            printCharLength( $(this) );
                        });
                    }
                    
                    if( $field.is('[type="file"]') && fieldOptions.maxFileSize > 0 ){
                        $thisForm.find('[data-max-file-size]').text( fieldOptions.maxFileSize );
                    }
                    
                    if( $field.val() ){
                        isValidField( $field, fieldOptions );
                    }
                });
                
                $thisForm.on(fieldOptions.validateOnEvents, _fieldsStringSelector, function( event ){
                    var $this = $(this),
                        isFieldForChangeEvent = $this.is('select, [type="radio"], [type="checkbox"]'),
                        eventType = event.type;

                    if(
                        (isFieldForChangeEvent && eventType === 'change') ||
                        (!isFieldForChangeEvent && eventType === 'input') ||
                        (eventType !== 'change' && eventType !== 'input')
                    ){

                        var validationResult = isValidField( $this, fieldOptions );
                        if( typeof fieldOptions.onValidation === 'function' ){
                            
                            var callbackData = [ { $field: $this, result: validationResult} ];
                            
                            fieldOptions.onValidation( callbackData );
                            
                        }

                    }
                });
                
                if( fieldOptions.strictHtmlValidation ){
                    // VALIDATION WITH ATTRIBUTES LIKE HTML ONES ( ALSO FOR BUG FIXING, EG: maxlength IN ANDROID )
                    $thisForm.on('keypress', '[maxlength]', function(event){
                        var $field = $(this),
                            value = $field.val().trim(),
                            maxLength = $field.attr('maxlength') * 1,
                            keyPressed = event.which || event.keyCode,
                            allowedKeys = [8, 37, 38, 39, 46];
                        
                        if( value.length >= maxLength && $.inArray(keyPressed, allowedKeys) === -1 ){
                            return false;
                        }
                    });
                }
                
                if( fieldOptions.preventPasteFields && $thisForm.find( fieldOptions.preventPasteFields ).length ){
                    $thisForm.on('paste', fieldOptions.preventPasteFields, function(event){
                        event.preventDefault();
                    });
                }
                
                $thisForm.filter('[data-ajax-submit]').on('submit', function(event){
                    event.preventDefault();
                    
                    var optionsAjaxSubmit = {
                            formOptions: formOptions,
                            fieldOptions: fieldOptions
                        };
                    
                    submitAjaxForm( $(this), optionsAjaxSubmit );
                });
                
            });
        },
        
        isValidField = function( $field, fieldOptions ){
            if( !$field.length ){ return false; }
            
            var options =           _mergeObjects( fieldOptions || {}, defaultFieldOptions ),
                
                fieldType =         $field.attr('type'),
                fieldValue =        $field.val().trim(),
                isValidValue =      fieldValue.length > 0,
                
                exceedMaxChoice =   false,
                isMultiChoice =     $field.closest('[data-max-check]').length > 0,
                isRequired =        $field.is('[required]'),
                isRequiredFrom =    $field.is('[data-required-from]'),
                isValidateIfFilled =$field.is('[data-validate-if-filled]'),
                isValid =           isValidValue,
                
                $container =        $field.closest('[data-formjs-question]'),
                $fieldEqualTo =     $field.closest('form').find('[data-equal-to="'+ $field.attr('name') +'"]');
                        
            if( options.checkDirtyField ){
                checkDirtyField( $field, options.cssClasses.dirty );
            }
            
            if(
                (!isRequired && !isValidateIfFilled && !isRequiredFrom && (fieldType !== 'checkbox' && fieldType !== 'radio')) || 
                (isValidateIfFilled && !isValidValue)
            ){
              
                isValid = true;
               
            } else {
                
                if( fieldType === 'checkbox' ){
                    
                    var checkField = _isFieldChecked( $field, options );
                    isValid = ( isMultiChoice ? checkField.isChecked : checkField );
                    exceedMaxChoice = ( isMultiChoice ? checkField.exceedMaxCheck : false );
                    
                } else if( fieldType === 'file' && options.maxFileSize > 0 ){
                    
                    $.each($field[0].files, function(idx, file){
                        if( (file.size/1024/1024) > options.maxFileSize ){
                            isValid = false;
                        }
                    });
                    
                } else if( fieldType === 'radio' ){
                    
                    isValid = _isFieldChecked( $field, options );
                    
                } else {
                    
                    var extraValidations = {},
                        doExtraValidations = true;
                    
                    if( $field.is('[data-equal-to]') ){
                        
                        var $checkFrom = $( '[name="' + $field.data('equal-to') + '"]' );
                        isValid = fieldValue === $checkFrom.val().trim();
                        doExtraValidations = false;
                        
                    } else {
                    
                        if( isRequiredFrom ){
                            
                            var $reqMore = $( $field.data('required-from') );
                            
                            isValid = $( '[name="'+ $reqMore.attr('name') +'"]:checked' ).length > 0;
                            
                            if( isValidValue ){
                                $reqMore.prop('checked', true);
                                $field.prop('required', true);
                            }
                            
                            if( !$reqMore.is(':checked') ){
                                doExtraValidations = false;
                            }
                            
                        }

                        // ADD FURTHER SPECIFIC VALIDATIONS
                        if( $field.is('[data-exact-length]') ){
                            extraValidations.exactLength = $field.data('exact-length');
                        }

                        if( $field.is('[max]') ){                        
                            extraValidations.max = $field.attr('max');
                        }

                        if( $field.is('[maxlength]') ){                        
                            extraValidations.maxlength = $field.attr('maxlength');
                        }
                        
                        if( $field.is('[min]') ){                        
                            extraValidations.min = $field.attr('min');
                        }
                        
                    }
                    
                    isValid = (doExtraValidations ? _isValid( $field, extraValidations ) : isValid);
                    
                }
                
                if( $fieldEqualTo.length > 0 ){
                    isValidField( $fieldEqualTo, options );
                }
                
            }
            
            // VALIDATION VISUAL FEEDBACK
            if( $container.length > 0 ){
                if( options.skipUIfeedback ){
                    
                    $container.removeClass( options.cssClasses.valid + ' ' + options.cssClasses.error + ' ' + options.cssClasses.errorMultiChoice );
                    
                } else {
                    if( isValid ){

                        $container.removeClass( options.cssClasses.error ).addClass( options.cssClasses.valid );
                        if( isMultiChoice && !exceedMaxChoice ){
                            $container.removeClass( options.cssClasses.errorMultiChoice );
                        }

                    } else {

                        $container.addClass( options.cssClasses.error ).removeClass( options.cssClasses.valid );
                        if( isMultiChoice && exceedMaxChoice ){
                            $container.addClass( options.cssClasses.errorMultiChoice );
                        }

                    }
                }
            }
            
            return isValid;
        },
        
        isValidForm = function( $form, options ){
            if( !$form.length || !$form.is('[novalidate]') ){ return false; }
            
            var options = options || {},
                formOptions = _mergeObjects( options.formOptions || {}, defaultFormOptions ),
                fieldOptions = _mergeObjects( options.fieldOptions || {}, defaultFieldOptions ),
                obj = {
                    $fields: [],
                    result: true
                },
                fieldName = '',
                fieldType = '';
            
            if( typeof fieldOptions.focusOnRelated === 'undefined' ){
                fieldOptions.focusOnRelated = false;
            }
            
            $form.find( _fieldsStringSelector ).each(function(idx, elem){
                var $field = $(elem),
                    name = $field.attr('name'),
                    type = $field.attr('type'),
                    fieldData = {
                        $field: $field,
                        result: true
                    };
                
                if( (name === fieldName && type === fieldType) ){ return true; }
                    
                if( !$field.is('[data-required-from]') ){
                    fieldName = name;
                    fieldType = type;
                }
                
                var fieldResult = isValidField( $field, fieldOptions );
                fieldData.result = fieldResult;

                if( !fieldResult ){
                    obj.result = false;
                }
                
                obj.$fields.push( fieldData );
            });
            
            return obj;
        },
        
        submitAjaxForm = function( $form, options ){
            var options = ( typeof options === 'undefined' ? {} : options );
            
            options.fieldOptions = _mergeObjects( (options.fieldOptions || {}), defaultFieldOptions );
            options.formOptions = _mergeObjects( (options.formOptions || {}), defaultFormOptions );
                        
            var formValidation = isValidForm($form, options),
                $btn = $form.find('[type="submit"]');
            
            if( typeof options.fieldOptions.onValidation === 'function' ){
                options.fieldOptions.onValidation( formValidation.$fields );
            }
            
            if( !formValidation.result || $btn.is(':disabled') ){ return false; }

            $btn.prop('disabled', true);
            
            var formDataObj = getFormJSON( $form );
            
            if( typeof options.formOptions.beforeSend === 'function' ){
                var beforeSendData = {
                        formData: formDataObj,
                        stopExecution: false
                    },
                    beforeSendFn = options.formOptions.beforeSend( beforeSendData, $form );
                
                if( Object.prototype.toString.call(beforeSendFn) === '[object Object]' ){
                    formDataObj = beforeSendFn.formData || formDataObj;
                    if( beforeSendFn.stopExecution ){
                        return false;
                    }
                }
            }
            
            var ajaxOptions = {
                    cache: false,
                    url: $form.attr('action'),
                    data: formDataObj,
                    method: $form.attr('method') || 'POST'
                };
            
            if( $form.is('[enctype="multipart/form-data"]') && options.formOptions.manageFileUpload ){
                var formDataMultipart = new FormData();
                
                for(var key in ajaxOptions.data){
                    formDataMultipart.append( key, ajaxOptions.data[key] );
                }
                
                $form.find('[type="file"]').each(function(idxField, field){
                    var field = field;
                    $.each(field.files, function(idx, file){
                        var name = field.name+'['+ idx +']';
                        formDataMultipart.append( name, file, file.name );
                    });
                });
                
            	ajaxOptions.contentType = false;
            	ajaxOptions.processData = false;
                ajaxOptions.data = formDataMultipart;
            }
            
            if( $form.is('[data-ajax-settings]') ){
                var ajaxSettings = $form.data('ajax-settings');
                try {
                    ajaxOptions = _mergeObjects( ajaxOptions, ajaxSettings );
                } catch(error) {
                    console.error('data-ajax-settings specified for ' + $form.attr('name') + ' form is not a valid JSON object!');
                    return false;
                }
            }
            
            $.ajax( ajaxOptions )
                .always(function( dataOrXHR, status, XHRorResponse ){
                    $btn.prop('disabled', false);

                    if( typeof options.formOptions.onSubmitComplete === 'function' ){

                        var ajaxData = { dataOrXHR: dataOrXHR, status: status, XHRorResponse: XHRorResponse };
                        options.formOptions.onSubmitComplete( ajaxData, $form );

                    }
                })
                .done(function( data, status, response ){

                    if( typeof options.formOptions.onSubmitSuccess === 'function' ){

                        var ajaxData = { data: data, status: status, response: response };
                        options.formOptions.onSubmitSuccess( ajaxData, $form );

                    }
                })
                .fail(function( jqXHR, textStatus, errorThrown ){
                    if( typeof options.formOptions.onSubmitError === 'function' ){

                        var ajaxData = { errorThrown: errorThrown, status: textStatus, response: jqXHR };
                        options.formOptions.onSubmitError( ajaxData, $form );

                    }
                });
        };
    
    
    
    return {
        addValidationRules: addValidationRules,
        checkDirtyField:    checkDirtyField,
        getFormJSON:        getFormJSON,
        init:               init,
        isValidField:       isValidField,
        isValidForm:        isValidForm,
        submitAjaxForm:     submitAjaxForm
    };
    
})( jQuery );