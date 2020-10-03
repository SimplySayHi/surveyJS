
export const getAnswerIndexInWebStorage = ( internals, fieldName, multiChoiceValue = '' ) => {

    const wsSurvey = sessionStorage.getObject( internals.storageName );
            
    if( wsSurvey ){
        const wsSurveyLength = wsSurvey.length;
        
        for(let ws=0; ws<wsSurveyLength; ws++){
            const lsItem = wsSurvey[ws];

            if( lsItem.name === fieldName ){
                if( multiChoiceValue ){
                    if( lsItem.value !== multiChoiceValue ){
                        continue;
                    }
                }
                return ws;
            }
        }
    }
    
    return -1;

}