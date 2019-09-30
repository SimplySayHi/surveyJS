
import { webStorage } from './webStorage';

export const internals = {
    formInstance: null,
    isAvailableStorage: webStorage().isAvailable,
    localStorageArray: [],
    localStorageName: 'Survey_' + location.href + '_{{surveyFormName}}_surveyId[{{surveyId}}]',
    progIds: []
}
