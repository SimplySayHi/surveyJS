
import { ajaxCall } from './helpers';
import { buildSurvey } from './buildSurvey/buildSurvey';

export const retrieveSurvey = ( formEl, options, internals ) => {

    formEl.querySelector('[data-surveyjs-body]').insertAdjacentHTML( 'beforebegin', options.loadingBox );
    return ajaxCall(options.url, options.initAjaxOptions)
        .then(response => {
            if( response.status.toLowerCase() === 'success' && response.data.questions && response.data.questions.length > 0 ){
                return new Promise(resolve => {
                    resolve( buildSurvey(formEl, options, internals, response.data) );
                }).then(() => {
                    return response;
                });
            }
            return Promise.reject(response);
        })
        .finally(() => {
            const loadingBoxEl = formEl.querySelector('[data-surveyjs-loading]');
            if( loadingBoxEl ){
                loadingBoxEl.parentNode.removeChild(loadingBoxEl);
            }
        });

}
