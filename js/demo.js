
var validationRules = {

    alphabetic: function( string ){
        var regex = new RegExp(/^[a-z]+$/i),
            obj = {
                result: regex.test( string )
            };

        return obj;
    },

    alphabeticExtended: function( string ){
        var regex = new RegExp(/^[-'A-ZÀ-ÖØ-öø-ÿ]+$/i),
            obj = {
                result: regex.test( string )
            };

        return obj;
    },
    
    alphanumeric: function( string ){
        var regex = new RegExp(/^[\w]+$/i), // OR [a-z0-9_]
            obj = {
                result: regex.test( string )
            };

        return obj;
    }

};

Form.addValidationRules( validationRules );
