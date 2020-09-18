
export const getAnswerIndexInLocalStorage = ( internals, fieldName, multiChoiceValue = '' ) => {

    const lsSurvey = localStorage.getObject( internals.storageName );
            
    if( lsSurvey ){
        const lsSurveyLength = lsSurvey.length;
        
        for(let ls=0; ls<lsSurveyLength; ls++){
            const lsItem = lsSurvey[ls];

            if( lsItem.field === fieldName ){
                if( multiChoiceValue ){
                    if( lsItem.value !== multiChoiceValue ){
                        continue;
                    }
                }
                return ls;
            }
        }
    }
    
    return -1;

}