/* surveyJS Lite v3.0.2 | Valerio Di Punzio (@SimplySayHi) | https://www.valeriodipunzio.com/plugins/surveyJS/ | https://github.com/SimplySayHi/surveyJS | MIT license */
!function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define(factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self).Survey = factory();
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
    var ajaxCall = function() {
        var timeoutTimer, url = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : location.href, options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        if (options.headers = new Headers(options.headers), options.timeout > 0) {
            var controller = new AbortController, signal = controller.signal;
            options.signal = signal, timeoutTimer = window.setTimeout((function() {
                controller.abort();
            }), options.timeout);
        }
        return fetch(url, options).then((function(response) {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
        })).catch((function(error) {
            throw new Error(error.message);
        })).finally((function() {
            timeoutTimer && window.clearTimeout(timeoutTimer);
        }));
    }, isDOMNode = function(node) {
        return Element.prototype.isPrototypeOf(node);
    }, checkFormEl = function(formEl) {
        var isString = _typeof(formEl), isFormSelector = "string" === isString && isDOMNode(document.querySelector(formEl)) && "form" === document.querySelector(formEl).tagName.toLowerCase();
        return {
            result: isDOMNode(formEl) || isFormSelector,
            element: "string" === isString ? document.querySelector(formEl) : formEl
        };
    }, customEvents_init = "sjs:init", deepFreeze = function deepFreeze(obj) {
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
    }, isNodeList = function(nodeList) {
        return NodeList.prototype.isPrototypeOf(nodeList);
    }, replaceObjectKeysInString = function(obj, stringHTML) {
        return Object.keys(obj).reduce((function(accString, name) {
            var regexStr = new RegExp("{{" + name + "}}", "g");
            return accString.replace(regexStr, obj[name]);
        }), stringHTML);
    }, sortList = function(list) {
        return list[0].sort && list.sort((function(a, b) {
            return a.sort > b.sort;
        })), list;
    }, generateOptionTags = function() {
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
            string += " data-".concat(function() {
                var useAllCaps = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], newString = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "").trim().replace(/(([_ ])([a-z]))|(([a-z])?([A-Z]))/g, (function(match, p1, p2, p3, p4, p5, p6) {
                    return (p3 ? "-" + p3 : (p5 || "") + "-" + p6).toLowerCase();
                }));
                return useAllCaps ? newString.toUpperCase() : newString;
            }(name), '="').concat(answerObj.data[name], '"');
        })), isRequired && (string += " required"), answerObj.related && (string += " data-require-more"), 
        (string += ' id="'.concat(answerCode, '"')).trim();
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
                var templates = function(answerType, templates) {
                    return {
                        field: templates[answerType] || templates.input,
                        label: /^(checkbox|nested|radio|related)$/.test(answerType) ? templates.label : "",
                        wrapper: templates.wrapper[answerType] || templates.wrapper.field
                    };
                }(answer.related ? "related" : answer.nested ? "nested" : answerType, options.templates), nestedFieldsHTML = "";
                answer.nested && (nestedFieldsHTML = generateAnswers(answer.nested, extraData, options));
                var optionsHtml = "";
                "select" === answerType && (optionsHtml = generateOptionTags(answersList)), answerHTML = templates.wrapper.replace("{{relatedFieldHTML}}", relatedFieldHTML).replace("{{fieldTemplate}}", templates.field).replace("{{optionsHtml}}", optionsHtml).replace("{{labelTemplate}}", templates.label).replace("{{nestedFieldsHTML}}", nestedFieldsHTML), 
                allAnswersHTML += replaceObjectKeysInString(answerData, answerHTML);
            }
        })), allAnswersHTML;
    }, generateQAcode = function(questions, surveyId, options) {
        return sortList(questions).reduce((function(accCode, questionObj, index) {
            if (questionObj.external) return accCode;
            var questionHTML = options.templates.wrapper.question, questionId = questionObj.id, questionNumber = index + 1, extraData = {
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
                answersHTML: answersHTML
            };
            if (questionHTML = replaceObjectKeysInString(questionData, questionHTML), options.showErrorMessage) {
                var errorMessage = "" !== maxChoice ? options.messages.errorMultiChoice : questionObj.errorMessage || options.messages.error;
                isPlainObject(errorMessage) && (errorMessage = ""), questionHTML = questionHTML.replace(/{{errorTemplates}}/g, errorMessage);
            }
            return accCode + replaceObjectKeysInString({
                checksMin: checksMin,
                checksMax: checksMax
            }, questionHTML);
        }), "");
    }, buildSurvey = function(data, formEl, options) {
        var qaHtmlAll = generateQAcode(data.questions, data.id, options);
        formEl.querySelector("[data-surveyjs-body]").insertAdjacentHTML("beforeend", qaHtmlAll);
        var extQuestions = data.questions.filter((function(obj) {
            return obj.external;
        }));
        if (extQuestions.length > 0) {
            var surveyWrapperEl = formEl.closest("[data-surveyjs-wrapper]");
            extQuestions.forEach((function(question, qIndex) {
                var externalCont = surveyWrapperEl.querySelector('[data-surveyjs-external="' + (qIndex + 1) + '"]');
                externalCont.setAttribute("data-question-id", question.id), question.answers.forEach((function(answer, aIndex) {
                    var externalField = externalCont.querySelectorAll("[data-field]")[aIndex], fieldProps = {
                        id: "".concat(answer.type, "-").concat(data.id, "-").concat(question.id, "-").concat(answer.id),
                        type: answer.type,
                        value: answer.value,
                        required: !!question.required
                    };
                    Object.keys(fieldProps).forEach((function(name) {
                        externalField[name] = fieldProps[name];
                    }));
                    var answerCont = externalField.closest("[data-answer]");
                    answerCont.querySelector("label").setAttribute("for", fieldProps.id), answerCont.querySelector("[data-label]").innerHTML = answer.label, 
                    externalCont.querySelector("[data-question]").innerHTML = question.question;
                }));
            }));
        }
    }, Survey = function() {
        function Survey(formEl) {
            var optionsObj = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            _classCallCheck(this, Survey);
            var argsL = arguments.length, checkFormElem = checkFormEl(formEl);
            if (0 === argsL || argsL > 0 && !formEl) throw new Error('First argument "formEl" is missing or falsy!');
            if (isNodeList(formEl)) throw new Error('First argument "formEl" must be a single DOM node or a form CSS selector, not a NodeList!');
            if (!checkFormElem.result) throw new Error('First argument "formEl" is not a DOM node nor a form CSS selector!');
            if (!optionsObj.url || "string" != typeof optionsObj.url) throw new Error('"options.url" is missing or not a string!');
            var self = this;
            self.formEl = checkFormElem.element, self.options = mergeObjects({}, Survey.prototype.options, optionsObj), 
            formEl = self.formEl, optionsObj = self.options, formEl.querySelector("[data-surveyjs-body]").insertAdjacentHTML("beforebegin", optionsObj.templates.loading);
            var retrieveSurvey = ajaxCall(optionsObj.url, optionsObj.initAjaxOptions).then((function(response) {
                return "success" !== response.status.toLowerCase() ? Promise.reject(response) : (response.data.questions && response.data.questions.length > 0 && (buildSurvey(response.data, formEl, optionsObj), 
                Object.defineProperty(self, "data", {
                    value: deepFreeze(response.data)
                }), self.isInitialized = !0, formEl.closest("[data-surveyjs-wrapper]").classList.add("surveyjs-init-success")), 
                response);
            })).finally((function() {
                var loadingBoxEl = formEl.querySelector("[data-surveyjs-loading]");
                loadingBoxEl && loadingBoxEl.parentNode.removeChild(loadingBoxEl);
            }));
            dispatchCustomEvent(formEl, customEvents_init, retrieveSurvey);
        }
        var Constructor, protoProps, staticProps;
        return Constructor = Survey, staticProps = [ {
            key: "setOptions",
            value: function(optionsObj) {
                Survey.prototype.options = mergeObjects({}, Survey.prototype.options, optionsObj);
            }
        } ], (protoProps = null) && _defineProperties(Constructor.prototype, protoProps), 
        staticProps && _defineProperties(Constructor, staticProps), Survey;
    }();
    return Survey.prototype.isInitialized = !1, Survey.prototype.options = {
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
            maxChoice: "answers max",
            error: "Answer is necessary.",
            errorMultiChoice: "You must choose from {{checksMin}} to {{checksMax}} answers."
        },
        showErrorMessage: !0,
        templates: {
            error: '<div class="surveyjs-error-message">{{errorMessage}}</div>',
            input: '<input {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-input surveyjs-{{answerType}} {{fieldClasses}}" />',
            label: '<label for="{{answerCode}}" class="surveyjs-label {{labelClasses}}">{{labelString}}</label>',
            loading: '<div class="surveyjs-loading" data-surveyjs-loading>Loading...</div>',
            select: '<select {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-select {{fieldClasses}}">{{optionsHtml}}</select>',
            textarea: '<textarea {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}" class="surveyjs-textarea {{fieldClasses}}"></textarea>',
            wrapper: {
                field: '<div class="surveyjs-field-wrapper surveyjs-{{answerType}}-wrapper {{wrapperClasses}}">{{fieldTemplate}}{{labelTemplate}}</div>',
                nested: '<div class="surveyjs-field-wrapper surveyjs-nested-wrapper">{{labelTemplate}}<div class="surveyjs-nested-inner">{{nestedFieldsHTML}}</div></div>',
                question: '<div class="surveyjs-question-wrapper" data-question-id="{{questionId}}"><div class="surveyjs-question-text">{{questionText}}</div><div class="surveyjs-answers-wrapper">{{answersHTML}}</div><div class="surveyjs-errors-wrapper" data-surveyjs-errors>{{errorTemplates}}</div></div>',
                related: '<div class="surveyjs-field-wrapper surveyjs-related-wrapper input-group"><div class="input-group-prepend"><div class="surveyjs-radio-wrapper input-group-text form-check">{{fieldTemplate}}{{labelTemplate}}</div></div>{{relatedFieldHTML}}</div>'
            }
        }
    }, Survey.prototype.version = "3.0.2", Survey;
}));
