
import { isDOMNode } from './isDOMNode';

export const checkFormEl = formEl => {

    const isString = typeof formEl,
          isValidNodeSelector = isString === 'string' && isDOMNode(document.querySelector(formEl)),
          isFormSelector = isValidNodeSelector && document.querySelector(formEl).tagName.toLowerCase() === 'form',
          obj = {
            result: isDOMNode(formEl) || isFormSelector,
            element: (isString === 'string' ? document.querySelector(formEl) : formEl)
        };

    return obj;
    
}
