
export function generateOptionTags( optionsList = [] ){

    const self = this;
    let optionsHtml = ( optionsList[0].id === '' ? '' : '<option value="">'+ self.options.selectFirstOption +'</option>' );

    optionsList.forEach(opt => {
        optionsHtml += '<option value="'+ opt.id +'" data-answer-id="'+ opt.id +'">'+ opt.answer +'</option>';
    });

    return optionsHtml;

}