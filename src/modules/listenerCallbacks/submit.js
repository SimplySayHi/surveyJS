
export function submit( event ){
    const self = event.target.formjs;
    event.data.then(() => {
        if( self.options.useWebStorage ){
            sessionStorage.removeItem( self.internals.storageName );
        }
    });
}
