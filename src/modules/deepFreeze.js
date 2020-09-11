function deepFreeze(obj) {

  // Prende tutti i nomi delle proprietà definite in obj
  var propNames = Object.getOwnPropertyNames(obj);

  // Congela tutte le proprietà prima di congelare obj
  propNames.forEach(function(name) {
    var prop = obj[name];

    // Congela prop se esso è un oggetto
    if (typeof prop == 'object' && prop !== null)
      deepFreeze(prop);
  });

  // Congela se stesso (niente operazione se esso è già congelato)
  return Object.freeze(obj);
}