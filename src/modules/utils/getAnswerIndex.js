
export const getAnswerIndex = ( list, fieldName, multiChoiceValue = '' ) => {

    const listLength = list.length;

    for(let item = 0; item < listLength; item++){
        const lsItem = list[item];
        if( lsItem.name === fieldName ){
            if( multiChoiceValue ){
                if( lsItem.value !== multiChoiceValue ){
                    continue;
                }
            }
            return item;
        }
    }
    
    return -1;

}