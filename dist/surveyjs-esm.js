/* surveyJS v3.0.0 | Valerio Di Punzio (@SimplySayHi) | https://www.valeriodipunzio.com/plugins/surveyJS/ | https://github.com/SimplySayHi/surveyJS | MIT license */
import Form from "formjs-plugin";

const customEvents_init = "sjs:init", deepFreeze = obj => (Object.getOwnPropertyNames(obj).forEach(name => {
    const prop = obj[name];
    "object" == typeof prop && null !== prop && deepFreeze(prop);
}), Object.freeze(obj)), isPlainObject$1 = object => "[object Object]" === Object.prototype.toString.call(object), mergeObjects = function(out = {}) {
    return Array.from(arguments).slice(1).filter(arg => !!arg).forEach(arg => {
        Object.keys(arg).forEach(key => {
            Array.isArray(arg[key]) ? out[key] = (out[key] || []).concat(arg[key].slice(0)) : isPlainObject$1(arg[key]) ? out[key] = mergeObjects(out[key] || {}, arg[key]) : Array.isArray(out[key]) ? out[key].push(arg[key]) : out[key] = arg[key];
        });
    }), out;
}, getQuestionId = fieldEl => {
    const containerEl = fieldEl.closest("[data-question-id]");
    return containerEl && containerEl.getAttribute("data-question-id") || "";
}, isEmptyObject = object => isPlainObject$1(object) && 0 === Object.getOwnPropertyNames(object).length, replaceObjectKeysInString = (obj, stringHTML) => Object.keys(obj).reduce((accString, name) => {
    const regexStr = new RegExp("{{" + name + "}}", "g");
    return accString.replace(regexStr, obj[name]);
}, stringHTML), sortList = list => (list[0].sort && list.sort((a, b) => a.sort > b.sort), 
list), webStorage = () => {
    const isAvailable = (() => {
        const mod = "check_storage";
        try {
            return localStorage.setItem(mod, mod), localStorage.removeItem(mod), !0;
        } catch (e) {
            return !1;
        }
    })();
    return isAvailable && (Storage.prototype.setObject = function(key, value) {
        this.setItem(key, JSON.stringify(value));
    }, Storage.prototype.getObject = function(key) {
        const value = this.getItem(key);
        return value && JSON.parse(value);
    }), {
        isAvailable: isAvailable
    };
}, getQuestionObject = (data, questionId) => {
    const questions = data.questions, qLength = questions.length;
    let obj = {};
    for (let q = 0; q < qLength; q++) {
        const question = questions[q];
        if (question.id == questionId) {
            obj = question;
            break;
        }
    }
    return obj;
}, options = {
    cssClasses: {
        checkbox: "form-check-input",
        default: "form-control",
        file: "form-control-file",
        label: "form-check-label",
        radio: "form-check-input",
        wrapper: {
            checkbox: "form-check",
            default: "",
            radio: "form-check"
        }
    },
    fieldErrorFeedback: !0,
    formOptions: {
        getFormData: {
            formOptions: {
                getFormData: function() {
                    const instance = this, formEl = instance.formEl, fieldsList = Array.from(formEl.closest("[data-surveyjs-wrapper]").querySelectorAll('[data-surveyjs-form] input:not([type="reset"]):not([type="submit"]):not([type="button"]), [data-surveyjs-form] select, [data-surveyjs-form] textarea, [data-name="bind-surveyjs-answer"]')), obj = {
                        answers: [],
                        id: instance.data.id
                    };
                    let fieldNameCheck = "", fieldTypeCheck = "";
                    return fieldsList.forEach(fieldEl => {
                        const type = fieldEl.type, name = fieldEl.name;
                        if (name === fieldNameCheck && type === fieldTypeCheck) return;
                        fieldEl.matches("[data-required-from]") || (fieldNameCheck = name, fieldTypeCheck = type);
                        const questionId = getQuestionId(fieldEl), qaObj = {
                            question: questionId,
                            answer: {
                                value: fieldEl.value || ""
                            }
                        };
                        if (!fieldEl.matches("[data-required-from]") && "" !== questionId && !isEmptyObject(getQuestionObject(instance.data, questionId))) {
                            if ("radio" === type) {
                                const checkedEl = (fieldEl.closest("form") ? formEl : fieldEl.closest(instance.options.fieldOptions.questionContainer)).querySelector('[name="' + name + '"]:checked');
                                qaObj.answer.value = checkedEl && checkedEl.value || "", checkedEl && checkedEl.matches("[data-require-more]") && (qaObj.answer.related = formEl.querySelector('[data-required-from="#' + checkedEl.id + '"]').value);
                            }
                            "checkbox" === type && fieldEl.matches("[data-checks]") && (qaObj.answer.value = [], 
                            Array.from(formEl.querySelectorAll('[name="' + name + '"]:checked')).forEach(el => {
                                qaObj.answer.value.push(el.value);
                            })), obj.answers.push(qaObj);
                        }
                    }), obj;
                }
            }
        }.formOptions.getFormData
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
        errorMessage: "Answer is necessary.",
        errorMessageMultiChoice: "You must choose from {{checksMin}} to {{checksMax}} answers."
    },
    templates: {
        error: '<div class="surveyjs-error-message">{{errorMessage}}</div>',
        input: '<input {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-input surveyjs-{{answerType}} {{fieldClasses}}" />',
        label: '<label for="{{answerCode}}" class="surveyjs-label {{labelClasses}}">{{labelString}}</label>',
        loading: '<div class="surveyjs-loading" data-surveyjs-loading>Loading...</div>',
        question: '<div class="surveyjs-question-wrapper" data-question-id="{{questionId}}" data-formjs-question><div class="surveyjs-question-body"><div class="surveyjs-question-text">{{questionText}}</div><div class="surveyjs-answers-wrapper form-group">{{answersHTML}}{{errorsHTML}}</div></div></div>',
        select: '<select {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-select {{fieldClasses}}">{{optionsHtml}}</select>',
        textarea: '<textarea {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}" class="surveyjs-textarea {{fieldClasses}}"></textarea>',
        wrapper: {
            default: '<div class="surveyjs-field-wrapper surveyjs-wrapper-{{answerType}} {{wrapperClasses}}">{{fieldTemplate}}{{labelTemplate}}</div>',
            errors: '<div class="surveyjs-errors-wrapper" data-surveyjs-errors>{{errorTemplates}}</div>',
            nested: '<div class="surveyjs-field-wrapper surveyjs-nested-parent surveyjs-wrapper-{{answerType}}">{{labelTemplate}}<div class="surveyjs-nested-container surveyjs-field-indent">{{nestedFieldsHTML}}</div></div>',
            related: '<div class="surveyjs-field-wrapper input-group {{wrapperClasses}}"><div class="input-group-prepend"><div class="input-group-text form-check surveyjs-wrapper-radio">{{fieldTemplate}}{{labelTemplate}}</div></div>{{relatedFieldHTML}}</div>'
        }
    },
    useWebStorage: !0
}, internals = {
    storageArray: [],
    storageName: "Survey_" + location.href + "_{{surveyFormName}}_surveyId[{{surveyId}}]"
};

function submit(event) {
    const self = event.target.formjs;
    event.data.then(() => {
        self.options.useWebStorage && sessionStorage.removeItem(self.internals.storageName);
    });
}

const getAnswerIndexInWebStorage = (internals, fieldName, multiChoiceValue = "") => {
    const wsSurvey = sessionStorage.getObject(internals.storageName);
    if (wsSurvey) {
        const wsSurveyLength = wsSurvey.length;
        for (let ws = 0; ws < wsSurveyLength; ws++) {
            const lsItem = wsSurvey[ws];
            if (lsItem.name === fieldName) {
                if (multiChoiceValue && lsItem.value !== multiChoiceValue) continue;
                return ws;
            }
        }
    }
    return -1;
};

function validationEnd(event) {
    const fieldEl = event.data.fieldEl, errors = event.data.errors, instance = event.target.formjs, questionId = getQuestionId(fieldEl), questionObj = getQuestionObject(instance.data, questionId);
    if (isEmptyObject(questionObj)) return !0;
    if (errors && isPlainObject(questionObj.errorMessage)) {
        let errorsList = Object.keys(errors);
        if (errors.rule) {
            const ruleIndex = errorsList.indexOf("rule");
            from = ruleIndex, to = 0, (array = errorsList).splice(to, 0, array.splice(from, 1)[0]), 
            errorsList = array;
        }
        const errorsWrapper = fieldEl.closest(instance.options.fieldOptions.questionContainer).querySelector("[data-surveyjs-errors]"), errorsHTML = errorsList.reduce((accHTML, name) => {
            const errorMessage = questionObj.errorMessage[name] || "";
            return accHTML + (errorMessage ? instance.options.templates.error.replace("{{errorMessage}}", errorMessage) : "");
        }, "");
        errorsWrapper.innerHTML = errorsHTML;
    }
    var array, from, to;
    if (instance.options.useWebStorage && !fieldEl.matches("[data-exclude-storage]")) {
        const internals = instance.internals, fieldValue = fieldEl.value, isRequiredFrom = fieldEl.matches("[data-required-from]"), isMultiChoice = fieldEl.matches("[data-checks]"), isRequireMore = fieldEl.matches("[data-require-more]"), reqMoreEl = isRequiredFrom ? document.querySelector(fieldEl.getAttribute("data-required-from")) : null, inArrayPos = getAnswerIndexInWebStorage(internals, fieldEl.name, !!isMultiChoice && fieldValue), inArrayRequireMorePos = getAnswerIndexInWebStorage(internals, fieldEl.name + "-more");
        let storageArray = internals.storageArray;
        if (isRequireMore || isRequiredFrom || -1 === inArrayRequireMorePos || storageArray.splice(inArrayRequireMorePos, 1), 
        -1 !== inArrayPos) isMultiChoice ? fieldEl.checked || storageArray[inArrayPos].value !== fieldValue ? storageArray.push({
            name: fieldEl.name,
            value: fieldValue
        }) : storageArray.splice(inArrayPos, 1) : "" !== fieldValue ? storageArray[inArrayPos].value = fieldValue : storageArray.splice(inArrayPos, 1); else if ("" !== fieldValue) {
            if (isRequiredFrom && "" !== fieldValue) {
                const oldFieldNamePos = getAnswerIndexInWebStorage(internals, reqMoreEl.name);
                -1 !== oldFieldNamePos && storageArray.splice(oldFieldNamePos, 1), storageArray.push({
                    name: reqMoreEl.name,
                    value: reqMoreEl.value
                });
            }
            if (storageArray.push({
                name: fieldEl.name,
                value: fieldValue
            }), isRequireMore) {
                const elReqFromEl = fieldEl.closest("form").querySelector('[data-required-from="#' + fieldEl.id + '"]');
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

const generateOptionTags = (optionsList = []) => sortList(optionsList).reduce((optionsHTML, opt) => optionsHTML + `<option value="${opt.value}">${opt.label}</option>`, ""), getAttributesStringHTML = (answerObj, answerCode, isRequired) => {
    const excludedAttrs = [ "data", "id", "label", "nested", "related", "sort" ];
    /^(option|textarea)$/.test(answerObj.type) && excludedAttrs.push("type", "value");
    let string = "";
    return Object.keys(answerObj).filter(name => -1 === excludedAttrs.indexOf(name)).forEach(name => {
        string += ` ${name}="${answerObj[name]}"`;
    }), answerObj.data && Object.keys(answerObj.data).forEach(name => {
        string += ` data-${((string = "", useAllCaps = !1) => {
            let newString = string.trim().replace(/(([_ ])([a-z]))|(([a-z])?([A-Z]))/g, (match, p1, p2, p3, p4, p5, p6) => (p3 ? "-" + p3 : (p5 || "") + "-" + p6).toLowerCase());
            return useAllCaps ? newString.toUpperCase() : newString;
        })(name)}="${answerObj.data[name]}"`;
    }), isRequired && (string += " required"), answerObj.related && (string += " data-require-more"), 
    string += ` id="${answerCode}"`, string.trim();
}, generateAnswers = (answersList, extraData, options) => {
    let allAnswersHTML = "", previousType = "";
    return sortList(answersList).forEach((answer, index) => {
        let answerHTML = "";
        const answerType = "option" === answer.type ? "select" : answer.type;
        if ("select" === answerType && previousType === answerType) return;
        previousType = answerType, extraData.question.checks && (answer = mergeObjects({}, answer, {
            data: {
                checks: extraData.question.checks
            }
        }));
        const answerCode = `${answerType}-${extraData.surveyId}-${extraData.question.id}-${"select" === answerType ? index + 1 : answer.id}`, answerData = {
            questionNumber: extraData.question.index + 1,
            wrapperClasses: options.cssClasses.wrapper[answerType] || options.cssClasses.wrapper.default,
            fieldAttributes: getAttributesStringHTML(answer, answerCode, extraData.question.isRequired),
            fieldClasses: options.cssClasses[answerType] || options.cssClasses.default,
            answerType: answerType,
            answerCode: answerCode,
            addMoreName: "",
            labelString: answer.label || "",
            labelClasses: options.cssClasses.label
        };
        let relatedFieldHTML = "";
        if (answer.related) {
            const relatedType = answer.related.type || "select", relatedIsSelect = "select" === relatedType, relatedObj = relatedIsSelect ? mergeObjects({}, answer) : answer.related;
            relatedObj.type = relatedIsSelect ? "option" : relatedType, relatedObj.id = "", 
            relatedObj.data = mergeObjects({}, relatedObj.data, {
                requiredFrom: "#" + answerCode
            }), delete relatedObj.related;
            const answerDataRelated = {
                fieldAttributes: getAttributesStringHTML(relatedObj, "", !1),
                answerType: relatedType,
                addMoreName: "-more",
                fieldClasses: relatedIsSelect ? options.cssClasses.select : options.cssClasses[relatedType] || options.cssClasses.default
            };
            if (relatedFieldHTML = options.templates[relatedType] || options.templates.input, 
            relatedIsSelect) {
                const optionsHtml = generateOptionTags(answer.related);
                relatedFieldHTML = relatedFieldHTML.replace("{{optionsHtml}}", optionsHtml);
            }
            relatedFieldHTML = replaceObjectKeysInString(answerDataRelated, relatedFieldHTML);
        }
        const templates = ((answerType, templates) => ({
            field: templates[answerType] || templates.input,
            label: /^(checkbox|nested|radio|related)$/.test(answerType) ? templates.label : "",
            wrapper: templates.wrapper[answerType] || templates.wrapper.default
        }))(answer.related ? "related" : answer.nested ? "nested" : answerType, options.templates);
        let nestedFieldsHTML = "";
        answer.nested && (nestedFieldsHTML = generateAnswers(answer.nested, extraData, options));
        let optionsHtml = "";
        "select" === answerType && (optionsHtml = generateOptionTags(answersList)), answerHTML = templates.wrapper.replace("{{relatedFieldHTML}}", relatedFieldHTML).replace("{{fieldTemplate}}", templates.field).replace("{{optionsHtml}}", optionsHtml).replace("{{labelTemplate}}", templates.label).replace("{{nestedFieldsHTML}}", nestedFieldsHTML), 
        allAnswersHTML += replaceObjectKeysInString(answerData, answerHTML);
    }), allAnswersHTML;
}, buildSurvey = (data, formEl, options, internals) => {
    const formName = formEl.getAttribute("name") || "";
    internals.storageName = internals.storageName.replace(/{{surveyId}}/, data.id), 
    internals.storageName = internals.storageName.replace(/{{surveyFormName}}/, formName);
    const qaHtmlAll = ((questions, surveyId, options) => sortList(questions).reduce((accCode, questionObj, index) => {
        if (questionObj.external) return accCode;
        let qaHtml = options.templates.question;
        const questionId = questionObj.id, questionNumber = index + 1, extraData = {
            surveyId: surveyId,
            question: {
                id: questionId,
                index: index,
                isRequired: !!questionObj.required
            }
        };
        questionObj.checks && (extraData.question.checks = questionObj.checks);
        let answersHTML = generateAnswers(questionObj.answers, extraData, options);
        const maxChoice = questionObj.checks ? JSON.parse(questionObj.checks) : "", checksMin = maxChoice[0] || "", checksMax = maxChoice[1] || "", maxChoiceText = maxChoice && options.messages.maxChoice ? " (" + checksMax + " " + options.messages.maxChoice + ")" : "", questionData = {
            questionId: questionId,
            questionNumber: questionNumber,
            questionText: questionObj.question + maxChoiceText,
            answersHTML: answersHTML,
            errorsHTML: options.fieldErrorFeedback ? options.templates.wrapper.errors : ""
        };
        if (qaHtml = replaceObjectKeysInString(questionData, qaHtml), options.fieldErrorFeedback) {
            let errorMessage = "" !== maxChoice ? options.messages.errorMessageMultiChoice : questionObj.errorMessage || options.messages.errorMessage;
            isPlainObject$1(errorMessage) && (errorMessage = ""), qaHtml = qaHtml.replace(/{{errorTemplates}}/g, errorMessage);
        }
        return accCode + replaceObjectKeysInString({
            checksMin: checksMin,
            checksMax: checksMax
        }, qaHtml);
    }, ""))(data.questions, data.id, options);
    formEl.querySelector("[data-surveyjs-body]").insertAdjacentHTML("beforeend", qaHtmlAll);
    const extQuestion = data.questions.filter(obj => obj.external)[0];
    if (extQuestion) {
        const externalCont = formEl.closest("[data-surveyjs-wrapper]").querySelector("[data-surveyjs-external]");
        externalCont.setAttribute("data-question-id", extQuestion.id), extQuestion.answers.forEach((answer, index) => {
            const externalField = externalCont.querySelectorAll("[data-field]")[index], fieldProps = {
                id: `${answer.type}-${data.id}-${extQuestion.id}-${answer.id}`,
                type: answer.type,
                value: answer.value,
                required: !!extQuestion.required
            };
            Object.keys(fieldProps).forEach(name => {
                externalField[name] = fieldProps[name];
            });
            const answerCont = externalField.closest("[data-answer]");
            answerCont.querySelector("label").setAttribute("for", fieldProps.id), answerCont.querySelector("[data-label]").innerHTML = answer.label, 
            externalCont.querySelector("[data-question]").innerHTML = extQuestion.question;
        });
    }
};

class Survey extends Form {
    constructor(formEl, optionsObj = {}) {
        if (!optionsObj.url || "string" != typeof optionsObj.url) throw new Error('"options.url" is missing or not a string!');
        const options = mergeObjects({}, Survey.prototype.options, optionsObj);
        webStorage().isAvailable || (options.useWebStorage = !1), super(formEl, options);
        const self = this;
        self.internals = internals, self.formEl.querySelector("[data-surveyjs-body]").insertAdjacentHTML("beforebegin", self.options.templates.loading);
        const retrieveSurvey = ((url = location.href, options = {}) => {
            let timeoutTimer;
            if (options.headers = new Headers(options.headers), options.timeout > 0) {
                const controller = new AbortController, signal = controller.signal;
                options.signal = signal, timeoutTimer = window.setTimeout(() => {
                    controller.abort();
                }, options.timeout);
            }
            return fetch(url, options).then(response => response.ok ? response.json() : Promise.reject(response)).catch(error => Promise.reject(error)).finally(() => {
                timeoutTimer && window.clearTimeout(timeoutTimer);
            });
        })(self.options.url, self.options.initAjaxOptions).then(response => "success" !== response.status.toLowerCase() ? Promise.reject(response) : new Promise(resolve => {
            self.data = response.data, self.data.questions && self.data.questions.length > 0 ? (buildSurvey(self.data, self.formEl, self.options, self.internals), 
            self.options.useWebStorage && ((formEl, internals) => {
                const WS = sessionStorage.getObject(internals.storageName);
                if (WS) {
                    const surveyContEl = formEl.closest("[data-surveyjs-wrapper]");
                    internals.storageArray = WS, WS.forEach(item => {
                        const fieldFirst = surveyContEl.querySelector('[name="' + item.name + '"]'), isRadioOrCheckbox = fieldFirst.matches('[type="radio"], [type="checkbox"]'), fieldEl = isRadioOrCheckbox ? surveyContEl.querySelector('[name="' + item.name + '"][value="' + item.value + '"]') : fieldFirst;
                        isRadioOrCheckbox ? fieldEl.checked = !0 : fieldEl.value = item.value;
                    });
                }
            })(self.formEl, self.internals), deepFreeze(self.data), self.formEl.addEventListener("fjs.field:validation", validationEnd), 
            self.formEl.addEventListener("fjs.form:submit", submit), super.init().then(() => {
                self.isInitialized = !0, self.formEl.closest("[data-surveyjs-wrapper]").classList.add("surveyjs-init-success"), 
                resolve(response);
            })) : resolve(response);
        })).finally(() => {
            const loadingBoxEl = self.formEl.querySelector("[data-surveyjs-loading]");
            loadingBoxEl && loadingBoxEl.parentNode.removeChild(loadingBoxEl);
        });
        ((elem, eventName, data = {}, eventOptions = {}) => {
            eventOptions = mergeObjects({}, {
                bubbles: !0
            }, eventOptions);
            const eventObj = new Event(eventName, eventOptions);
            eventObj.data = data, elem.dispatchEvent(eventObj);
        })(self.formEl, customEvents_init, retrieveSurvey);
    }
    destroy() {
        var formEl;
        (formEl = this.formEl).removeEventListener("fjs.field:validation", validationEnd), 
        formEl.removeEventListener("fjs.form:submit", submit), super.destroy();
    }
    static setOptions(optionsObj) {
        Survey.prototype.options = mergeObjects({}, Survey.prototype.options, optionsObj);
    }
}

Survey.prototype.isInitialized = !1, Survey.prototype.options = options, Survey.prototype.version = "3.0.0";

export default Survey;
