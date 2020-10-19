/* formJS v4.2.3 | Valerio Di Punzio (@SimplySayHi) | https://valeriodipunzio.com/plugins/formJS/ | https://github.com/SimplySayHi/formJS | MIT license */
var Form = function() {
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
    }, checkFormEl = function(formEl) {
        var isString = _typeof(formEl), isFormSelector = "string" === isString && isDOMNode(document.querySelector(formEl)) && "form" === document.querySelector(formEl).tagName.toLowerCase();
        return {
            result: isDOMNode(formEl) || isFormSelector,
            element: "string" === isString ? document.querySelector(formEl) : formEl
        };
    }, customEvents_field = {
        validation: "fjs.field:validation"
    }, customEvents_form = {
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
    }, dispatchCustomEvent = function(elem, eventName) {
        var data = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, eventOptions = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
        eventOptions = mergeObjects({}, {
            bubbles: !0
        }, eventOptions);
        var eventObj = new Event(eventName, eventOptions);
        eventObj.data = data, elem.dispatchEvent(eventObj);
    }, fieldsStringSelector = 'input:not([type="reset"]):not([type="submit"]):not([type="button"]):not([type="hidden"]), select, textarea', formatMap = {
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
    }, getUniqueFields = function(nodeList) {
        var currentFieldName = "", currentFieldType = "";
        return Array.from(nodeList).filter((function(fieldEl) {
            var name = fieldEl.name, type = fieldEl.type;
            return (name !== currentFieldName || type !== currentFieldType) && (fieldEl.matches("[data-required-from]") || (currentFieldName = name, 
            currentFieldType = type), !0);
        }));
    }, getValidateFieldDefault = function(obj) {
        return mergeObjects({}, {
            result: !1,
            fieldEl: null
        }, obj);
    }, getValidateFormDefault = function(obj) {
        return mergeObjects({}, {
            result: !0,
            fields: []
        }, obj);
    }, isFieldForChangeEvent = function(fieldEl) {
        return fieldEl.matches('select, [type="radio"], [type="checkbox"], [type="file"]');
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
    }, defaultCallbacksInOptions = {
        fieldOptions: {
            beforeValidation: function(fieldObj) {
                var fieldOptions = this.options.fieldOptions;
                !function(fields, fieldOptions) {
                    (fields = isNodeList(fields) ? Array.from(fields) : [ fields ]).forEach((function(fieldEl) {
                        if ("checkbox" !== fieldEl.type && "radio" !== fieldEl.type) {
                            var containerEl = fieldEl.closest(fieldOptions.questionContainer) || fieldEl;
                            fieldEl.value ? addClass(containerEl, fieldOptions.cssClasses.dirty) : removeClass(containerEl, fieldOptions.cssClasses.dirty);
                        }
                    }));
                }(fieldObj.fieldEl, fieldOptions), fieldOptions.skipUIfeedback || addClass(fieldObj.fieldEl.closest(fieldOptions.questionContainer), fieldOptions.cssClasses.pending);
            }
        },
        formOptions: {
            getFormData: function(filteredFields) {
                var formData = {}, formEl = this.formEl;
                return filteredFields.forEach((function(fieldEl) {
                    var isCheckbox = "checkbox" === fieldEl.type, isRadio = "radio" === fieldEl.type, isSelect = fieldEl.matches("select"), name = fieldEl.name, value = fieldEl.value;
                    if (isCheckbox) {
                        value = fieldEl.checked;
                        var checkboxes = Array.from(formEl.querySelectorAll('[name="' + name + '"]'));
                        if (checkboxes.length > 1) value = [], checkboxes.filter((function(field) {
                            return field.checked;
                        })).forEach((function(fieldEl) {
                            value.push(fieldEl.value);
                        }));
                    } else if (isRadio) {
                        var checkedRadio = formEl.querySelector('[name="' + name + '"]:checked');
                        value = null === checkedRadio ? null : checkedRadio.value;
                    } else if (isSelect) {
                        var selectedOpts = Array.from(fieldEl.options).filter((function(option) {
                            return option.selected;
                        }));
                        selectedOpts.length > 1 && (value = [], selectedOpts.forEach((function(fieldEl) {
                            value.push(fieldEl.value);
                        })));
                    }
                    formData[name] = value;
                })), formData;
            }
        }
    }, options = {
        fieldOptions: {
            beforeValidation: [ defaultCallbacksInOptions.fieldOptions.beforeValidation ],
            cssClasses: {
                dirty: "is-dirty",
                error: "has-error",
                errorEmpty: "has-error-empty",
                errorRule: "has-error-rule",
                pending: "is-pending",
                valid: "is-valid"
            },
            focusOnRelated: !0,
            handleFileUpload: !0,
            handleValidation: !0,
            maxFileSize: 10,
            onValidationCheckAll: !0,
            preventPasteFields: '[type="password"], [data-equal-to]',
            questionContainer: "[data-formjs-question]",
            skipUIfeedback: !1,
            strictHtmlValidation: !0,
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
            getFormData: defaultCallbacksInOptions.formOptions.getFormData,
            handleSubmit: !0
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
        checkbox: function(value, fieldEl) {
            var dataChecksEl = fieldEl.closest("form").querySelector('[name="' + fieldEl.name + '"][data-checks]');
            return dataChecksEl ? function(fieldEl) {
                var attrValue = JSON.parse(fieldEl.getAttribute("data-checks")), checkedElLength = fieldEl.closest("form").querySelectorAll('[name="' + fieldEl.name + '"]:checked').length, isMinOk = checkedElLength >= attrValue[0], isMaxOk = checkedElLength <= attrValue[1], obj = {
                    result: isMinOk && isMaxOk
                };
                return obj.result || (obj.errors = {
                    checks: !0
                }, isMinOk || (obj.errors.minChecks = !0), isMaxOk || (obj.errors.maxChecks = !0)), 
                obj;
            }(dataChecksEl) : {
                result: fieldEl.checked
            };
        },
        equalTo: function(value, fieldEl) {
            return {
                result: value === fieldEl.closest("form").querySelector('[name="' + fieldEl.getAttribute("data-equal-to") + '"]').value
            };
        },
        exactLength: function(value, fieldEl) {
            var valueLength = value.length, exactLength = 1 * fieldEl.getAttribute("data-exact-length"), obj = {
                result: valueLength === exactLength
            };
            return obj.result || (obj.errors = {}, valueLength < exactLength ? obj.errors.minlength = !0 : obj.errors.maxlength = !0), 
            obj;
        },
        file: function(value, fieldEl) {
            var maxFileSize = 1 * (fieldEl.getAttribute("data-max-file-size") || fieldOptions.maxFileSize), MIMEtype = fieldEl.accept ? new RegExp(fieldEl.accept.replace("*", "[^\\/,]+")) : null, filesList = Array.from(fieldEl.files), obj = {
                result: !0
            };
            return filesList.forEach((function(file) {
                var exceedMaxFileSize = maxFileSize > 0 && file.size / 1024 / 1024 > maxFileSize, isAcceptedFileType = null === MIMEtype || MIMEtype.test(file.type);
                !exceedMaxFileSize && isAcceptedFileType || (obj.result = !1, void 0 === obj.errors && (obj.errors = {}), 
                exceedMaxFileSize && (obj.errors.maxFileSize = !0), isAcceptedFileType || (obj.errors.acceptedFileType = !0));
            })), obj;
        },
        length: function(value, fieldEl) {
            var valueL = value.length, attrValue = JSON.parse(fieldEl.getAttribute("data-length")), isMinlengthOk = valueL >= attrValue[0], isMaxlengthOk = valueL <= attrValue[1], obj = {
                result: isMinlengthOk && isMaxlengthOk
            };
            return obj.result || (obj.errors = {
                stringLength: !0
            }, isMinlengthOk || (obj.errors.minlength = !0), isMaxlengthOk || (obj.errors.maxlength = !0)), 
            obj;
        },
        max: function(value, fieldEl) {
            var maxVal = fieldEl.max, dateFormat = fieldEl.getAttribute("data-date-format");
            return ("date" === fieldEl.type || dateFormat) && (value = getDateAsNumber(value, dateFormat), 
            maxVal = maxVal.split("-").join("")), {
                result: (value *= 1) <= (maxVal *= 1)
            };
        },
        maxlength: function(value, fieldEl) {
            return {
                result: value.length <= 1 * fieldEl.maxLength
            };
        },
        min: function(value, fieldEl) {
            var minVal = fieldEl.min, dateFormat = fieldEl.getAttribute("data-date-format");
            return ("date" === fieldEl.type || fieldEl.getAttribute("data-date-format")) && (value = getDateAsNumber(value, dateFormat), 
            minVal = minVal.split("-").join("")), {
                result: (value *= 1) >= (minVal *= 1)
            };
        },
        minlength: function(value, fieldEl) {
            return {
                result: value.length >= 1 * fieldEl.minLength
            };
        },
        pattern: function(value, fieldEl) {
            return {
                result: new RegExp(fieldEl.pattern).test(value)
            };
        },
        radio: function(value, fieldEl) {
            var fieldChecked = fieldEl.closest("form").querySelector('[name="' + fieldEl.name + '"]:checked');
            return {
                result: null !== fieldChecked && fieldChecked.value.trim().length > 0
            };
        }
    }, dataTypeNumber = function(event) {
        var fieldEl = event.target;
        if (fieldEl.matches('[data-type="number"]')) {
            var fieldValue = fieldEl.value;
            if (/[^\d.,+\-]/.test(fieldValue)) {
                event.stopImmediatePropagation();
                var valueReplaced = fieldValue.replace(/[^\d.,+\-]/g, "");
                fieldEl.value = valueReplaced;
            }
        }
    }, formValidationEnd = function(event) {
        var formEl = event.target, options = formEl.formjs.options;
        if (!options.fieldOptions.skipUIfeedback) {
            var clMethodName = event.data.result ? "add" : "remove";
            formEl.classList[clMethodName](options.formOptions.cssClasses.valid);
        }
    }, keypressMaxlength = function(event) {
        var fieldEl = event.target;
        if (fieldEl.matches("[maxlength]")) {
            var maxLength = 1 * fieldEl.maxLength, keyPressed = event.which || event.keyCode;
            if (fieldEl.value.length >= maxLength && -1 === [ 8, 37, 38, 39, 46 ].indexOf(keyPressed)) return !1;
        }
    }, pastePrevent = function(event) {
        var fieldEl = event.target, fieldOptions = fieldEl.closest("form").formjs.options.fieldOptions;
        fieldEl.matches(fieldOptions.preventPasteFields) && event.preventDefault();
    };
    function submit(event) {
        var formEl = event.target, instance = formEl.formjs, options = instance.options, formCssClasses = options.formOptions.cssClasses, isAjaxForm = options.formOptions.ajaxSubmit, btnEl = formEl.querySelector('[type="submit"]'), eventPreventDefault = function() {
            var enableBtn = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
            btnEl && enableBtn && (btnEl.disabled = !1), event && event.preventDefault();
        };
        if (isAjaxForm && eventPreventDefault(!1), btnEl) {
            if (btnEl.disabled) return eventPreventDefault(!1), !1;
            btnEl.disabled = !0;
        }
        removeClass(formEl, formCssClasses.ajaxComplete + " " + formCssClasses.ajaxError + " " + formCssClasses.ajaxSuccess), 
        addClass(formEl, formCssClasses.submit), (options.fieldOptions.handleValidation ? instance.validateForm() : Promise.resolve(getValidateFormDefault())).then((function(formValidation) {
            var beforeSendData = {
                stopExecution: !1,
                formData: {}
            };
            if (!formValidation.result) return eventPreventDefault(), removeClass(formEl, formCssClasses.submit), 
            beforeSendData.stopExecution = !0, [ beforeSendData ];
            var formDataObj = isAjaxForm ? instance.getFormData() : null, callbacksBeforeSend = options.formOptions.beforeSend;
            return formDataObj && (beforeSendData.formData = formDataObj), runFunctionsSequence({
                functionsList: callbacksBeforeSend,
                data: beforeSendData,
                stopConditionFn: function(data) {
                    return data.stopExecution;
                }
            });
        })).then((function(dataList) {
            if (dataList.filter((function(data) {
                return data.stopExecution;
            })).length > 0) return eventPreventDefault(), !1;
            if (isAjaxForm) {
                var formData = dataList.pop().formData;
                addClass(formEl, formCssClasses.ajaxPending), dispatchCustomEvent(formEl, customEvents_form.submit, function(formEl, formDataObj, options) {
                    var timeoutTimer, btnEl = formEl.querySelector('[type="submit"]'), ajaxOptions = mergeObjects({}, options.formOptions.ajaxOptions), isMultipart = "multipart/form-data" === ajaxOptions.headers["Content-Type"];
                    if (ajaxOptions.body = formDataObj, isMultipart && options.fieldOptions.handleFileUpload) {
                        var formDataMultipart = new FormData;
                        for (var key in ajaxOptions.body) formDataMultipart.append(key, ajaxOptions.body[key]);
                        Array.from(formEl.querySelectorAll('[type="file"]')).forEach((function(field) {
                            Array.from(field.files).forEach((function(file, idx) {
                                var name = field.name + "[" + idx + "]";
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
                        if (!response.ok) return Promise.reject(response);
                        var fetchMethod = function(response, options) {
                            var accept = options.headers.get("Accept"), contentType = response.headers.get("Content-Type"), headerOpt = accept || contentType || "";
                            return headerOpt.indexOf("application/json") > -1 || "" === headerOpt ? "json" : headerOpt.indexOf("text/") > -1 ? "text" : "blob";
                        }(response, ajaxOptions);
                        return response[fetchMethod]();
                    })).then((function(data) {
                        return addClass(formEl, options.formOptions.cssClasses.ajaxSuccess), data;
                    })).catch((function(error) {
                        return addClass(formEl, options.formOptions.cssClasses.ajaxError), Promise.reject(error);
                    })).finally((function() {
                        timeoutTimer && window.clearTimeout(timeoutTimer), removeClass(formEl, options.formOptions.cssClasses.submit + " " + options.formOptions.cssClasses.ajaxPending), 
                        addClass(formEl, options.formOptions.cssClasses.ajaxComplete), btnEl.disabled = !1;
                    }));
                }(formEl, formData, options));
            }
        }));
    }
    var validation = function(event) {
        var isChangeEvent = "change" === event.type, fieldEl = event.target, self = fieldEl.closest("form").formjs;
        if (fieldEl.matches(fieldsStringSelector)) {
            var isFieldForChangeEventBoolean = isFieldForChangeEvent(fieldEl);
            if (isFieldForChangeEventBoolean && isChangeEvent || !isFieldForChangeEventBoolean && !isChangeEvent) return self.validateField(fieldEl).then((function(obj) {
                var type = obj.fieldEl.type, realtedFieldEqualTo = obj.fieldEl.closest("form").querySelector('[data-equal-to="' + obj.fieldEl.name + '"]');
                return (obj.fieldEl.required || obj.fieldEl.matches("[data-validate-if-filled]")) && "checkbox" !== type && "radio" !== type && realtedFieldEqualTo && "" !== realtedFieldEqualTo.value.trim() && self.validateField(realtedFieldEqualTo), 
                obj;
            }));
        }
    }, validationEnd = function(event) {
        var eventData = event.data, fieldEl = eventData.fieldEl, options = fieldEl.closest("form").formjs.options.fieldOptions, containerEl = fieldEl.closest(options.questionContainer), isReqFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = document.querySelector(fieldEl.getAttribute("data-required-from"));
        if (null !== containerEl && removeClass(containerEl, options.cssClasses.pending), 
        null !== containerEl && !options.skipUIfeedback) if (eventData.result) {
            if (!isReqFrom || isReqFrom && reqMoreEl.checked) {
                var errorClasses = options.cssClasses.error + " " + options.cssClasses.errorEmpty + " " + options.cssClasses.errorRule;
                removeClass(containerEl, errorClasses), addClass(containerEl, options.cssClasses.valid);
            }
        } else {
            var extraErrorClass = options.cssClasses.errorRule, isChecks = fieldEl.matches("[data-checks]"), checkedElLength = isChecks ? containerEl.querySelectorAll('[name="' + fieldEl.name + '"]:checked').length : 0;
            (!isChecks && eventData.errors && eventData.errors.empty || isChecks && 0 === checkedElLength) && (extraErrorClass = options.cssClasses.errorEmpty);
            var _errorClasses = options.cssClasses.error + " " + extraErrorClass, errorClassToRemove = options.cssClasses.errorEmpty + " " + options.cssClasses.errorRule;
            removeClass(containerEl, options.cssClasses.valid + " " + errorClassToRemove), addClass(containerEl, _errorClasses);
        }
    };
    function formStartup(formEl, options) {
        formEl.noValidate = !0;
        var fieldOptions = options.fieldOptions, formOptions = options.formOptions;
        fieldOptions.handleValidation && (fieldOptions.strictHtmlValidation && (formEl.addEventListener("keypress", keypressMaxlength, !1), 
        formEl.addEventListener("input", dataTypeNumber, !1)), fieldOptions.preventPasteFields && formEl.querySelectorAll(fieldOptions.preventPasteFields).length && formEl.addEventListener("paste", pastePrevent, !1), 
        fieldOptions.validateOnEvents.split(" ").forEach((function(eventName) {
            var useCapturing = "blur" === eventName;
            formEl.addEventListener(eventName, validation, useCapturing);
        })), formEl.addEventListener(customEvents_field.validation, validationEnd, !1), 
        formEl.addEventListener(customEvents_form.validation, formValidationEnd, !1)), formOptions.handleSubmit && (formEl.addEventListener("submit", submit), 
        formOptions.ajaxSubmit && (formEl.getAttribute("enctype") && (formOptions.ajaxOptions.headers["Content-Type"] = formEl.getAttribute("enctype")), 
        formEl.getAttribute("method") && (formOptions.ajaxOptions.method = formEl.getAttribute("method").toUpperCase()), 
        formEl.getAttribute("action") && (formOptions.ajaxOptions.url = formEl.getAttribute("action"))));
    }
    var init = function(formEl) {
        var instance = formEl.formjs, formFields = function(formEl) {
            return getUniqueFields(formEl.querySelectorAll(fieldsStringSelector)).map((function(fieldEl) {
                var name = fieldEl.name, type = fieldEl.type, isCheckboxOrRadio = "checkbox" === type || "radio" === type, fieldChecked = formEl.querySelector('[name="' + name + '"]:checked'), isReqFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = isReqFrom ? formEl.querySelector(fieldEl.getAttribute("data-required-from")) : null;
                return isCheckboxOrRadio ? fieldChecked || null : isReqFrom && reqMoreEl.checked || !isReqFrom && fieldEl.value ? fieldEl : null;
            })).filter((function(fieldEl) {
                return null !== fieldEl;
            }));
        }(formEl);
        return Promise.all(formFields.map((function(fieldEl) {
            var isFieldForChangeEventBoolean = isFieldForChangeEvent(fieldEl);
            return validation({
                target: fieldEl,
                type: isFieldForChangeEventBoolean ? "change" : ""
            });
        }))).then((function(fields) {
            return instance.isInitialized = !0, {
                instance: instance,
                fields: fields
            };
        }));
    };
    function checkFieldValidity(fieldEl, fieldOptions, validationRules, validationErrors) {
        if (!isDOMNode(fieldEl)) {
            var obj = getValidateFieldDefault({
                fieldEl: fieldEl
            });
            return Promise.resolve(obj);
        }
        var formEl = fieldEl.closest("form"), isValidValue = fieldEl.value.trim().length > 0;
        if ("radio" === fieldEl.type) {
            var checkedEl = fieldEl.checked ? fieldEl : formEl.querySelector('[name="' + fieldEl.name + '"]:checked'), reqMoreIsChecked = checkedEl && checkedEl.matches("[data-require-more]"), findReqMoreEl = reqMoreIsChecked ? checkedEl : formEl.querySelector('[data-require-more][name="' + fieldEl.name + '"]'), findReqFromEl = findReqMoreEl ? formEl.querySelector('[data-required-from="#' + findReqMoreEl.id + '"]') : null;
            checkedEl && findReqFromEl && (findReqFromEl.required = findReqMoreEl.required && findReqMoreEl.checked, 
            reqMoreIsChecked ? fieldOptions.focusOnRelated && findReqFromEl.focus() : findReqFromEl.value = "");
        }
        if (fieldEl.matches("[data-required-from]") && isValidValue) {
            var reqMoreEl = formEl.querySelector(fieldEl.getAttribute("data-required-from"));
            reqMoreEl.checked = !0, fieldEl.required = reqMoreEl.required;
        }
        var needsValidation = fieldEl.required || fieldEl.matches("[data-validate-if-filled]") && isValidValue;
        return runFunctionsSequence({
            functionsList: fieldOptions.beforeValidation,
            data: {
                fieldEl: fieldEl
            }
        }).then((function(data) {
            var dataObj = data.pop();
            return new Promise((function(resolve) {
                needsValidation || (dataObj.result = !0), resolve(needsValidation ? function(fieldEl, fieldOptions, validationRules, validationErrors) {
                    var fieldValue = fieldEl.value, obj = getValidateFieldDefault({
                        result: fieldValue.trim().length > 0,
                        fieldEl: fieldEl
                    }), isRadioOrCheckbox = /^(radio|checkbox)$/.test(fieldEl.type), hasSelectedInput = fieldEl.closest("form").querySelectorAll('[name="' + fieldEl.name + '"]:checked').length > 0;
                    if (!isRadioOrCheckbox && !obj.result || isRadioOrCheckbox && !hasSelectedInput) return obj.result = !1, 
                    obj.errors = {
                        empty: !0
                    }, Promise.resolve(obj);
                    var validationMethods = Array.from(fieldEl.attributes).reduce((function(accList, attr) {
                        var attrName = toCamelCase(attr.name.replace("data-", "")), attrValue = toCamelCase(attr.value), isAttrValueWithFn = ("type" === attrName || "subtype" === attrName) && validationRules[attrValue], isAttrNameWithFn = validationRules[attrName];
                        return (isAttrValueWithFn || isAttrNameWithFn) && accList.push(isAttrValueWithFn ? attrValue : attrName), 
                        accList;
                    }), []);
                    return new Promise((function(resolve) {
                        resolve(validationMethods.reduce((function(accPromise, methodName) {
                            return accPromise.then((function(accObj) {
                                return new Promise((function(resolveVal) {
                                    resolveVal(validationRules[methodName](fieldValue, fieldEl, fieldOptions));
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
                            var errors = validationErrors[methodName] && validationErrors[methodName](fieldValue, fieldEl) || {};
                            return mergeObjects(accObj, errors);
                        }), data.errors), data.errors.rule = !0), data;
                    }));
                }(fieldEl, fieldOptions, validationRules, validationErrors) : dataObj);
            }));
        }));
    }
    function checkFormValidity(formEl, fieldOptions, validationRules, validationErrors) {
        var fieldToSkip = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : null;
        fieldOptions = mergeObjects({}, fieldOptions, {
            focusOnRelated: !1
        });
        var fieldsList = getUniqueFields(formEl.querySelectorAll(fieldsStringSelector));
        return Promise.all(fieldsList.map((function(fieldEl) {
            if (fieldToSkip && fieldEl === fieldToSkip) {
                var obj = getValidateFieldDefault({
                    fieldEl: fieldEl,
                    result: !0
                });
                return Promise.resolve(obj);
            }
            return checkFieldValidity(fieldEl, fieldOptions, validationRules, validationErrors);
        }))).then((function(fields) {
            var areAllFieldsValid = 0 === fields.filter((function(fieldObj) {
                return !fieldObj.result;
            })).length;
            return getValidateFormDefault({
                result: areAllFieldsValid,
                fields: fields
            });
        }));
    }
    var Form = function() {
        function Form(formEl, optionsObj) {
            _classCallCheck(this, Form);
            var argsL = arguments.length, checkFormElem = checkFormEl(formEl);
            if (0 === argsL || argsL > 0 && !formEl) throw new Error('First argument "formEl" is missing or falsy!');
            if (isNodeList(formEl)) throw new Error('First argument "formEl" must be a single DOM node or a form CSS selector, not a NodeList!');
            if (!checkFormElem.result) throw new Error('First argument "formEl" is not a DOM node nor a form CSS selector!');
            var self = this;
            self.formEl = checkFormElem.element, self.formEl.formjs = self, self.options = mergeObjects({}, Form.prototype.options, optionsObj);
            var cbList = [ "beforeValidation", "beforeSend", "getFormData" ];
            cbList.forEach((function(cbName) {
                var optionType = self.options.formOptions[cbName] ? "formOptions" : "fieldOptions", cbOpt = self.options[optionType][cbName];
                cbOpt && (self.options[optionType][cbName] = Array.isArray(cbOpt) ? cbOpt.map((function(cbFn) {
                    return cbFn.bind(self);
                })) : cbOpt.bind(self));
            })), formStartup(self.formEl, self.options);
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
                !function(formEl, options) {
                    options.fieldOptions.strictHtmlValidation && (formEl.removeEventListener("keypress", keypressMaxlength, !1), 
                    formEl.removeEventListener("input", dataTypeNumber, !1)), options.fieldOptions.preventPasteFields && formEl.removeEventListener("paste", pastePrevent, !1), 
                    options.formOptions.handleSubmit && formEl.removeEventListener("submit", submit), 
                    options.fieldOptions.validateOnEvents.split(" ").forEach((function(eventName) {
                        var useCapturing = "blur" === eventName;
                        formEl.removeEventListener(eventName, validation, useCapturing);
                    })), formEl.removeEventListener(customEvents_field.validation, validationEnd, !1), 
                    formEl.removeEventListener(customEvents_form.validation, formValidationEnd, !1), 
                    delete formEl.formjs;
                }(this.formEl, this.options);
            }
        }, {
            key: "getFormData",
            value: function() {
                var formFieldsEl = this.formEl.querySelectorAll("input, select, textarea"), filteredFields = Array.from(formFieldsEl).filter((function(elem) {
                    return elem.matches(':not([type="reset"]):not([type="submit"]):not([type="button"]):not([type="file"]):not([data-exclude-data])');
                }));
                return this.options.formOptions.getFormData(filteredFields);
            }
        }, {
            key: "init",
            value: function() {
                var _this = this, focusOnRelated = this.options.fieldOptions.focusOnRelated;
                return this.options.fieldOptions.focusOnRelated = !1, init(this.formEl).then((function(initObj) {
                    return _this.options.fieldOptions.focusOnRelated = focusOnRelated, initObj;
                }));
            }
        }, {
            key: "validateField",
            value: function(fieldEl, fieldOptions) {
                var self = this;
                fieldEl = "string" == typeof fieldEl ? self.formEl.querySelector(fieldEl) : fieldEl, 
                fieldOptions = mergeObjects({}, self.options.fieldOptions, fieldOptions);
                var formEl = self.formEl;
                return checkFieldValidity(fieldEl, fieldOptions, self.validationRules, self.validationErrors).then((function(obj) {
                    return dispatchCustomEvent(obj.fieldEl, customEvents_field.validation, obj), obj.result && fieldOptions.onValidationCheckAll ? checkFormValidity(formEl, fieldOptions, self.validationRules, self.validationErrors, obj.fieldEl).then((function(dataForm) {
                        dispatchCustomEvent(formEl, customEvents_form.validation, dataForm);
                    })) : obj.result || removeClass(formEl, self.options.formOptions.cssClasses.valid), 
                    obj;
                }));
            }
        }, {
            key: "validateForm",
            value: function(fieldOptions) {
                fieldOptions = mergeObjects({}, this.options.fieldOptions, fieldOptions);
                var formEl = this.formEl;
                return checkFormValidity(formEl, fieldOptions, this.validationRules, this.validationErrors).then((function(data) {
                    return data.fields.forEach((function(obj) {
                        dispatchCustomEvent(obj.fieldEl, customEvents_field.validation, obj);
                    })), dispatchCustomEvent(formEl, customEvents_form.validation, data), data;
                }));
            }
        } ]) && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), 
        Form;
    }();
    return Form.prototype.isInitialized = !1, Form.prototype.options = options, Form.prototype.validationErrors = {
        email: function(string) {
            var obj = {};
            if (-1 === string.indexOf("@")) obj.missingAtChar = !0; else {
                var splitAt_at = string.split("@");
                if (0 === splitAt_at[0].length && (obj.missingUserName = !0), 0 === splitAt_at[1].length) obj.missingDomain = !0, 
                obj.missingExtensionDot = !0, obj.missingExtension = !0; else if (-1 === splitAt_at[1].indexOf(".")) obj.missingExtensionDot = !0, 
                obj.missingExtension = !0; else {
                    var extLength = splitAt_at[1].split(".")[1].length;
                    0 === extLength ? obj.missingExtension = !0 : extLength < 2 && (obj.minlengthExtension = !0);
                }
            }
            return obj;
        }
    }, Form.prototype.validationRules = validationRules, Form.prototype.version = "4.2.3", 
    Form;
}();
