
import { generateOptionTags } from './generateOptionTags';

export const select = function( data ){

    const self = this,
          objData = data.objData;
    
    let aHtml = data.beforeCode + self.options.templates.select + data.afterCode;
    
    objData.optionsHtml = generateOptionTags.call( self, data.obj.answers );

    return { aHtml, objData };
}
