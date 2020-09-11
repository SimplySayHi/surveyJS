
import { generateOptionTags } from './generateOptionTags';

export const select = ( options, data ) => {

    const objData = data.objData,
          aHtml = data.beforeCode + options.templates.select + data.afterCode;
    
    objData.optionsHtml = generateOptionTags( data.obj.answers, options );

    return { aHtml, objData };
}
