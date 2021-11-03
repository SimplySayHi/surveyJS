
export function submit( event ){
    const self = event.target.surveyjs;
    event.detail.then(() => {
        if( self.options.useWebStorage ){
            sessionStorage.removeItem( self.internals.storageName );
        }
    });
}
