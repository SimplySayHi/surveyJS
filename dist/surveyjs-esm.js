/* surveyJS v3.0.0 | Valerio Di Punzio (@SimplySayHi) | https://www.valeriodipunzio.com/plugins/surveyJS/ | https://github.com/SimplySayHi/surveyJS | MIT license */
import Form from "formjs-plugin";

const customEvents_init = "sjs:init", deepFreeze = obj => (Object.getOwnPropertyNames(obj).forEach(name => {
    const prop = obj[name];
    "object" == typeof prop && null !== prop && deepFreeze(prop);
}), Object.freeze(obj)), isPlainObject = object => "[object Object]" === Object.prototype.toString.call(object), mergeObjects = function(out = {}) {
    return Array.from(arguments).slice(1).filter(arg => !!arg).forEach(arg => {
        Object.keys(arg).forEach(key => {
            Array.isArray(arg[key]) ? out[key] = (out[key] || []).concat(arg[key].slice(0)) : isPlainObject(arg[key]) ? out[key] = mergeObjects(out[key] || {}, arg[key]) : Array.isArray(out[key]) ? out[key].push(arg[key]) : out[key] = arg[key];
        });
    }), out;
}, fieldsStringSelectorSurvey = '[data-surveyjs-form] input:not([type="reset"]):not([type="submit"]):not([type="button"]), [data-surveyjs-form] select, [data-surveyjs-form] textarea, [data-name="bind-surveyjs-answer"]', isEmptyObject = object => isPlainObject(object) && 0 === Object.getOwnPropertyNames(object).length, replaceObjectKeysInString = (obj, stringHTML) => Object.keys(obj).reduce((accString, name) => {
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
}, defaultCallbacksInOptions = {
    formOptions: {
        beforeSend: function(data) {
            let isHacking = !1;
            const instance = this, surveyContEl = instance.formEl.closest("[data-surveyjs-container]"), fieldsList = Array.from(surveyContEl.querySelectorAll(fieldsStringSelectorSurvey));
            let fieldNameCheck = "", fieldTypeCheck = "";
            if (fieldsList.forEach(fieldEl => {
                const type = fieldEl.type, name = fieldEl.name;
                if (name === fieldNameCheck && type === fieldTypeCheck) return;
                fieldEl.matches("[data-required-from]") || (fieldNameCheck = name, fieldTypeCheck = type);
                const questionEl = fieldEl.closest("[data-question-id]"), questionId = questionEl ? questionEl.getAttribute("data-question-id") : "", questionObj = getQuestionObject(instance.data, questionId);
                if ("" !== questionId && questionObj && questionObj.required) {
                    const isRequiredFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = document.querySelector(fieldEl.getAttribute("data-required-from"));
                    (!isRequiredFrom || isRequiredFrom && reqMoreEl.checked) && (fieldEl.required || (isHacking = !0), 
                    fieldEl.required = !0);
                }
            }), isHacking) {
                const fieldOptions = mergeObjects({}, instance.options.fieldOptions, {
                    focusOnRelated: !1
                });
                return instance.validateForm(fieldOptions).then(formRes => (data.stopExecution = !0, 
                data));
            }
            return data;
        },
        getFormData: function() {
            const formEl = this.formEl, instance = formEl.formjs, fieldsList = Array.from(formEl.closest("[data-surveyjs-container]").querySelectorAll(fieldsStringSelectorSurvey)), obj = {
                answers: [],
                id: instance.data.id
            };
            let fieldNameCheck = "", fieldTypeCheck = "";
            return fieldsList.forEach(fieldEl => {
                const type = fieldEl.type, name = fieldEl.name;
                if (name === fieldNameCheck && type === fieldTypeCheck) return;
                fieldEl.matches("[data-required-from]") || (fieldNameCheck = name, fieldTypeCheck = type);
                const questionEl = fieldEl.closest("[data-question-id]"), questionId = questionEl ? questionEl.getAttribute("data-question-id") : "", qaObj = {
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
    messages: {
        maxChoice: "ANSWERS MAX",
        fieldErrorMessage: "Answer is necessary.",
        fieldErrorMessageMultiChoice: "You must choose from {{checksMin}} to {{checksMax}} answers."
    },
    templates: {
        fieldError: '<div class="surveyjs-field-error-message">{{fieldErrorMessage}}</div>',
        input: '<input {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-input surveyjs-{{answerType}} {{fieldClasses}}" />',
        label: '<label for="{{answerCode}}" class="surveyjs-label {{labelClasses}}">{{labelString}}</label>',
        loading: '<div class="surveyjs-loading" data-surveyjs-loading>Loading...</div>',
        question: '<div data-question-id="{{questionId}}" data-formjs-question class="surveyjs-question-box clearfix"><div class="surveyjs-question-header">Question {{questionNumber}}</div><div class="surveyjs-question-body"><div class="surveyjs-question-text">{{questionText}}</div><div class="surveyjs-answers-box form-group clearfix">{{answersHTML}}{{fieldErrorTemplate}}</div></div></div>',
        select: '<select {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}{{addMoreName}}" class="surveyjs-select {{fieldClasses}}">{{optionsHtml}}</select>',
        textarea: '<textarea {{fieldAttributes}} name="surveyjs-answer-{{questionNumber}}" class="surveyjs-textarea {{fieldClasses}}"></textarea>',
        wrapper: {
            default: '<div class="surveyjs-single-answer surveyjs-field-container surveyjs-answer-{{answerType}} {{wrapperClasses}}">{{fieldTemplate}}{{labelTemplate}}</div>',
            nested: '<div class="surveyjs-nested-parent surveyjs-single-answer surveyjs-field-container surveyjs-answer-{{answerType}}">{{labelTemplate}}<div class="surveyjs-nested-container surveyjs-field-indent">{{nestedFieldsHTML}}</div></div>',
            related: '<div class="surveyjs-single-answer surveyjs-field-container input-group {{wrapperClasses}}"><div class="input-group-prepend"><div class="input-group-text form-check surveyjs-answer-radio">{{fieldTemplate}}{{labelTemplate}}</div></div>{{relatedFieldHTML}}</div>'
        }
    },
    useWebStorage: !0
}, internals = {
    storageArray: [],
    storageName: "Survey_" + location.href + "_{{surveyFormName}}_surveyId[{{surveyId}}]"
}, getAnswerIndexInWebStorage = (internals, fieldName, multiChoiceValue = "") => {
    const wsSurvey = sessionStorage.getObject(internals.storageName);
    if (wsSurvey) {
        const wsSurveyLength = wsSurvey.length;
        for (let ws = 0; ws < wsSurveyLength; ws++) {
            const lsItem = wsSurvey[ws];
            if (lsItem.field === fieldName) {
                if (multiChoiceValue && lsItem.value !== multiChoiceValue) continue;
                return ws;
            }
        }
    }
    return -1;
}, callbackFns_submit = function(event) {
    const self = event.target.formjs;
    event.data.then(() => {
        self.options.useWebStorage && sessionStorage.removeItem(self.internals.storageName);
    });
}, callbackFns_validation = function(event) {
    const eventName = event.type, fieldEl = event.target, self = fieldEl.closest("form").formjs, internals = self.internals, containerEl = fieldEl.closest(self.options.fieldOptions.questionContainer), fieldValue = fieldEl.value, isMultiChoice = fieldEl.matches("[data-checks]"), isRequireMore = fieldEl.matches("[data-require-more]"), isRequiredFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = isRequiredFrom ? containerEl.querySelector(fieldEl.getAttribute("data-required-from")) : null, itemEl = isRequiredFrom ? reqMoreEl : fieldEl, questionId = itemEl.id ? itemEl.id.split("-")[2] : "id-not-found", isFieldForChangeEventBoolean = (fieldEl => fieldEl.matches('select, [type="radio"], [type="checkbox"], [type="file"]'))(fieldEl), questionObj = getQuestionObject(self.data, questionId);
    if (isEmptyObject(questionObj)) return !0;
    if (isFieldForChangeEventBoolean && "change" === eventName || !isFieldForChangeEventBoolean && "change" !== eventName) {
        if (self.options.useWebStorage && !fieldEl.matches("[data-exclude-storage]")) {
            const inArrayPos = getAnswerIndexInWebStorage(internals, fieldEl.name, !!isMultiChoice && fieldValue), inArrayRequireMorePos = getAnswerIndexInWebStorage(internals, fieldEl.name + "-more");
            let storageArray = internals.storageArray;
            if (isRequireMore || isRequiredFrom || -1 === inArrayRequireMorePos || storageArray.splice(inArrayRequireMorePos, 1), 
            -1 !== inArrayPos) isMultiChoice ? fieldEl.checked || storageArray[inArrayPos].value !== fieldValue ? storageArray.push({
                field: fieldEl.name,
                value: fieldValue
            }) : storageArray.splice(inArrayPos, 1) : "" !== fieldValue ? storageArray[inArrayPos].value = fieldValue : storageArray.splice(inArrayPos, 1); else if ("" !== fieldValue) {
                if (isRequiredFrom && "" !== fieldValue) {
                    const oldFieldNamePos = getAnswerIndexInWebStorage(internals, reqMoreEl.name);
                    -1 !== oldFieldNamePos && storageArray.splice(oldFieldNamePos, 1), storageArray.push({
                        field: reqMoreEl.name,
                        value: reqMoreEl.value
                    });
                }
                if (storageArray.push({
                    field: fieldEl.name,
                    value: fieldValue
                }), isRequireMore) {
                    const elReqFromEl = fieldEl.closest("form").querySelector('[data-required-from="#' + fieldEl.id + '"]');
                    storageArray.push({
                        field: elReqFromEl.name,
                        value: elReqFromEl.value
                    });
                }
            }
            sessionStorage.setObject(internals.storageName, storageArray);
        }
        void 0 !== questionObj.required && (fieldEl.required = !0);
    }
}, generateOptionTags = (optionsList = []) => sortList(optionsList).reduce((optionsHTML, opt) => optionsHTML + `<option value="${opt.value}">${opt.label}</option>`, ""), getAttributesStringHTML = (answerObj, answerCode, isRequired) => {
    const excludedAttrs = [ "data", "id", "label", "nested", "related", "sort" ];
    /^(option|textarea)$/.test(answerObj.type) && excludedAttrs.push("type");
    let string = "";
    return Object.keys(answerObj).filter(name => -1 === excludedAttrs.indexOf(name)).forEach(name => {
        string += ` ${name}="${answerObj[name]}"`;
    }), answerObj.data && Object.keys(answerObj.data).forEach(name => {
        string += ` data-${((string = "", useAllCaps = !1) => {
            let newString = string.trim().replace(/(([_ ])([a-z]))|(([a-z])?([A-Z]))/g, (match, p1, p2, p3, p4, p5, p6) => (p3 ? "-" + p3 : (p5 || "") + "-" + p6).toLowerCase());
            return useAllCaps ? newString.toUpperCase() : newString;
        })(name)}="${answerObj.data[name]}"`;
    }), isRequired && (string += " required"), answerObj.related && (string += " data-require-more"), 
    string += ` id="${answerCode}"`, string += ` data-answer-id="${answerObj.id}"`, 
    string.trim();
}, generateAnswers = (options, answersList, extraData) => {
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
            relatedObj.type = relatedIsSelect ? "option" : relatedType, relatedObj.id = answer.id + "-more", 
            relatedObj.data = mergeObjects({}, relatedObj.data, {
                requiredFrom: "#" + answerCode
            }), delete relatedObj.related;
            const answerDataRelated = {
                fieldAttributes: getAttributesStringHTML(relatedObj, answerCode + "-more", !1),
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
        const answerTypeForTemplate = answer.related ? "related" : answer.nested ? "nested" : answerType, templates = ((templates, answerType) => ({
            field: templates[answerType] || templates.input,
            label: /^(checkbox|nested|radio|related)$/.test(answerType) ? templates.label : "",
            wrapper: templates.wrapper[answerType] || templates.wrapper.default
        }))(options.templates, answerTypeForTemplate);
        let nestedFieldsHTML = "";
        answer.nested && (nestedFieldsHTML = generateAnswers(options, answer.nested, extraData));
        let optionsHtml = "";
        "select" === answerType && (optionsHtml = generateOptionTags(answersList)), answerHTML = templates.wrapper.replace("{{relatedFieldHTML}}", relatedFieldHTML).replace("{{fieldTemplate}}", templates.field).replace("{{optionsHtml}}", optionsHtml).replace("{{labelTemplate}}", templates.label).replace("{{nestedFieldsHTML}}", nestedFieldsHTML), 
        allAnswersHTML += replaceObjectKeysInString(answerData, answerHTML);
    }), allAnswersHTML;
}, buildSurvey = (formEl, options, internals, data) => {
    const formName = formEl.getAttribute("name") || "";
    internals.storageName = internals.storageName.replace(/{{surveyId}}/, data.id), 
    internals.storageName = internals.storageName.replace(/{{surveyFormName}}/, formName);
    const qaHtmlAll = ((formEl, options, surveyData) => {
        const questionsList = sortList(surveyData.questions), qaDataLength = questionsList.length;
        let qaCodeAll = "";
        for (let i = 0; i < qaDataLength; i++) {
            const questionObj = questionsList[i];
            let qaHtml = options.templates.question;
            const questionId = questionObj.id, questionNumber = i + 1, extraData = {
                surveyId: surveyData.id,
                question: {
                    id: questionId,
                    index: i,
                    isRequired: !!questionObj.required
                }
            };
            questionObj.checks && (extraData.question.checks = questionObj.checks);
            let answersHTML = generateAnswers(options, questionObj.answers, extraData);
            if (questionObj.external) {
                const externalCont = formEl.closest("[data-surveyjs-container]").querySelector("[data-surveyjs-external]");
                externalCont.setAttribute("data-question-id", questionId), questionObj.answers.forEach((answer, index) => {
                    const bindAnswerEl = externalCont.querySelectorAll("[data-field]")[index], fieldProps = {
                        id: `${answer.type}-${extraData.surveyId}-${questionId}-${answer.id}`,
                        name: `${bindAnswerEl.name}${questionNumber}`,
                        type: answer.type,
                        value: answer.value,
                        required: !!questionObj.required
                    };
                    Object.keys(fieldProps).forEach(name => {
                        bindAnswerEl[name] = fieldProps[name];
                    }), bindAnswerEl.setAttribute("data-answer-id", answer.id);
                    const answerCont = bindAnswerEl.closest("[data-answer]");
                    answerCont.querySelector("label").setAttribute("for", fieldProps.id), answerCont.querySelector("[data-label]").innerHTML = answer.label, 
                    externalCont.querySelector("[data-question]").innerHTML = questionObj.question;
                });
                continue;
            }
            const maxChoice = questionObj.checks ? JSON.parse(questionObj.checks) : "", checksMin = maxChoice[0] || "", checksMax = maxChoice[1] || "", maxChoiceText = maxChoice && options.maxChoice ? " (" + checksMax + " " + options.maxChoice + ")" : "", questionData = {
                questionId: questionId,
                questionNumber: questionNumber,
                questionText: questionObj.question + maxChoiceText,
                answersHTML: answersHTML,
                fieldErrorTemplate: options.fieldErrorFeedback ? options.templates.fieldError : ""
            };
            if (qaHtml = replaceObjectKeysInString(questionData, qaHtml), options.fieldErrorFeedback && -1 !== options.templates.fieldError.indexOf("{{fieldErrorMessage}}")) {
                const fieldErrorMessage = "" !== maxChoice ? options.fieldErrorMessageMultiChoice : questionObj.errorMessage || options.fieldErrorMessage;
                qaHtml = qaHtml.replace(/{{fieldErrorMessage}}/g, fieldErrorMessage);
            }
            qaCodeAll += replaceObjectKeysInString({
                checksMin: checksMin,
                checksMax: checksMax
            }, qaHtml);
        }
        return qaCodeAll;
    })(formEl, options, data);
    formEl.querySelector("[data-surveyjs-body]").insertAdjacentHTML("beforeend", qaHtmlAll), 
    options.useWebStorage && ((formEl, internals) => {
        const WS = sessionStorage.getObject(internals.storageName);
        if (WS) {
            const surveyContEl = formEl.closest("[data-surveyjs-container]");
            internals.storageArray = WS, WS.forEach(item => {
                const fieldFirst = surveyContEl.querySelector('[name="' + item.field + '"]'), isRadioOrCheckbox = fieldFirst.matches('[type="radio"], [type="checkbox"]'), fieldEl = isRadioOrCheckbox ? surveyContEl.querySelector('[name="' + item.field + '"][value="' + item.value + '"]') : fieldFirst;
                isRadioOrCheckbox ? fieldEl.checked = !0 : fieldEl.value = item.value;
            });
        }
    })(formEl, internals);
};

class Survey extends Form {
    constructor(formEl, optionsObj = {}) {
        if (!optionsObj.url || "string" != typeof optionsObj.url) throw new Error('"options.url" is missing or not a string!');
        const options = mergeObjects({}, Survey.prototype.options, optionsObj);
        webStorage().isAvailable || (options.useWebStorage = !1), super(formEl, options);
        const self = this;
        self.internals = internals, self.options.fieldOptions.validateOnEvents.split(" ").forEach(eventName => {
            const useCapturing = "blur" === eventName;
            self.formEl.addEventListener(eventName, callbackFns_validation, useCapturing);
        }), self.formEl.addEventListener("fjs.form:submit", callbackFns_submit), self.formEl.querySelector("[data-surveyjs-body]").insertAdjacentHTML("beforebegin", self.options.templates.loading);
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
            response.data.questions && response.data.questions.length > 0 ? (buildSurvey(self.formEl, self.options, self.internals, response.data), 
            super.init().then(() => {
                self.isInitialized = !0, self.data = response.data, deepFreeze(self.data), self.formEl.closest("[data-surveyjs-container]").classList.add("surveyjs-init-success"), 
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
        (formEl = this.formEl).formjs.options.fieldOptions.validateOnEvents.split(" ").forEach(eventName => {
            const useCapturing = "blur" === eventName;
            formEl.removeEventListener(eventName, callbackFns_validation, useCapturing);
        }), formEl.removeEventListener("fjs.form:submit", callbackFns_submit), super.destroy();
    }
    static setOptions(optionsObj) {
        Survey.prototype.options = mergeObjects({}, Survey.prototype.options, optionsObj);
    }
}

Survey.prototype.isInitialized = !1, Survey.prototype.options = options, Survey.prototype.version = "3.0.0";

export default Survey;
