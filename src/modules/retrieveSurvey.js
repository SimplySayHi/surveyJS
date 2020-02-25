
import { ajaxCall } from './helpers';
import { buildSurvey } from './buildSurvey/buildSurvey';

export function retrieveSurvey(){

    const self = this;

    self.formEl.querySelector('[data-surveyjs-body]').insertAdjacentHTML( 'beforebegin', self.options.loadingBox );

    return ajaxCall(self.options.url, self.options.initAjaxOptions)
        .then(response => {

            if( response.status.toLowerCase() === 'success' && response.data.questions && response.data.questions.length > 0 ){
                self.data = response.data;
                Object.freeze(self.data);
                return new Promise(resolve => {
                    resolve( buildSurvey.call(self) );
                }).then(() => {
                    return response;
                });
            } else {
                return Promise.reject(response);
            }

        })
        .finally(() => {

            let loadingBoxEl = self.formEl.querySelector('[data-surveyjs-loading]');
            if( loadingBoxEl ){
                loadingBoxEl.parentNode.removeChild(loadingBoxEl);
            }

        });

}
