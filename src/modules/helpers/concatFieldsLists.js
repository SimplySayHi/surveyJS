
export const concatFieldsLists = () => {

    return Array.from(arguments).reduce((argAcc, list) => {
        return list.reduce((listAcc, elem) => {
            if( listAcc.indexOf(elem) === -1 ){
                listAcc.push(elem);
            }
            return listAcc;
        }, argAcc);
    }, []);
    
}
