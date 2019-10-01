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
        /**! formJS v3.1.0 | Valerio Di Punzio (@SimplySayHi) | https://www.valeriodipunzio.com/plugins/formJS/ | https://github.com/SimplySayHi/formJS | MIT license */        var _helper = __webpack_require__("./src/modules/helper.js");
        var _options = __webpack_require__("./src/modules/options.js");
        var _validationRules = __webpack_require__("./src/modules/validationRules.js");
        var _validationErrors = __webpack_require__("./src/modules/validationErrors.js");
        var _constructor = __webpack_require__("./src/modules/constructor.js");
        var _destroy2 = __webpack_require__("./src/modules/destroy.js");
        var _getFormData2 = __webpack_require__("./src/modules/getFormData.js");
        var _init2 = __webpack_require__("./src/modules/init.js");
        var _validateField2 = __webpack_require__("./src/modules/validateField.js");
        var _validateForm2 = __webpack_require__("./src/modules/validateForm.js");
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        var version = "3.1.0";
        var Form = function() {
            function Form(formEl, optionsObj) {
                _classCallCheck(this, Form);
                _constructor.constructorFn.call(this, formEl, optionsObj);
            }
            _createClass(Form, [ {
                key: "destroy",
                value: function destroy() {
                    _destroy2.destroy.call(this);
                }
            }, {
                key: "getFormData",
                value: function getFormData() {
                    return _getFormData2.getFormData.call(this);
                }
            }, {
                key: "init",
                value: function init() {
                    return _init2.init.call(this);
                }
            }, {
                key: "validateField",
                value: function validateField(fieldEl, fieldOptions) {
                    return _validateField2.validateField.call(this, fieldEl, fieldOptions);
                }
            }, {
                key: "validateForm",
                value: function validateForm(fieldOptions) {
                    return _validateForm2.validateForm.call(this, fieldOptions);
                }
            } ], [ {
                key: "addValidationErrors",
                value: function addValidationErrors(errorsObj) {
                    this.prototype.validationErrors = (0, _helper.mergeObjects)({}, this.prototype.validationErrors, errorsObj);
                }
            }, {
                key: "addValidationRules",
                value: function addValidationRules(rulesObj) {
                    this.prototype.validationRules = (0, _helper.mergeObjects)({}, this.prototype.validationRules, rulesObj);
                }
            }, {
                key: "setOptions",
                value: function setOptions(optionsObj) {
                    this.prototype.options = (0, _helper.mergeObjects)({}, this.prototype.options, optionsObj);
                }
            } ]);
            return Form;
        }();
        Form.prototype.isInitialized = false;
        Form.prototype.options = _options.options;
        Form.prototype.validationErrors = _validationErrors.validationErrors;
        Form.prototype.validationRules = _validationRules.validationRules;
        Form.prototype.version = version;
        if (!window.Form) {
            window.Form = Form;
        }
        if (!window.FormJS) {
            window.FormJS = Form;
        }
    },
    "./src/modules/ajaxCall.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.ajaxCall = ajaxCall;
        var _helper = __webpack_require__("./src/modules/helper.js");
        function ajaxCall(formDataObj) {
            var self = this, formEl = self.formEl, fieldOptions = self.options.fieldOptions, formOptions = self.options.formOptions, btnEl = formEl.querySelector('[type="submit"]'), timeoutTimer = void 0, ajaxOptions = (0, 
            _helper.mergeObjects)({}, formOptions.ajaxOptions), isMultipart = ajaxOptions.headers["Content-Type"] === "multipart/form-data";
            ajaxOptions.body = formDataObj;
            if (isMultipart && fieldOptions.handleFileUpload) {
                var formDataMultipart = new FormData();
                for (var key in ajaxOptions.body) {
                    formDataMultipart.append(key, ajaxOptions.body[key]);
                }
                Array.from(formEl.querySelectorAll('[type="file"]')).forEach(function(field) {
                    Array.from(field.files).forEach(function(file, idx) {
                        var name = field.name + "[" + idx + "]";
                        formDataMultipart.append(name, file, file.name);
                    });
                });
                ajaxOptions.body = formDataMultipart;
            }
            if (ajaxOptions.method === "GET") {
                ajaxOptions.url += (/\?/.test(ajaxOptions.url) ? "&" : "?") + (0, _helper.serializeObject)(ajaxOptions.body);
                delete ajaxOptions.body;
            } else {
                if (ajaxOptions.headers["Content-Type"].indexOf("application/x-www-form-urlencoded") > -1) {
                    ajaxOptions.body = (0, _helper.serializeObject)(ajaxOptions.body);
                } else if (!isMultipart) {
                    ajaxOptions.body = JSON.stringify(ajaxOptions.body);
                }
            }
            ajaxOptions.headers = new Headers(ajaxOptions.headers);
            if (ajaxOptions.timeout > 0) {
                var controller = new AbortController();
                var signal = controller.signal;
                ajaxOptions.signal = signal;
                timeoutTimer = window.setTimeout(function() {
                    controller.abort();
                }, ajaxOptions.timeout);
            }
            fetch(ajaxOptions.url, ajaxOptions).then(function(response) {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                var getFetchMethod = function getFetchMethod(response) {
                    var contentType = response.headers.get("Content-Type"), methodName = "blob";
                    if (contentType.indexOf("application/json") > -1) {
                        methodName = "json";
                    } else if (contentType.indexOf("text/") > -1) {
                        methodName = "text";
                    }
                    return methodName;
                };
                var fetchMethod = getFetchMethod(response);
                return response[fetchMethod]();
            }).then(function(data) {
                _helper.executeCallback.call(self, formOptions.onSubmitSuccess, data);
            }).catch(function(error) {
                _helper.executeCallback.call(self, formOptions.onSubmitError, error);
            }).finally(function() {
                if (timeoutTimer) {
                    window.clearTimeout(timeoutTimer);
                }
                btnEl.disabled = false;
                _helper.executeCallback.call(self, formOptions.onSubmitComplete);
            });
        }
    },
    "./src/modules/checkDirtyField.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.checkDirtyField = checkDirtyField;
        var _helper = __webpack_require__("./src/modules/helper.js");
        function checkDirtyField(fields) {
            var cssClasses = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.options.fieldOptions.cssClasses.dirty;
            var fields = (0, _helper.isNodeList)(fields) ? Array.from(fields) : [ fields ];
            fields.forEach(function(fieldEl) {
                if (fieldEl.type !== "checkbox" && fieldEl.type !== "radio") {
                    var containerEl = fieldEl.closest("[data-formjs-question]") || fieldEl;
                    if (fieldEl.value) {
                        (0, _helper.addClass)(containerEl, cssClasses);
                    } else {
                        (0, _helper.removeClass)(containerEl, cssClasses);
                    }
                }
            });
        }
    },
    "./src/modules/constructor.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.constructorFn = constructorFn;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var _listenerCallbacks = __webpack_require__("./src/modules/listenerCallbacks.js");
        var _formStartup = __webpack_require__("./src/modules/formStartup.js");
        function constructorFn(formEl) {
            var optionsObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var self = this, argsL = arguments.length, checkFormElem = (0, _helper.checkFormEl)(formEl);
            if (argsL === 0 || argsL > 0 && !formEl) {
                throw new Error('First argument "formEl" is missing or falsy!');
            }
            if ((0, _helper.isNodeList)(formEl)) {
                throw new Error('First argument "formEl" must be a single DOM node or a form CSS selector, not a NodeList!');
            }
            if (!checkFormElem.result) {
                throw new Error('First argument "formEl" is not a DOM node nor a form CSS selector!');
            }
            self.formEl = checkFormElem.element;
            self.formEl.formjs = self;
            self.options = (0, _helper.mergeObjects)({}, Form.prototype.options, optionsObj);
            self.listenerCallbacks = {
                dataTypeNumber: _listenerCallbacks.callbackFns.dataTypeNumber,
                keypressMaxlength: _listenerCallbacks.callbackFns.keypressMaxlength,
                pastePrevent: _listenerCallbacks.callbackFns.pastePrevent.bind(self),
                submit: _listenerCallbacks.callbackFns.submit.bind(self),
                validation: _listenerCallbacks.callbackFns.validation.bind(self)
            };
            Object.freeze(self.listenerCallbacks);
            _formStartup.formStartup.call(self);
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
            delete self.formEl.formjs;
        }
    },
    "./src/modules/formStartup.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.formStartup = formStartup;
        function formStartup() {
            var self = this, formEl = self.formEl;
            if (!formEl.matches("[novalidate]")) {
                return null;
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
                        formOptions.ajaxOptions.headers["Content-Type"] = formEl.getAttribute("enctype");
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
    "./src/modules/getFormData.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.getFormData = getFormData;
        function getFormData() {
            var self = this, formEl = self.formEl, formFieldsEl = formEl.querySelectorAll("input, select, textarea"), excludeSelectors = ':not([type="reset"]):not([type="submit"]):not([type="button"]):not([type="file"]):not([data-exclude-data])', filteredFields = Array.from(formFieldsEl).filter(function(elem) {
                return elem.matches(excludeSelectors);
            });
            return self.options.formOptions.getFormData.call(self, filteredFields);
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
        var fieldsStringSelector = exports.fieldsStringSelector = 'input:not([type="reset"]):not([type="submit"]):not([type=button]):not([type=hidden]), select, textarea', addClass = exports.addClass = function addClass(element, cssClasses) {
            cssClasses.split(" ").forEach(function(className) {
                element.classList.add(className);
            });
        }, checkFormEl = exports.checkFormEl = function checkFormEl(formEl) {
            var isString = typeof formEl === "undefined" ? "undefined" : _typeof(formEl), isValidNodeSelector = isString === "string" && isDOMNode(document.querySelector(formEl)), isFormSelector = isValidNodeSelector && document.querySelector(formEl).tagName.toLowerCase() === "form", obj = {
                result: isDOMNode(formEl) || isFormSelector,
                element: isString === "string" ? document.querySelector(formEl) : formEl
            };
            return obj;
        }, executeCallback = exports.executeCallback = function executeCallback(callbackOption) {
            var callbackData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var tempOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var self = this, options = mergeObjects({}, self.options, tempOptions), callbackFnList = [];
            if (typeof callbackOption === "function") {
                callbackFnList.push(callbackOption);
            } else if (Array.isArray(callbackOption)) {
                callbackFnList = callbackOption;
            }
            callbackFnList.forEach(function(cbFn) {
                cbFn.call(self, callbackData, options);
            });
        }, getSplitChar = exports.getSplitChar = function getSplitChar(string) {
            var splitChar = ".";
            if (string.indexOf(splitChar) === -1) {
                if (string.indexOf("-") >= 0) {
                    splitChar = "-";
                } else if (string.indexOf("/") >= 0) {
                    splitChar = "/";
                }
            }
            return splitChar;
        }, isDOMNode = exports.isDOMNode = function isDOMNode(node) {
            return Element.prototype.isPrototypeOf(node);
        }, isFieldForChangeEvent = exports.isFieldForChangeEvent = function isFieldForChangeEvent(fieldEl) {
            return fieldEl.matches('select, [type="radio"], [type="checkbox"], [type="file"]');
        }, isNodeList = exports.isNodeList = function isNodeList(nodeList) {
            return NodeList.prototype.isPrototypeOf(nodeList);
        }, isPlainObject = exports.isPlainObject = function isPlainObject(object) {
            return Object.prototype.toString.call(object) === "[object Object]";
        }, mergeObjects = exports.mergeObjects = function mergeObjects() {
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
                            if (typeof out[key] === "undefined") {
                                out[key] = [];
                            }
                            out[key] = out[key].concat(obj[key].slice(0));
                        } else if (isObject) {
                            out[key] = mergeObjects(out[key], obj[key]);
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
        }, removeClass = exports.removeClass = function removeClass(element, cssClasses) {
            cssClasses.split(" ").forEach(function(className) {
                element.classList.remove(className);
            });
        }, serializeObject = exports.serializeObject = function serializeObject(obj) {
            var objToString = obj && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && obj.constructor === Object ? Object.keys(obj).reduce(function(a, k) {
                a.push(k + "=" + encodeURIComponent(obj[k]));
                return a;
            }, []).join("&") : obj;
            return objToString;
        }, toCamelCase = exports.toCamelCase = function toCamelCase(string) {
            return string.replace(/-([a-z])/gi, function(all, letter) {
                return letter.toUpperCase();
            });
        }, validateFieldObjDefault = exports.validateFieldObjDefault = {
            result: false,
            fieldEl: null
        }, validateFormObjDefault = exports.validateFormObjDefault = {
            result: true,
            fields: []
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
            var self = this, formEl = self.formEl, formFields = formEl.querySelectorAll(_helper.fieldsStringSelector);
            var currentFieldName = "", currentFieldType = "";
            Array.from(formFields).forEach(function(fieldEl) {
                var name = fieldEl.name, type = fieldEl.type;
                if (name === currentFieldName && type === currentFieldType) {
                    return true;
                }
                var isCheckboxOrRadio = fieldEl.type === "checkbox" || fieldEl.type === "radio", isFieldForChangeEventBoolean = (0, 
                _helper.isFieldForChangeEvent)(fieldEl), fieldChecked = formEl.querySelector('[name="' + fieldEl.name + '"]:checked'), isReqFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = isReqFrom ? formEl.querySelector(fieldEl.getAttribute("data-required-from")) : null;
                if (!isReqFrom) {
                    currentFieldName = name;
                    currentFieldType = type;
                }
                if (fieldChecked) {
                    fieldEl = fieldChecked;
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
        exports.isValid = isValid;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var _validationRules = __webpack_require__("./src/modules/validationRules.js");
        function isValid(fieldEl) {
            var fieldOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var self = this, fieldType = fieldEl.matches("[data-subtype]") ? (0, _helper.toCamelCase)(fieldEl.getAttribute("data-subtype")) : fieldEl.type, fieldValue = fieldEl.value, isValidValue = fieldValue.trim().length > 0, fieldAttributes = Array.from(fieldEl.attributes).sort(function(a, b) {
                return a.name < b.name;
            });
            var attrValidations = [], attrValidationsResult = isValidValue, obj = {
                result: isValidValue
            };
            if (!obj.result) {
                obj.errors = {
                    empty: true
                };
                return Promise.resolve(obj);
            }
            fieldAttributes.forEach(function(attr) {
                var attrName = (0, _helper.toCamelCase)(attr.name.replace("data-", "")), attrValue = attr.value, isAttrValueWithFn = attrName === "type" && typeof _validationRules.validationRulesAttributes[attrValue] === "function", isAttrNameWithFn = typeof _validationRules.validationRulesAttributes[attrName] === "function";
                if (isAttrValueWithFn || isAttrNameWithFn) {
                    var extraValObj = {
                        attrName: isAttrValueWithFn ? attrValue : attrName,
                        attrValue: attrValue,
                        fieldEl: fieldEl,
                        fieldOptions: fieldOptions
                    };
                    if (isAttrValueWithFn || attrName === "requiredFrom") {
                        attrValidations.unshift(extraValObj);
                    } else {
                        attrValidations.push(extraValObj);
                    }
                }
            });
            attrValidations.forEach(function(item) {
                var extraVal = _validationRules.validationRulesAttributes[item.attrName](item);
                if (!extraVal.result) {
                    obj = (0, _helper.mergeObjects)({}, obj, extraVal);
                    attrValidationsResult = false;
                }
            });
            return new Promise(function(resolve) {
                if (typeof self.validationRules[fieldType] === "function") {
                    resolve(self.validationRules[fieldType](fieldValue, fieldEl));
                } else {
                    resolve(obj);
                }
            }).then(function(data) {
                obj = (0, _helper.mergeObjects)({}, obj, data);
                obj.result = obj.result && attrValidationsResult;
                if (!obj.result) {
                    var fieldErrors = typeof self.validationErrors[fieldType] === "function" ? self.validationErrors[fieldType](fieldValue, fieldEl) : {};
                    if (typeof obj.errors === "undefined") {
                        obj.errors = {};
                    }
                    obj.errors.rule = true;
                    obj.errors = (0, _helper.mergeObjects)({}, obj.errors, fieldErrors);
                }
                return obj;
            });
        }
    },
    "./src/modules/isValidField.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.isValidField = isValidField;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var _checkDirtyField = __webpack_require__("./src/modules/checkDirtyField.js");
        var _isValid = __webpack_require__("./src/modules/isValid.js");
        function isValidField(fieldElem) {
            var fieldOptionsObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var self = this, fieldEl = typeof fieldElem === "string" ? self.formEl.querySelector(fieldElem) : fieldElem;
            var obj = (0, _helper.mergeObjects)({}, _helper.validateFieldObjDefault);
            if (!(0, _helper.isDOMNode)(fieldEl)) {
                return Promise.resolve(obj);
            }
            var options = (0, _helper.mergeObjects)({}, self.options.fieldOptions, fieldOptionsObj), isValidValue = fieldEl.value.trim().length > 0, isRequired = fieldEl.required, isReqFrom = fieldEl.matches("[data-required-from]"), isValidateIfFilled = fieldEl.matches("[data-validate-if-filled]");
            _checkDirtyField.checkDirtyField.call(self, fieldEl);
            return new Promise(function(resolve) {
                if (!isRequired && !isValidateIfFilled && !isReqFrom || isValidateIfFilled && !isValidValue || isReqFrom && !isRequired) {
                    obj.result = true;
                    resolve(obj);
                } else {
                    resolve(_isValid.isValid.call(self, fieldEl, options));
                }
            }).then(function(obj) {
                obj.fieldEl = fieldEl;
                return obj;
            });
        }
    },
    "./src/modules/isValidForm.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.isValidForm = isValidForm;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var _isValidField = __webpack_require__("./src/modules/isValidField.js");
        function isValidForm() {
            var fieldOptionsObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var self = this, formEl = self.formEl, obj = (0, _helper.mergeObjects)({}, _helper.validateFormObjDefault), fieldOptions = (0, 
            _helper.mergeObjects)({}, fieldOptionsObj, {
                focusOnRelated: false
            });
            var currentFieldName = "", currentFieldType = "";
            var fieldsList = Array.from(formEl.querySelectorAll(_helper.fieldsStringSelector)).filter(function(fieldEl) {
                var name = fieldEl.name, type = fieldEl.type;
                if (name === currentFieldName && type === currentFieldType) {
                    return false;
                }
                if (!fieldEl.matches("[data-required-from]")) {
                    currentFieldName = name;
                    currentFieldType = type;
                }
                return true;
            });
            return Promise.all(fieldsList.map(function(fieldEl) {
                return _isValidField.isValidField.call(self, fieldEl, fieldOptions);
            })).then(function(list) {
                var areAllFieldsValid = list.filter(function(fieldObj) {
                    return !fieldObj.result;
                }).length === 0;
                obj.result = areAllFieldsValid;
                obj.fields = list;
                return obj;
            });
        }
    },
    "./src/modules/listenerCallbacks.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.callbackFns = undefined;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var _submit2 = __webpack_require__("./src/modules/submit.js");
        var callbackFns = exports.callbackFns = {
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
                    _helper.executeCallback.call(self, fieldOptions.onPastePrevented, fieldEl);
                }
            },
            submit: function submit(event) {
                _submit2.submit.call(this, event);
            },
            validation: function validation(event) {
                var self = this, eventName = event.type, fieldEl = event.target;
                if (fieldEl.matches(_helper.fieldsStringSelector)) {
                    var isFieldForChangeEventBoolean = (0, _helper.isFieldForChangeEvent)(fieldEl), isRadio = fieldEl.type === "radio", isReqFrom = fieldEl.matches("[data-required-from]"), isReqMore = fieldEl.matches("[data-require-more]"), isValidValue = fieldEl.value.trim().length > 0;
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
                    if (isFieldForChangeEventBoolean && eventName === "change" || !isFieldForChangeEventBoolean && eventName !== "change") {
                        self.validateField(fieldEl).then(function(obj) {
                            var type = obj.fieldEl.type, realtedFieldEqualTo = obj.fieldEl.closest("form").querySelector('[data-equal-to="' + obj.fieldEl.name + '"]');
                            if ((obj.fieldEl.required || obj.fieldEl.matches("[data-validate-if-filled]")) && !(type === "checkbox" || type === "radio") && realtedFieldEqualTo && realtedFieldEqualTo.value.trim() !== "") {
                                self.validateField(realtedFieldEqualTo);
                            }
                        });
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
        exports.options = undefined;
        var _optionsUtils = __webpack_require__("./src/modules/optionsUtils.js");
        var _optionsAjax = __webpack_require__("./src/modules/optionsAjax.js");
        var options = exports.options = {
            fieldOptions: {
                cssClasses: {
                    dirty: "is-dirty",
                    error: "has-error",
                    errorEmpty: "has-error-empty",
                    errorRule: "has-error-rule",
                    valid: "is-valid"
                },
                focusOnRelated: true,
                handleFileUpload: true,
                handleValidation: true,
                maxFileSize: 10,
                onPastePrevented: [],
                onValidation: [ _optionsUtils.defaultCallbacksInOptions.fieldOptions.onValidation ],
                preventPasteFields: '[type="password"], [data-equal-to]',
                skipUIfeedback: false,
                strictHtmlValidation: true,
                validateOnEvents: "input change"
            },
            formOptions: {
                ajaxOptions: _optionsAjax.ajaxOptions,
                ajaxSubmit: true,
                beforeSend: [],
                getFormData: _optionsUtils.defaultCallbacksInOptions.formOptions.getFormData,
                handleSubmit: true,
                onSubmitComplete: [],
                onSubmitError: [],
                onSubmitSuccess: []
            }
        };
    },
    "./src/modules/optionsAjax.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var ajaxOptions = exports.ajaxOptions = {
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
        };
    },
    "./src/modules/optionsUtils.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.defaultCallbacksInOptions = undefined;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var defaultCallbacksInOptions = exports.defaultCallbacksInOptions = {
            fieldOptions: {
                onValidation: function onValidationDefault(fieldsArray) {
                    var tempOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                    var self = this, options = (0, _helper.mergeObjects)({}, self.options.fieldOptions, tempOptions.fieldOptions);
                    fieldsArray.forEach(function(obj) {
                        var fieldEl = obj.fieldEl, containerEl = fieldEl.closest("[data-formjs-question]"), isReqFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = self.formEl.querySelector(fieldEl.getAttribute("data-required-from"));
                        if (containerEl !== null && !options.skipUIfeedback) {
                            if (obj.result) {
                                if (!isReqFrom || isReqFrom && reqMoreEl.checked) {
                                    var errorClasses = options.cssClasses.error + " " + options.cssClasses.errorEmpty + " " + options.cssClasses.errorRule;
                                    (0, _helper.removeClass)(containerEl, errorClasses);
                                    (0, _helper.addClass)(containerEl, options.cssClasses.valid);
                                }
                            } else {
                                var extraErrorClass = options.cssClasses.errorRule;
                                var isChecks = fieldEl.matches("[data-checks]"), checkedElLength = isChecks ? containerEl.querySelectorAll('[name="' + fieldEl.name + '"]:checked').length : 0;
                                if (!isChecks && obj.errors && obj.errors.empty || isChecks && checkedElLength === 0) {
                                    extraErrorClass = options.cssClasses.errorEmpty;
                                }
                                var _errorClasses = options.cssClasses.error + " " + extraErrorClass, errorClassToRemove = options.cssClasses.errorEmpty + " " + options.cssClasses.errorRule;
                                (0, _helper.removeClass)(containerEl, options.cssClasses.valid + " " + errorClassToRemove);
                                (0, _helper.addClass)(containerEl, _errorClasses);
                            }
                        }
                    });
                }
            },
            formOptions: {
                getFormData: function getFormDataDefault(filteredFields) {
                    var formData = {}, self = this, formEl = self.formEl;
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
                    return formData;
                }
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
        var _ajaxCall = __webpack_require__("./src/modules/ajaxCall.js");
        function submit(event) {
            var self = this, options = self.options, isAjaxForm = options.formOptions.ajaxSubmit, formEl = self.formEl, btnEl = formEl.querySelector('[type="submit"]'), eventPreventDefault = function eventPreventDefault() {
                var enableBtn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
                if (btnEl && enableBtn) {
                    btnEl.disabled = false;
                }
                if (event) {
                    event.preventDefault();
                }
            };
            if (isAjaxForm) {
                eventPreventDefault(false);
            }
            if (btnEl) {
                if (btnEl.disabled) {
                    eventPreventDefault(false);
                    return false;
                }
                btnEl.disabled = true;
            }
            var handleValidation = options.fieldOptions.handleValidation, formValidationPromise = handleValidation ? self.validateForm() : Promise.resolve(_helper.validateFormObjDefault);
            formValidationPromise.then(function(formValidation) {
                var beforeSendData = {
                    stopExecution: false,
                    formData: {}
                };
                if (!formValidation.result) {
                    eventPreventDefault();
                    beforeSendData.stopExecution = true;
                    return [ beforeSendData ];
                }
                var formDataObj = isAjaxForm ? self.getFormData() : null, callbacksBeforeSend = options.formOptions.beforeSend;
                if (formDataObj) {
                    beforeSendData.formData = formDataObj;
                }
                return callbacksBeforeSend.reduce(function(acc, cbFn) {
                    return acc.then(function(res) {
                        var beforeSendDataNew = (0, _helper.mergeObjects)({}, res[res.length - 1]);
                        if (beforeSendDataNew.stopExecution) {
                            return Promise.resolve(res);
                        }
                        return cbFn.call(self, beforeSendDataNew, options).then(function(result) {
                            res.push(result);
                            return res;
                        });
                    });
                }, Promise.resolve([ beforeSendData ]));
            }).then(function(dataList) {
                if (dataList.filter(function(data) {
                    return data.stopExecution;
                }).length > 0) {
                    eventPreventDefault();
                    return false;
                }
                if (isAjaxForm) {
                    var formData = dataList[dataList.length - 1].formData;
                    _ajaxCall.ajaxCall.call(self, formData);
                }
            });
        }
    },
    "./src/modules/validateField.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.validateField = validateField;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var _isValidField = __webpack_require__("./src/modules/isValidField.js");
        function validateField(fieldElem) {
            var fieldOptionsObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var self = this, fieldEl = typeof fieldElem === "string" ? self.formEl.querySelector(fieldElem) : fieldElem, fieldOptions = (0, 
            _helper.mergeObjects)({}, self.options.fieldOptions, fieldOptionsObj);
            return new Promise(function(resolve) {
                var prom = _isValidField.isValidField.call(self, fieldEl, fieldOptionsObj);
                resolve(prom);
            }).then(function(obj) {
                if (obj.fieldEl) {
                    _helper.executeCallback.call(self, fieldOptions.onValidation, [ obj ], {
                        fieldOptions: fieldOptionsObj
                    });
                }
                return obj;
            });
        }
    },
    "./src/modules/validateForm.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.validateForm = validateForm;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var _isValidForm = __webpack_require__("./src/modules/isValidForm.js");
        function validateForm() {
            var fieldOptionsObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var self = this, fieldOptions = (0, _helper.mergeObjects)({}, self.options.fieldOptions, fieldOptionsObj);
            return new Promise(function(resolve) {
                var prom = _isValidForm.isValidForm.call(self, fieldOptionsObj);
                resolve(prom);
            }).then(function(obj) {
                _helper.executeCallback.call(self, fieldOptions.onValidation, obj.fields, {
                    fieldOptions: fieldOptionsObj
                });
                return obj;
            });
        }
    },
    "./src/modules/validationErrors.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var validationErrors = exports.validationErrors = {
            email: function email(string) {
                var obj = {};
                if (string.indexOf("@") === -1) {
                    obj.missingAtChar = true;
                } else {
                    var splitAt_at = string.split("@");
                    if (splitAt_at[0].length === 0) {
                        obj.missingUserName = true;
                    }
                    if (splitAt_at[1].length === 0) {
                        obj.missingDomain = true;
                        obj.missingExtensionDot = true;
                        obj.missingExtension = true;
                    } else if (splitAt_at[1].indexOf(".") === -1) {
                        obj.missingExtensionDot = true;
                        obj.missingExtension = true;
                    } else {
                        var splitAt_dot = splitAt_at[1].split("."), extLength = splitAt_dot[1].length;
                        if (extLength === 0) {
                            obj.missingExtension = true;
                        } else if (extLength < 2) {
                            obj.minlengthExtension = true;
                        }
                    }
                }
                return obj;
            }
        };
    },
    "./src/modules/validationRules.js": function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.validationRulesAttributes = exports.validationRules = undefined;
        var _helper = __webpack_require__("./src/modules/helper.js");
        var validationRules = exports.validationRules = {
            date: function date(string) {
                var date = /^(((19|[2-9]\d)\d{2})[ \/\-.](0[13578]|1[02])[ \/\-.](0[1-9]|[12]\d|3[01]))|(((19|[2-9]\d)\d{2})[ \/\-.](0[13456789]|1[012])[ \/\-.](0[1-9]|[12]\d|30))|(((19|[2-9]\d)\d{2})[ \/\-.]02[ \/\-.](0[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))[ \/\-.]02[ \/\-.]29)$/g.test(string), obj = {
                    result: date
                };
                return obj;
            },
            email: function email(string) {
                var obj = {
                    result: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(string)
                };
                return obj;
            },
            number: function number(string) {
                var obj = {
                    result: /[+-]?([0-9]*[.])?[0-9]+/.test(string)
                };
                return obj;
            }
        };
        var validationRulesAttributes = exports.validationRulesAttributes = {
            checkbox: function checkbox(data) {
                var formEl = data.fieldEl.closest("form"), dataChecksEl = formEl.querySelector('[name="' + data.fieldEl.name + '"][data-checks]'), obj = {
                    result: data.fieldEl.checked
                };
                if (dataChecksEl !== null) {
                    obj = this.checks({
                        attrValue: dataChecksEl.getAttribute("data-checks"),
                        fieldEl: dataChecksEl
                    });
                }
                return obj;
            },
            checks: function checks(data) {
                try {
                    var attrValue = JSON.parse(data.attrValue), fieldEl = data.fieldEl, formEl = fieldEl.closest("form"), checkedElLength = formEl.querySelectorAll('[name="' + fieldEl.name + '"]:checked').length, isMinOk = checkedElLength >= attrValue[0], isMaxOk = checkedElLength <= attrValue[1], obj = {
                        result: isMinOk && isMaxOk
                    };
                    if (!obj.result) {
                        obj.errors = {
                            checks: true
                        };
                        if (!isMinOk) {
                            obj.errors.minChecks = true;
                        }
                        if (!isMaxOk) {
                            obj.errors.maxChecks = true;
                        }
                    }
                    return obj;
                } catch (e) {
                    throw new Error('"data-checks" attribute is not a valid array!');
                }
            },
            equalTo: function equalTo(data) {
                var fieldEl = data.fieldEl, formEl = fieldEl.closest("form"), checkFromEl = formEl.querySelector('[name="' + fieldEl.getAttribute("data-equal-to") + '"]'), obj = {
                    result: fieldEl.value === checkFromEl.value
                };
                if (!obj.result) {
                    obj.errors = {
                        equalTo: true
                    };
                }
                return obj;
            },
            exactLength: function exactLength(data) {
                var valueLength = data.fieldEl.value.length, exactLength = data.attrValue * 1, obj = {
                    result: valueLength === exactLength
                };
                if (!obj.result) {
                    obj.errors = {
                        exactLength: true
                    };
                    if (valueLength < exactLength) {
                        obj.errors.minlength = true;
                    } else {
                        obj.errors.maxlength = true;
                    }
                }
                return obj;
            },
            file: function file(data) {
                var fieldEl = data.fieldEl, maxFileSize = (fieldEl.getAttribute("data-max-file-size") || data.fieldOptions.maxFileSize) * 1, MIMEtype = fieldEl.accept ? new RegExp(fieldEl.accept.replace("*", "[^\\/,]+")) : null, filesList = Array.from(fieldEl.files), obj = {
                    result: true
                };
                filesList.forEach(function(file) {
                    var exceedMaxFileSize = maxFileSize > 0 && file.size / 1024 / 1024 > maxFileSize, isAcceptedFileType = MIMEtype !== null ? MIMEtype.test(file.type) : true;
                    if (exceedMaxFileSize || !isAcceptedFileType) {
                        obj.result = false;
                        if (typeof obj.errors === "undefined") {
                            obj.errors = {};
                        }
                        obj.errors.file = true;
                        if (exceedMaxFileSize) {
                            obj.errors.maxFileSize = true;
                        }
                        if (!isAcceptedFileType) {
                            obj.errors.acceptedFileType = true;
                        }
                    }
                });
                return obj;
            },
            length: function length(data) {
                try {
                    var valueL = data.fieldEl.value.length, attrValue = JSON.parse(data.attrValue), isMinlengthOk = valueL >= attrValue[0], isMaxlengthOk = valueL <= attrValue[1], obj = {
                        result: isMinlengthOk && isMaxlengthOk
                    };
                    if (!obj.result) {
                        obj.errors = {
                            stringLength: true
                        };
                        if (!isMinlengthOk) {
                            obj.errors.minlength = true;
                        }
                        if (!isMaxlengthOk) {
                            obj.errors.maxlength = true;
                        }
                    }
                    return obj;
                } catch (e) {
                    throw new Error('"data-length" attribute is not a valid array!');
                }
            },
            max: function max(data) {
                var fieldEl = data.fieldEl, isDate = fieldEl.matches('[type="date"]') || fieldEl.matches('[data-subtype="date"]') || fieldEl.matches('[data-subtype="dateDDMMYYYY"]'), value = data.fieldEl.value, maxVal = data.attrValue;
                if (isDate) {
                    var splitChar = (0, _helper.getSplitChar)(value);
                    if (value.indexOf(splitChar) === 2) {
                        value = value.split(splitChar).reverse();
                    } else {
                        value = value.split(splitChar);
                    }
                    value = value.join("");
                    maxVal = maxVal.split("-").join("");
                }
                value = value * 1;
                maxVal = maxVal * 1;
                var obj = {
                    result: value <= maxVal
                };
                if (!obj.result) {
                    obj.errors = {
                        max: true
                    };
                }
                return obj;
            },
            maxlength: function maxlength(data) {
                var obj = {
                    result: data.fieldEl.value.length <= data.attrValue * 1
                };
                if (!obj.result) {
                    obj.errors = {
                        maxlength: true
                    };
                }
                return obj;
            },
            min: function min(data) {
                var fieldEl = data.fieldEl, isDate = fieldEl.matches('[type="date"]') || fieldEl.matches('[data-subtype="date"]') || fieldEl.matches('[data-subtype="dateDDMMYYYY"]'), value = data.fieldEl.value, minVal = data.attrValue;
                if (isDate) {
                    var splitChar = (0, _helper.getSplitChar)(value);
                    if (value.indexOf(splitChar) === 2) {
                        value = value.split(splitChar).reverse();
                    } else {
                        value = value.split(splitChar);
                    }
                    value = value.join("");
                    minVal = minVal.split("-").join("");
                }
                value = value * 1;
                minVal = minVal * 1;
                var obj = {
                    result: value >= minVal
                };
                if (!obj.result) {
                    obj.errors = {
                        min: true
                    };
                }
                return obj;
            },
            minlength: function minlength(data) {
                var obj = {
                    result: data.fieldEl.value.length >= data.attrValue * 1
                };
                if (!obj.result) {
                    obj.errors = {
                        minlength: true
                    };
                }
                return obj;
            },
            pattern: function pattern(data) {
                var fieldEl = data.fieldEl, fieldPattern = fieldEl.pattern, fieldRegex = new RegExp(fieldPattern), obj = {
                    result: fieldRegex.test(fieldEl.value)
                };
                if (!obj.result) {
                    obj.errors = {
                        pattern: true
                    };
                }
                return obj;
            },
            radio: function radio(data) {
                var fieldEl = data.fieldEl, fieldChecked = fieldEl.closest("form").querySelector('[name="' + fieldEl.name + '"]:checked'), isValid = fieldChecked !== null && fieldChecked.value.trim().length > 0, obj = {
                    result: isValid
                };
                return obj;
            },
            requiredFrom: function requiredFrom(data) {
                var fieldEl = data.fieldEl, formEl = fieldEl.closest("form"), isValidValue = fieldEl.value.trim().length > 0, reqMoreEl = formEl.querySelector(fieldEl.getAttribute("data-required-from")), checkedEl = formEl.querySelector('[name="' + reqMoreEl.name + '"]:checked'), obj = {
                    result: checkedEl !== null
                };
                if (reqMoreEl.checked && reqMoreEl.required) {
                    obj.result = isValidValue;
                }
                if (!obj.result) {
                    obj.errors = {
                        requiredFrom: true
                    };
                }
                return obj;
            }
        };
    }
});