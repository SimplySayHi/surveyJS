(function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function(exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                enumerable: true,
                get: getter
            });
        }
    };
    __webpack_require__.r = function(exports) {
        if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, {
                value: "Module"
            });
        }
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
    };
    __webpack_require__.t = function(value, mode) {
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, "default", {
            enumerable: true,
            value: value
        });
        if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, function(key) {
            return value[key];
        }.bind(null, key));
        return ns;
    };
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function getDefault() {
            return module["default"];
        } : function getModuleExports() {
            return module;
        };
        __webpack_require__.d(getter, "a", getter);
        return getter;
    };
    __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = "";
    return __webpack_require__(__webpack_require__.s = "./src/index.js");
})({
    "./src/index.js": function(module, exports, __webpack_require__) {
        "use strict";
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
 /**! formJS v2.3.3 | Valerio Di Punzio (@SimplySayHi) | https://valeriodipunzio.com/plugins/formJS/ | https://github.com/SimplySayHi/formJS | MIT license */        var _helper = __webpack_require__("./src/modules/helper.js");
        var _listenerCallbacks2 = __webpack_require__("./src/modules/listenerCallbacks.js");
        var _optionsUtils = __webpack_require__("./src/modules/optionsUtils.js");
        var _options = __webpack_require__("./src/modules/options.js");
        var _validationRules = __webpack_require__("./src/modules/validationRules.js");
        var _formStartup2 = __webpack_require__("./src/modules/formStartup.js");
        var _destroy2 = __webpack_require__("./src/modules/destroy.js");
        var _getFormJSON2 = __webpack_require__("./src/modules/getFormJSON.js");
        var _init2 = __webpack_require__("./src/modules/init.js");
        var _isValidField2 = __webpack_require__("./src/modules/isValidField.js");
        var _isValidForm2 = __webpack_require__("./src/modules/isValidForm.js");
        var _submit2 = __webpack_require__("./src/modules/submit.js");
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var version = "2.3.3";
        var _listenerCallbacks = new WeakMap();
        var Form = function() {
            function Form(formEl) {
                var optionsObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                _classCallCheck(this, Form);
                var self = this, argsL = arguments.length, checkFormEl = (0, _helper._checkFormEl)(formEl);
                if (argsL === 0 || argsL > 0 && !formEl) {
                    throw new Error('First argument "formEl" is missing or falsy!');
                }
                if ((0, _helper._isNodeList)(formEl)) {
                    throw new Error('First argument "formEl" must be a single DOM node or a form CSS selector, not a NodeList!');
                }
                if (!checkFormEl.result) {
                    throw new Error('First argument "formEl" is not a DOM node nor a form CSS selector!');
                }
                self.formEl = checkFormEl.element;
                self.options = (0, _helper._mergeObjects)({}, Form.prototype.options, optionsObj);
                _listenerCallbacks.set(self, {
                    charCount: _listenerCallbacks2._callbackFns.charCount,
                    dataTypeNumber: _listenerCallbacks2._callbackFns.dataTypeNumber,
                    keypressMaxlength: _listenerCallbacks2._callbackFns.keypressMaxlength,
                    pastePrevent: _listenerCallbacks2._callbackFns.pastePrevent.bind(self),
                    submit: _listenerCallbacks2._callbackFns.submit.bind(self),
                    validation: _listenerCallbacks2._callbackFns.validation.bind(self)
                });
                _formStartup2._formStartup.call(self);
            }
            _createClass(Form, [ {
                key: "destroy",
                value: function destroy() {
                    _destroy2.destroy.call(this);
                }
            }, {
                key: "getFormJSON",
                value: function getFormJSON(customFn) {
                    return _getFormJSON2.getFormJSON.call(this, customFn);
                }
            }, {
                key: "init",
                value: function init() {
                    return _init2.init.call(this);
                }
            }, {
                key: "isValidField",
                value: function isValidField(fieldEl, fieldOptions) {
                    return _isValidField2.isValidField.call(this, fieldEl, fieldOptions);
                }
            }, {
                key: "isValidForm",
                value: function isValidForm(optionsObj) {
                    return _isValidForm2.isValidForm.call(this, optionsObj);
                }
            }, {
                key: "submit",
                value: function submit(optionsObj, event) {
                    _submit2.submit.call(this, optionsObj, event);
                }
            }, {
                key: "listenerCallbacks",
                get: function get() {
                    return _listenerCallbacks.get(this);
                }
            } ], [ {
                key: "addValidationRules",
                value: function addValidationRules(rulesObj) {
                    this.prototype.validationRules = (0, _helper._mergeObjects)({}, this.prototype.validationRules, rulesObj);
                }
            }, {
                key: "setOptions",
                value: function setOptions(optionsObj) {
                    this.prototype.options = (0, _helper._mergeObjects)({}, this.prototype.options, optionsObj);
                }
            } ]);
            return Form;
        }();
        Form.prototype.isInitialized = false;
        Form.prototype.validationRules = _validationRules.validationRules;
        Form.prototype.options = _options.options;
        Form.prototype.version = version;
        _optionsUtils._setCallbackFunctionsInOptions.call(Form.prototype);
        if (!window.Form) {
            window.Form = Form;
        }
        if (!window.FormJS) {
            window.FormJS = Form;
        }
    },
    "./src/modules/checkDirtyField.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports._checkDirtyField = _checkDirtyField;
        var _helper = __webpack_require__("./src/modules/helper.js");
        function _checkDirtyField(fields) {
            var cssClasses = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
            var fields = (0, _helper._isNodeList)(fields) ? Array.from(fields) : [ fields ];
            fields.forEach(function(fieldEl) {
                if (fieldEl.type !== "checkbox" && fieldEl.type !== "radio") {
                    var containerEl = fieldEl.closest("[data-formjs-question]") || fieldEl;
                    if (fieldEl.value) {
                        (0, _helper._addClass)(containerEl, cssClasses);
                    } else {
                        (0, _helper._removeClass)(containerEl, cssClasses);
                    }
                }
            });
        }
    },
    "./src/modules/destroy.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.destroy = destroy;
        function destroy() {
            var self = this, formEl = self.formEl, validationListenerNames = self.options.fieldOptions.validateOnEvents;
            if (formEl.querySelectorAll("[data-char-count]").length > 0) {
                formEl.removeEventListener("input", self.listenerCallbacks.charCount, false);
            }
            if (self.options.fieldOptions.strictHtmlValidation) {
                formEl.removeEventListener("keypress", self.listenerCallbacks.keypressMaxlength, false);
                formEl.removeEventListener("input", self.listenerCallbacks.dataTypeNumber, false);
            }
            if (self.options.fieldOptions.preventPasteFields) {
                formEl.removeEventListener("paste", self.listenerCallbacks.pastePrevent, false);
            }
            if (self.options.formOptions.handleSubmit) {
                formEl.removeEventListener("submit", self.listenerCallbacks.submit);
            }
            validationListenerNames.split(" ").forEach(function(eventName) {
                var useCapturing = eventName === "blur" ? true : false;
                formEl.removeEventListener(eventName, self.listenerCallbacks.validation, useCapturing);
            });
        }
    },
    "./src/modules/formStartup.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports._formStartup = _formStartup;
        function _formStartup() {
            var self = this, formEl = self.formEl;
            if (!formEl || !formEl.matches("[novalidate]")) {
                return false;
            }
            var fieldOptions = self.options.fieldOptions, formOptions = self.options.formOptions;
            if (fieldOptions.handleValidation) {
                if (fieldOptions.strictHtmlValidation) {
                    formEl.addEventListener("keypress", self.listenerCallbacks.keypressMaxlength, false);
                    formEl.addEventListener("input", self.listenerCallbacks.dataTypeNumber, false);
                }
                if (fieldOptions.preventPasteFields && formEl.querySelectorAll(fieldOptions.preventPasteFields).length) {
                    formEl.addEventListener("paste", self.listenerCallbacks.pastePrevent, false);
                }
                if (formEl.querySelectorAll("[data-char-count]").length > 0) {
                    formEl.addEventListener("input", self.listenerCallbacks.charCount, false);
                }
                fieldOptions.validateOnEvents.split(" ").forEach(function(eventName) {
                    var useCapturing = eventName === "blur" ? true : false;
                    formEl.addEventListener(eventName, self.listenerCallbacks.validation, useCapturing);
                });
            }
            if (formOptions.handleSubmit) {
                formEl.addEventListener("submit", self.listenerCallbacks.submit);
                if (formOptions.ajaxSubmit) {
                    if (formEl.getAttribute("enctype")) {
                        formOptions.ajaxOptions.contentType = formEl.getAttribute("enctype");
                    }
                    if (formEl.getAttribute("method")) {
                        formOptions.ajaxOptions.method = formEl.getAttribute("method").toUpperCase();
                    }
                    if (formEl.getAttribute("action")) {
                        formOptions.ajaxOptions.url = formEl.getAttribute("action");
                    }
                }
            }
        }
    },
    "./src/modules/getFormJSON.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.getFormJSON = getFormJSON;
        function getFormJSON() {
            var customFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options.formOptions.getFormJSON;
            var formData = {}, self = this, formEl = self.formEl, formFieldsEl = formEl.querySelectorAll("input, select, textarea"), excludeSelectors = ':not([type="reset"]):not([type="submit"]):not([type="button"]):not([type="file"]):not([data-exclude-json])', filteredFields = Array.from(formFieldsEl).filter(function(elem) {
                return elem.matches(excludeSelectors);
            });
            if (typeof customFn === "function") {
                formData = customFn.call(self, filteredFields);
            } else {
                filteredFields.forEach(function(fieldEl) {
                    var isCheckbox = fieldEl.type === "checkbox", isRadio = fieldEl.type === "radio", isSelect = fieldEl.matches("select"), name = fieldEl.name, value = fieldEl.value;
                    if (isCheckbox) {
                        value = fieldEl.checked;
                        var checkboxes = Array.from(formEl.querySelectorAll('[name="' + name + '"]'));
                        if (checkboxes.length > 1) {
                            value = [];
                            var checkedElems = checkboxes.filter(function(field) {
                                return field.checked;
                            });
                            checkedElems.forEach(function(fieldEl) {
                                value.push(fieldEl.value);
                            });
                        }
                    } else if (isRadio) {
                        var checkedRadio = formEl.querySelector('[name="' + name + '"]:checked');
                        value = checkedRadio === null ? null : checkedRadio.value;
                    } else if (isSelect) {
                        var selectedOpts = Array.from(fieldEl.options).filter(function(option) {
                            return option.selected;
                        });
                        if (selectedOpts.length > 1) {
                            value = [];
                            selectedOpts.forEach(function(fieldEl) {
                                value.push(fieldEl.value);
                            });
                        }
                    }
                    formData[name] = value;
                });
            }
            return formData;
        }
    },
    "./src/modules/helper.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var _fieldsStringSelector = exports._fieldsStringSelector = 'input:not([type="reset"]):not([type="submit"]):not([type=button]):not([type=hidden]), select, textarea', _addClass = exports._addClass = function _addClass(element, cssClasses) {
            cssClasses.split(" ").forEach(function(className) {
                element.classList.add(className);
            });
        }, _executeCallback = exports._executeCallback = function _executeCallback(callbackOption, callbackData) {
            var self = this, callbackFnList = [];
            if (typeof callbackOption === "function") {
                callbackFnList.push(callbackOption);
            } else if (Array.isArray(callbackOption)) {
                callbackFnList = callbackOption;
            }
            callbackFnList.forEach(function(cbFn) {
                cbFn.call(self, callbackData);
            });
        }, _isDOMNode = exports._isDOMNode = function _isDOMNode(node) {
            return Element.prototype.isPrototypeOf(node);
        }, _isFieldForChangeEvent = exports._isFieldForChangeEvent = function _isFieldForChangeEvent(fieldEl) {
            return fieldEl.matches('select, [type="radio"], [type="checkbox"], [type="file"]');
        }, _isNodeList = exports._isNodeList = function _isNodeList(nodeList) {
            return NodeList.prototype.isPrototypeOf(nodeList);
        }, _isPlainObject = exports._isPlainObject = function _isPlainObject(object) {
            return Object.prototype.toString.call(object) === "[object Object]";
        }, _checkFormEl = exports._checkFormEl = function _checkFormEl(formEl) {
            var isString = typeof formEl === "undefined" ? "undefined" : _typeof(formEl), isValidNodeSelector = isString === "string" && _isDOMNode(document.querySelector(formEl)), isFormSelector = isValidNodeSelector && document.querySelector(formEl).tagName.toLowerCase() === "form", obj = {
                result: _isDOMNode(formEl) || isFormSelector,
                element: isString === "string" ? document.querySelector(formEl) : formEl
            };
            return obj;
        }, _mergeObjects = exports._mergeObjects = function _mergeObjects() {
            var out = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];
                if (!obj) {
                    continue;
                }
                for (var key in obj) {
                    var isArray = Object.prototype.toString.call(obj[key]) === "[object Array]";
                    var isObject = Object.prototype.toString.call(obj[key]) === "[object Object]";
                    if (obj.hasOwnProperty(key)) {
                        if (isArray) {
                            if (typeof out[key] === "undefined" || out[key] === null) {
                                out[key] = [];
                            }
                            out[key] = out[key].concat(obj[key].slice(0));
                        } else if (isObject) {
                            out[key] = _mergeObjects(out[key], obj[key]);
                        } else {
                            if (Array.isArray(out[key])) {
                                out[key].push(obj[key]);
                            } else {
                                out[key] = obj[key];
                            }
                        }
                    }
                }
            }
            return out;
        }, _removeClass = exports._removeClass = function _removeClass(element, cssClasses) {
            cssClasses.split(" ").forEach(function(className) {
                element.classList.remove(className);
            });
        }, _serialize = exports._serialize = function _serialize(obj) {
            var objToString = obj && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && obj.constructor === Object ? Object.keys(obj).reduce(function(a, k) {
                a.push(k + "=" + encodeURIComponent(obj[k]));
                return a;
            }, []).join("&") : obj;
            return objToString;
        }, _toCamelCase = exports._toCamelCase = function _toCamelCase(string) {
            return string.replace(/-([a-z])/gi, function(all, letter) {
                return letter.toUpperCase();
            });
        };
    },
    "./src/modules/init.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.init = undefined;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var init = exports.init = function init() {
            var self = this, formEl = self.formEl, formFields = formEl.querySelectorAll(_helper._fieldsStringSelector);
            var currentFieldName = "", currentFieldType = "";
            Array.from(formFields).forEach(function(fieldEl) {
                var name = fieldEl.name, type = fieldEl.type;
                if (name === currentFieldName && type === currentFieldType) {
                    return true;
                }
                var isCheckboxOrRadio = fieldEl.type === "checkbox" || fieldEl.type === "radio", isFieldForChangeEventBoolean = (0, 
                _helper._isFieldForChangeEvent)(fieldEl), fieldChecked = formEl.querySelector('[name="' + fieldEl.name + '"]:checked'), isReqFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = isReqFrom ? formEl.querySelector(fieldEl.getAttribute("data-required-from")) : null;
                if (!isReqFrom) {
                    currentFieldName = name;
                    currentFieldType = type;
                }
                if (!isCheckboxOrRadio && fieldEl.value || isCheckboxOrRadio && fieldChecked !== null || isReqFrom && reqMoreEl.checked) {
                    var fakeEventObj = {
                        target: fieldEl,
                        type: isFieldForChangeEventBoolean ? "change" : ""
                    };
                    self.listenerCallbacks.validation.call(self, fakeEventObj);
                }
            });
            self.isInitialized = true;
            return self;
        };
    },
    "./src/modules/isValid.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports._isValid = _isValid;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var _validationRules = __webpack_require__("./src/modules/validationRules.js");
        function _isValid(fieldEl) {
            var fieldOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var self = this, fieldType = fieldEl.matches("[data-subtype]") ? (0, _helper._toCamelCase)(fieldEl.getAttribute("data-subtype")) : fieldEl.type, fieldValue = fieldEl.value, isValidValue = fieldValue.trim().length > 0, fieldAttributes = Array.from(fieldEl.attributes).sort(function(a, b) {
                return a.name < b.name;
            });
            var attrValidations = [], attrValidationsResult = true;
            fieldAttributes.forEach(function(attr) {
                var attrName = (0, _helper._toCamelCase)(attr.name.replace("data-", "")), attrValue = attr.value, isTypeValueWithFn = attrName === "type" && typeof _validationRules._validationRulesAttributes[attrValue] === "function", isAttrNameWithFn = typeof _validationRules._validationRulesAttributes[attrName] === "function";
                if (isTypeValueWithFn || isAttrNameWithFn) {
                    var extraValObj = {
                        attrName: isTypeValueWithFn ? attrValue : attrName,
                        attrValue: attrValue,
                        fieldEl: fieldEl,
                        fieldOptions: fieldOptions
                    };
                    if (isTypeValueWithFn || attrName === "requiredFrom") {
                        attrValidations.unshift(extraValObj);
                    } else {
                        attrValidations.push(extraValObj);
                    }
                }
            });
            attrValidations.forEach(function(item) {
                var extraVal = _validationRules._validationRulesAttributes[item.attrName](item, fieldEl);
                if (!extraVal) {
                    attrValidationsResult = false;
                }
            });
            attrValidationsResult = attrValidations.length > 0 ? attrValidationsResult && isValidValue : isValidValue;
            return typeof self.validationRules[fieldType] === "function" ? self.validationRules[fieldType](fieldValue, fieldEl) && attrValidationsResult : attrValidationsResult;
        }
    },
    "./src/modules/isValidField.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.isValidField = isValidField;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var _isValid2 = __webpack_require__("./src/modules/isValid.js");
        var _checkDirtyField2 = __webpack_require__("./src/modules/checkDirtyField.js");
        function isValidField(fieldElem) {
            var fieldOptionsObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            if (!fieldElem) {
                return false;
            }
            var self = this, fieldEl = typeof fieldElem === "string" ? self.formEl.querySelector(fieldElem) : fieldElem;
            var options = (0, _helper._mergeObjects)({}, self.options.fieldOptions, fieldOptionsObj), isValidValue = fieldEl.value.trim().length > 0, isRequired = fieldEl.required, isReqFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = self.formEl.querySelector(fieldEl.getAttribute("data-required-from")), isValidateIfFilled = fieldEl.matches("[data-validate-if-filled]"), isValid = isValidValue, containerEl = fieldEl.closest("[data-formjs-question]");
            if (!isRequired && !isValidateIfFilled && !isReqFrom || isValidateIfFilled && !isValidValue || isReqFrom && !isRequired) {
                isValid = true;
            } else {
                isValid = _isValid2._isValid.call(self, fieldEl, options);
            }
            if (options.checkDirtyField) {
                (0, _checkDirtyField2._checkDirtyField)(fieldEl, options.cssClasses.dirty);
            }
            if (containerEl !== null && !options.skipUIfeedback) {
                if (isValid) {
                    if (!isReqFrom || isReqFrom && reqMoreEl.checked) {
                        (0, _helper._removeClass)(containerEl, options.cssClasses.error);
                        (0, _helper._addClass)(containerEl, options.cssClasses.valid);
                    }
                } else {
                    (0, _helper._removeClass)(containerEl, options.cssClasses.valid);
                    (0, _helper._addClass)(containerEl, options.cssClasses.error);
                }
            }
            return isValid;
        }
    },
    "./src/modules/isValidForm.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.isValidForm = isValidForm;
        var _helper = __webpack_require__("./src/modules/helper.js");
        function isValidForm() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var self = this, formEl = self.formEl;
            if (formEl === null || !formEl.matches("[novalidate]")) {
                return false;
            }
            var fieldOptions = (0, _helper._mergeObjects)({}, self.options.fieldOptions, options.fieldOptions || {}), obj = {
                fields: [],
                result: true
            }, currentFieldName = "", currentFieldType = "";
            if (typeof fieldOptions.focusOnRelated === "undefined") {
                fieldOptions.focusOnRelated = false;
            }
            Array.from(formEl.querySelectorAll(_helper._fieldsStringSelector)).forEach(function(fieldEl) {
                var name = fieldEl.name, type = fieldEl.type, fieldData = {
                    field: fieldEl,
                    result: true
                };
                if (name === currentFieldName && type === currentFieldType) {
                    return true;
                }
                if (!fieldEl.matches("[data-required-from]")) {
                    currentFieldName = name;
                    currentFieldType = type;
                }
                var fieldResult = self.isValidField(fieldEl, fieldOptions);
                fieldData.result = fieldResult;
                if (!fieldResult) {
                    obj.result = false;
                }
                obj.fields.push(fieldData);
            });
            return obj;
        }
    },
    "./src/modules/listenerCallbacks.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports._callbackFns = undefined;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var _callbackFns = exports._callbackFns = {
            charCount: function charCount(eventOrField) {
                var fieldEl = eventOrField.target || eventOrField;
                if (fieldEl.matches("[data-char-count]")) {
                    var containerEL = fieldEl.closest("[data-formjs-question]");
                    if (containerEL && containerEL.querySelector("[data-char-length]")) {
                        var usedChars = fieldEl.value.length;
                        containerEL.querySelector("[data-char-length]").textContent = usedChars;
                    }
                }
            },
            dataTypeNumber: function dataTypeNumber(event) {
                var fieldEl = event.target;
                if (fieldEl.matches('[data-type="number"]')) {
                    var fieldValue = fieldEl.value, hasInvalidChars = /[^\d.,+\-]/.test(fieldValue);
                    if (hasInvalidChars) {
                        event.stopImmediatePropagation();
                        var valueReplaced = fieldValue.replace(/[^\d.,+\-]/g, "");
                        fieldEl.value = valueReplaced;
                    }
                }
            },
            keypressMaxlength: function keypressMaxlength(event) {
                var fieldEl = event.target;
                if (fieldEl.matches("[maxlength]")) {
                    var maxLength = fieldEl.maxLength * 1, keyPressed = event.which || event.keyCode, allowedKeys = [ 8, 37, 38, 39, 46 ];
                    if (fieldEl.value.length >= maxLength && allowedKeys.indexOf(keyPressed) === -1) {
                        return false;
                    }
                }
            },
            pastePrevent: function pastePrevent(event) {
                var self = this, fieldEl = event.target;
                var fieldOptions = self.options.fieldOptions;
                if (fieldEl.matches(fieldOptions.preventPasteFields)) {
                    event.preventDefault();
                    _helper._executeCallback.call(self, fieldOptions.onPastePrevented, fieldEl);
                }
            },
            submit: function submit(event) {
                this.submit({}, event);
            },
            validation: function validation(event) {
                var self = this, eventName = event.type, fieldEl = event.target;
                if (fieldEl.matches(_helper._fieldsStringSelector)) {
                    var isFieldForChangeEvent = fieldEl.matches('select, [type="radio"], [type="checkbox"], [type="file"]'), isRadio = fieldEl.type === "radio", isReqFrom = fieldEl.matches("[data-required-from]"), isReqMore = fieldEl.matches("[data-require-more]"), isValidValue = fieldEl.value.trim().length > 0;
                    if (isRadio && eventName === "change") {
                        var findReqMoreEl = isReqMore ? fieldEl : self.formEl.querySelector('[name="' + fieldEl.name + '"][data-require-more]'), findReqFromEl = findReqMoreEl !== null ? self.formEl.querySelector('[data-required-from="#' + findReqMoreEl.id + '"]') : null;
                        if (isReqMore) {
                            if (findReqFromEl !== null) {
                                findReqFromEl.required = fieldEl.required;
                                if (self.options.fieldOptions.focusOnRelated) {
                                    findReqFromEl.focus();
                                }
                            }
                        } else if (findReqMoreEl !== null) {
                            if (findReqFromEl !== null) {
                                findReqFromEl.required = findReqMoreEl.required && findReqMoreEl.checked;
                                findReqFromEl.value = "";
                            }
                        }
                    }
                    if (isReqFrom) {
                        if (isValidValue) {
                            var reqMoreEl = self.formEl.querySelector(fieldEl.getAttribute("data-required-from"));
                            reqMoreEl.checked = true;
                            fieldEl.required = reqMoreEl.required;
                        }
                    }
                    if (isFieldForChangeEvent && eventName === "change" || !isFieldForChangeEvent && eventName !== "change") {
                        var validationResult = self.isValidField(fieldEl), callbackData = [ {
                            field: fieldEl,
                            result: validationResult
                        } ];
                        _helper._executeCallback.call(self, self.options.fieldOptions.onValidation, callbackData);
                    }
                }
            }
        };
    },
    "./src/modules/options.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var options = exports.options = {
            fieldOptions: {
                checkDirtyField: false,
                cssClasses: {
                    dirty: "is-dirty",
                    error: "has-error",
                    valid: "is-valid"
                },
                focusOnRelated: true,
                handleFileUpload: true,
                handleValidation: true,
                maxFileSize: 10,
                onPastePrevented: null,
                onValidation: null,
                preventPasteFields: '[type="password"], [data-equal-to]',
                skipUIfeedback: false,
                strictHtmlValidation: true,
                validateOnEvents: "input change"
            },
            formOptions: {
                ajaxOptions: {
                    async: true,
                    cache: false,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    method: "POST",
                    timeout: 0,
                    url: location.href
                },
                ajaxSubmit: true,
                beforeSend: null,
                getFormJSON: null,
                handleSubmit: true,
                onSubmitComplete: null,
                onSubmitError: null,
                onSubmitSuccess: null
            }
        };
    },
    "./src/modules/optionsUtils.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _setCallbackFunctionsInOptions = exports._setCallbackFunctionsInOptions = function _setCallbackFunctionsInOptions() {
            var self = this, callbacks = {
                fieldOptions: [ "onPastePrevented", "onValidation" ],
                formOptions: [ "beforeSend", "onSubmitComplete", "onSubmitError", "onSubmitSuccess" ]
            };
            var _loop = function _loop(opt) {
                var fjsOpt = callbacks[opt];
                fjsOpt.forEach(function(fnName) {
                    var fnInOptions = self.options[opt][fnName], fnList = [];
                    if (Array.isArray(fnInOptions)) {
                        fnList.concat(fnInOptions);
                    } else if (fnInOptions) {
                        fnList.push(fnInOptions);
                    }
                    self.options[opt][fnName] = fnList;
                });
            };
            for (var opt in callbacks) {
                _loop(opt);
            }
        };
    },
    "./src/modules/submit.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.submit = submit;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var _xhrCall2 = __webpack_require__("./src/modules/xhrCall.js");
        function submit() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var self = this, formEl = self.formEl, btnEl = formEl.querySelector('[type="submit"]'), eventPreventDefault = function eventPreventDefault() {
                var enableBtn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
                if (btnEl && enableBtn) {
                    btnEl.disabled = false;
                }
                if (event) {
                    event.preventDefault();
                }
            };
            if (btnEl) {
                if (btnEl.disabled) {
                    eventPreventDefault(false);
                    return false;
                }
                btnEl.disabled = true;
            }
            options.fieldOptions = (0, _helper._mergeObjects)({}, self.options.fieldOptions, options.fieldOptions || {});
            options.formOptions = (0, _helper._mergeObjects)({}, self.options.formOptions, options.formOptions || {});
            var isAjaxForm = options.formOptions.ajaxSubmit, handleValidation = options.fieldOptions.handleValidation, formValidation = handleValidation ? self.isValidForm(options) : {
                result: true
            };
            if (handleValidation) {
                _helper._executeCallback.call(self, options.fieldOptions.onValidation, formValidation.fields);
            }
            if (!formValidation.result) {
                eventPreventDefault();
                return false;
            }
            var formDataJSON = isAjaxForm ? self.getFormJSON() : null, callbacksBeforeSend = [], beforeSendOpt = options.formOptions.beforeSend;
            if (typeof beforeSendOpt === "function" || Array.isArray(beforeSendOpt)) {
                var beforeSendData = {
                    stopExecution: false
                }, stopCallbackLoop = false;
                if (formDataJSON) {
                    beforeSendData.formData = formDataJSON;
                }
                if (typeof beforeSendOpt === "function") {
                    callbacksBeforeSend.push(beforeSendOpt);
                } else if (Array.isArray(beforeSendOpt)) {
                    callbacksBeforeSend = beforeSendOpt;
                }
                callbacksBeforeSend.forEach(function(cbFn) {
                    if (!stopCallbackLoop) {
                        var beforeSendFn = cbFn.call(self, beforeSendData);
                        if ((0, _helper._isPlainObject)(beforeSendFn)) {
                            formDataJSON = beforeSendFn.formData || formDataJSON;
                            if (beforeSendFn.stopExecution) {
                                stopCallbackLoop = true;
                            }
                        }
                    }
                });
                if (stopCallbackLoop) {
                    eventPreventDefault();
                    return false;
                }
            }
            if (isAjaxForm) {
                eventPreventDefault(false);
                _xhrCall2._xhrCall.call(self, formDataJSON);
            } else if (!event) {
                var submitEvent = new Event("submit", {
                    bubbles: true,
                    cancelable: true
                });
                formEl.dispatchEvent(submitEvent);
            }
        }
    },
    "./src/modules/validationRules.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var validationRules = exports.validationRules = {
            cap: function cap(string) {
                return /^[0-9]{5}$/.test(string);
            },
            date: function date(string) {
                var dateIT = /^(((0[1-9]|[12]\d|3[01])[ \/\-.](0[13578]|1[02])[ \/\-.]((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)[ \/\-.](0[13456789]|1[012])[ \/\-.]((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])[ \/\-.]02[ \/\-.]((19|[2-9]\d)\d{2}))|(29[ \/\-.]02[ \/\-.]((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g.test(string), dateISO8601ext = /^(((19|[2-9]\d)\d{2})[ \/\-.](0[13578]|1[02])[ \/\-.](0[1-9]|[12]\d|3[01]))|(((19|[2-9]\d)\d{2})[ \/\-.](0[13456789]|1[012])[ \/\-.](0[1-9]|[12]\d|30))|(((19|[2-9]\d)\d{2})[ \/\-.]02[ \/\-.](0[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))[ \/\-.]02[ \/\-.]29)$/g.test(string);
                return dateIT || dateISO8601ext;
            },
            email: function email(string) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(string);
            },
            fiscalCode: function fiscalCode(string) {
                return /^(?:[B-DF-HJ-NP-TV-Z](?:[AEIOU]{2}|[AEIOU]X)|[AEIOU]{2}X|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[\dLMNP-V][1-9MNP-V]|[1-9MNP-V][0L]))[A-Z]$/i.test(string);
            },
            hexColor: function hexColor(string) {
                return /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(string);
            },
            landlineNumber: function landlineNumber(string) {
                return /^((00|\+)\d{2}[\-\. ]??)??(((0[\d]{1,4}))([\/\-\. ]){0,1}([\d, ]{5,10}))$/.test(string);
            },
            mobileNumber: function mobileNumber(string) {
                return /^((00|\+)??\d{2}[\-\. ]??)??3\d{2}[\-\. ]??(\d{6,7}|\d{2}[\-\. ]??\d{2}[\-\. ]??\d{3})$/.test(string);
            },
            number: function number(string) {
                return /[+-]?([0-9]*[.])?[0-9]+/.test(string);
            },
            numberFloat: function numberFloat(string) {
                return /[+-]?([0-9]*[.])[0-9]+/.test(string);
            },
            numberInteger: function numberInteger(string) {
                return /^\d+$/.test(string);
            },
            password: function password(string) {
                return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(string);
            },
            url: function url(string) {
                return /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(string);
            },
            username: function username(string) {
                return /^(?=\w)(?=[\-\.\@]?)[\w\-\.\@]{3,24}$/.test(string);
            },
            vatNumber: function vatNumber(string) {
                return /^(IT){0,1}[0-9]{11}$/i.test(string);
            }
        };
        var _validationRulesAttributes = exports._validationRulesAttributes = {
            checkbox: function checkbox(data) {
                var isValid = data.fieldEl.checked, formEl = data.fieldEl.closest("form"), dataChecksEl = formEl.querySelector('[name="' + data.fieldEl.name + '"][data-checks]');
                if (dataChecksEl !== null) {
                    isValid = this.checks({
                        attrValue: dataChecksEl.getAttribute("data-checks"),
                        fieldEl: dataChecksEl
                    });
                }
                return isValid;
            },
            checks: function checks(data) {
                try {
                    var attrValue = JSON.parse(data.attrValue), fieldEl = data.fieldEl, formEl = fieldEl.closest("form"), checkedElLength = formEl.querySelectorAll('[name="' + fieldEl.name + '"]:checked').length;
                    return checkedElLength >= attrValue[0] && checkedElLength <= attrValue[1];
                } catch (e) {
                    throw new Error('"data-checks" attribute is not a valid array!');
                }
            },
            equalTo: function equalTo(data) {
                var fieldEl = data.fieldEl, formEl = fieldEl.closest("form"), checkFromEl = formEl.querySelector('[name="' + fieldEl.getAttribute("data-equal-to") + '"]');
                return fieldEl.value === checkFromEl.value;
            },
            exactLength: function exactLength(data) {
                return data.fieldEl.value.length === data.attrValue * 1;
            },
            file: function file(data) {
                var isValid = true, fieldEl = data.fieldEl, MIMEtype = fieldEl.accept ? new RegExp(fieldEl.accept.replace("*", "[^\\/,]+")) : null, filesList = Array.from(fieldEl.files);
                filesList.forEach(function(file) {
                    var exceedMaxFileSize = data.fieldOptions.maxFileSize > 0 && file.size / 1024 / 1024 > data.fieldOptions.maxFileSize, isAcceptedFileType = MIMEtype !== null ? MIMEtype.test(file.type) : true;
                    if (exceedMaxFileSize || !isAcceptedFileType) {
                        isValid = false;
                    }
                });
                return isValid;
            },
            length: function length(data) {
                try {
                    var valueL = data.fieldEl.value.length, attrValue = JSON.parse(data.attrValue);
                    return valueL >= attrValue[0] && valueL <= attrValue[1];
                } catch (e) {
                    throw new Error('"data-length" attribute is not a valid array!');
                }
            },
            max: function max(data) {
                var value = data.fieldEl.value * 1, maxVal = data.attrValue * 1;
                return value <= maxVal;
            },
            maxlength: function maxlength(data) {
                return data.fieldEl.value.length <= data.attrValue * 1;
            },
            min: function min(data) {
                var value = data.fieldEl.value * 1, minVal = data.attrValue * 1;
                return value >= minVal;
            },
            minlength: function minlength(data) {
                return data.fieldEl.value.length >= data.attrValue * 1;
            },
            pattern: function pattern(data) {
                var fieldEl = data.fieldEl, fieldPattern = fieldEl.pattern, fieldRegex = new RegExp(fieldPattern);
                return fieldRegex.test(fieldEl.value);
            },
            radio: function radio(data) {
                var fieldEl = data.fieldEl, fieldChecked = fieldEl.closest("form").querySelector('[name="' + fieldEl.name + '"]:checked'), isValid = fieldChecked !== null && fieldChecked.value.trim().length > 0;
                return isValid;
            },
            requiredFrom: function requiredFrom(data) {
                var fieldEl = data.fieldEl, formEl = fieldEl.closest("form"), isValidValue = fieldEl.value.trim().length > 0, reqMoreEl = formEl.querySelector(fieldEl.getAttribute("data-required-from")), checkedEl = formEl.querySelector('[name="' + reqMoreEl.name + '"]:checked');
                if (reqMoreEl.checked && reqMoreEl.required) {
                    return isValidValue;
                }
                return checkedEl !== null;
            }
        };
    },
    "./src/modules/xhrCall.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports._xhrCall = _xhrCall;
        var _helper = __webpack_require__("./src/modules/helper.js");
        function _xhrCall(formDataJSON) {
            var self = this, formEl = self.formEl, fieldOptions = self.options.fieldOptions, formOptions = self.options.formOptions, btnEl = formEl.querySelector('[type="submit"]'), timeoutTimer = void 0, xhrOptions = (0, 
            _helper._mergeObjects)({}, formOptions.ajaxOptions);
            xhrOptions.data = formDataJSON;
            if (xhrOptions.contentType === "multipart/form-data" && fieldOptions.handleFileUpload) {
                var formDataMultipart = new FormData();
                for (var key in xhrOptions.data) {
                    formDataMultipart.append(key, xhrOptions.data[key]);
                }
                Array.from(formEl.querySelectorAll('[type="file"]')).forEach(function(field) {
                    Array.from(field.files).forEach(function(file, idx) {
                        var name = field.name + "[" + idx + "]";
                        formDataMultipart.append(name, file, file.name);
                    });
                });
                xhrOptions.data = formDataMultipart;
            }
            var XHR = new XMLHttpRequest(), parseResponse = function parseResponse(xhr) {
                var data = xhr.responseText, getJSON = function getJSON() {
                    try {
                        var obj = JSON.parse(data);
                        return obj;
                    } catch (e) {
                        return false;
                    }
                }, getXML_HTML = function getXML_HTML() {
                    try {
                        var isXML = xhr.responseXML !== null, obj = isXML ? new DOMParser().parseFromString(data, "text/xml") : data;
                        return obj;
                    } catch (e) {
                        return false;
                    }
                };
                return getJSON() || getXML_HTML() || data;
            }, loadendFn = function loadendFn(e) {
                var xhr = e.target, responseData = parseResponse(xhr);
                var readyStateOK = xhr.readyState === 4, statusOK = xhr.status === 200, ajaxData = {
                    dataOrXHR: readyStateOK && statusOK ? responseData : xhr,
                    status: readyStateOK && statusOK ? "success" : "error",
                    XHRorResponse: readyStateOK && statusOK ? xhr : responseData
                };
                if (timeoutTimer) {
                    window.clearTimeout(timeoutTimer);
                }
                btnEl.disabled = false;
                _helper._executeCallback.call(self, formOptions.onSubmitComplete, ajaxData);
            }, loadFn = function loadFn(e) {
                var xhr = e.target;
                if (xhr.status === 200) {
                    var responseData = parseResponse(xhr), ajaxData = {
                        data: responseData,
                        status: "success",
                        response: xhr
                    };
                    _helper._executeCallback.call(self, formOptions.onSubmitSuccess, ajaxData);
                } else {
                    errorFn(e);
                }
            }, errorFn = function errorFn(e) {
                var xhr = e.target, ajaxData = {
                    errorThrown: xhr.statusText,
                    status: "error",
                    response: xhr
                };
                _helper._executeCallback.call(self, formOptions.onSubmitError, ajaxData);
            };
            XHR.addEventListener("loadend", loadendFn, false);
            XHR.addEventListener("load", loadFn, false);
            XHR.addEventListener("error", errorFn, false);
            if (xhrOptions.method === "GET") {
                xhrOptions.url += (/\?/.test(xhrOptions.url) ? "&" : "?") + (0, _helper._serialize)(xhrOptions.data);
                if (xhrOptions.cache === false) {
                    xhrOptions.url += (/\&/.test(xhrOptions.url) ? "&" : "") + "_=" + new Date().getTime();
                }
            }
            XHR.open(xhrOptions.method, xhrOptions.url, xhrOptions.async);
            if (xhrOptions.xhrFields) {
                for (var i in xhrOptions.xhrFields) {
                    XHR[i] = xhrOptions.xhrFields[i];
                }
            }
            if (xhrOptions.mimeType && XHR.overrideMimeType) {
                XHR.overrideMimeType(xhrOptions.mimeType);
            }
            if (xhrOptions.data && xhrOptions.contentType !== "multipart/form-data") {
                XHR.setRequestHeader("Content-Type", xhrOptions.contentType);
            }
            for (var h in xhrOptions.headers) {
                XHR.setRequestHeader(h, xhrOptions.headers[h]);
            }
            XHR.send(xhrOptions.method === "GET" ? null : xhrOptions.data);
            if (xhrOptions.async && xhrOptions.timeout > 0) {
                timeoutTimer = window.setTimeout(function() {
                    XHR.abort();
                }, xhrOptions.timeout);
            }
        }
    }
});