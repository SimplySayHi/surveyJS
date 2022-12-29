/* surveyJS Lite v4.0.2 | Valerio Di Punzio (@SimplySayHi) | https://www.valeriodipunzio.com/plugins/surveyJS/ | https://github.com/SimplySayHi/surveyJS | MIT license */
const isDOMNode = node => Element.prototype.isPrototypeOf(node), customEvents_destroy = "sjs:destroy", customEvents_init = "sjs:init", deepFreeze = obj => (Object.getOwnPropertyNames(obj).forEach((name => {
    const prop = obj[name];
    "object" == typeof prop && null !== prop && deepFreeze(prop);
})), Object.freeze(obj)), isPlainObject = object => "[object Object]" === Object.prototype.toString.call(object), mergeObjects = function(out = {}) {
    return Array.from(arguments).slice(1).filter((arg => !!arg)).forEach((arg => {
        Object.keys(arg).forEach((key => {
            Array.isArray(arg[key]) ? out[key] = (out[key] || []).concat(arg[key].slice(0)) : isPlainObject(arg[key]) ? out[key] = mergeObjects(out[key] || {}, arg[key]) : Array.isArray(out[key]) ? out[key].push(arg[key]) : out[key] = arg[key];
        }));
    })), out;
}, dispatchCustomEvent = (elem, eventName, eventOptions) => {
    eventOptions = mergeObjects({}, {
        bubbles: !0
    }, eventOptions);
    const eventObj = new CustomEvent(eventName, eventOptions);
    elem.dispatchEvent(eventObj);
}, replaceObjectKeysInString = (obj, stringHTML) => Object.keys(obj).reduce(((accString, name) => {
    const regexStr = new RegExp("{{" + name + "}}", "g");
    return accString.replace(regexStr, obj[name]);
}), stringHTML), sortList = list => (list[0].sort && list.sort(((a, b) => a.sort > b.sort)), 
list), generateOptionTags = (optionsList = []) => sortList(optionsList).reduce(((optionsHTML, opt) => optionsHTML + `<option value="${opt.value}">${opt.label}</option>`), ""), getAttributesStringHTML = (answerObj, answerCode, isRequired) => {
    const excludedAttrs = [ "data", "id", "label", "nested", "related", "sort" ];
    /^(option|textarea)$/.test(answerObj.type) && excludedAttrs.push("type", "value");
    let string = "";
    return Object.keys(answerObj).filter((name => -1 === excludedAttrs.indexOf(name))).forEach((name => {
        string += ` ${name}="${answerObj[name]}"`;
    })), answerObj.data && Object.keys(answerObj.data).forEach((name => {
        string += ` data-${((string = "", useAllCaps = !1) => {
            let newString = string.trim().replace(/(([_ ])([a-z]))|(([a-z])?([A-Z]))/g, ((match, p1, p2, p3, p4, p5, p6) => (p3 ? "-" + p3 : (p5 || "") + "-" + p6).toLowerCase()));
            return useAllCaps ? newString.toUpperCase() : newString;
        })(name)}="${answerObj.data[name]}"`;
    })), isRequired && (string += " required"), answerObj.related && (string += " data-require-more"), 
    string += ` id="${answerCode}"`, string.trim();
}, generateAnswers = (answersList, extraData, options) => {
    let allAnswersHTML = "", previousType = "";
    return sortList(answersList).forEach(((answer, index) => {
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
            wrapperClasses: options.cssClasses.wrapper[answerType] || options.cssClasses.wrapper.field,
            fieldAttributes: getAttributesStringHTML(answer, answerCode, extraData.question.isRequired),
            fieldClasses: options.cssClasses[answerType] || options.cssClasses.field,
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
                fieldClasses: relatedIsSelect ? options.cssClasses.select : options.cssClasses[relatedType] || options.cssClasses.field
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
            wrapper: templates.wrapper[answerType] || templates.wrapper.field
        }))(answer.related ? "related" : answer.nested ? "nested" : answerType, options.templates);
        let nestedFieldsHTML = "";
        answer.nested && (nestedFieldsHTML = generateAnswers(answer.nested, extraData, options));
        let optionsHtml = "";
        "select" === answerType && (optionsHtml = generateOptionTags(answersList)), answerHTML = templates.wrapper.replace("{{relatedFieldHTML}}", relatedFieldHTML).replace("{{fieldTemplate}}", templates.field).replace("{{optionsHtml}}", optionsHtml).replace("{{labelTemplate}}", templates.label).replace("{{nestedFieldsHTML}}", nestedFieldsHTML), 
        allAnswersHTML += replaceObjectKeysInString(answerData, answerHTML);
    })), allAnswersHTML;
}, buildSurvey = (data, $form, options) => {
    const qaHtmlAll = ((questions, surveyId, options) => sortList(questions).reduce(((accCode, questionObj, index) => {
        if (questionObj.external) return accCode;
        let questionHTML = options.templates.wrapper.question;
        const questionId = questionObj.id, questionNumber = index + 1, extraData = {
            surveyId: surveyId,
            question: {
                id: questionId,
                index: index,
                isRequired: !!questionObj.required
            }
        };
        questionObj.checks && (extraData.question.checks = questionObj.checks);
        const answersHTML = generateAnswers(questionObj.answers, extraData, options), maxChoice = questionObj.checks ? JSON.parse(questionObj.checks) : "", checksMin = maxChoice[0] || "", checksMax = maxChoice[1] || "", maxChoiceText = maxChoice && options.messages.maxChoice ? " (" + checksMax + " " + options.messages.maxChoice + ")" : "", questionData = {
            questionId: questionId,
            questionNumber: questionNumber,
            questionText: questionObj.question + maxChoiceText,
            answersHTML: answersHTML
        };
        if (questionHTML = replaceObjectKeysInString(questionData, questionHTML), options.showErrorMessage) {
            let errorMessage = "" !== maxChoice ? options.messages.errorMultiChoice : questionObj.errorMessage || options.messages.error;
            isPlainObject(errorMessage) && (errorMessage = ""), questionHTML = questionHTML.replace(/{{errorTemplates}}/g, errorMessage);
        }
        return accCode + replaceObjectKeysInString({
            checksMin: checksMin,
            checksMax: checksMax
        }, questionHTML);
    }), ""))(data.questions, data.id, options);
    $form.querySelector("[data-surveyjs-body]").insertAdjacentHTML("beforeend", qaHtmlAll);
    const extQuestions = data.questions.filter((obj => obj.external));
    if (extQuestions.length > 0) {
        const $surveyWrapper = $form.closest("[data-surveyjs-wrapper]");
        extQuestions.forEach(((question, qIndex) => {
            const $externalCont = $surveyWrapper.querySelector('[data-surveyjs-external="' + (qIndex + 1) + '"]');
            $externalCont.setAttribute("data-question-id", question.id), question.answers.forEach(((answer, aIndex) => {
                const $externalField = $externalCont.querySelectorAll("[data-field]")[aIndex], fieldProps = {
                    id: `${answer.type}-${data.id}-${question.id}-${answer.id}`,
                    type: answer.type,
                    value: answer.value,
                    required: !!question.required
                };
                Object.keys(fieldProps).forEach((name => {
                    $externalField[name] = fieldProps[name];
                }));
                const $answerCont = $externalField.closest("[data-answer]");
                $answerCont.querySelector("label").setAttribute("for", fieldProps.id), $answerCont.querySelector("[data-label]").innerHTML = answer.label, 
                $externalCont.querySelector("[data-question]").innerHTML = question.question;
            }));
        }));
    }
};

class Survey {
    constructor($form, optionsObj = {}) {
        const argsL = arguments.length, checkFormElem = (formEl => {
            const isString = typeof formEl, isFormSelector = "string" === isString && isDOMNode(document.querySelector(formEl)) && "form" === document.querySelector(formEl).tagName.toLowerCase();
            return {
                result: isDOMNode(formEl) || isFormSelector,
                element: "string" === isString ? document.querySelector(formEl) : formEl
            };
        })($form);
        if (0 === argsL || argsL > 0 && !$form) throw new Error('First argument "$form" is missing or falsy!');
        if (nodeList = $form, NodeList.prototype.isPrototypeOf(nodeList)) throw new Error('First argument "$form" must be a single DOM node or a form CSS selector, not a NodeList!');
        var nodeList;
        if (!checkFormElem.result) throw new Error('First argument "$form" is not a DOM node nor a form CSS selector!');
        if (!optionsObj.url || "string" != typeof optionsObj.url) throw new Error('"options.url" is missing or not a string!');
        const self = this;
        self.$form = checkFormElem.element, self.options = mergeObjects({}, Survey.prototype.options, optionsObj), 
        $form = self.$form, optionsObj = self.options, $form.surveyjs = self, $form.querySelector("[data-surveyjs-body]").insertAdjacentHTML("beforebegin", optionsObj.templates.loading);
        const retrieveSurvey = ((url = location.href, options = {}) => {
            let timeoutTimer;
            if (options.headers = new Headers(options.headers), options.timeout > 0) {
                const controller = new AbortController, signal = controller.signal;
                options.signal = signal, timeoutTimer = window.setTimeout((() => {
                    controller.abort();
                }), options.timeout);
            }
            return fetch(url, options).then((response => {
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })).catch((error => {
                throw new Error(error.message);
            })).finally((() => {
                timeoutTimer && window.clearTimeout(timeoutTimer);
            }));
        })(optionsObj.url, optionsObj.initAjaxOptions).then((response => "success" !== response.status.toLowerCase() ? Promise.reject(response) : (response.data.questions && response.data.questions.length > 0 && (buildSurvey(response.data, $form, optionsObj), 
        Object.defineProperty(self, "data", {
            value: deepFreeze(response.data)
        }), self.isInitialized = !0, $form.closest("[data-surveyjs-wrapper]").classList.add("surveyjs-init-success")), 
        response))).finally((() => {
            const $loadingBox = $form.querySelector("[data-surveyjs-loading]");
            $loadingBox && $loadingBox.parentNode.removeChild($loadingBox);
        }));
        dispatchCustomEvent($form, customEvents_init, {
            detail: retrieveSurvey
        });
    }
    destroy() {
        delete this.$form.surveyjs, dispatchCustomEvent(this.$form, customEvents_destroy);
    }
    static setOptions(optionsObj) {
        Survey.prototype.options = mergeObjects({}, Survey.prototype.options, optionsObj);
    }
}

Survey.prototype.isInitialized = !1, Survey.prototype.options = {
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
}, Survey.prototype.version = "4.0.2";

export { Survey as default };
