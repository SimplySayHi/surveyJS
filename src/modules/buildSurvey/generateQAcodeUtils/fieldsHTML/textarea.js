
export const textarea = function( data ){

    const self = this,
          answer = data.answer,
          objData = data.objData;

    let aHtml = self.options.templates.textarea;

    objData.answerPlaceholder = answer.placeholder || self.options.textareaPlaceholder;

    return { aHtml, objData };
}
