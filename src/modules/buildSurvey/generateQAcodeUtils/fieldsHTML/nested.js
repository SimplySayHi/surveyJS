
// NESTED ANSWER -> IT IS A CHILD ANSWER OF ITS PARENT
// EXAMPLE:
// IF 'WEBSITE' IS THE PARENT ANSWER
// IT CAN HAVE THESE CHILDREN ANSWERS: PC - SMARTPHONE - TABLET
// SO THE PARENT ANSWER IS PRINTED AS TEXT ( WITHOUT THE INPUT FIELD ) AND ITS nested ANSWERS WILL BE LOOPED
export const nested = function( data ){

    const self = this,
          answer = data.answer,
          objData = data.objData;

    let labelForNested = self.options.templates.labelTag;

    labelForNested = labelForNested.replace(/{{answerCode}}/g, objData.answerCode);
    labelForNested = labelForNested.replace(/{{labelClass}}/g, self.options.cssClasses.label + ' surveyjs-field-indent-0');
    labelForNested = labelForNested.replace(/{{answerString}}/g, answer.answer);

    let aLoopHtml = data.beforeCode + '<div class="surveyjs-'+ objData.answerType +'">' + labelForNested + '</div>' + data.afterCode;

    return { aHtml: aLoopHtml, objData };
}
