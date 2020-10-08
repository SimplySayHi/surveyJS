/* surveyJS v3.0.0 | Valerio Di Punzio (@SimplySayHi) | https://www.valeriodipunzio.com/plugins/surveyJS/ | https://github.com/SimplySayHi/surveyJS | MIT license */
var Survey = function(Form) {
    "use strict";
    function _interopDefaultLegacy(e) {
        return e && "object" == typeof e && "default" in e ? e : {
            default: e
        };
    }
    var Form__default = _interopDefaultLegacy(Form);
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
    }, arrayMove = function(array, from, to) {
        return array.splice(to, 0, array.splice(from, 1)[0]), array;
    }, customEvents = {
        init: "sjs:init"
    }, deepFreeze = function deepFreeze(obj) {
        return Object.getOwnPropertyNames(obj).forEach((function(name) {
            var prop = obj[name];
            "object" === _typeof(prop) && null !== prop && deepFreeze(prop);
        })), Object.freeze(obj);
    }, isPlainObject$1 = function(object) {
        return "[object Object]" === Object.prototype.toString.call(object);
    }, mergeObjects = function mergeObjects() {
        var out = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return Array.from(arguments).slice(1).filter((function(arg) {
            return !!arg;
        })).forEach((function(arg) {
            Object.keys(arg).forEach((function(key) {
                Array.isArray(arg[key]) ? out[key] = (out[key] || []).concat(arg[key].slice(0)) : isPlainObject$1(arg[key]) ? out[key] = mergeObjects(out[key] || {}, arg[key]) : Array.isArray(out[key]) ? out[key].push(arg[key]) : out[key] = arg[key];
            }));
        })), out;
    }, dispatchCustomEvent = function(elem, eventName) {
        var data = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, eventOptions = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
        eventOptions = mergeObjects({}, {
            bubbles: !0
        }, eventOptions);
        var eventObj = new Event(eventName, eventOptions);
        eventObj.data = data, elem.dispatchEvent(eventObj);
    }, fieldsStringSelectorSurvey = '[data-surveyjs-form] input:not([type="reset"]):not([type="submit"]):not([type="button"]), [data-surveyjs-form] select, [data-surveyjs-form] textarea, [data-name="bind-surveyjs-answer"]', getQuestionId = function(fieldEl) {
        var containerEl = fieldEl.closest("[data-question-id]");
        return containerEl && containerEl.getAttribute("data-question-id") || "";
    }, isEmptyObject = function(object) {
        return isPlainObject$1(object) && 0 === Object.getOwnPropertyNames(object).length;
    }, replaceObjectKeysInString = function(obj, stringHTML) {
        return Object.keys(obj).reduce((function(accString, name) {
            var regexStr = new RegExp("{{" + name + "}}", "g");
            return accString.replace(regexStr, obj[name]);
        }), stringHTML);
    }, sortList = function(list) {
        return list[0].sort && list.sort((function(a, b) {
            return a.sort > b.sort;
        })), list;
    }, toKebabCase = function() {
        var string = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", useAllCaps = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], newString = string.trim().replace(/(([_ ])([a-z]))|(([a-z])?([A-Z]))/g, (function(match, p1, p2, p3, p4, p5, p6) {
            return (p3 ? "-" + p3 : (p5 || "") + "-" + p6).toLowerCase();
        }));
        return useAllCaps ? newString.toUpperCase() : newString;
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
    }, getQuestionObject = function(data, questionId) {
        for (var questions = data.questions, qLength = questions.length, obj = {}, q = 0; q < qLength; q++) {
            var question = questions[q];
            if (question.id == questionId) {
                obj = question;
                break;
            }
        }
        return obj;
    }, optionsUtils = {
        formOptions: {
            getFormData: function() {
                var instance = this, formEl = instance.formEl, fieldsList = Array.from(formEl.closest("[data-surveyjs-wrapper]").querySelectorAll(fieldsStringSelectorSurvey)), obj = {
                    answers: [],
                    id: instance.data.id
                }, fieldNameCheck = "", fieldTypeCheck = "";
                return fieldsList.forEach((function(fieldEl) {
                    var type = fieldEl.type, name = fieldEl.name;
                    if (name !== fieldNameCheck || type !== fieldTypeCheck) {
                        fieldEl.matches("[data-required-from]") || (fieldNameCheck = name, fieldTypeCheck = type);
                        var questionId = getQuestionId(fieldEl), qaObj = {
                            question: questionId,
                            answer: {
                                value: fieldEl.value || ""
                            }
                        };
                        if (!fieldEl.matches("[data-required-from]") && "" !== questionId && !isEmptyObject(getQuestionObject(instance.data, questionId))) {
                            if ("radio" === type) {
                                var checkedEl = (fieldEl.closest("form") ? formEl : fieldEl.closest(instance.options.fieldOptions.questionContainer)).querySelector('[name="' + name + '"]:checked');
                                qaObj.answer.value = checkedEl && checkedEl.value || "", checkedEl && checkedEl.matches("[data-require-more]") && (qaObj.answer.related = formEl.querySelector('[data-required-from="#' + checkedEl.id + '"]').value);
                            }
                            "checkbox" === type && fieldEl.matches("[data-checks]") && (qaObj.answer.value = [], 
                            Array.from(formEl.querySelectorAll('[name="' + name + '"]:checked')).forEach((function(el) {
                                qaObj.answer.value.push(el.value);
                            }))), obj.answers.push(qaObj);
                        }
                    }
                })), obj;
            }
        }
    }, options = {
        cssClasses: {
            checkbox: "form-check-input",
            field: "form-control",
            file: "form-control-file",
            label: "form-check-label",
            radio: "form-check-input",
            wrapper: {
                checkbox: "form-check",
                field: "",
                radio: "form-check"
            }
        },
        fieldErrorFeedback: !0,
        formOptions: {
            getFormData: optionsUtils.formOptions.getFormData
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
        messages: {
            maxChoice: "ANSWERS MAX",
            error: "Answer is necessary.",
            errorMultiChoice: "You must choose from {{checksMin}} to {{checksMax}} answers."
        },
        templates: {
            error: '<div class="surveyjs-error-message">{{errorMessage}}</div>',
            input: '<input {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-input surveyjs-{{answerType}} {{fieldClasses}}" />',
            label: '<label for="{{answerCode}}" class="surveyjs-label {{labelClasses}}">{{labelString}}</label>',
            loading: '<div class="surveyjs-loading" data-surveyjs-loading>Loading...</div>',
            select: '<select {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-select {{fieldClasses}}">{{optionsHtml}}</select>',
            textarea: '<textarea {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}" class="surveyjs-textarea {{fieldClasses}}"></textarea>',
            wrapper: {
                field: '<div class="surveyjs-field-wrapper surveyjs-wrapper-{{answerType}} {{wrapperClasses}}">{{fieldTemplate}}{{labelTemplate}}</div>',
                errors: '<div class="surveyjs-errors-wrapper" data-surveyjs-errors>{{errorTemplates}}</div>',
                nested: '<div class="surveyjs-field-wrapper surveyjs-nested-parent surveyjs-wrapper-{{answerType}}">{{labelTemplate}}<div class="surveyjs-nested-container surveyjs-field-indent">{{nestedFieldsHTML}}</div></div>',
                question: '<div class="surveyjs-question-wrapper" data-question-id="{{questionId}}" data-formjs-question><div class="surveyjs-question-body"><div class="surveyjs-question-text">{{questionText}}</div><div class="surveyjs-answers-wrapper form-group">{{answersHTML}}{{errorsHTML}}</div></div></div>',
                related: '<div class="surveyjs-field-wrapper input-group {{wrapperClasses}}"><div class="input-group-prepend"><div class="input-group-text form-check surveyjs-wrapper-radio">{{fieldTemplate}}{{labelTemplate}}</div></div>{{relatedFieldHTML}}</div>'
            }
        },
        useWebStorage: !0
    }, internals = {
        storageArray: [],
        storageName: "Survey_" + location.href + "_{{surveyFormName}}_surveyId[{{surveyId}}]"
    };
    function submit(event) {
        var self = event.target.formjs;
        event.data.then((function() {
            self.options.useWebStorage && sessionStorage.removeItem(self.internals.storageName);
        }));
    }
    var getAnswerIndexInWebStorage = function(internals, fieldName) {
        var multiChoiceValue = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "", wsSurvey = sessionStorage.getObject(internals.storageName);
        if (wsSurvey) for (var wsSurveyLength = wsSurvey.length, ws = 0; ws < wsSurveyLength; ws++) {
            var lsItem = wsSurvey[ws];
            if (lsItem.name === fieldName) {
                if (multiChoiceValue && lsItem.value !== multiChoiceValue) continue;
                return ws;
            }
        }
        return -1;
    };
    function validationEnd(event) {
        var fieldEl = event.data.fieldEl, errors = event.data.errors, instance = event.target.formjs, questionId = getQuestionId(fieldEl), questionObj = getQuestionObject(instance.data, questionId);
        if (isEmptyObject(questionObj)) return !0;
        if (errors && isPlainObject(questionObj.errorMessage)) {
            var errorsList = Object.keys(errors);
            if (errors.rule) {
                var ruleIndex = errorsList.indexOf("rule");
                errorsList = arrayMove(errorsList, ruleIndex, 0);
            }
            var errorsWrapper = fieldEl.closest(instance.options.fieldOptions.questionContainer).querySelector("[data-surveyjs-errors]"), errorsHTML = errorsList.reduce((function(accHTML, name) {
                var errorMessage = questionObj.errorMessage[name] || "";
                return accHTML + (errorMessage ? instance.options.templates.error.replace("{{errorMessage}}", errorMessage) : "");
            }), "");
            errorsWrapper.innerHTML = errorsHTML;
        }
        if (instance.options.useWebStorage && !fieldEl.matches("[data-exclude-storage]")) {
            var internals = instance.internals, fieldValue = fieldEl.value, isRequiredFrom = fieldEl.matches("[data-required-from]"), isMultiChoice = fieldEl.matches("[data-checks]"), isRequireMore = fieldEl.matches("[data-require-more]"), reqMoreEl = isRequiredFrom ? document.querySelector(fieldEl.getAttribute("data-required-from")) : null, inArrayPos = getAnswerIndexInWebStorage(internals, fieldEl.name, !!isMultiChoice && fieldValue), inArrayRequireMorePos = getAnswerIndexInWebStorage(internals, fieldEl.name + "-more"), storageArray = internals.storageArray;
            if (isRequireMore || isRequiredFrom || -1 === inArrayRequireMorePos || storageArray.splice(inArrayRequireMorePos, 1), 
            -1 !== inArrayPos) isMultiChoice ? fieldEl.checked || storageArray[inArrayPos].value !== fieldValue ? storageArray.push({
                name: fieldEl.name,
                value: fieldValue
            }) : storageArray.splice(inArrayPos, 1) : "" !== fieldValue ? storageArray[inArrayPos].value = fieldValue : storageArray.splice(inArrayPos, 1); else if ("" !== fieldValue) {
                if (isRequiredFrom && "" !== fieldValue) {
                    var oldFieldNamePos = getAnswerIndexInWebStorage(internals, reqMoreEl.name);
                    -1 !== oldFieldNamePos && storageArray.splice(oldFieldNamePos, 1), storageArray.push({
                        name: reqMoreEl.name,
                        value: reqMoreEl.value
                    });
                }
                if (storageArray.push({
                    name: fieldEl.name,
                    value: fieldValue
                }), isRequireMore) {
                    var elReqFromEl = fieldEl.closest("form").querySelector('[data-required-from="#' + fieldEl.id + '"]');
                    storageArray.push({
                        name: elReqFromEl.name,
                        value: elReqFromEl.value
                    });
                }
            }
            sessionStorage.setObject(internals.storageName, storageArray);
        }
        questionObj.required && !fieldEl.required && (fieldEl.required = !0, instance.validateField(fieldEl));
    }
    var generateOptionTags = function() {
        var optionsList = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
        return sortList(optionsList).reduce((function(optionsHTML, opt) {
            return optionsHTML + '<option value="'.concat(opt.value, '">').concat(opt.label, "</option>");
        }), "");
    }, getAttributesStringHTML = function(answerObj, answerCode, isRequired) {
        var excludedAttrs = [ "data", "id", "label", "nested", "related", "sort" ];
        /^(option|textarea)$/.test(answerObj.type) && excludedAttrs.push("type", "value");
        var string = "";
        return Object.keys(answerObj).filter((function(name) {
            return -1 === excludedAttrs.indexOf(name);
        })).forEach((function(name) {
            string += " ".concat(name, '="').concat(answerObj[name], '"');
        })), answerObj.data && Object.keys(answerObj.data).forEach((function(name) {
            string += " data-".concat(toKebabCase(name), '="').concat(answerObj.data[name], '"');
        })), isRequired && (string += " required"), answerObj.related && (string += " data-require-more"), 
        (string += ' id="'.concat(answerCode, '"')).trim();
    }, getTemplates = function(answerType, templates) {
        return {
            field: templates[answerType] || templates.input,
            label: /^(checkbox|nested|radio|related)$/.test(answerType) ? templates.label : "",
            wrapper: templates.wrapper[answerType] || templates.wrapper.field
        };
    }, generateAnswers = function generateAnswers(answersList, extraData, options) {
        var allAnswersHTML = "", previousType = "";
        return sortList(answersList).forEach((function(answer, index) {
            var answerHTML, answerType = "option" === answer.type ? "select" : answer.type;
            if ("select" !== answerType || previousType !== answerType) {
                previousType = answerType, extraData.question.checks && (answer = mergeObjects({}, answer, {
                    data: {
                        checks: extraData.question.checks
                    }
                }));
                var answerCode = "".concat(answerType, "-").concat(extraData.surveyId, "-").concat(extraData.question.id, "-").concat("select" === answerType ? index + 1 : answer.id), answerData = {
                    questionNumber: extraData.question.index + 1,
                    wrapperClasses: options.cssClasses.wrapper[answerType] || options.cssClasses.wrapper.field,
                    fieldAttributes: getAttributesStringHTML(answer, answerCode, extraData.question.isRequired),
                    fieldClasses: options.cssClasses[answerType] || options.cssClasses.field,
                    answerType: answerType,
                    answerCode: answerCode,
                    addMoreName: "",
                    labelString: answer.label || "",
                    labelClasses: options.cssClasses.label
                }, relatedFieldHTML = "";
                if (answer.related) {
                    var relatedType = answer.related.type || "select", relatedIsSelect = "select" === relatedType, relatedObj = relatedIsSelect ? mergeObjects({}, answer) : answer.related;
                    relatedObj.type = relatedIsSelect ? "option" : relatedType, relatedObj.id = "", 
                    relatedObj.data = mergeObjects({}, relatedObj.data, {
                        requiredFrom: "#" + answerCode
                    }), delete relatedObj.related;
                    var answerDataRelated = {
                        fieldAttributes: getAttributesStringHTML(relatedObj, "", !1),
                        answerType: relatedType,
                        addMoreName: "-more",
                        fieldClasses: relatedIsSelect ? options.cssClasses.select : options.cssClasses[relatedType] || options.cssClasses.field
                    };
                    if (relatedFieldHTML = options.templates[relatedType] || options.templates.input, 
                    relatedIsSelect) {
                        var _optionsHtml = generateOptionTags(answer.related);
                        relatedFieldHTML = relatedFieldHTML.replace("{{optionsHtml}}", _optionsHtml);
                    }
                    relatedFieldHTML = replaceObjectKeysInString(answerDataRelated, relatedFieldHTML);
                }
                var answerTypeForTemplate = answer.related ? "related" : answer.nested ? "nested" : answerType, templates = getTemplates(answerTypeForTemplate, options.templates), nestedFieldsHTML = "";
                answer.nested && (nestedFieldsHTML = generateAnswers(answer.nested, extraData, options));
                var optionsHtml = "";
                "select" === answerType && (optionsHtml = generateOptionTags(answersList)), answerHTML = templates.wrapper.replace("{{relatedFieldHTML}}", relatedFieldHTML).replace("{{fieldTemplate}}", templates.field).replace("{{optionsHtml}}", optionsHtml).replace("{{labelTemplate}}", templates.label).replace("{{nestedFieldsHTML}}", nestedFieldsHTML), 
                allAnswersHTML += replaceObjectKeysInString(answerData, answerHTML);
            }
        })), allAnswersHTML;
    }, generateQAcode = function(questions, surveyId, options) {
        return sortList(questions).reduce((function(accCode, questionObj, index) {
            if (questionObj.external) return accCode;
            var qaHtml = options.templates.wrapper.question, questionId = questionObj.id, questionNumber = index + 1, extraData = {
                surveyId: surveyId,
                question: {
                    id: questionId,
                    index: index,
                    isRequired: !!questionObj.required
                }
            };
            questionObj.checks && (extraData.question.checks = questionObj.checks);
            var answersHTML = generateAnswers(questionObj.answers, extraData, options), maxChoice = questionObj.checks ? JSON.parse(questionObj.checks) : "", checksMin = maxChoice[0] || "", checksMax = maxChoice[1] || "", maxChoiceText = maxChoice && options.messages.maxChoice ? " (" + checksMax + " " + options.messages.maxChoice + ")" : "", questionData = {
                questionId: questionId,
                questionNumber: questionNumber,
                questionText: questionObj.question + maxChoiceText,
                answersHTML: answersHTML,
                errorsHTML: options.fieldErrorFeedback ? options.templates.wrapper.errors : ""
            };
            if (qaHtml = replaceObjectKeysInString(questionData, qaHtml), options.fieldErrorFeedback) {
                var errorMessage = "" !== maxChoice ? options.messages.errorMultiChoice : questionObj.errorMessage || options.messages.error;
                isPlainObject$1(errorMessage) && (errorMessage = ""), qaHtml = qaHtml.replace(/{{errorTemplates}}/g, errorMessage);
            }
            return accCode + replaceObjectKeysInString({
                checksMin: checksMin,
                checksMax: checksMax
            }, qaHtml);
        }), "");
    }, buildSurvey = function(data, formEl, options, internals) {
        var formName = formEl.getAttribute("name") || "";
        internals.storageName = internals.storageName.replace(/{{surveyId}}/, data.id), 
        internals.storageName = internals.storageName.replace(/{{surveyFormName}}/, formName);
        var qaHtmlAll = generateQAcode(data.questions, data.id, options);
        formEl.querySelector("[data-surveyjs-body]").insertAdjacentHTML("beforeend", qaHtmlAll);
        var extQuestion = data.questions.filter((function(obj) {
            return obj.external;
        }))[0];
        if (extQuestion) {
            var externalCont = formEl.closest("[data-surveyjs-wrapper]").querySelector("[data-surveyjs-external]");
            externalCont.setAttribute("data-question-id", extQuestion.id), extQuestion.answers.forEach((function(answer, index) {
                var externalField = externalCont.querySelectorAll("[data-field]")[index], fieldProps = {
                    id: "".concat(answer.type, "-").concat(data.id, "-").concat(extQuestion.id, "-").concat(answer.id),
                    type: answer.type,
                    value: answer.value,
                    required: !!extQuestion.required
                };
                Object.keys(fieldProps).forEach((function(name) {
                    externalField[name] = fieldProps[name];
                }));
                var answerCont = externalField.closest("[data-answer]");
                answerCont.querySelector("label").setAttribute("for", fieldProps.id), answerCont.querySelector("[data-label]").innerHTML = answer.label, 
                externalCont.querySelector("[data-question]").innerHTML = extQuestion.question;
            }));
        }
    }, populateAnswers = function(formEl, internals) {
        var WS = sessionStorage.getObject(internals.storageName);
        if (WS) {
            var surveyContEl = formEl.closest("[data-surveyjs-wrapper]");
            internals.storageArray = WS, WS.forEach((function(item) {
                var fieldFirst = surveyContEl.querySelector('[name="' + item.name + '"]'), isRadioOrCheckbox = fieldFirst.matches('[type="radio"], [type="checkbox"]'), fieldEl = isRadioOrCheckbox ? surveyContEl.querySelector('[name="' + item.name + '"][value="' + item.value + '"]') : fieldFirst;
                isRadioOrCheckbox ? fieldEl.checked = !0 : fieldEl.value = item.value;
            }));
        }
    }, destroy = function(formEl) {
        formEl.removeEventListener("fjs.field:validation", validationEnd), formEl.removeEventListener("fjs.form:submit", submit);
    }, version = "3.0.0", Survey = function(_Form) {
        _inherits(Survey, _Form);
        var _super = _createSuper(Survey);
        function Survey(formEl) {
            var _thisSuper, _this, optionsObj = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            if (_classCallCheck(this, Survey), !optionsObj.url || "string" != typeof optionsObj.url) throw new Error('"options.url" is missing or not a string!');
            var options = mergeObjects({}, Survey.prototype.options, optionsObj);
            webStorage().isAvailable || (options.useWebStorage = !1);
            var self = _assertThisInitialized(_this = _super.call(this, formEl, options));
            self.internals = internals, self.formEl.querySelector("[data-surveyjs-body]").insertAdjacentHTML("beforebegin", self.options.templates.loading);
            var retrieveSurvey = ajaxCall(self.options.url, self.options.initAjaxOptions).then((function(response) {
                return "success" !== response.status.toLowerCase() ? Promise.reject(response) : new Promise((function(resolve) {
                    self.data = response.data, self.data.questions && self.data.questions.length > 0 ? (buildSurvey(self.data, self.formEl, self.options, self.internals), 
                    self.options.useWebStorage && populateAnswers(self.formEl, self.internals), deepFreeze(self.data), 
                    self.formEl.addEventListener("fjs.field:validation", validationEnd), self.formEl.addEventListener("fjs.form:submit", submit), 
                    _get((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(Survey.prototype)), "init", _thisSuper).call(_thisSuper).then((function() {
                        self.isInitialized = !0, self.formEl.closest("[data-surveyjs-wrapper]").classList.add("surveyjs-init-success"), 
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
            key: "setOptions",
            value: function(optionsObj) {
                Survey.prototype.options = mergeObjects({}, Survey.prototype.options, optionsObj);
            }
        } ]), Survey;
    }(Form__default.default);
    return Survey.prototype.isInitialized = !1, Survey.prototype.options = options, 
    Survey.prototype.version = version, Survey;
}(Form);
