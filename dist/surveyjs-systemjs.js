/* surveyJS v3.0.0 | Valerio Di Punzio (@SimplySayHi) | https://www.valeriodipunzio.com/plugins/surveyJS/ | https://github.com/SimplySayHi/surveyJS | MIT license */
System.register([ "formjs-plugin" ], (function(exports) {
    "use strict";
    var Form;
    return {
        setters: [ function(module) {
            Form = module.default;
        } ],
        execute: function() {
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
            function _createClass(Constructor, protoProps, staticProps) {
                return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), 
                Constructor;
            }
            function _inherits(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        writable: !0,
                        configurable: !0
                    }
                }), superClass && _setPrototypeOf(subClass, superClass);
            }
            function _getPrototypeOf(o) {
                return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
                    return o.__proto__ || Object.getPrototypeOf(o);
                })(o);
            }
            function _setPrototypeOf(o, p) {
                return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
                    return o.__proto__ = p, o;
                })(o, p);
            }
            function _isNativeReflectConstruct() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), 
                    !0;
                } catch (e) {
                    return !1;
                }
            }
            function _assertThisInitialized(self) {
                if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self;
            }
            function _possibleConstructorReturn(self, call) {
                return !call || "object" != typeof call && "function" != typeof call ? _assertThisInitialized(self) : call;
            }
            function _createSuper(Derived) {
                var hasNativeReflectConstruct = _isNativeReflectConstruct();
                return function() {
                    var result, Super = _getPrototypeOf(Derived);
                    if (hasNativeReflectConstruct) {
                        var NewTarget = _getPrototypeOf(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return _possibleConstructorReturn(this, result);
                };
            }
            function _superPropBase(object, property) {
                for (;!Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)); ) ;
                return object;
            }
            function _get(target, property, receiver) {
                return (_get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(target, property, receiver) {
                    var base = _superPropBase(target, property);
                    if (base) {
                        var desc = Object.getOwnPropertyDescriptor(base, property);
                        return desc.get ? desc.get.call(receiver) : desc.value;
                    }
                })(target, property, receiver || target);
            }
            var ajaxCall = function() {
                var timeoutTimer, url = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : location.href, options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                if (options.headers = new Headers(options.headers), options.timeout > 0) {
                    var controller = new AbortController, signal = controller.signal;
                    options.signal = signal, timeoutTimer = window.setTimeout((function() {
                        controller.abort();
                    }), options.timeout);
                }
                return fetch(url, options).then((function(response) {
                    return response.ok ? response.json() : Promise.reject(response);
                })).catch((function(error) {
                    return Promise.reject(error);
                })).finally((function() {
                    timeoutTimer && window.clearTimeout(timeoutTimer);
                }));
            }, appendDomStringToNode = function(HTMLstring, parentNode) {
                var tmpEl = document.createElement("div");
                tmpEl.innerHTML = HTMLstring, Array.from(tmpEl.childNodes).forEach((function(elem) {
                    parentNode.appendChild(elem);
                }));
            }, customEvents = {
                init: "sjs:init"
            }, deepFreeze = function deepFreeze(obj) {
                return Object.getOwnPropertyNames(obj).forEach((function(name) {
                    var prop = obj[name];
                    "object" === _typeof(prop) && null !== prop && deepFreeze(prop);
                })), Object.freeze(obj);
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
            }, fieldsStringSelectorSurvey = '[data-surveyjs-form] input:not([type="reset"]):not([type="submit"]):not([type="button"]), [data-surveyjs-form] select, [data-surveyjs-form] textarea, [data-name="bind-surveyjs-answer"]', isEmptyObject = function(object) {
                return isPlainObject(object) && 0 === Object.getOwnPropertyNames(object).length;
            }, isFieldForChangeEvent = function(fieldEl) {
                return fieldEl.matches('select, [type="radio"], [type="checkbox"], [type="file"]');
            }, webStorage = function() {
                var isAvailable = function() {
                    var mod = "check_storage";
                    try {
                        return localStorage.setItem(mod, mod), localStorage.removeItem(mod), !0;
                    } catch (e) {
                        return !1;
                    }
                }();
                return isAvailable && (Storage.prototype.setObject = function(key, value) {
                    this.setItem(key, JSON.stringify(value));
                }, Storage.prototype.getObject = function(key) {
                    var value = this.getItem(key);
                    return value && JSON.parse(value);
                }), {
                    isAvailable: isAvailable
                };
            }, messages = {
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
            }, getQuestionObject = function(data, questionId) {
                for (var questions = data.questions, qLength = questions.length, obj = {}, q = 0; q < qLength; q++) {
                    var question = questions[q];
                    if (question.id == questionId) {
                        obj = question;
                        break;
                    }
                }
                return obj;
            }, defaultCallbacksInOptions = {
                formOptions: {
                    beforeSend: function(data) {
                        var isHacking = !1, instance = this, surveyContEl = instance.formEl.closest("[data-surveyjs-container]"), fieldsList = Array.from(surveyContEl.querySelectorAll(fieldsStringSelectorSurvey)), fieldNameCheck = "", fieldTypeCheck = "";
                        if (fieldsList.forEach((function(fieldEl) {
                            var type = fieldEl.type, name = fieldEl.name;
                            if (name !== fieldNameCheck || type !== fieldTypeCheck) {
                                fieldEl.matches("[data-required-from]") || (fieldNameCheck = name, fieldTypeCheck = type);
                                var questionIdEl = fieldEl.closest("[data-question-id]"), questionId = questionIdEl ? questionIdEl.getAttribute("data-question-id") : "", questionObj = getQuestionObject(instance.data, questionId);
                                if ("" !== questionId && questionObj && void 0 !== questionObj.required) {
                                    var isRequiredFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = document.querySelector(fieldEl.getAttribute("data-required-from"));
                                    (!isRequiredFrom || isRequiredFrom && reqMoreEl.checked) && (fieldEl.required || (isHacking = !0), 
                                    fieldEl.required = !0);
                                }
                            }
                        })), isHacking) {
                            var fieldOptions = mergeObjects({}, instance.options.fieldOptions, {
                                focusOnRelated: !1
                            });
                            return instance.validateForm(fieldOptions).then((function(formRes) {
                                return data.stopExecution = !0, data;
                            }));
                        }
                        return data;
                    },
                    getFormData: function() {
                        var formEl = this.formEl, instance = formEl.formjs, fieldsList = Array.from(formEl.closest("[data-surveyjs-container]").querySelectorAll(fieldsStringSelectorSurvey)), obj = {
                            answers: [],
                            id: instance.data.id
                        }, fieldNameCheck = "", fieldTypeCheck = "";
                        return fieldsList.forEach((function(fieldEl) {
                            var type = fieldEl.type, name = fieldEl.name;
                            if (name !== fieldNameCheck || type !== fieldTypeCheck) {
                                fieldEl.matches("[data-required-from]") || (fieldNameCheck = name, fieldTypeCheck = type);
                                var questionIdEl = fieldEl.closest("[data-question-id]"), questionId = questionIdEl ? questionIdEl.getAttribute("data-question-id") : "", fieldValue = fieldEl.value, qaObj = {
                                    question: questionId,
                                    answer: {
                                        id_answer: [ fieldValue ]
                                    }
                                };
                                if (!fieldEl.matches("[data-required-from]") && "" !== questionId && !isEmptyObject(getQuestionObject(instance.data, questionId))) {
                                    if (fieldEl.matches("textarea") && (qaObj.answer.id_answer = [ "" ], qaObj.answer.text = fieldValue), 
                                    "radio" === type) {
                                        var elem = (fieldEl.closest("form") ? formEl : fieldEl.closest("[data-formjs-question]")).querySelector('[name="' + name + '"]:checked');
                                        elem ? (elem.matches("[data-require-more]") && (qaObj.answer.attributes = formEl.querySelector('[data-required-from="#' + elem.id + '"]').value.trim()), 
                                        elem.matches("[data-nested-index]") && (qaObj.answer.attributes = elem.getAttribute("data-nested-index")), 
                                        qaObj.answer.id_answer = [ elem.value.trim() ]) : qaObj.answer.id_answer = [ "" ];
                                    }
                                    "checkbox" === type && fieldEl.matches("[data-checks]") && (qaObj.answer.id_answer = [], 
                                    Array.from(formEl.querySelectorAll('[name="' + name + '"]:checked')).forEach((function(el) {
                                        qaObj.answer.id_answer.push(el.value.trim());
                                    }))), obj.answers.push(qaObj);
                                }
                            }
                        })), obj;
                    }
                }
            }, options = {
                cssClasses: {
                    checkbox: "form-check-input",
                    default: "form-control",
                    file: "form-control-file",
                    label: "form-check-label",
                    radio: "form-check-input",
                    select: "form-control",
                    textarea: "form-control"
                },
                fieldErrorFeedback: !0,
                formOptions: {
                    beforeSend: [ defaultCallbacksInOptions.formOptions.beforeSend ],
                    getFormData: defaultCallbacksInOptions.formOptions.getFormData
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
                    input: '<div class="surveyjs-single-answer surveyjs-input-container surveyjs-answer-{{answerType}} form-check" data-answer-index="{{answerIndex}}">{{inputTagCode}}{{labelTagCode}}</div>',
                    inputGroup: '<div class="surveyjs-single-answer input-group" data-answer-index="{{answerIndex}}"><div class="input-group-prepend"><div class="input-group-text form-check surveyjs-answer-{{answerType}}"><input type="{{answerType}}" name="surveyjs-answer-{{questionNumber}}" id="{{answerCode}}" data-answer-id="{{answerId}}" value="{{answerIdValue}}" {{attrRequired}} data-require-more="" class="surveyjs-input surveyjs-radio form-check-input" /><label for="{{answerCode}}" class="surveyjs-label form-check-label">{{answerString}}</label></div></div>{{relatedAnswerField}}</div>',
                    inputTag: '<input type="{{answerType}}" {{attrSubtype}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-input surveyjs-{{answerType}} {{fieldClass}}" id="{{answerCode}}" {{nestedAnswer}} data-answer-root="{{progIdsJoined}}" data-answer-id="{{answerId}}" value="{{answerIdValue}}" {{attrRequired}} {{validateIfFilled}} {{attrChecks}} {{attrRequiredFrom}} />',
                    labelTag: '<label for="{{answerCode}}" class="surveyjs-label {{labelClass}}">{{answerString}}</label>',
                    question: '<div data-question-id="{{questionId}}" data-question-index="{{questionNumber}}" data-formjs-question class="surveyjs-question-box clearfix"><div class="surveyjs-question-header">Question {{questionNumber}}</div><div class="surveyjs-question-body"><div class="surveyjs-question-text">{{questionText}}</div><div class="surveyjs-answers-box form-group clearfix">{{answersHtml}}{{fieldErrorTemplate}}</div></div></div>',
                    select: '<div class="surveyjs-single-answer surveyjs-answer-select" data-answer-index="{{answerIndex}}">{{selectTagCode}}</div>',
                    selectTag: '<select id="{{answerCode}}" name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-select {{fieldClass}}" {{attrRequired}} {{nestedAnswer}} data-answer-root="{{progIdsJoined}}" {{attrRequiredFrom}}>{{optionsHtml}}</select>',
                    textarea: '<div class="surveyjs-single-answer surveyjs-answer-textarea"><textarea id="{{answerCode}}" data-answer-id="{{answerId}}" {{nestedAnswer}} name="surveyjs-answer-{{questionNumber}}" {{attrRequired}} class="surveyjs-textarea {{fieldClass}}" {{answerMaxlength}} rows="6" placeholder="{{answerPlaceholder}}"></textarea></div>'
                },
                useLocalStorage: !0
            }, internals = {
                storageArray: [],
                storageName: "Survey_" + location.href + "_{{surveyFormName}}_surveyId[{{surveyId}}]"
            }, getAnswerIndexInLocalStorage = function(internals, fieldName) {
                var multiChoiceValue = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "", lsSurvey = localStorage.getObject(internals.storageName);
                if (lsSurvey) for (var lsSurveyLength = lsSurvey.length, ls = 0; ls < lsSurveyLength; ls++) {
                    var lsItem = lsSurvey[ls];
                    if (lsItem.field === fieldName) {
                        if (multiChoiceValue && lsItem.value !== multiChoiceValue) continue;
                        return ls;
                    }
                }
                return -1;
            }, callbackFns = {
                validation: function(event) {
                    var eventName = event.type, fieldEl = event.target, self = fieldEl.closest("form").formjs, internals = self.internals, containerEl = fieldEl.closest("[data-formjs-question]"), fieldValue = fieldEl.value ? fieldEl.value.trim() : fieldEl.value, isMultiChoice = fieldEl.matches("[data-checks]"), isRequireMore = fieldEl.matches("[data-require-more]"), isRequiredFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = isRequiredFrom ? containerEl.querySelector(fieldEl.getAttribute("data-required-from")) : null, itemEl = isRequiredFrom ? reqMoreEl : fieldEl, questionId = itemEl.id ? itemEl.id.split("-")[1] : "id-not-found", isFieldForChangeEventBoolean = isFieldForChangeEvent(fieldEl), questionObj = getQuestionObject(self.data, questionId);
                    if (isEmptyObject(questionObj)) return !0;
                    if (isFieldForChangeEventBoolean && "change" === eventName || !isFieldForChangeEventBoolean && "change" !== eventName) {
                        if (self.options.useLocalStorage && !fieldEl.matches("[data-exclude-storage]")) {
                            var inArrayPos = getAnswerIndexInLocalStorage(internals, fieldEl.name, !!isMultiChoice && fieldValue), inArrayRequireMorePos = getAnswerIndexInLocalStorage(internals, fieldEl.name + "-more"), storageArray = internals.storageArray;
                            if (isRequireMore || isRequiredFrom || -1 === inArrayRequireMorePos || storageArray.splice(inArrayRequireMorePos, 1), 
                            -1 !== inArrayPos) isMultiChoice ? fieldEl.checked || storageArray[inArrayPos].value !== fieldValue ? storageArray.push({
                                field: fieldEl.name,
                                value: fieldValue
                            }) : storageArray.splice(inArrayPos, 1) : "" !== fieldValue ? storageArray[inArrayPos].value = fieldValue : storageArray.splice(inArrayPos, 1); else if ("" !== fieldValue) {
                                if (isRequiredFrom && "" !== fieldValue) {
                                    var oldFieldNamePos = getAnswerIndexInLocalStorage(internals, reqMoreEl.name);
                                    -1 !== oldFieldNamePos && storageArray.splice(oldFieldNamePos, 1), storageArray.push({
                                        field: reqMoreEl.name,
                                        value: reqMoreEl.value.trim()
                                    });
                                }
                                if (storageArray.push({
                                    field: fieldEl.name,
                                    value: fieldValue
                                }), isRequireMore) {
                                    var elReqFromEl = fieldEl.closest("form").querySelector('[data-required-from="#' + fieldEl.id + '"]');
                                    storageArray.push({
                                        field: elReqFromEl.name,
                                        value: elReqFromEl.value.trim()
                                    });
                                }
                            }
                            localStorage.setObject(internals.storageName, storageArray);
                        }
                        void 0 !== questionObj.required && (fieldEl.required = !0);
                    }
                }
            }, generateOptionTags = function() {
                var optionsList = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], options = arguments.length > 1 ? arguments[1] : void 0, optionsHtml = "" === optionsList[0].id ? "" : '<option value="">' + options.selectFirstOption + "</option>";
                return optionsList.forEach((function(opt) {
                    optionsHtml += '<option value="' + opt.id + '" data-answer-id="' + opt.id + '">' + opt.answer + "</option>";
                })), optionsHtml;
            }, attribute = function(options, data) {
                var objData = data.objData, aHtml = options.templates.inputGroup, attr = data.answer.attribute, attributeIsArray = Array.isArray(attr), relatedAnswerField = attributeIsArray ? options.templates.selectTag : options.templates.inputTag;
                return objData.fieldClass = options.cssClasses.default, attributeIsArray && (objData.fieldClass = options.cssClasses.select, 
                objData.optionsHtml = generateOptionTags(attr, options)), {
                    aHtml: aHtml,
                    relatedAnswerField: relatedAnswerField,
                    objData: objData
                };
            }, input = function(options, data) {
                var objData = data.objData, aHtml = data.beforeCode + options.templates.input + data.afterCode;
                return "checkbox" !== objData.answerType && "radio" !== objData.answerType && (objData.nestedAnswer += ' class="' + objData.fieldClass + '"'), 
                {
                    aHtml: aHtml,
                    objData: objData
                };
            }, nested = function(options, data) {
                var objData = data.objData, labelForNested = options.templates.labelTag;
                return labelForNested = (labelForNested = (labelForNested = labelForNested.replace(/{{answerCode}}/g, objData.answerCode)).replace(/{{labelClass}}/g, options.cssClasses.label + " surveyjs-field-indent-0")).replace(/{{answerString}}/g, data.answer.answer), 
                {
                    aHtml: data.beforeCode + '<div class="surveyjs-' + objData.answerType + '">' + labelForNested + "</div>" + data.afterCode,
                    objData: objData
                };
            }, select = function(options, data) {
                var objData = data.objData, aHtml = data.beforeCode + options.templates.select + data.afterCode;
                return objData.optionsHtml = generateOptionTags(data.obj.answers, options), {
                    aHtml: aHtml,
                    objData: objData
                };
            }, textarea = function(options, data) {
                var objData = data.objData, aHtml = options.templates.textarea;
                return objData.answerPlaceholder = data.answer.placeholder || options.textareaPlaceholder, 
                {
                    aHtml: aHtml,
                    objData: objData
                };
            }, generateFieldHTML = {
                attribute: attribute,
                input: input,
                nested: nested,
                select: select,
                textarea: textarea
            }, replaceTemplateStrings = function(options, fieldData, objData) {
                if ("" !== objData.optionsHtml && (fieldData.aHtml = fieldData.aHtml.replace(/{{selectTagCode}}/g, options.templates.selectTag)), 
                fieldData.relatedAnswerField) {
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
                } else fieldData.aHtml = fieldData.aHtml.replace(/{{addMoreName}}/g, ""), fieldData.aHtml = fieldData.aHtml.replace(/{{attrRequiredFrom}}/g, "");
                for (var key in objData) {
                    var regexStr = new RegExp("{{" + key + "}}", "g");
                    fieldData.aHtml = fieldData.aHtml.replace(regexStr, objData[key]);
                }
                return fieldData.aHtml;
            }, progIds = [], iterateAnswers = function iterateAnswers(formEl, options, obj, qID, qIdx, attrReq) {
                qID = obj.id ? obj.id : qID || 0;
                var list = Array.isArray(obj) ? obj : obj.answers, listL = list.length, i = qIdx || 0, aLoopHtml = "", needsBinding = "hidden-privacy" === obj.question;
                list[0].sort && list.sort((function(a, b) {
                    return a.sort > b.sort;
                }));
                for (var _loop = function(_a) {
                    var answer = list[_a], aNum = _a + 1, qNum = i + 1, aType = answer.type, aId = answer.id, progIdsLength = progIds.length, progIdsJoined = progIdsLength > 0 ? progIds.join("-") : "", fieldData = {
                        aHtml: ""
                    }, objData = {
                        labelTagCode: "checkbox" === aType || "radio" === aType ? options.templates.labelTag : "",
                        answerId: aId,
                        answerIdValue: "text" === aType ? "" : aId,
                        answerIndex: aNum,
                        answerName: "surveyjs-answer-" + qNum,
                        answerPlaceholder: "",
                        answerMaxlength: answer.maxlength ? 'maxlength="' + answer.maxlength + '"' : "",
                        answerString: "string" == typeof answer.answer ? answer.answer : "",
                        answerType: aType,
                        attrRequired: void 0 !== obj.required ? "required" : void 0 !== attrReq ? attrReq : "",
                        fieldClass: function() {
                            var aType = "option" === answer.type ? "select" : answer.type;
                            return a = _a, options.cssClasses[aType] || options.cssClasses.default;
                        }(),
                        nestedAnswer: "" !== progIdsJoined ? 'data-nested-index="' + aNum + '"' : "",
                        optionsHtml: "",
                        progIdsJoined: progIdsJoined,
                        questionNumber: qNum,
                        answerCode: ("option" === aType ? "select" : aType) + "-" + qID + "-" + (aId || 0) + "-" + qNum + ("" !== progIdsJoined ? "-" + progIdsJoined : "") + "-" + aNum,
                        attrChecks: obj.checks ? 'data-checks="' + obj.checks + '"' : "",
                        attrSubtype: answer.subtype ? 'data-subtype="' + answer.subtype + '"' : "",
                        validateIfFilled: void 0 !== obj.validateIfFilled ? "data-validate-if-filled" : ""
                    };
                    if (needsBinding) {
                        var boundedFieldEl = formEl.closest("[data-surveyjs-container]").querySelectorAll('[data-name="bind-surveyjs-answer"]')[_a], fieldProps = {
                            id: objData.answerCode,
                            name: objData.answerName,
                            type: aType,
                            value: objData.answerId
                        };
                        for (var key in void 0 !== obj.required && (fieldProps.required = !0), fieldProps) boundedFieldEl[key] = fieldProps[key];
                        return boundedFieldEl.setAttribute("data-answer-id", objData.answerId), boundedFieldEl.closest("div").querySelector("label").setAttribute("for", objData.answerCode), 
                        boundedFieldEl.closest("div").querySelector("label span").textContent = answer.answer, 
                        a = _a, "continue";
                    }
                    if ("string" == typeof answer.answer || "number" == typeof answer.answer) {
                        var surveyFieldType = answer.attribute ? "attribute" : answer.nested ? "nested" : "option" === aType ? "select" : aType, data = {
                            answer: answer,
                            objData: objData,
                            beforeCode: progIdsLength > 0 && 0 === _a ? '<div class="surveyjs-field-indent">' : "",
                            afterCode: progIdsLength > 0 && _a === listL - 1 ? "</div>" : "",
                            obj: obj
                        };
                        if (void 0 === generateFieldHTML[surveyFieldType] && (surveyFieldType = "input"), 
                        objData = (fieldData = generateFieldHTML[surveyFieldType](options, data)).objData, 
                        answer.nested) return progIds.push(aNum), aLoopHtml += fieldData.aHtml, aLoopHtml += iterateAnswers(formEl, options, answer.nested, qID, i, objData.attrRequired), 
                        a = _a, "continue";
                        progIdsLength > 0 && _a === listL - 1 && progIds.pop();
                    }
                    fieldData.aHtml = replaceTemplateStrings(options, fieldData, objData), aLoopHtml += fieldData.aHtml, 
                    "option" === aType && (_a += obj.answers.length), a = _a;
                }, a = 0; a < listL; a++) _loop(a);
                return aLoopHtml;
            }, generateQAcode = function(formEl, options) {
                for (var questionsList = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [], qaData = questionsList[0].sort ? questionsList.sort((function(a, b) {
                    return a.sort > b.sort;
                })) : questionsList, qaDataLength = qaData.length, qaCodeAll = "", i = 0; i < qaDataLength; i++) {
                    var item = qaData[i], maxChoice = item.checks ? JSON.parse(item.checks) : "", checksMin = maxChoice.length > 0 ? maxChoice[0] : "", checksMax = maxChoice.length > 0 ? maxChoice[1] : "", aHtml = "", qaHtml = options.templates.question;
                    if (aHtml += iterateAnswers(formEl, options, item, item.id, i), "hidden-privacy" === item.question) {
                        var bindAnswerEl = formEl.closest("[data-surveyjs-container]").querySelector('[data-name="bind-surveyjs-answer"]');
                        if (bindAnswerEl) {
                            bindAnswerEl.closest("[data-formjs-question]").setAttribute("data-question-id", item.id);
                            continue;
                        }
                    }
                    if (qaHtml = (qaHtml = (qaHtml = (qaHtml = (qaHtml = qaHtml.replace(/{{questionId}}/g, item.id)).replace(/{{questionNumber}}/g, i + 1)).replace(/{{questionText}}/g, item.question + ("" !== maxChoice ? " (" + checksMax + " " + options.maxChoiceText + ")" : ""))).replace(/{{answersHtml}}/g, aHtml)).replace(/{{fieldErrorTemplate}}/g, options.fieldErrorFeedback ? options.templates.fieldError : ""), 
                    options.fieldErrorFeedback && -1 !== options.templates.fieldError.indexOf("{{fieldErrorMessage}}")) {
                        var message = "" !== maxChoice ? options.fieldErrorMessageMultiChoice : options.fieldErrorMessage;
                        qaHtml = qaHtml.replace(/{{fieldErrorMessage}}/g, message).replace(/{{checksMin}}/g, checksMin).replace(/{{checksMax}}/g, checksMax);
                    }
                    qaCodeAll += qaHtml;
                }
                return qaCodeAll;
            }, populateAnswers = function(formEl, internals) {
                var LS = localStorage.getObject(internals.storageName);
                if (LS) {
                    var surveyContEl = formEl.closest("[data-surveyjs-container]");
                    internals.storageArray = LS, LS.forEach((function(item) {
                        var fieldFirst = surveyContEl.querySelector('[name="' + item.field + '"]'), isRadioOrCheckbox = fieldFirst.matches('[type="radio"], [type="checkbox"]'), fieldEl = isRadioOrCheckbox ? surveyContEl.querySelector('[name="' + item.field + '"][value="' + item.value + '"]') : fieldFirst;
                        isRadioOrCheckbox ? fieldEl.checked = !0 : fieldEl.value = item.value;
                    }));
                }
            }, buildSurvey = function(formEl, options, internals, data) {
                var self = formEl.formjs, formName = formEl.getAttribute("name") || "";
                self.internals.storageName = internals.storageName.replace(/{{surveyId}}/g, data.id), 
                self.internals.storageName = internals.storageName.replace(/{{surveyFormName}}/g, formName);
                var qaHtmlAll = generateQAcode(formEl, options, data.questions);
                appendDomStringToNode(qaHtmlAll, formEl.querySelector("[data-surveyjs-body]")), 
                options.useLocalStorage && populateAnswers(formEl, self.internals);
            }, destroy = function(formEl) {
                formEl.formjs.options.fieldOptions.validateOnEvents.split(" ").forEach((function(eventName) {
                    var useCapturing = "blur" === eventName;
                    formEl.removeEventListener(eventName, callbackFns.validation, useCapturing);
                }));
            }, version = "3.0.0", Survey = exports("default", function(_Form) {
                _inherits(Survey, _Form);
                var _super = _createSuper(Survey);
                function Survey(formEl) {
                    var _thisSuper, _this, optionsObj = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    if (_classCallCheck(this, Survey), !optionsObj.url || "string" != typeof optionsObj.url) throw new Error('"options.url" is missing or not a string!');
                    var customLang = "string" == typeof optionsObj.lang && optionsObj.lang.toLowerCase(), langValue = customLang && Survey.prototype.messages[customLang] ? customLang : Survey.prototype.options.lang, options = mergeObjects({}, Survey.prototype.options, Survey.prototype.messages[langValue], optionsObj);
                    -1 !== options.templates.input.indexOf("{{inputTagCode}}") && (options.templates.input = options.templates.input.replace(/{{inputTagCode}}/g, options.templates.inputTag)), 
                    options.templates.labelTag = options.templates.labelTag.replace(/{{labelClass}}/g, options.cssClasses.label), 
                    webStorage().isAvailable || (options.useLocalStorage = !1);
                    var self = _assertThisInitialized(_this = _super.call(this, formEl, options));
                    self.internals = internals, self.options.fieldOptions.validateOnEvents.split(" ").forEach((function(eventName) {
                        var useCapturing = "blur" === eventName;
                        self.formEl.addEventListener(eventName, callbackFns.validation, useCapturing);
                    })), self.formEl.addEventListener("fjs.form:submit", (function(event) {
                        event.data.then((function() {
                            self.options.useLocalStorage && localStorage.removeItem(self.internals.storageName);
                        }));
                    })), self.formEl.querySelector("[data-surveyjs-body]").insertAdjacentHTML("beforebegin", self.options.loadingBox);
                    var retrieveSurvey = ajaxCall(self.options.url, self.options.initAjaxOptions).then((function(response) {
                        return "success" !== response.status.toLowerCase() ? Promise.reject(response) : new Promise((function(resolve) {
                            response.data.questions && response.data.questions.length > 0 ? (buildSurvey(self.formEl, self.options, self.internals, response.data), 
                            _get((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(Survey.prototype)), "init", _thisSuper).call(_thisSuper).then((function() {
                                self.isInitialized = !0, self.data = response.data, deepFreeze(self.data), self.formEl.closest("[data-surveyjs-container]").classList.add("surveyjs-init-success"), 
                                resolve(response);
                            }))) : resolve(response);
                        }));
                    })).finally((function() {
                        var loadingBoxEl = self.formEl.querySelector("[data-surveyjs-loading]");
                        loadingBoxEl && loadingBoxEl.parentNode.removeChild(loadingBoxEl);
                    }));
                    return dispatchCustomEvent(self.formEl, customEvents.init, retrieveSurvey), _this;
                }
                return _createClass(Survey, [ {
                    key: "destroy",
                    value: function() {
                        destroy(this.formEl), _get(_getPrototypeOf(Survey.prototype), "destroy", this).call(this);
                    }
                } ], [ {
                    key: "addLanguage",
                    value: function(langString, langObject) {
                        var langValue = langString.toLowerCase();
                        Survey.prototype.messages[langValue] = mergeObjects({}, Survey.prototype.messages[langValue], langObject);
                    }
                }, {
                    key: "setOptions",
                    value: function(optionsObj) {
                        Survey.prototype.options = mergeObjects({}, Survey.prototype.options, optionsObj);
                    }
                } ]), Survey;
            }(Form));
            Survey.prototype.isInitialized = !1, Survey.prototype.messages = messages, Survey.prototype.options = options, 
            Survey.prototype.version = version;
        }
    };
}));
