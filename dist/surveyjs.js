/**! surveyJS v2.0.4 | Valerio Di Punzio (@SimplySayHi) | https://www.valeriodipunzio.com/plugins/surveyJS/ | https://github.com/SimplySayHi/surveyJS | MIT license */
(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(require("Form")); else if (typeof define === "function" && define.amd) define([ "Form" ], factory); else if (typeof exports === "object") exports["Survey"] = factory(require("Form")); else root["Survey"] = factory(root["Form"]);
})(this, (function(__WEBPACK_EXTERNAL_MODULE_formjs_plugin__) {
    return function(modules) {
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
    }({
        "./src/index.css": function(module, exports, __webpack_require__) {},
        "./src/index.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var _modules_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/helpers.js");
            var _modules_messages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/messages.js");
            var _modules_options__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/modules/options.js");
            var _modules_constructor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/modules/constructor.js");
            var _modules_retrieveSurvey__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/modules/retrieveSurvey.js");
            var _modules_destroy__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/modules/destroy.js");
            var _index_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/index.css");
            var _index_css__WEBPACK_IMPORTED_MODULE_6___default = __webpack_require__.n(_index_css__WEBPACK_IMPORTED_MODULE_6__);
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            function _defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            function _createClass(Constructor, protoProps, staticProps) {
                if (protoProps) _defineProperties(Constructor.prototype, protoProps);
                if (staticProps) _defineProperties(Constructor, staticProps);
                return Constructor;
            }
            var version = "2.0.4";
            var Survey = function() {
                function Survey(formEl, optionsObj) {
                    _classCallCheck(this, Survey);
                    return _modules_constructor__WEBPACK_IMPORTED_MODULE_3__["constructorFn"].call(this, formEl, optionsObj);
                }
                _createClass(Survey, [ {
                    key: "destroy",
                    value: function destroy() {
                        _modules_destroy__WEBPACK_IMPORTED_MODULE_5__["destroy"].call(this);
                    }
                }, {
                    key: "init",
                    value: function init() {
                        return _modules_retrieveSurvey__WEBPACK_IMPORTED_MODULE_4__["retrieveSurvey"].call(this);
                    }
                } ], [ {
                    key: "addLanguage",
                    value: function addLanguage(langString, langObject) {
                        var langValue = langString.toLowerCase();
                        this.prototype.messages[langValue] = Object(_modules_helpers__WEBPACK_IMPORTED_MODULE_0__["mergeObjects"])({}, this.prototype.messages[langValue], langObject);
                    }
                }, {
                    key: "setOptions",
                    value: function setOptions(optionsObj) {
                        this.prototype.options = Object(_modules_helpers__WEBPACK_IMPORTED_MODULE_0__["mergeObjects"])({}, this.prototype.options, optionsObj);
                    }
                } ]);
                return Survey;
            }();
            Survey.prototype.isInitialized = false;
            Survey.prototype.messages = _modules_messages__WEBPACK_IMPORTED_MODULE_1__["messages"];
            Survey.prototype.options = _modules_options__WEBPACK_IMPORTED_MODULE_2__["options"];
            Survey.prototype.version = version;
            __webpack_exports__["default"] = Survey;
        },
        "./src/modules/buildSurvey/buildSurvey.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "buildSurvey", (function() {
                return buildSurvey;
            }));
            var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/helpers.js");
            var _generateQAcode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/buildSurvey/generateQAcode.js");
            var _populateAnswers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/modules/buildSurvey/populateAnswers.js");
            var formjs_plugin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("formjs-plugin");
            var formjs_plugin__WEBPACK_IMPORTED_MODULE_3___default = __webpack_require__.n(formjs_plugin__WEBPACK_IMPORTED_MODULE_3__);
            function buildSurvey() {
                var self = this, data = self.data, formEl = self.formEl, formName = formEl.getAttribute("name") || "", surveyContEl = formEl.closest("[data-surveyjs-container]");
                self.internals.localStorageName = self.internals.localStorageName.replace(/{{surveyId}}/g, data.id);
                self.internals.localStorageName = self.internals.localStorageName.replace(/{{surveyFormName}}/g, formName);
                var checkData = function checkData(data) {
                    return typeof data !== "undefined" ? data : "";
                };
                if (surveyContEl.querySelector("[data-surveyjs-title]")) {
                    surveyContEl.querySelector("[data-surveyjs-title]").textContent = checkData(data.title);
                }
                if (surveyContEl.querySelector("[data-surveyjs-description]")) {
                    surveyContEl.querySelector("[data-surveyjs-description]").textContent = checkData(data.description);
                }
                var qaHtmlAll = _generateQAcode__WEBPACK_IMPORTED_MODULE_1__["generateQAcode"].call(self, data.questions);
                Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["appendDomStringToNode"])(qaHtmlAll, formEl.querySelector("[data-surveyjs-body]"));
                _populateAnswers__WEBPACK_IMPORTED_MODULE_2__["populateAnswers"].call(self);
                self.options.fieldOptions.validateOnEvents.split(" ").forEach((function(eventName) {
                    var useCapturing = eventName === "blur" ? true : false;
                    formEl.addEventListener(eventName, self.listenerCallbacks.validation, useCapturing);
                }));
                var formJSoptions = {
                    fieldOptions: self.options.fieldOptions,
                    formOptions: self.options.formOptions
                };
                self.internals.formInstance = new formjs_plugin__WEBPACK_IMPORTED_MODULE_3___default.a(formEl, formJSoptions);
                return new Promise((function(resolve) {
                    resolve(self.internals.formInstance.init());
                })).then((function() {
                    self.isInitialized = true;
                    surveyContEl.classList.add("surveyjs-init-success");
                }));
            }
        },
        "./src/modules/buildSurvey/generateQAcode.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "generateQAcode", (function() {
                return generateQAcode;
            }));
            var _generateQAcodeUtils_iterateAnswers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/buildSurvey/generateQAcodeUtils/iterateAnswers.js");
            function generateQAcode() {
                var questionsList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                var self = this;
                var qaData = questionsList[0]["sort"] ? questionsList.sort((function(a, b) {
                    return a["sort"] > b["sort"];
                })) : questionsList, qaCodeAll = "", qaDataLength = qaData.length;
                for (var i = 0; i < qaDataLength; i++) {
                    var item = qaData[i], maxChoice = item.checks ? JSON.parse(item.checks) : "", checksMin = maxChoice.length > 0 ? maxChoice[0] : "", checksMax = maxChoice.length > 0 ? maxChoice[1] : "", aHtml = "", qaHtml = self.options.templates.question;
                    aHtml += _generateQAcodeUtils_iterateAnswers__WEBPACK_IMPORTED_MODULE_0__["iterateAnswers"].call(self, item, item.id, i);
                    if (item.question === "hidden-privacy") {
                        var bindAnswerEl = self.formEl.closest("[data-surveyjs-container]").querySelector('[data-name="bind-surveyjs-answer"]');
                        if (bindAnswerEl) {
                            bindAnswerEl.closest("[data-formjs-question]").setAttribute("data-question-id", item.id);
                            continue;
                        }
                    }
                    qaHtml = qaHtml.replace(/{{questionId}}/g, item.id);
                    qaHtml = qaHtml.replace(/{{questionNumber}}/g, i + 1);
                    qaHtml = qaHtml.replace(/{{questionText}}/g, item.question + (maxChoice !== "" ? " (" + checksMax + " " + self.options.maxChoiceText + ")" : ""));
                    qaHtml = qaHtml.replace(/{{answersHtml}}/g, aHtml);
                    qaHtml = qaHtml.replace(/{{fieldErrorTemplate}}/g, self.options.fieldErrorFeedback ? self.options.templates.fieldError : "");
                    if (self.options.fieldErrorFeedback && self.options.templates.fieldError.indexOf("{{fieldErrorMessage}}") !== -1) {
                        var message = maxChoice !== "" ? self.options.fieldErrorMessageMultiChoice : self.options.fieldErrorMessage;
                        qaHtml = qaHtml.replace(/{{fieldErrorMessage}}/g, message).replace(/{{checksMin}}/g, checksMin).replace(/{{checksMax}}/g, checksMax);
                    }
                    qaCodeAll += qaHtml;
                }
                return qaCodeAll;
            }
        },
        "./src/modules/buildSurvey/generateQAcodeUtils/fieldsHTML/attribute.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "attribute", (function() {
                return attribute;
            }));
            var _generateOptionTags__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/buildSurvey/generateQAcodeUtils/fieldsHTML/generateOptionTags.js");
            var attribute = function attribute(data) {
                var self = this, answer = data.answer, objData = data.objData, aHtml = self.options.templates.inputGroup, attr = answer.attribute, attributeIsArray = Array.isArray(attr);
                var relatedAnswerField = attributeIsArray ? self.options.templates.selectTag : self.options.templates.inputTag;
                objData.fieldClass = self.options.cssClasses["default"];
                if (attributeIsArray) {
                    objData.fieldClass = self.options.cssClasses.select;
                    objData.optionsHtml = _generateOptionTags__WEBPACK_IMPORTED_MODULE_0__["generateOptionTags"].call(self, attr);
                }
                return {
                    aHtml: aHtml,
                    relatedAnswerField: relatedAnswerField,
                    objData: objData
                };
            };
        },
        "./src/modules/buildSurvey/generateQAcodeUtils/fieldsHTML/generateOptionTags.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "generateOptionTags", (function() {
                return generateOptionTags;
            }));
            function generateOptionTags() {
                var optionsList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                var self = this;
                var optionsHtml = optionsList[0].id === "" ? "" : '<option value="">' + self.options.selectFirstOption + "</option>";
                optionsList.forEach((function(opt) {
                    optionsHtml += '<option value="' + opt.id + '" data-answer-id="' + opt.id + '">' + opt.answer + "</option>";
                }));
                return optionsHtml;
            }
        },
        "./src/modules/buildSurvey/generateQAcodeUtils/fieldsHTML/input.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "input", (function() {
                return input;
            }));
            var input = function input(data) {
                var self = this, objData = data.objData;
                var aHtml = data.beforeCode + self.options.templates.input + data.afterCode;
                if (objData.answerType !== "checkbox" && objData.answerType !== "radio") {
                    objData.nestedAnswer += ' class="' + objData.fieldClass + '"';
                }
                return {
                    aHtml: aHtml,
                    objData: objData
                };
            };
        },
        "./src/modules/buildSurvey/generateQAcodeUtils/fieldsHTML/nested.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "nested", (function() {
                return nested;
            }));
            var nested = function nested(data) {
                var self = this, answer = data.answer, objData = data.objData;
                var labelForNested = self.options.templates.labelTag;
                labelForNested = labelForNested.replace(/{{answerCode}}/g, objData.answerCode);
                labelForNested = labelForNested.replace(/{{labelClass}}/g, self.options.cssClasses.label + " surveyjs-field-indent-0");
                labelForNested = labelForNested.replace(/{{answerString}}/g, answer.answer);
                var aLoopHtml = data.beforeCode + '<div class="surveyjs-' + objData.answerType + '">' + labelForNested + "</div>" + data.afterCode;
                return {
                    aHtml: aLoopHtml,
                    objData: objData
                };
            };
        },
        "./src/modules/buildSurvey/generateQAcodeUtils/fieldsHTML/select.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "select", (function() {
                return select;
            }));
            var _generateOptionTags__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/buildSurvey/generateQAcodeUtils/fieldsHTML/generateOptionTags.js");
            var select = function select(data) {
                var self = this, objData = data.objData;
                var aHtml = data.beforeCode + self.options.templates.select + data.afterCode;
                objData.optionsHtml = _generateOptionTags__WEBPACK_IMPORTED_MODULE_0__["generateOptionTags"].call(self, data.obj.answers);
                return {
                    aHtml: aHtml,
                    objData: objData
                };
            };
        },
        "./src/modules/buildSurvey/generateQAcodeUtils/fieldsHTML/textarea.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "textarea", (function() {
                return textarea;
            }));
            var textarea = function textarea(data) {
                var self = this, answer = data.answer, objData = data.objData;
                var aHtml = self.options.templates.textarea;
                objData.answerPlaceholder = answer.placeholder || self.options.textareaPlaceholder;
                return {
                    aHtml: aHtml,
                    objData: objData
                };
            };
        },
        "./src/modules/buildSurvey/generateQAcodeUtils/generateFieldHTML.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "generateFieldHTML", (function() {
                return generateFieldHTML;
            }));
            var _fieldsHTML_attribute__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/buildSurvey/generateQAcodeUtils/fieldsHTML/attribute.js");
            var _fieldsHTML_input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/buildSurvey/generateQAcodeUtils/fieldsHTML/input.js");
            var _fieldsHTML_nested__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/modules/buildSurvey/generateQAcodeUtils/fieldsHTML/nested.js");
            var _fieldsHTML_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/modules/buildSurvey/generateQAcodeUtils/fieldsHTML/select.js");
            var _fieldsHTML_textarea__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/modules/buildSurvey/generateQAcodeUtils/fieldsHTML/textarea.js");
            var generateFieldHTML = {
                attribute: _fieldsHTML_attribute__WEBPACK_IMPORTED_MODULE_0__["attribute"],
                input: _fieldsHTML_input__WEBPACK_IMPORTED_MODULE_1__["input"],
                nested: _fieldsHTML_nested__WEBPACK_IMPORTED_MODULE_2__["nested"],
                select: _fieldsHTML_select__WEBPACK_IMPORTED_MODULE_3__["select"],
                textarea: _fieldsHTML_textarea__WEBPACK_IMPORTED_MODULE_4__["textarea"]
            };
        },
        "./src/modules/buildSurvey/generateQAcodeUtils/iterateAnswers.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "iterateAnswers", (function() {
                return iterateAnswers;
            }));
            var _generateFieldHTML__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/buildSurvey/generateQAcodeUtils/generateFieldHTML.js");
            var _replaceTemplateStrings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/buildSurvey/generateQAcodeUtils/replaceTemplateStrings.js");
            function iterateAnswers(obj, qID, qIdx, attrReq) {
                var self = this;
                var progIds = self.internals.progIds;
                var list = Array.isArray(obj) ? obj : obj.answers, listL = list.length, qID = obj.id ? obj.id : qID ? qID : 0, i = qIdx || 0, aLoopHtml = "", needsBinding = obj.question === "hidden-privacy" ? true : false;
                if (list[0]["sort"]) {
                    list.sort((function(a, b) {
                        return a["sort"] > b["sort"];
                    }));
                }
                var _loop = function _loop(_a) {
                    var answer = list[_a], aNum = _a + 1, qNum = i + 1, aType = answer.type, aId = answer.id, progIdsLength = progIds.length, progIdsJoined = progIdsLength > 0 ? self.internals.progIds.join("-") : "", getSettingsFieldClass = function getSettingsFieldClass() {
                        var aType = answer.type === "option" ? "select" : answer.type;
                        a = _a;
                        return self.options.cssClasses[aType] || self.options.cssClasses["default"];
                    };
                    var fieldData = {
                        aHtml: ""
                    };
                    var objData = {
                        labelTagCode: aType === "checkbox" || aType === "radio" ? self.options.templates.labelTag : "",
                        answerId: aId,
                        answerIdValue: aType === "text" ? "" : aId,
                        answerIndex: aNum,
                        answerName: "surveyjs-answer-" + qNum,
                        answerPlaceholder: "",
                        answerMaxlength: answer.maxlength ? 'maxlength="' + answer.maxlength + '"' : "",
                        answerString: typeof answer.answer === "string" ? answer.answer : "",
                        answerType: aType,
                        attrRequired: typeof obj.required !== "undefined" ? "required" : typeof attrReq !== "undefined" ? attrReq : "",
                        fieldClass: getSettingsFieldClass(),
                        nestedAnswer: progIdsJoined !== "" ? 'data-nested-index="' + aNum + '"' : "",
                        optionsHtml: "",
                        progIdsJoined: progIdsJoined,
                        questionNumber: qNum,
                        answerCode: (aType === "option" ? "select" : aType) + "-" + qID + "-" + (aId || 0) + "-" + qNum + (progIdsJoined !== "" ? "-" + progIdsJoined : "") + "-" + aNum,
                        attrChecks: obj.checks ? 'data-checks="' + obj.checks + '"' : "",
                        attrSubtype: answer.subtype ? 'data-subtype="' + answer.subtype + '"' : "",
                        validateIfFilled: typeof obj.validateIfFilled !== "undefined" ? "data-validate-if-filled" : ""
                    };
                    if (needsBinding) {
                        var boundedFieldEl = self.formEl.closest("[data-surveyjs-container]").querySelectorAll('[data-name="bind-surveyjs-answer"]')[_a], fieldProps = {
                            id: objData.answerCode,
                            name: objData.answerName,
                            type: aType,
                            value: objData.answerId
                        };
                        if (typeof obj.required !== "undefined") {
                            fieldProps.required = true;
                        }
                        for (var key in fieldProps) {
                            boundedFieldEl[key] = fieldProps[key];
                        }
                        boundedFieldEl.setAttribute("data-answer-id", objData.answerId);
                        boundedFieldEl.closest("div").querySelector("label").setAttribute("for", objData.answerCode);
                        boundedFieldEl.closest("div").querySelector("label span").textContent = answer.answer;
                        a = _a;
                        return "continue";
                    }
                    if (typeof answer.answer === "string" || typeof answer.answer === "number") {
                        var surveyFieldType = answer.attribute ? "attribute" : answer.nested ? "nested" : aType === "option" ? "select" : aType, beforeCode = progIdsLength > 0 && _a === 0 ? '<div class="surveyjs-field-indent">' : "", afterCode = progIdsLength > 0 && _a === listL - 1 ? "</div>" : "", data = {
                            answer: answer,
                            objData: objData,
                            beforeCode: beforeCode,
                            afterCode: afterCode,
                            obj: obj
                        };
                        if (typeof _generateFieldHTML__WEBPACK_IMPORTED_MODULE_0__["generateFieldHTML"][surveyFieldType] === "undefined") {
                            surveyFieldType = "input";
                        }
                        fieldData = _generateFieldHTML__WEBPACK_IMPORTED_MODULE_0__["generateFieldHTML"][surveyFieldType].call(self, data);
                        objData = fieldData.objData;
                        if (answer.nested) {
                            self.internals.progIds.push(aNum);
                            aLoopHtml += fieldData.aHtml;
                            aLoopHtml += iterateAnswers.call(self, answer.nested, qID, i, objData.attrRequired);
                            a = _a;
                            return "continue";
                        }
                        if (progIdsLength > 0 && _a === listL - 1) {
                            self.internals.progIds.pop();
                        }
                    }
                    fieldData.aHtml = _replaceTemplateStrings__WEBPACK_IMPORTED_MODULE_1__["replaceTemplateStrings"].call(self, fieldData, objData);
                    aLoopHtml += fieldData.aHtml;
                    if (aType === "option") {
                        _a = _a + obj.answers.length;
                    }
                    a = _a;
                };
                for (var a = 0; a < listL; a++) {
                    var _ret = _loop(a);
                    if (_ret === "continue") continue;
                }
                return aLoopHtml;
            }
        },
        "./src/modules/buildSurvey/generateQAcodeUtils/replaceTemplateStrings.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "replaceTemplateStrings", (function() {
                return replaceTemplateStrings;
            }));
            function replaceTemplateStrings(fieldData, objData) {
                var self = this;
                if (objData.optionsHtml !== "") {
                    fieldData.aHtml = fieldData.aHtml.replace(/{{selectTagCode}}/g, self.options.templates.selectTag);
                }
                if (fieldData.relatedAnswerField) {
                    var relatedAnswerKeys = {
                        answerCode: "",
                        answerType: "text",
                        fieldClass: objData.fieldClass,
                        answerIdValue: "",
                        attrRequired: "",
                        addMoreName: "-more",
                        attrRequiredFrom: 'data-required-from="#' + objData.answerCode + '"'
                    };
                    for (var reKey in relatedAnswerKeys) {
                        var regexStrRe = new RegExp("{{" + reKey + "}}", "g");
                        fieldData.relatedAnswerField = fieldData.relatedAnswerField.replace(regexStrRe, relatedAnswerKeys[reKey]);
                    }
                    fieldData.aHtml = fieldData.aHtml.replace(/{{relatedAnswerField}}/g, fieldData.relatedAnswerField);
                } else {
                    fieldData.aHtml = fieldData.aHtml.replace(/{{addMoreName}}/g, "");
                    fieldData.aHtml = fieldData.aHtml.replace(/{{attrRequiredFrom}}/g, "");
                }
                for (var key in objData) {
                    var regexStr = new RegExp("{{" + key + "}}", "g");
                    fieldData.aHtml = fieldData.aHtml.replace(regexStr, objData[key]);
                }
                return fieldData.aHtml;
            }
        },
        "./src/modules/buildSurvey/populateAnswers.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "populateAnswers", (function() {
                return populateAnswers;
            }));
            function populateAnswers() {
                var self = this;
                if (self.options.useLocalStorage) {
                    var LS = localStorage.getObject(self.internals.localStorageName);
                    if (LS) {
                        var surveyContEl = self.formEl.closest("[data-surveyjs-container]");
                        self.internals.localStorageArray = LS;
                        LS.forEach((function(item) {
                            var fieldFirst = surveyContEl.querySelector('[name="' + item.field + '"]'), isRadioOrCheckbox = fieldFirst.matches('[type="radio"], [type="checkbox"]'), fieldEl = isRadioOrCheckbox ? surveyContEl.querySelector('[name="' + item.field + '"][value="' + item.value + '"]') : fieldFirst;
                            if (isRadioOrCheckbox) {
                                fieldEl.checked = true;
                            } else {
                                fieldEl.value = item.value;
                            }
                        }));
                    }
                } else {
                    console.warn("LOCAL STORAGE IS NOT SUPPORTED!");
                }
            }
        },
        "./src/modules/constructor.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "constructorFn", (function() {
                return constructorFn;
            }));
            var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/helpers.js");
            var _internals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/internals.js");
            var _listenerCallbacks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/modules/listenerCallbacks.js");
            function constructorFn(formEl) {
                var optionsObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var self = this, argsL = arguments.length, checkFormElem = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["checkFormEl"])(formEl);
                if (argsL === 0 || argsL > 0 && !formEl) {
                    throw new Error('First argument "formEl" is missing or falsy!');
                }
                if (Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["isNodeList"])(formEl)) {
                    throw new Error('First argument "formEl" must be a single DOM node or a form CSS selector, not a NodeList!');
                }
                if (!checkFormElem.result) {
                    throw new Error('First argument "formEl" is not a DOM node nor a form CSS selector!');
                }
                if (!optionsObj.url || typeof optionsObj.url !== "string") {
                    throw new Error('"options.url" is missing or not valid!');
                }
                self.formEl = checkFormElem.element;
                self.formEl.surveyjs = self;
                formEl = self.formEl;
                if (typeof optionsObj.lang === "string") {
                    var langValue = optionsObj.lang.toLowerCase();
                    if (self.messages[langValue]) {
                        self.options.lang = langValue;
                    }
                }
                self.options = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["mergeObjects"])({}, self.options, self.messages[self.options.lang]);
                self.options = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["mergeObjects"])({}, self.options, optionsObj);
                if (self.options.templates.input.indexOf("{{inputTagCode}}") !== -1) {
                    self.options.templates.input = self.options.templates.input.replace(/{{inputTagCode}}/g, self.options.templates.inputTag);
                }
                self.options.templates.labelTag = self.options.templates.labelTag.replace(/{{labelClass}}/g, self.options.cssClasses.label);
                self.internals = _internals__WEBPACK_IMPORTED_MODULE_1__["internals"];
                if (!self.internals.isAvailableStorage) {
                    self.options.useLocalStorage = false;
                }
                self.listenerCallbacks = {
                    validation: _listenerCallbacks__WEBPACK_IMPORTED_MODULE_2__["callbackFns"].validation.bind(self)
                };
                Object.freeze(self.listenerCallbacks);
            }
        },
        "./src/modules/destroy.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "destroy", (function() {
                return destroy;
            }));
            function destroy() {
                var self = this, formEl = self.formEl;
                formEl.formjs.options.fieldOptions.validateOnEvents.split(" ").forEach((function(eventName) {
                    var useCapturing = eventName === "blur" ? true : false;
                    formEl.removeEventListener(eventName, self.listenerCallbacks.validation, useCapturing);
                }));
                delete self.formEl.surveyjs;
                self.formEl.formjs.destroy();
            }
        },
        "./src/modules/helpers.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "fieldsStringSelectorSurvey", (function() {
                return fieldsStringSelectorSurvey;
            }));
            __webpack_require__.d(__webpack_exports__, "ajaxCall", (function() {
                return ajaxCall;
            }));
            __webpack_require__.d(__webpack_exports__, "appendDomStringToNode", (function() {
                return appendDomStringToNode;
            }));
            __webpack_require__.d(__webpack_exports__, "checkFormEl", (function() {
                return checkFormEl;
            }));
            __webpack_require__.d(__webpack_exports__, "concatFieldsLists", (function() {
                return concatFieldsLists;
            }));
            __webpack_require__.d(__webpack_exports__, "isDOMNode", (function() {
                return isDOMNode;
            }));
            __webpack_require__.d(__webpack_exports__, "isEmptyObject", (function() {
                return isEmptyObject;
            }));
            __webpack_require__.d(__webpack_exports__, "isFieldForChangeEvent", (function() {
                return isFieldForChangeEvent;
            }));
            __webpack_require__.d(__webpack_exports__, "isNodeList", (function() {
                return isNodeList;
            }));
            __webpack_require__.d(__webpack_exports__, "isPlainObject", (function() {
                return isPlainObject;
            }));
            __webpack_require__.d(__webpack_exports__, "mergeObjects", (function() {
                return mergeObjects;
            }));
            function _typeof(obj) {
                "@babel/helpers - typeof";
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    _typeof = function _typeof(obj) {
                        return typeof obj;
                    };
                } else {
                    _typeof = function _typeof(obj) {
                        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                    };
                }
                return _typeof(obj);
            }
            var fieldsStringSelectorSurvey = '[data-surveyjs-form] input:not([type="reset"]):not([type="submit"]):not([type="button"]), [data-surveyjs-form] select, [data-surveyjs-form] textarea, [data-name="bind-surveyjs-answer"]', ajaxCall = function ajaxCall() {
                var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : location.href;
                var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var timeoutTimer;
                options.headers = new Headers(options.headers);
                if (options.timeout > 0) {
                    var controller = new AbortController;
                    var signal = controller.signal;
                    options.signal = signal;
                    timeoutTimer = window.setTimeout((function() {
                        controller.abort();
                    }), options.timeout);
                }
                return fetch(url, options).then((function(response) {
                    if (!response.ok) {
                        return Promise.reject(response);
                    }
                    var getFetchMethod = function getFetchMethod(response) {
                        var accept = options.headers.get("Accept");
                        var contentType = response.headers.get("Content-Type");
                        var headerOpt = accept || contentType || "";
                        if (headerOpt.indexOf("application/json") > -1 || headerOpt === "") {
                            return "json";
                        } else if (headerOpt.indexOf("text/") > -1) {
                            return "text";
                        } else {
                            return "blob";
                        }
                    };
                    var fetchMethod = getFetchMethod(response);
                    return response[fetchMethod]();
                }))["catch"]((function(error) {
                    return Promise.reject(error);
                }))["finally"]((function() {
                    if (timeoutTimer) {
                        window.clearTimeout(timeoutTimer);
                    }
                }));
            }, appendDomStringToNode = function appendDomStringToNode(HTMLstring, parentNode) {
                var tmpEl = document.createElement("div");
                tmpEl.innerHTML = HTMLstring;
                Array.from(tmpEl.childNodes).forEach((function(elem) {
                    parentNode.appendChild(elem);
                }));
            }, checkFormEl = function checkFormEl(formEl) {
                var isString = _typeof(formEl), isValidNodeSelector = isString === "string" && isDOMNode(document.querySelector(formEl)), isFormSelector = isValidNodeSelector && document.querySelector(formEl).tagName.toLowerCase() === "form", obj = {
                    result: isDOMNode(formEl) || isFormSelector,
                    element: isString === "string" ? document.querySelector(formEl) : formEl
                };
                return obj;
            }, concatFieldsLists = function concatFieldsLists() {
                return Array.from(arguments).reduce((function(argAcc, list) {
                    return list.reduce((function(listAcc, elem) {
                        if (listAcc.indexOf(elem) === -1) {
                            listAcc.push(elem);
                        }
                        return listAcc;
                    }), argAcc);
                }), []);
            }, isDOMNode = function isDOMNode(node) {
                return Element.prototype.isPrototypeOf(node);
            }, isEmptyObject = function isEmptyObject(object) {
                return isPlainObject(object) && Object.getOwnPropertyNames(object).length === 0;
            }, isFieldForChangeEvent = function isFieldForChangeEvent(fieldEl) {
                return fieldEl.matches('select, [type="radio"], [type="checkbox"], [type="file"]');
            }, isNodeList = function isNodeList(nodeList) {
                return NodeList.prototype.isPrototypeOf(nodeList);
            }, isPlainObject = function isPlainObject(object) {
                return Object.prototype.toString.call(object) === "[object Object]";
            }, mergeObjects = function mergeObjects() {
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
            };
        },
        "./src/modules/internals.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "internals", (function() {
                return internals;
            }));
            var _webStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/webStorage.js");
            var internals = {
                formInstance: null,
                isAvailableStorage: Object(_webStorage__WEBPACK_IMPORTED_MODULE_0__["webStorage"])().isAvailable,
                localStorageArray: [],
                localStorageName: "Survey_" + location.href + "_{{surveyFormName}}_surveyId[{{surveyId}}]",
                progIds: []
            };
        },
        "./src/modules/listenerCallbacks.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "callbackFns", (function() {
                return callbackFns;
            }));
            var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/helpers.js");
            var _utils_getAnswerIndexInLocalStorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/utils/getAnswerIndexInLocalStorage.js");
            var _utils_getQuestionObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/modules/utils/getQuestionObject.js");
            var callbackFns = {
                validation: function validation(event) {
                    var self = this, eventName = event.type, fieldEl = event.target, containerEl = fieldEl.closest("[data-formjs-question]"), fieldValue = fieldEl.value ? fieldEl.value.trim() : fieldEl.value, isMultiChoice = fieldEl.matches("[data-checks]"), isRequireMore = fieldEl.matches("[data-require-more]"), isRequiredFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = isRequiredFrom ? containerEl.querySelector(fieldEl.getAttribute("data-required-from")) : null;
                    var itemEl = isRequiredFrom ? reqMoreEl : fieldEl, questionId = itemEl.id ? itemEl.id.split("-")[1] : "id-not-found", isFieldForChangeEventBoolean = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["isFieldForChangeEvent"])(fieldEl), questionObj = _utils_getQuestionObject__WEBPACK_IMPORTED_MODULE_2__["getQuestionObject"].call(self, questionId);
                    if (Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["isEmptyObject"])(questionObj)) {
                        return true;
                    }
                    if (isFieldForChangeEventBoolean && eventName === "change" || !isFieldForChangeEventBoolean && eventName !== "change") {
                        if (self.options.useLocalStorage && !fieldEl.matches("[data-exclude-storage]")) {
                            var inArrayPos = _utils_getAnswerIndexInLocalStorage__WEBPACK_IMPORTED_MODULE_1__["getAnswerIndexInLocalStorage"].call(self, fieldEl.name, isMultiChoice ? fieldValue : false), inArrayRequireMorePos = _utils_getAnswerIndexInLocalStorage__WEBPACK_IMPORTED_MODULE_1__["getAnswerIndexInLocalStorage"].call(self, fieldEl.name + "-more");
                            var localStorageArray = self.internals.localStorageArray;
                            if (!isRequireMore && !isRequiredFrom && inArrayRequireMorePos !== -1) {
                                localStorageArray.splice(inArrayRequireMorePos, 1);
                            }
                            if (inArrayPos !== -1) {
                                if (isMultiChoice) {
                                    if (!fieldEl.checked && localStorageArray[inArrayPos].value === fieldValue) {
                                        localStorageArray.splice(inArrayPos, 1);
                                    } else {
                                        localStorageArray.push({
                                            field: fieldEl.name,
                                            value: fieldValue
                                        });
                                    }
                                } else {
                                    if (fieldValue !== "") {
                                        localStorageArray[inArrayPos].value = fieldValue;
                                    } else {
                                        localStorageArray.splice(inArrayPos, 1);
                                    }
                                }
                            } else {
                                if (fieldValue !== "") {
                                    if (isRequiredFrom && fieldValue !== "") {
                                        var oldFieldNamePos = _utils_getAnswerIndexInLocalStorage__WEBPACK_IMPORTED_MODULE_1__["getAnswerIndexInLocalStorage"].call(self, reqMoreEl.name);
                                        if (oldFieldNamePos !== -1) {
                                            localStorageArray.splice(oldFieldNamePos, 1);
                                        }
                                        localStorageArray.push({
                                            field: reqMoreEl.name,
                                            value: reqMoreEl.value.trim()
                                        });
                                    }
                                    localStorageArray.push({
                                        field: fieldEl.name,
                                        value: fieldValue
                                    });
                                    if (isRequireMore) {
                                        var elReqFromEl = fieldEl.closest("form").querySelector('[data-required-from="#' + fieldEl.id + '"]');
                                        localStorageArray.push({
                                            field: elReqFromEl.name,
                                            value: elReqFromEl.value.trim()
                                        });
                                    }
                                }
                            }
                            localStorage.setObject(self.internals.localStorageName, localStorageArray);
                        }
                        if (typeof questionObj.required !== "undefined") {
                            fieldEl.required = true;
                        }
                    }
                }
            };
        },
        "./src/modules/messages.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "messages", (function() {
                return messages;
            }));
            var messages = {
                it: {
                    loadingBox: '<div class="surveyjs-loading" data-surveyjs-loading><i class="glyphicon glyphicon-refresh icon-spin"></i> Caricamento in corso...</div>',
                    selectFirstOption: "Seleziona una risposta...",
                    textareaPlaceholder: "Scrivi la tua risposta...",
                    maxChoiceText: "RISPOSTE MAX",
                    fieldErrorMessage: "&Egrave; necessario rispondere.",
                    fieldErrorMessageMultiChoice: "Puoi scegliere da {{checksMin}} a {{checksMax}} risposte."
                },
                en: {
                    loadingBox: '<div class="surveyjs-loading" data-surveyjs-loading><i class="glyphicon glyphicon-refresh icon-spin"></i> Loading...</div>',
                    selectFirstOption: "Select your answer...",
                    textareaPlaceholder: "Write here your answer...",
                    maxChoiceText: "ANSWERS MAX",
                    fieldErrorMessage: "Answer is necessary.",
                    fieldErrorMessageMultiChoice: "You can choose from {{checksMin}} to {{checksMax}} answers."
                }
            };
        },
        "./src/modules/options.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "options", (function() {
                return options;
            }));
            var _optionsUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/optionsUtils.js");
            var options = {
                cssClasses: {
                    checkbox: "form-check-input",
                    default: "form-control",
                    file: "form-control-file",
                    label: "form-check-label",
                    radio: "form-check-input",
                    select: "form-control",
                    textarea: "form-control"
                },
                fieldErrorFeedback: true,
                fieldOptions: {
                    validateOnEvents: "input change"
                },
                formOptions: {
                    beforeSend: [ _optionsUtils__WEBPACK_IMPORTED_MODULE_0__["defaultCallbacksInOptions"].formOptions.beforeSend ],
                    getFormData: _optionsUtils__WEBPACK_IMPORTED_MODULE_0__["defaultCallbacksInOptions"].formOptions.getFormData,
                    onSubmitSuccess: [ _optionsUtils__WEBPACK_IMPORTED_MODULE_0__["defaultCallbacksInOptions"].formOptions.onSubmitSuccess ]
                },
                initAjaxOptions: {
                    cache: "no-store",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    method: "GET",
                    mode: "same-origin",
                    redirect: "follow",
                    timeout: 0
                },
                lang: "en",
                templates: {
                    fieldError: '<div class="surveyjs-field-error-message">{{fieldErrorMessage}}</div>',
                    input: '<div class="surveyjs-single-answer surveyjs-input-container surveyjs-answer-{{answerType}} form-check" data-answer-index="{{answerIndex}}">' + "{{inputTagCode}}" + "{{labelTagCode}}" + "</div>",
                    inputGroup: '<div class="surveyjs-single-answer input-group" data-answer-index="{{answerIndex}}">' + '<div class="input-group-prepend">' + '<div class="input-group-text form-check surveyjs-answer-{{answerType}}">' + '<input type="{{answerType}}" name="surveyjs-answer-{{questionNumber}}" id="{{answerCode}}" data-answer-id="{{answerId}}" value="{{answerIdValue}}" {{attrRequired}} data-require-more="" class="surveyjs-input surveyjs-radio form-check-input" />' + '<label for="{{answerCode}}" class="surveyjs-label form-check-label">{{answerString}}</label>' + "</div>" + "</div>" + "{{relatedAnswerField}}" + "</div>",
                    inputTag: '<input type="{{answerType}}" {{attrSubtype}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-input surveyjs-{{answerType}} {{fieldClass}}" id="{{answerCode}}" {{nestedAnswer}} data-answer-root="{{progIdsJoined}}" data-answer-id="{{answerId}}" value="{{answerIdValue}}" {{attrRequired}} {{validateIfFilled}} {{attrChecks}} {{attrRequiredFrom}} />',
                    labelTag: '<label for="{{answerCode}}" class="surveyjs-label {{labelClass}}">{{answerString}}</label>',
                    question: '<div data-question-id="{{questionId}}" data-question-index="{{questionNumber}}" data-formjs-question class="surveyjs-question-box clearfix">' + '<div class="surveyjs-question-header">Question {{questionNumber}}</div>' + '<div class="surveyjs-question-body">' + '<div class="surveyjs-question-text">{{questionText}}</div>' + '<div class="surveyjs-answers-box form-group clearfix">' + "{{answersHtml}}" + "{{fieldErrorTemplate}}" + "</div>" + "</div>" + "</div>",
                    select: '<div class="surveyjs-single-answer surveyjs-answer-select" data-answer-index="{{answerIndex}}">' + "{{selectTagCode}}" + "</div>",
                    selectTag: '<select id="{{answerCode}}" name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-select {{fieldClass}}" {{attrRequired}} {{nestedAnswer}} data-answer-root="{{progIdsJoined}}" {{attrRequiredFrom}}>' + "{{optionsHtml}}" + "</select>",
                    textarea: '<div class="surveyjs-single-answer surveyjs-answer-textarea">' + '<textarea id="{{answerCode}}" data-answer-id="{{answerId}}" {{nestedAnswer}} name="surveyjs-answer-{{questionNumber}}" {{attrRequired}} class="surveyjs-textarea {{fieldClass}}" {{answerMaxlength}} rows="6" placeholder="{{answerPlaceholder}}"></textarea>' + "</div>"
                },
                useLocalStorage: true
            };
        },
        "./src/modules/optionsUtils.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "defaultCallbacksInOptions", (function() {
                return defaultCallbacksInOptions;
            }));
            var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/helpers.js");
            var _utils_getQuestionObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/utils/getQuestionObject.js");
            var defaultCallbacksInOptions = {
                formOptions: {
                    beforeSend: function beforeSend_surveyDefault(data) {
                        var surveyjs = this.formEl.surveyjs;
                        var surveyContEl = this.formEl.closest("[data-surveyjs-container]");
                        var formInstance = surveyjs.internals.formInstance;
                        var fieldsList = Array.from(surveyContEl.querySelectorAll(_helpers__WEBPACK_IMPORTED_MODULE_0__["fieldsStringSelectorSurvey"]));
                        var fieldNameCheck = "", fieldTypeCheck = "";
                        fieldsList.forEach((function(fieldEl) {
                            var type = fieldEl.type, name = fieldEl.name;
                            if (name === fieldNameCheck && type === fieldTypeCheck) {
                                return;
                            }
                            if (!fieldEl.matches("[data-required-from]")) {
                                fieldNameCheck = name;
                                fieldTypeCheck = type;
                            }
                            var questionIdEl = fieldEl.closest("[data-question-id]");
                            var questionId = questionIdEl ? questionIdEl.getAttribute("data-question-id") : "";
                            var questionObj = _utils_getQuestionObject__WEBPACK_IMPORTED_MODULE_1__["getQuestionObject"].call(surveyjs, questionId);
                            if (questionId !== "" && questionObj && typeof questionObj.required !== "undefined") {
                                var isRequiredFrom = fieldEl.matches("[data-required-from]");
                                var reqMoreEl = document.querySelector(fieldEl.getAttribute("data-required-from"));
                                if (!isRequiredFrom || isRequiredFrom && reqMoreEl.checked) {
                                    fieldEl.required = true;
                                }
                            }
                        }));
                        var fieldOptions = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["mergeObjects"])({}, surveyjs.options.fieldOptions, {
                            focusOnRelated: false
                        });
                        return new Promise((function(resolve) {
                            formInstance.validateForm(fieldOptions).then((function(formRes) {
                                if (!formRes.result) {
                                    data.stopExecution = true;
                                }
                                resolve(data);
                            }));
                        }));
                    },
                    getFormData: function getFormData_surveyDefault() {
                        var formEl = this.formEl;
                        var survey = formEl.surveyjs;
                        var fieldsList = Array.from(formEl.closest("[data-surveyjs-container]").querySelectorAll(_helpers__WEBPACK_IMPORTED_MODULE_0__["fieldsStringSelectorSurvey"]));
                        var obj = {
                            answers: [],
                            id: survey.data.id
                        }, fieldNameCheck = "", fieldTypeCheck = "";
                        fieldsList.forEach((function(fieldEl) {
                            var type = fieldEl.type, name = fieldEl.name;
                            if (name === fieldNameCheck && type === fieldTypeCheck) {
                                return;
                            }
                            if (!fieldEl.matches("[data-required-from]")) {
                                fieldNameCheck = name;
                                fieldTypeCheck = type;
                            }
                            var questionIdEl = fieldEl.closest("[data-question-id]"), questionId = questionIdEl ? questionIdEl.getAttribute("data-question-id") : "", fieldValue = fieldEl.value, qaObj = {
                                question: questionId,
                                answer: {
                                    id_answer: [ fieldValue ]
                                }
                            };
                            if (fieldEl.matches("[data-required-from]") || questionId === "" || Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["isEmptyObject"])(_utils_getQuestionObject__WEBPACK_IMPORTED_MODULE_1__["getQuestionObject"].call(survey, questionId))) {
                                return;
                            }
                            if (fieldEl.matches("textarea")) {
                                qaObj.answer.id_answer = [ "" ];
                                qaObj.answer.text = fieldValue;
                            }
                            if (type === "radio") {
                                var containerEl = fieldEl.closest("form") ? formEl : fieldEl.closest("[data-formjs-question]"), elem = containerEl.querySelector('[name="' + name + '"]:checked');
                                if (elem) {
                                    if (elem.matches("[data-require-more]")) {
                                        qaObj.answer.attributes = formEl.querySelector('[data-required-from="#' + elem.id + '"]').value.trim();
                                    }
                                    if (elem.matches("[data-nested-index]")) {
                                        qaObj.answer.attributes = elem.getAttribute("data-nested-index");
                                    }
                                    qaObj.answer.id_answer = [ elem.value.trim() ];
                                } else {
                                    qaObj.answer.id_answer = [ "" ];
                                }
                            }
                            if (type === "checkbox" && fieldEl.matches("[data-checks]")) {
                                qaObj.answer.id_answer = [];
                                Array.from(formEl.querySelectorAll('[name="' + name + '"]:checked')).forEach((function(el) {
                                    qaObj.answer.id_answer.push(el.value.trim());
                                }));
                            }
                            obj.answers.push(qaObj);
                        }));
                        return obj;
                    },
                    onSubmitSuccess: function onSubmitSuccess_surveyDefault() {
                        var survey = this.formEl.surveyjs;
                        if (self.options.useLocalStorage) {
                            localStorage.removeItem(survey.internals.localStorageName);
                        }
                    }
                }
            };
        },
        "./src/modules/retrieveSurvey.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "retrieveSurvey", (function() {
                return retrieveSurvey;
            }));
            var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/modules/helpers.js");
            var _buildSurvey_buildSurvey__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/modules/buildSurvey/buildSurvey.js");
            function retrieveSurvey() {
                var self = this;
                self.formEl.querySelector("[data-surveyjs-body]").insertAdjacentHTML("beforebegin", self.options.loadingBox);
                return Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["ajaxCall"])(self.options.url, self.options.initAjaxOptions).then((function(response) {
                    if (response.status.toLowerCase() === "success" && response.data.questions && response.data.questions.length > 0) {
                        self.data = response.data;
                        Object.freeze(self.data);
                        return new Promise((function(resolve) {
                            resolve(_buildSurvey_buildSurvey__WEBPACK_IMPORTED_MODULE_1__["buildSurvey"].call(self));
                        })).then((function() {
                            return response;
                        }));
                    } else {
                        return Promise.reject(response);
                    }
                }))["finally"]((function() {
                    var loadingBoxEl = self.formEl.querySelector("[data-surveyjs-loading]");
                    if (loadingBoxEl) {
                        loadingBoxEl.parentNode.removeChild(loadingBoxEl);
                    }
                }));
            }
        },
        "./src/modules/utils/getAnswerIndexInLocalStorage.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "getAnswerIndexInLocalStorage", (function() {
                return getAnswerIndexInLocalStorage;
            }));
            function getAnswerIndexInLocalStorage(fieldName) {
                var multiChoiceValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
                var self = this;
                var lsSurvey = localStorage.getObject(self.internals.localStorageName);
                if (lsSurvey) {
                    var lsSurveyLength = lsSurvey.length;
                    for (var ls = 0; ls < lsSurveyLength; ls++) {
                        var lsItem = lsSurvey[ls];
                        if (lsItem.field === fieldName) {
                            if (multiChoiceValue) {
                                if (lsItem.value !== multiChoiceValue) {
                                    continue;
                                }
                            }
                            return ls;
                        }
                    }
                }
                return -1;
            }
        },
        "./src/modules/utils/getQuestionObject.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "getQuestionObject", (function() {
                return getQuestionObject;
            }));
            function getQuestionObject(questionId) {
                var self = this, questions = self.data.questions, qLength = questions.length;
                var obj = {};
                for (var q = 0; q < qLength; q++) {
                    var question = questions[q];
                    if (question.id == questionId) {
                        obj = question;
                        break;
                    }
                }
                return obj;
            }
        },
        "./src/modules/webStorage.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "webStorage", (function() {
                return webStorage;
            }));
            function webStorage() {
                var checkLocalStorage = function checkLocalStorage() {
                    var mod = "check_storage";
                    try {
                        localStorage.setItem(mod, mod);
                        localStorage.removeItem(mod);
                        return true;
                    } catch (e) {
                        return false;
                    }
                };
                var isAvailable = checkLocalStorage();
                if (isAvailable) {
                    Storage.prototype.setObject = function(key, value) {
                        this.setItem(key, JSON.stringify(value));
                    };
                    Storage.prototype.getObject = function(key) {
                        var value = this.getItem(key);
                        return value && JSON.parse(value);
                    };
                }
                return {
                    isAvailable: isAvailable
                };
            }
        },
        "formjs-plugin": function(module, exports) {
            module.exports = __WEBPACK_EXTERNAL_MODULE_formjs_plugin__;
        }
    })["default"];
}));