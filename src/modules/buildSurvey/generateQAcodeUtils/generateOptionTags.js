
import { sortList } from '../../helpers';

export const generateOptionTags = ( optionsList = [] ) => {

    return sortList( optionsList ).reduce((optionsHTML, opt) => {
        return optionsHTML += `<option value="${opt.value}">${opt.label}</option>`;
    }, '');

}