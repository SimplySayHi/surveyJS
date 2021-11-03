/* formJS v5.2.0 | Valerio Di Punzio (@SimplySayHi) | https://valeriodipunzio.com/plugins/formJS/ | https://github.com/SimplySayHi/formJS | MIT license */
!function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define(factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self).Form = factory();
}(this, (function() {
    "use strict";
    function _typeof(obj) {
        return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        })(obj);
    }
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
            "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    var addClass = function(element, cssClasses) {
        cssClasses.split(" ").forEach((function(className) {
            element.classList.add(className);
        }));
    }, isNodeList = function(nodeList) {
        return NodeList.prototype.isPrototypeOf(nodeList);
    }, removeClass = function(element, cssClasses) {
        cssClasses.split(" ").forEach((function(className) {
            element.classList.remove(className);
        }));
    }, isDOMNode = function(node) {
        return Element.prototype.isPrototypeOf(node);
    }, checkFormEl = function(form) {
        var isString = _typeof(form), isFormSelector = "string" === isString && isDOMNode(document.querySelector(form)) && "form" === document.querySelector(form).tagName.toLowerCase();
        return {
            result: isDOMNode(form) || isFormSelector,
            $el: "string" === isString ? document.querySelector(form) : form
        };
    }, customEvents_field = {
        validation: "fjs.field:validation"
    }, customEvents_form = {
        destroy: "fjs.form:destroy",
        init: "fjs.form:init",
        submit: "fjs.form:submit",
        validation: "fjs.form:validation"
    }, isPlainObject = function(object) {
        return "[object Object]" === Object.prototype.toString.call(object);
    }, mergeObjects = function mergeObjects() {
        var out = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return Array.from(arguments).slice(1).filter((function(arg) {
            return !!arg;
        })).forEach((function(arg) {
            Object.keys(arg).forEach((function(key) {
                Array.isArray(arg[key]) ? out[key] = (out[key] || []).concat(arg[key].slice(0)) : isPlainObject(arg[key]) ? out[key] = mergeObjects(out[key] || {}, arg[key]) : Array.isArray(out[key]) ? out[key].push(arg[key]) : out[key] = arg[key];
            }));
        })), out;
    }, dispatchCustomEvent = function(elem, eventName, eventOptions) {
        eventOptions = mergeObjects({}, {
            bubbles: !0
        }, eventOptions);
        var eventObj = new CustomEvent(eventName, eventOptions);
        elem.dispatchEvent(eventObj);
    }, excludeSelector = ':not([type="reset"]):not([type="submit"]):not([type="button"]):not([type="file"]):not([data-exclude-data])', fieldsStringSelector = 'input:not([type="reset"]):not([type="submit"]):not([type="button"]):not([type="hidden"]), select, textarea', finalizeFieldPromise = function(obj) {
        return obj.result ? Promise.resolve() : Promise.reject(obj.errors);
    }, finalizeFormPromise = function(obj) {
        return obj.result ? Promise.resolve(obj.fields) : Promise.reject(obj.fields);
    }, formatMap = {
        "YYYY-MM-DD": function(dateArray) {
            return dateArray;
        },
        "MM-DD-YYYY": function(dateArray) {
            return [ dateArray[2], dateArray[0], dateArray[1] ];
        },
        "DD-MM-YYYY": function(dateArray) {
            return dateArray.reverse();
        }
    }, getDateAsNumber = function(dateString, dateFormat) {
        dateFormat = dateFormat || "YYYY-MM-DD";
        var separator, splitChar = (separator = dateString.match(/\D/)) && separator.length > 0 ? separator[0] : null;
        if (!(dateFormat.indexOf(splitChar) < 0)) return dateFormat = dateFormat.replace(/[^YMD]/g, "-"), 
        dateString = dateString.split(splitChar), dateString = formatMap[dateFormat](dateString).join("");
    }, getJSONobjectFromFieldAttribute = function(fieldEl, attrName) {
        var customAttrEl = fieldEl.closest("[" + attrName + "]");
        return customAttrEl && JSON.parse(customAttrEl.getAttribute(attrName)) || {};
    }, getUniqueFields = function($nodeList) {
        var currentFieldName = "", currentFieldType = "";
        return Array.from($nodeList).filter((function($field) {
            var name = $field.name, type = $field.type;
            return (name !== currentFieldName || type !== currentFieldType) && ($field.matches("[data-required-from]") || (currentFieldName = name, 
            currentFieldType = type), !0);
        }));
    }, mergeValidateFieldDefault = function(obj) {
        return mergeObjects({}, {
            result: !1,
            $field: null
        }, obj);
    }, mergeValidateFormDefault = function(obj) {
        return mergeObjects({}, {
            result: !0,
            fields: []
        }, obj);
    }, isFieldForChangeEvent = function($field) {
        return $field.matches('select, [type="radio"], [type="checkbox"], [type="file"]');
    }, runFunctionsSequence = function() {
        var _ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, _ref$functionsList = _ref.functionsList, functionsList = void 0 === _ref$functionsList ? [] : _ref$functionsList, _ref$data = _ref.data, data = void 0 === _ref$data ? {} : _ref$data, _ref$stopConditionFn = _ref.stopConditionFn, stopConditionFn = void 0 === _ref$stopConditionFn ? function() {
            return !1;
        } : _ref$stopConditionFn;
        return functionsList.reduce((function(acc, promiseFn) {
            return acc.then((function(res) {
                var dataNew = mergeObjects({}, res[res.length - 1]);
                return stopConditionFn(dataNew) ? Promise.resolve(res) : new Promise((function(resolve) {
                    resolve(promiseFn(dataNew));
                })).then((function() {
                    var result = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : dataNew;
                    return res.push(result), res;
                }));
            }));
        }), Promise.resolve([ data ])).then((function(dataList) {
            return dataList.length > 1 ? dataList.slice(1) : dataList;
        }));
    }, serializeObject = function(obj) {
        return obj && "object" === _typeof(obj) && obj.constructor === Object ? Object.keys(obj).reduce((function(a, k) {
            return a.push(k + "=" + encodeURIComponent(obj[k])), a;
        }), []).join("&") : obj;
    }, toCamelCase = function(string) {
        return string.replace(/-([a-z])/gi, (function(all, letter) {
            return letter.toUpperCase();
        }));
    }, options = {
        fieldOptions: {
            beforeValidation: [ function(_ref) {
                var $field = _ref.$field, fieldOptions = _ref.fieldOptions;
                fieldOptions.trimValue && !isFieldForChangeEvent($field) && ($field.value = $field.value.trim()), 
                function($fields, fieldOptions) {
                    ($fields = isNodeList($fields) ? Array.from($fields) : [ $fields ]).forEach((function($field) {
                        if ("checkbox" !== $field.type && "radio" !== $field.type) {
                            var $container = $field.closest(fieldOptions.questionContainer) || $field;
                            $field.value ? addClass($container, fieldOptions.cssClasses.dirty) : removeClass($container, fieldOptions.cssClasses.dirty);
                        }
                    }));
                }($field, fieldOptions), fieldOptions.skipUIfeedback || addClass($field.closest(fieldOptions.questionContainer), fieldOptions.cssClasses.pending);
            } ],
            cssClasses: {
                dirty: "is-dirty",
                error: "has-error",
                errorEmpty: "has-error-empty",
                errorRule: "has-error-rule",
                pending: "is-pending",
                valid: "is-valid"
            },
            focusOnRelated: !0,
            maxFileSize: 10,
            onValidationCheckAll: !1,
            preventPasteFields: '[type="password"], [data-equal-to]',
            questionContainer: "[data-formjs-question]",
            skipUIfeedback: !1,
            strictHtmlValidation: !0,
            trimValue: !1,
            validateOnEvents: "input change"
        },
        formOptions: {
            ajaxOptions: {
                cache: "no-store",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                method: "POST",
                mode: "same-origin",
                redirect: "follow",
                timeout: 0,
                url: location.href
            },
            ajaxSubmit: !0,
            beforeSend: [],
            cssClasses: {
                ajaxComplete: "ajax-complete",
                ajaxError: "ajax-error",
                ajaxPending: "ajax-pending",
                ajaxSuccess: "ajax-success",
                submit: "is-submitting",
                valid: "is-valid"
            },
            getFormData: function($filteredFields, trimValues) {
                var formData = {}, $form = this.$form;
                return $filteredFields.forEach((function($field) {
                    var isCheckbox = "checkbox" === $field.type, isRadio = "radio" === $field.type, isSelect = $field.matches("select"), name = $field.name, value = trimValues ? $field.value.trim() : $field.value;
                    if (isCheckbox) {
                        value = $field.checked;
                        var $checkboxes = Array.from($form.querySelectorAll('[name="' + name + '"]'));
                        if ($checkboxes.length > 1) value = [], $checkboxes.filter((function(field) {
                            return field.checked;
                        })).forEach((function($field) {
                            value.push($field.value);
                        }));
                    } else if (isRadio) {
                        var $checkedRadio = $form.querySelector('[name="' + name + '"]:checked');
                        value = null === $checkedRadio ? null : $checkedRadio.value;
                    } else if (isSelect) {
                        var $selectedOpts = Array.from($field.options).filter((function(option) {
                            return option.selected;
                        }));
                        $selectedOpts.length > 1 && (value = [], $selectedOpts.forEach((function($field) {
                            value.push($field.value);
                        })));
                    }
                    formData[name] = value;
                })), formData;
            },
            handleFileUpload: !0,
            handleSubmit: !0,
            onInitCheckFilled: !0
        }
    }, validationRules = {
        date: function(string) {
            return {
                result: /^((((19|[2-9]\d)\d{2})[ \/\-.](0[13578]|1[02])[ \/\-.](0[1-9]|[12]\d|3[01]))|(((19|[2-9]\d)\d{2})[ \/\-.](0[13456789]|1[012])[ \/\-.](0[1-9]|[12]\d|30))|(((19|[2-9]\d)\d{2})[ \/\-.]02[ \/\-.](0[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))[ \/\-.]02[ \/\-.]29))$/g.test(string)
            };
        },
        email: function(string) {
            return {
                result: /^[a-zA-Z_-]([\w.-]?[a-zA-Z0-9])*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?){2,})+$/.test(string)
            };
        },
        number: function(string) {
            return {
                result: /[+-]?([0-9]*[.])?[0-9]+/.test(string)
            };
        },
        checkbox: function(value, $field) {
            var $dataChecks = $field.closest("form").querySelector('[name="' + $field.name + '"][data-checks]');
            return $dataChecks ? function($field) {
                var attrValue = JSON.parse($field.getAttribute("data-checks")), checkedLength = $field.closest("form").querySelectorAll('[name="' + $field.name + '"]:checked').length, isMinOk = checkedLength >= attrValue[0], isMaxOk = checkedLength <= attrValue[1], obj = {
                    result: isMinOk && isMaxOk
                };
                return obj.result || (obj.errors = {
                    checks: !0
                }, isMinOk || (obj.errors.minChecks = !0), isMaxOk || (obj.errors.maxChecks = !0)), 
                obj;
            }($dataChecks) : {
                result: $field.checked
            };
        },
        equalTo: function(value, $field) {
            return {
                result: value === $field.closest("form").querySelector('[name="' + $field.getAttribute("data-equal-to") + '"]').value
            };
        },
        exactLength: function(value, $field) {
            var valueLength = value.length, exactLength = 1 * $field.getAttribute("data-exact-length"), obj = {
                result: valueLength === exactLength
            };
            return obj.result || (obj.errors = {}, valueLength < exactLength ? obj.errors.minlength = !0 : obj.errors.maxlength = !0), 
            obj;
        },
        file: function(value, $field, fieldOptions) {
            var maxFileSize = 1 * ($field.getAttribute("data-max-file-size") || fieldOptions.maxFileSize), MIMEtype = $field.accept ? new RegExp($field.accept.replace("*", "[^\\/,]+")) : null, filesList = Array.from($field.files), obj = {
                result: !0
            };
            return filesList.forEach((function(file) {
                var exceedMaxFileSize = maxFileSize > 0 && file.size / 1024 / 1024 > maxFileSize, isAcceptedFileType = null === MIMEtype || MIMEtype.test(file.type);
                !exceedMaxFileSize && isAcceptedFileType || (obj.result = !1, void 0 === obj.errors && (obj.errors = {}), 
                exceedMaxFileSize && (obj.errors.maxFileSize = !0), isAcceptedFileType || (obj.errors.acceptedFileType = !0));
            })), obj;
        },
        length: function(value, $field) {
            var valueL = value.length, attrValue = JSON.parse($field.getAttribute("data-length")), isMinlengthOk = valueL >= attrValue[0], isMaxlengthOk = valueL <= attrValue[1], obj = {
                result: isMinlengthOk && isMaxlengthOk
            };
            return obj.result || (obj.errors = {}, isMinlengthOk || (obj.errors.minlength = !0), 
            isMaxlengthOk || (obj.errors.maxlength = !0)), obj;
        },
        max: function(value, $field) {
            var maxVal = $field.max, dateFormat = $field.getAttribute("data-date-format");
            return ("date" === $field.type || dateFormat) && (value = getDateAsNumber(value, dateFormat), 
            maxVal = maxVal.split("-").join("")), {
                result: (value *= 1) <= (maxVal *= 1)
            };
        },
        maxlength: function(value, $field) {
            return {
                result: value.length <= 1 * $field.maxLength
            };
        },
        min: function(value, $field) {
            var minVal = $field.min, dateFormat = $field.getAttribute("data-date-format");
            return ("date" === $field.type || dateFormat) && (value = getDateAsNumber(value, dateFormat), 
            minVal = minVal.split("-").join("")), {
                result: (value *= 1) >= (minVal *= 1)
            };
        },
        minlength: function(value, $field) {
            return {
                result: value.length >= 1 * $field.minLength
            };
        },
        pattern: function(value, $field) {
            return {
                result: new RegExp($field.pattern).test(value)
            };
        },
        radio: function(value, $field) {
            var $fieldChecked = $field.closest("form").querySelector('[name="' + $field.name + '"]:checked');
            return {
                result: null !== $fieldChecked && $fieldChecked.value.trim().length > 0
            };
        }
    }, dataTypeNumber = function(event) {
        var $field = event.target;
        if ($field.matches('[data-type="number"]')) {
            var fieldValue = $field.value;
            if (/[^\d.,+\-]/.test(fieldValue)) {
                event.stopImmediatePropagation();
                var valueReplaced = fieldValue.replace(/[^\d.,+\-]/g, "");
                $field.value = valueReplaced;
            }
        }
    }, formValidationEnd = function(event) {
        var formEl = event.target, options = formEl.formjs.options;
        if (!options.fieldOptions.skipUIfeedback) {
            var clMethodName = event.detail.result ? "add" : "remove";
            formEl.classList[clMethodName](options.formOptions.cssClasses.valid);
        }
    }, keypressMaxlength = function(event) {
        var $field = event.target;
        if ($field.matches("[maxlength]")) {
            var maxLength = 1 * $field.maxLength, keyPressed = event.which || event.keyCode;
            if ($field.value.length >= maxLength && -1 === [ 8, 37, 38, 39, 46 ].indexOf(keyPressed)) return !1;
        }
    }, pastePrevent = function(event) {
        var $field = event.target, fieldOptions = $field.closest("form").formjs.options.fieldOptions;
        $field.matches(fieldOptions.preventPasteFields) && event.preventDefault();
    };
    function ajaxCall($form, formDataObj, options) {
        var timeoutTimer, ajaxOptions = mergeObjects({}, options.formOptions.ajaxOptions), isMultipart = "multipart/form-data" === ajaxOptions.headers["Content-Type"];
        if (ajaxOptions.body = formDataObj, isMultipart && options.formOptions.handleFileUpload) {
            var formDataMultipart = new FormData;
            for (var key in ajaxOptions.body) formDataMultipart.append(key, ajaxOptions.body[key]);
            Array.from($form.querySelectorAll('[type="file"]')).forEach((function($field) {
                Array.from($field.files).forEach((function(file, idx) {
                    var name = $field.name + "[" + idx + "]";
                    formDataMultipart.append(name, file, file.name);
                }));
            })), ajaxOptions.body = formDataMultipart;
        }
        if ("GET" === ajaxOptions.method ? (ajaxOptions.url += (/\?/.test(ajaxOptions.url) ? "&" : "?") + serializeObject(ajaxOptions.body), 
        delete ajaxOptions.body) : ajaxOptions.headers["Content-Type"].indexOf("application/x-www-form-urlencoded") > -1 ? ajaxOptions.body = serializeObject(ajaxOptions.body) : isMultipart || (ajaxOptions.body = JSON.stringify(ajaxOptions.body)), 
        ajaxOptions.headers = new Headers(ajaxOptions.headers), ajaxOptions.timeout > 0) {
            var controller = new AbortController, signal = controller.signal;
            ajaxOptions.signal = signal, timeoutTimer = window.setTimeout((function() {
                controller.abort();
            }), ajaxOptions.timeout);
        }
        return fetch(ajaxOptions.url, ajaxOptions).then((function(response) {
            if (!response.ok) throw new Error(response.statusText);
            var fetchMethod = function(response, options) {
                var accept = options.headers.get("Accept"), contentType = response.headers.get("Content-Type"), headerOpt = accept || contentType || "";
                return headerOpt.indexOf("application/json") > -1 || "" === headerOpt ? "json" : headerOpt.indexOf("text/") > -1 ? "text" : "blob";
            }(response, ajaxOptions);
            return response[fetchMethod]();
        })).then((function(data) {
            return addClass($form, options.formOptions.cssClasses.ajaxSuccess), data;
        })).catch((function(error) {
            throw addClass($form, options.formOptions.cssClasses.ajaxError), new Error(error.message);
        })).finally((function() {
            timeoutTimer && window.clearTimeout(timeoutTimer), removeClass($form, options.formOptions.cssClasses.submit + " " + options.formOptions.cssClasses.ajaxPending), 
            addClass($form, options.formOptions.cssClasses.ajaxComplete), $form.querySelector('[type="submit"]').disabled = !1;
        }));
    }
    function submit(event) {
        var $form = event.target, instance = $form.formjs, options = instance.options, formCssClasses = options.formOptions.cssClasses, isAjaxForm = options.formOptions.ajaxSubmit, $btn = $form.querySelector('[type="submit"]'), eventPreventDefault = function() {
            var enableBtn = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
            $btn && enableBtn && ($btn.disabled = !1), event && event.preventDefault();
        };
        if (isAjaxForm && eventPreventDefault(!1), $btn) {
            if ($btn.disabled) return eventPreventDefault(!1), !1;
            $btn.disabled = !0;
        }
        removeClass($form, formCssClasses.ajaxComplete + " " + formCssClasses.ajaxError + " " + formCssClasses.ajaxSuccess), 
        addClass($form, formCssClasses.submit), instance.validateForm().then((function(fields) {
            var beforeSendData = {
                stopExecution: !1,
                formData: isAjaxForm ? instance.getFormData() : null
            }, rfsObject = {
                functionsList: options.formOptions.beforeSend,
                data: beforeSendData,
                stopConditionFn: function(data) {
                    return data.stopExecution;
                }
            };
            return runFunctionsSequence(rfsObject);
        })).then((function(dataList) {
            if (dataList.filter((function(data) {
                return data.stopExecution;
            })).length > 0) return eventPreventDefault(), !1;
            if (isAjaxForm) {
                var formData = dataList.pop().formData;
                addClass($form, formCssClasses.ajaxPending), dispatchCustomEvent($form, customEvents_form.submit, {
                    detail: ajaxCall($form, formData, options)
                });
            }
        })).catch((function(fields) {
            eventPreventDefault(), removeClass($form, formCssClasses.submit);
        }));
    }
    var validation = function(event) {
        var isChangeEvent = "change" === event.type, $field = event.target, self = $field.closest("form").formjs;
        if ($field.matches(fieldsStringSelector)) {
            var isFieldForChangeEventBoolean = isFieldForChangeEvent($field), hasOnlyChangeEvent = "change" === self.options.fieldOptions.validateOnEvents;
            if (isFieldForChangeEventBoolean && isChangeEvent || !isFieldForChangeEventBoolean && (!isChangeEvent || hasOnlyChangeEvent)) return self.validateField($field).then((function() {
                var type = $field.type, $realtedEqualTo = $field.closest("form").querySelector('[data-equal-to="' + $field.name + '"]');
                return ($field.required || $field.matches("[data-validate-if-filled]")) && "checkbox" !== type && "radio" !== type && $realtedEqualTo && "" !== $realtedEqualTo.value.trim() && self.validateField($realtedEqualTo).catch((function(errors) {})), 
                mergeValidateFieldDefault({
                    result: !0,
                    $field: $field
                });
            })).catch((function(errors) {
                return mergeValidateFieldDefault({
                    $field: $field,
                    errors: errors
                });
            }));
        }
    }, validationEnd = function(event) {
        var eventDetail = event.detail, $field = eventDetail.$field, dataFieldOptions = getJSONobjectFromFieldAttribute($field, "data-field-options"), fieldOptions = mergeObjects({}, $field.closest("form").formjs.options.fieldOptions, dataFieldOptions), $container = $field.closest(fieldOptions.questionContainer), isReqFrom = $field.matches("[data-required-from]"), $reqMore = document.querySelector($field.getAttribute("data-required-from"));
        if ($container && !fieldOptions.skipUIfeedback) if (eventDetail.result) {
            if (!isReqFrom || isReqFrom && $reqMore.checked) {
                var errorClasses = fieldOptions.cssClasses.error + " " + fieldOptions.cssClasses.errorEmpty + " " + fieldOptions.cssClasses.errorRule;
                removeClass($container, errorClasses), addClass($container, fieldOptions.cssClasses.valid);
            }
        } else {
            var extraErrorClass = fieldOptions.cssClasses.errorRule, isChecks = $field.matches("[data-checks]"), checkedElLength = isChecks ? $container.querySelectorAll('[name="' + $field.name + '"]:checked').length : 0;
            (!isChecks && eventDetail.errors && eventDetail.errors.empty || isChecks && 0 === checkedElLength) && (extraErrorClass = fieldOptions.cssClasses.errorEmpty);
            var _errorClasses = fieldOptions.cssClasses.error + " " + extraErrorClass, errorClassToRemove = fieldOptions.cssClasses.errorEmpty + " " + fieldOptions.cssClasses.errorRule;
            removeClass($container, fieldOptions.cssClasses.valid + " " + errorClassToRemove), 
            addClass($container, _errorClasses);
        }
    };
    function formStartup($form, options) {
        $form.noValidate = !0;
        var fieldOptions = options.fieldOptions, formOptions = options.formOptions;
        fieldOptions.strictHtmlValidation && ($form.addEventListener("keypress", keypressMaxlength, !1), 
        $form.addEventListener("input", dataTypeNumber, !1)), fieldOptions.preventPasteFields && $form.querySelectorAll(fieldOptions.preventPasteFields).length && $form.addEventListener("paste", pastePrevent, !1), 
        fieldOptions.validateOnEvents.split(" ").forEach((function(eventName) {
            var useCapture = /^(blur|focus)$/.test(eventName);
            $form.addEventListener(eventName, validation, useCapture);
        })), $form.addEventListener(customEvents_field.validation, validationEnd, !1), $form.addEventListener(customEvents_form.validation, formValidationEnd, !1), 
        formOptions.handleSubmit && ($form.addEventListener("submit", submit), formOptions.ajaxSubmit && ($form.getAttribute("enctype") && (formOptions.ajaxOptions.headers["Content-Type"] = $form.getAttribute("enctype")), 
        $form.getAttribute("method") && (formOptions.ajaxOptions.method = $form.getAttribute("method").toUpperCase()), 
        $form.getAttribute("action") && (formOptions.ajaxOptions.url = $form.getAttribute("action"))));
    }
    function checkFieldValidity($field, fieldOptions, validationRules, validationErrors) {
        if (!isDOMNode($field)) {
            var obj = mergeValidateFieldDefault({
                $field: $field
            });
            return Promise.resolve(obj);
        }
        var $form = $field.closest("form"), isValidValue = $field.value.trim().length > 0, dataFieldOptions = getJSONobjectFromFieldAttribute($field, "data-field-options");
        if (fieldOptions = mergeObjects(fieldOptions, dataFieldOptions), "radio" === $field.type) {
            var $checked = $field.checked ? $field : $form.querySelector('[name="' + $field.name + '"]:checked'), reqMoreIsChecked = $checked && $checked.matches("[data-require-more]"), $findReqMore = reqMoreIsChecked ? $checked : $form.querySelector('[data-require-more][name="' + $field.name + '"]'), $findReqFrom = $findReqMore ? $form.querySelector('[data-required-from="#' + $findReqMore.id + '"]') : null;
            $checked && $findReqFrom && ($findReqFrom.required = $findReqMore.required && $findReqMore.checked, 
            reqMoreIsChecked ? fieldOptions.focusOnRelated && $findReqFrom.focus() : $findReqFrom.value = "");
        }
        if ($field.matches("[data-required-from]") && isValidValue) {
            var $reqMore = $form.querySelector($field.getAttribute("data-required-from"));
            $reqMore.checked = !0, $field.required = $reqMore.required;
        }
        var needsValidation = $field.required || $field.matches("[data-validate-if-filled]") && isValidValue;
        return runFunctionsSequence({
            functionsList: fieldOptions.beforeValidation,
            data: {
                $field: $field,
                fieldOptions: fieldOptions
            }
        }).then((function(data) {
            var dataObj = data.pop();
            return new Promise((function(resolve) {
                needsValidation || (dataObj.result = !0), resolve(needsValidation ? function($field, fieldOptions, validationRules, validationErrors) {
                    var fieldValue = $field.value, obj = mergeValidateFieldDefault({
                        result: fieldValue.trim().length > 0,
                        $field: $field
                    }), isRadioOrCheckbox = /^(radio|checkbox)$/.test($field.type), hasSelectedInput = $field.closest("form").querySelectorAll('[name="' + $field.name + '"]:checked').length > 0;
                    if (!isRadioOrCheckbox && !obj.result || isRadioOrCheckbox && !hasSelectedInput) return obj.result = !1, 
                    obj.errors = {
                        empty: !0
                    }, Promise.resolve(obj);
                    var validationMethods = Array.from($field.attributes).reduce((function(accList, attr) {
                        var attrName = toCamelCase(attr.name.replace("data-", "")), attrValue = toCamelCase(attr.value), isAttrValueWithFn = ("type" === attrName || "subtype" === attrName) && validationRules[attrValue], isAttrNameWithFn = validationRules[attrName];
                        return (isAttrValueWithFn || isAttrNameWithFn) && accList.push(isAttrValueWithFn ? attrValue : attrName), 
                        accList;
                    }), []);
                    return new Promise((function(resolve) {
                        resolve(validationMethods.reduce((function(accPromise, methodName) {
                            return accPromise.then((function(accObj) {
                                return new Promise((function(resolveVal) {
                                    resolveVal(validationRules[methodName](fieldValue, $field, fieldOptions));
                                })).then((function(valObj) {
                                    if (!valObj.result) {
                                        var errorObj = {};
                                        void 0 !== valObj.errors && void 0 !== valObj.errors[methodName] || (errorObj[methodName] = !0), 
                                        valObj.errors = mergeObjects({}, valObj.errors, errorObj);
                                    }
                                    return valObj = valObj.result ? {} : valObj, mergeObjects(accObj, valObj);
                                }));
                            }));
                        }), Promise.resolve(obj)));
                    })).then((function(data) {
                        return data.result || (data.errors = validationMethods.reduce((function(accObj, methodName) {
                            var errors = validationErrors[methodName] && validationErrors[methodName](fieldValue, $field) || {};
                            return mergeObjects(accObj, errors);
                        }), data.errors)), data;
                    }));
                }($field, fieldOptions, validationRules, validationErrors) : dataObj);
            }));
        })).then((function(data) {
            var $container = fieldOptions.questionContainer && data.$field.closest(fieldOptions.questionContainer);
            return $container && removeClass($container, fieldOptions.cssClasses.pending), data;
        }));
    }
    function checkFormValidity($form, fieldOptions, validationRules, validationErrors) {
        var fieldToSkip = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : null;
        fieldOptions = mergeObjects({}, fieldOptions, {
            focusOnRelated: !1
        });
        var $fieldsList = getUniqueFields($form.querySelectorAll(fieldsStringSelector));
        return Promise.all($fieldsList.map((function($field) {
            if (fieldToSkip && $field === fieldToSkip) {
                var obj = mergeValidateFieldDefault({
                    $field: $field,
                    result: !0
                });
                return Promise.resolve(obj);
            }
            return checkFieldValidity($field, fieldOptions, validationRules, validationErrors);
        }))).then((function(fields) {
            var areAllFieldsValid = 0 === fields.filter((function(fieldObj) {
                return !fieldObj.result;
            })).length;
            return mergeValidateFormDefault({
                result: areAllFieldsValid,
                fields: fields
            });
        }));
    }
    var checkFilledFields = function($form) {
        var formFields = function($form) {
            return getUniqueFields($form.querySelectorAll(fieldsStringSelector)).map((function($field) {
                var name = $field.name, type = $field.type, isCheckboxOrRadio = "checkbox" === type || "radio" === type, fieldChecked = $form.querySelector('[name="' + name + '"]:checked'), isReqFrom = $field.matches("[data-required-from]"), $reqMore = isReqFrom ? $form.querySelector($field.getAttribute("data-required-from")) : null;
                return isCheckboxOrRadio ? fieldChecked || null : isReqFrom && $reqMore.checked || !isReqFrom && $field.value ? $field : null;
            })).filter((function($field) {
                return null !== $field;
            }));
        }($form);
        return Promise.all(formFields.map((function($field) {
            var isFieldForChangeEventBoolean = isFieldForChangeEvent($field);
            return validation({
                target: $field,
                type: isFieldForChangeEventBoolean ? "change" : ""
            });
        })));
    }, Form = function() {
        function Form(form, optionsObj) {
            _classCallCheck(this, Form);
            var argsL = arguments.length, checkFormElem = checkFormEl(form);
            if (0 === argsL || argsL > 0 && !form) throw new Error('First argument "form" is missing or falsy!');
            if (isNodeList(form)) throw new Error('First argument "form" must be a single DOM node or a form CSS selector, not a NodeList!');
            if (!checkFormElem.result) throw new Error('First argument "form" is not a DOM node nor a form CSS selector!');
            var self = this;
            self.$form = checkFormElem.$el, self.$form.formjs = self, self.options = mergeObjects({}, Form.prototype.options, optionsObj);
            var cbList = [ "beforeValidation", "beforeSend", "getFormData" ];
            cbList.forEach((function(cbName) {
                var optionType = self.options.formOptions[cbName] ? "formOptions" : "fieldOptions", cbOpt = self.options[optionType][cbName];
                cbOpt && (self.options[optionType][cbName] = Array.isArray(cbOpt) ? cbOpt.map((function(cbFn) {
                    return cbFn.bind(self);
                })) : cbOpt.bind(self));
            })), formStartup(self.$form, self.options);
            var initOptions = {};
            self.options.formOptions.onInitCheckFilled && (initOptions.detail = self.validateFilledFields()), 
            dispatchCustomEvent(self.$form, customEvents_form.init, initOptions);
        }
        var Constructor, protoProps, staticProps;
        return Constructor = Form, staticProps = [ {
            key: "addValidationErrors",
            value: function(errorsObj) {
                Form.prototype.validationErrors = mergeObjects({}, Form.prototype.validationErrors, errorsObj);
            }
        }, {
            key: "addValidationRules",
            value: function(rulesObj) {
                Form.prototype.validationRules = mergeObjects({}, Form.prototype.validationRules, rulesObj);
            }
        }, {
            key: "setOptions",
            value: function(optionsObj) {
                Form.prototype.options = mergeObjects({}, Form.prototype.options, optionsObj);
            }
        } ], (protoProps = [ {
            key: "destroy",
            value: function() {
                !function($form, options) {
                    options.fieldOptions.strictHtmlValidation && ($form.removeEventListener("keypress", keypressMaxlength, !1), 
                    $form.removeEventListener("input", dataTypeNumber, !1)), options.fieldOptions.preventPasteFields && $form.removeEventListener("paste", pastePrevent, !1), 
                    options.formOptions.handleSubmit && $form.removeEventListener("submit", submit), 
                    options.fieldOptions.validateOnEvents.split(" ").forEach((function(eventName) {
                        var useCapturing = "blur" === eventName;
                        $form.removeEventListener(eventName, validation, useCapturing);
                    })), $form.removeEventListener(customEvents_field.validation, validationEnd, !1), 
                    $form.removeEventListener(customEvents_form.validation, formValidationEnd, !1), 
                    delete $form.formjs;
                }(this.$form, this.options), dispatchCustomEvent(this.$form, customEvents_form.destroy);
            }
        }, {
            key: "getFormData",
            value: function() {
                var trimValues = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.options.fieldOptions.trimValue, $formFields = this.$form.querySelectorAll("input, select, textarea"), $filteredFields = Array.from($formFields).filter((function(elem) {
                    return elem.matches(excludeSelector);
                }));
                return this.options.formOptions.getFormData($filteredFields, trimValues);
            }
        }, {
            key: "validateField",
            value: function(field, fieldOptions) {
                var self = this, $field = "string" == typeof field ? self.$form.querySelector(field) : field;
                fieldOptions = mergeObjects({}, self.options.fieldOptions, fieldOptions);
                var $form = self.$form;
                return checkFieldValidity($field, fieldOptions, self.validationRules, self.validationErrors).then((function(obj) {
                    return dispatchCustomEvent(obj.$field, customEvents_field.validation, {
                        detail: obj
                    }), obj.result && fieldOptions.onValidationCheckAll ? checkFormValidity($form, fieldOptions, self.validationRules, self.validationErrors, obj.$field).then((function(dataForm) {
                        dispatchCustomEvent($form, customEvents_form.validation, {
                            detail: dataForm
                        });
                    })) : obj.result || removeClass($form, self.options.formOptions.cssClasses.valid), 
                    obj;
                })).then(finalizeFieldPromise);
            }
        }, {
            key: "validateFilledFields",
            value: function() {
                var _this = this, focusOnRelated = this.options.fieldOptions.focusOnRelated;
                return this.options.fieldOptions.focusOnRelated = !1, checkFilledFields(this.$form).then((function(fields) {
                    return _this.options.fieldOptions.focusOnRelated = focusOnRelated, fields;
                }));
            }
        }, {
            key: "validateForm",
            value: function(fieldOptions) {
                fieldOptions = mergeObjects({}, this.options.fieldOptions, fieldOptions);
                var $form = this.$form;
                return checkFormValidity($form, fieldOptions, this.validationRules, this.validationErrors).then((function(data) {
                    return data.fields.forEach((function(obj) {
                        obj.isCheckingForm = !0, dispatchCustomEvent(obj.$field, customEvents_field.validation, {
                            detail: obj
                        });
                    })), dispatchCustomEvent($form, customEvents_form.validation, {
                        detail: data
                    }), data;
                })).then(finalizeFormPromise);
            }
        } ]) && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), 
        Form;
    }();
    return Form.prototype.options = options, Form.prototype.validationErrors = {}, Form.prototype.validationRules = validationRules, 
    Form.prototype.version = "5.2.0", Form;
}));
