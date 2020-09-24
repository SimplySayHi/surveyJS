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
}, fieldsStringSelectorSurvey = '[data-surveyjs-form] input:not([type="reset"]):not([type="submit"]):not([type="button"]), [data-surveyjs-form] select, [data-surveyjs-form] textarea, [data-name="bind-surveyjs-answer"]', isEmptyObject = object => isPlainObject(object) && 0 === Object.getOwnPropertyNames(object).length, webStorage = () => {
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
                const questionIdEl = fieldEl.closest("[data-question-id]"), questionId = questionIdEl ? questionIdEl.getAttribute("data-question-id") : "", questionObj = getQuestionObject(instance.data, questionId);
                if ("" !== questionId && questionObj && void 0 !== questionObj.required) {
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
                const questionIdEl = fieldEl.closest("[data-question-id]"), questionId = questionIdEl ? questionIdEl.getAttribute("data-question-id") : "", fieldValue = fieldEl.value, qaObj = {
                    question: questionId,
                    answer: {
                        id_answer: [ fieldValue ]
                    }
                };
                if (!fieldEl.matches("[data-required-from]") && "" !== questionId && !isEmptyObject(getQuestionObject(instance.data, questionId))) {
                    if (fieldEl.matches("textarea") && (qaObj.answer.id_answer = [ "" ], qaObj.answer.text = fieldValue), 
                    "radio" === type) {
                        const elem = (fieldEl.closest("form") ? formEl : fieldEl.closest("[data-formjs-question]")).querySelector('[name="' + name + '"]:checked');
                        elem ? (elem.matches("[data-require-more]") && (qaObj.answer.attributes = formEl.querySelector('[data-required-from="#' + elem.id + '"]').value.trim()), 
                        elem.matches("[data-nested-index]") && (qaObj.answer.attributes = elem.getAttribute("data-nested-index")), 
                        qaObj.answer.id_answer = [ elem.value.trim() ]) : qaObj.answer.id_answer = [ "" ];
                    }
                    "checkbox" === type && fieldEl.matches("[data-checks]") && (qaObj.answer.id_answer = [], 
                    Array.from(formEl.querySelectorAll('[name="' + name + '"]:checked')).forEach(el => {
                        qaObj.answer.id_answer.push(el.value.trim());
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
}, callbackFns_validation = function(event) {
    const eventName = event.type, fieldEl = event.target, self = fieldEl.closest("form").formjs, internals = self.internals, containerEl = fieldEl.closest("[data-formjs-question]"), fieldValue = fieldEl.value ? fieldEl.value.trim() : fieldEl.value, isMultiChoice = fieldEl.matches("[data-checks]"), isRequireMore = fieldEl.matches("[data-require-more]"), isRequiredFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = isRequiredFrom ? containerEl.querySelector(fieldEl.getAttribute("data-required-from")) : null, itemEl = isRequiredFrom ? reqMoreEl : fieldEl, questionId = itemEl.id ? itemEl.id.split("-")[1] : "id-not-found", isFieldForChangeEventBoolean = (fieldEl => fieldEl.matches('select, [type="radio"], [type="checkbox"], [type="file"]'))(fieldEl), questionObj = getQuestionObject(self.data, questionId);
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
                        value: reqMoreEl.value.trim()
                    });
                }
                if (storageArray.push({
                    field: fieldEl.name,
                    value: fieldValue
                }), isRequireMore) {
                    const elReqFromEl = fieldEl.closest("form").querySelector('[data-required-from="#' + fieldEl.id + '"]');
                    storageArray.push({
                        field: elReqFromEl.name,
                        value: elReqFromEl.value.trim()
                    });
                }
            }
            sessionStorage.setObject(internals.storageName, storageArray);
        }
        void 0 !== questionObj.required && (fieldEl.required = !0);
    }
}, generateOptionTags = (optionsList = [], options) => {
    let optionsHtml = "" === optionsList[0].id ? "" : '<option value="">' + options.selectFirstOption + "</option>";
    return optionsList.forEach(opt => {
        optionsHtml += '<option value="' + opt.id + '" data-answer-id="' + opt.id + '">' + opt.answer + "</option>";
    }), optionsHtml;
}, generateFieldHTML = {
    attribute: (options, data) => {
        const objData = data.objData, aHtml = options.templates.inputGroup, attr = data.answer.attribute, attributeIsArray = Array.isArray(attr), relatedAnswerField = attributeIsArray ? options.templates.selectTag : options.templates.inputTag;
        return objData.fieldClass = options.cssClasses.default, attributeIsArray && (objData.fieldClass = options.cssClasses.select, 
        objData.optionsHtml = generateOptionTags(attr, options)), {
            aHtml: aHtml,
            relatedAnswerField: relatedAnswerField,
            objData: objData
        };
    },
    input: (options, data) => {
        const objData = data.objData, aHtml = data.beforeCode + options.templates.input + data.afterCode;
        return "checkbox" !== objData.answerType && "radio" !== objData.answerType && (objData.nestedAnswer += ' class="' + objData.fieldClass + '"'), 
        {
            aHtml: aHtml,
            objData: objData
        };
    },
    nested: (options, data) => {
        const objData = data.objData;
        let labelForNested = options.templates.labelTag;
        labelForNested = labelForNested.replace(/{{answerCode}}/g, objData.answerCode), 
        labelForNested = labelForNested.replace(/{{labelClass}}/g, options.cssClasses.label + " surveyjs-field-indent-0"), 
        labelForNested = labelForNested.replace(/{{answerString}}/g, data.answer.answer);
        return {
            aHtml: data.beforeCode + '<div class="surveyjs-' + objData.answerType + '">' + labelForNested + "</div>" + data.afterCode,
            objData: objData
        };
    },
    select: (options, data) => {
        const objData = data.objData, aHtml = data.beforeCode + options.templates.select + data.afterCode;
        return objData.optionsHtml = generateOptionTags(data.obj.answers, options), {
            aHtml: aHtml,
            objData: objData
        };
    },
    textarea: (options, data) => {
        const objData = data.objData, aHtml = options.templates.textarea;
        return objData.answerPlaceholder = data.answer.placeholder || options.textareaPlaceholder, 
        {
            aHtml: aHtml,
            objData: objData
        };
    }
}, replaceTemplateStrings = (options, fieldData, objData) => {
    if ("" !== objData.optionsHtml && (fieldData.aHtml = fieldData.aHtml.replace(/{{selectTagCode}}/g, options.templates.selectTag)), 
    fieldData.relatedAnswerField) {
        const relatedAnswerKeys = {
            answerCode: "",
            answerType: "text",
            fieldClass: objData.fieldClass,
            answerIdValue: "",
            attrRequired: "",
            addMoreName: "-more",
            attrRequiredFrom: 'data-required-from="#' + objData.answerCode + '"'
        };
        for (let reKey in relatedAnswerKeys) {
            const regexStrRe = new RegExp("{{" + reKey + "}}", "g");
            fieldData.relatedAnswerField = fieldData.relatedAnswerField.replace(regexStrRe, relatedAnswerKeys[reKey]);
        }
        fieldData.aHtml = fieldData.aHtml.replace(/{{relatedAnswerField}}/g, fieldData.relatedAnswerField);
    } else fieldData.aHtml = fieldData.aHtml.replace(/{{addMoreName}}/g, ""), fieldData.aHtml = fieldData.aHtml.replace(/{{attrRequiredFrom}}/g, "");
    for (let key in objData) {
        const regexStr = new RegExp("{{" + key + "}}", "g");
        fieldData.aHtml = fieldData.aHtml.replace(regexStr, objData[key]);
    }
    return fieldData.aHtml;
};

let progIds = [];

const iterateAnswers = (formEl, options, obj, qID, qIdx, attrReq) => {
    qID = obj.id ? obj.id : qID || 0;
    let list = Array.isArray(obj) ? obj : obj.answers, listL = list.length, i = qIdx || 0, aLoopHtml = "";
    const needsBinding = "hidden-privacy" === obj.question;
    list[0].sort && list.sort((a, b) => a.sort > b.sort);
    for (let a = 0; a < listL; a++) {
        let answer = list[a], aNum = a + 1, qNum = i + 1, aType = answer.type, aId = answer.id, progIdsLength = progIds.length, progIdsJoined = progIdsLength > 0 ? progIds.join("-") : "", getSettingsFieldClass = () => {
            let aType = "option" === answer.type ? "select" : answer.type;
            return options.cssClasses[aType] || options.cssClasses.default;
        }, fieldData = {
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
            fieldClass: getSettingsFieldClass(),
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
            const boundedFieldEl = formEl.closest("[data-surveyjs-container]").querySelectorAll('[data-name="bind-surveyjs-answer"]')[a], fieldProps = {
                id: objData.answerCode,
                name: objData.answerName,
                type: aType,
                value: objData.answerId
            };
            void 0 !== obj.required && (fieldProps.required = !0);
            for (let key in fieldProps) boundedFieldEl[key] = fieldProps[key];
            boundedFieldEl.setAttribute("data-answer-id", objData.answerId), boundedFieldEl.closest("div").querySelector("label").setAttribute("for", objData.answerCode), 
            boundedFieldEl.closest("div").querySelector("label span").textContent = answer.answer;
        } else {
            if ("string" == typeof answer.answer || "number" == typeof answer.answer) {
                let surveyFieldType = answer.attribute ? "attribute" : answer.nested ? "nested" : "option" === aType ? "select" : aType, data = {
                    answer: answer,
                    objData: objData,
                    beforeCode: progIdsLength > 0 && 0 === a ? '<div class="surveyjs-field-indent">' : "",
                    afterCode: progIdsLength > 0 && a === listL - 1 ? "</div>" : "",
                    obj: obj
                };
                if (void 0 === generateFieldHTML[surveyFieldType] && (surveyFieldType = "input"), 
                fieldData = generateFieldHTML[surveyFieldType](options, data), objData = fieldData.objData, 
                answer.nested) {
                    progIds.push(aNum), aLoopHtml += fieldData.aHtml, aLoopHtml += iterateAnswers(formEl, options, answer.nested, qID, i, objData.attrRequired);
                    continue;
                }
                progIdsLength > 0 && a === listL - 1 && progIds.pop();
            }
            fieldData.aHtml = replaceTemplateStrings(options, fieldData, objData), aLoopHtml += fieldData.aHtml, 
            "option" === aType && (a += obj.answers.length);
        }
    }
    return aLoopHtml;
}, buildSurvey = (formEl, options, internals, data) => {
    const self = formEl.formjs, formName = formEl.getAttribute("name") || "";
    self.internals.storageName = internals.storageName.replace(/{{surveyId}}/g, data.id), 
    self.internals.storageName = internals.storageName.replace(/{{surveyFormName}}/g, formName);
    ((HTMLstring, parentNode) => {
        const tmpEl = document.createElement("div");
        tmpEl.innerHTML = HTMLstring, Array.from(tmpEl.childNodes).forEach(elem => {
            parentNode.appendChild(elem);
        });
    })(((formEl, options, questionsList = []) => {
        const qaData = questionsList[0].sort ? questionsList.sort((a, b) => a.sort > b.sort) : questionsList, qaDataLength = qaData.length;
        let qaCodeAll = "";
        for (let i = 0; i < qaDataLength; i++) {
            const item = qaData[i];
            let qaHtml = options.templates.question, answersHtml = iterateAnswers(formEl, options, item, item.id, i);
            if ("hidden-privacy" === item.question) {
                const bindAnswerEl = formEl.closest("[data-surveyjs-container]").querySelector('[data-name="bind-surveyjs-answer"]');
                if (bindAnswerEl) {
                    bindAnswerEl.closest("[data-formjs-question]").setAttribute("data-question-id", item.id);
                    continue;
                }
            }
            const maxChoice = item.checks ? JSON.parse(item.checks) : "", checksMin = maxChoice.length > 0 ? maxChoice[0] : "", checksMax = maxChoice.length > 0 ? maxChoice[1] : "", maxChoiceText = "" !== maxChoice ? " (" + checksMax + " " + options.maxChoiceText + ")" : "", questionText = item.question + maxChoiceText, fieldErrorTemplate = options.fieldErrorFeedback ? options.templates.fieldError : "";
            if (qaHtml = qaHtml.replace(/{{questionId}}/g, item.id), qaHtml = qaHtml.replace(/{{questionNumber}}/g, i + 1), 
            qaHtml = qaHtml.replace(/{{questionText}}/g, questionText), qaHtml = qaHtml.replace(/{{answersHtml}}/g, answersHtml), 
            qaHtml = qaHtml.replace(/{{fieldErrorTemplate}}/g, fieldErrorTemplate), options.fieldErrorFeedback && -1 !== options.templates.fieldError.indexOf("{{fieldErrorMessage}}")) {
                const fieldErrorMessage = "" !== maxChoice ? options.fieldErrorMessageMultiChoice : options.fieldErrorMessage;
                qaHtml = qaHtml.replace(/{{fieldErrorMessage}}/g, fieldErrorMessage).replace(/{{checksMin}}/g, checksMin).replace(/{{checksMax}}/g, checksMax);
            }
            qaCodeAll += qaHtml;
        }
        return qaCodeAll;
    })(formEl, options, data.questions), formEl.querySelector("[data-surveyjs-body]")), 
    options.useWebStorage && ((formEl, internals) => {
        const WS = sessionStorage.getObject(internals.storageName);
        if (WS) {
            const surveyContEl = formEl.closest("[data-surveyjs-container]");
            internals.storageArray = WS, WS.forEach(item => {
                const fieldFirst = surveyContEl.querySelector('[name="' + item.field + '"]'), isRadioOrCheckbox = fieldFirst.matches('[type="radio"], [type="checkbox"]'), fieldEl = isRadioOrCheckbox ? surveyContEl.querySelector('[name="' + item.field + '"][value="' + item.value + '"]') : fieldFirst;
                isRadioOrCheckbox ? fieldEl.checked = !0 : fieldEl.value = item.value;
            });
        }
    })(formEl, self.internals);
};

class Survey extends Form {
    constructor(formEl, optionsObj = {}) {
        if (!optionsObj.url || "string" != typeof optionsObj.url) throw new Error('"options.url" is missing or not a string!');
        const customLang = "string" == typeof optionsObj.lang && optionsObj.lang.toLowerCase(), langValue = customLang && Survey.prototype.messages[customLang] ? customLang : Survey.prototype.options.lang, options = mergeObjects({}, Survey.prototype.options, Survey.prototype.messages[langValue], optionsObj);
        -1 !== options.templates.input.indexOf("{{inputTagCode}}") && (options.templates.input = options.templates.input.replace(/{{inputTagCode}}/g, options.templates.inputTag)), 
        options.templates.labelTag = options.templates.labelTag.replace(/{{labelClass}}/g, options.cssClasses.label), 
        webStorage().isAvailable || (options.useWebStorage = !1), super(formEl, options);
        const self = this;
        self.internals = internals, self.options.fieldOptions.validateOnEvents.split(" ").forEach(eventName => {
            const useCapturing = "blur" === eventName;
            self.formEl.addEventListener(eventName, callbackFns_validation, useCapturing);
        }), self.formEl.addEventListener("fjs.form:submit", event => {
            event.data.then(() => {
                self.options.useWebStorage && sessionStorage.removeItem(self.internals.storageName);
            });
        }), self.formEl.querySelector("[data-surveyjs-body]").insertAdjacentHTML("beforebegin", self.options.loadingBox);
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
        }), super.destroy();
    }
    static addLanguage(langString, langObject) {
        const langValue = langString.toLowerCase();
        Survey.prototype.messages[langValue] = mergeObjects({}, Survey.prototype.messages[langValue], langObject);
    }
    static setOptions(optionsObj) {
        Survey.prototype.options = mergeObjects({}, Survey.prototype.options, optionsObj);
    }
}

Survey.prototype.isInitialized = !1, Survey.prototype.messages = {
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
}, Survey.prototype.options = options, Survey.prototype.version = "3.0.0";

export default Survey;
