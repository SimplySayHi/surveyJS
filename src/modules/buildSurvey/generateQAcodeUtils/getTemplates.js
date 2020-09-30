
export const getTemplates = ( templates, answerType ) => {
    return {
        field: templates[answerType] || templates.input,
        label: /^(checkbox|nested|radio|related)$/.test(answerType) ? templates.label : '',
        wrapper: templates.wrapper[answerType] || templates.wrapper.default
    }
}
