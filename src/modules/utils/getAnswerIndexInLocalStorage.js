
export function getAnswerIndexInLocalStorage( fieldName, multiChoiceValue = '' ){

    const self = this
    let lsSurvey = localStorage.getObject( self.internals.localStorageName );
            
    if( lsSurvey ){
        let lsSurveyLength = lsSurvey.length;
        
        for(let ls=0; ls<lsSurveyLength; ls++){
            let lsItem = lsSurvey[ls];
            
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