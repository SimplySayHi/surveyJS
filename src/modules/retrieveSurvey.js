
import { ajaxCall } from './helpers';
import { buildSurvey } from './buildSurvey/buildSurvey';

export function retrieveSurvey(){

    const self = this;

    self.formEl.querySelector('[data-surveyjs-body]').insertAdjacentHTML( 'beforebegin', self.options.loadingBox );

    return ajaxCall(self.options.url, self.options.initAjaxOptions)
        .then(function( response ){

            if( response.status && response.status.toLowerCase() === 'success' ){
                self.data = response.data;
                Object.freeze(self.data);
                buildSurvey.call(self);
            }
            return response;

        })
        .finally(function(){

            let loadingBoxEl = self.formEl.querySelector('[data-surveyjs-loading]');
            if( loadingBoxEl ){
                loadingBoxEl.parentNode.removeChild(loadingBoxEl);
            }

        });

}