
export const sortList = ( list ) => {
    if( list[0]['sort'] ){
        list.sort((a, b) => a['sort'] > b['sort']);
    }
    return list;
}
