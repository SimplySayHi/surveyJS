
export const textarea = ( options, data ) => {

    const objData = data.objData,
          aHtml = options.templates.textarea;

    objData.answerPlaceholder = data.answer.placeholder || options.textareaPlaceholder;

    return { aHtml, objData };
}
