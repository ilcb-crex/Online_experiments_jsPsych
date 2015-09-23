// Prothèse d'émulation (polyfill)
// Add method not define before ECMAScript 5



/** Array.prototype.reduce */
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/reduce
// Production steps, ECMA-262, Edition 5, 15.4.4.21
// Référence : http://es5.github.io/#x15.4.4.21
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(callback /*, initialValue*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.reduce appelé sur null ou undefined');
    }
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' n est pas une fonction');
    }
    var t = Object(this), len = t.length >>> 0, k = 0, value;
    if (arguments.length == 2) {
      value = arguments[1];
    } else {
      while (k < len && ! (k in t)) {
        k++;
      }
      if (k >= len) {
        throw new TypeError('Réduction de tableau vide sans valeur initiale');
      }
      value = t[k++];
    }
    for (; k < len; k++) {
      if (k in t) {
        value = callback(value, t[k], k, t);
      }
    }
    return value;
  };	
}

/** Array.isArray*/
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/isArray
if(!Array.isArray) {
  Array.isArray = function(arg) {
	return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
/** Array.prototype.indexOf() */
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/indexOf
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Référence : http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Soit O le résultat de l'appel à ToObject avec
    //    this en argument.
    if (this == null) {
      throw new TypeError('"this" vaut null ou n est pas défini');
    }

    var O = Object(this);

    // 2. Soit lenValue le résultat de l'appel de la
    //    méthode interne Get de O avec l'argument
    //    "length".
    // 3. Soit len le résultat de ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. Si len vaut 0, on renvoie -1.
    if (len === 0) {
      return -1;
    }

    // 5. Si l'argument fromIndex a été utilisé, soit
    //    n le résultat de ToInteger(fromIndex)
    //    0 sinon
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. Si n >= len, on renvoie -1.
    if (n >= len) {
      return -1;
    }

    // 7. Si n >= 0, soit k égal à n.
    // 8. Sinon, si n<0, soit k égal à len - abs(n).
    //    Si k est inférieur à 0, on ramène k égal à 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. On répète tant que k < len
    while (k < len) {
      // a. Soit Pk égal à ToString(k).
      //    Ceci est implicite pour l'opérande gauche de in
      // b. Soit kPresent le résultat de l'appel de la
      //    méthode interne HasProperty de O avec Pk en
      //    argument. Cette étape peut être combinée avec
      //    l'étape c
      // c. Si kPresent vaut true, alors
      //    i.  soit elementK le résultat de l'appel de la
      //        méthode interne Get de O avec ToString(k) en
      //        argument
      //   ii.  Soit same le résultat de l'application de
      //        l'algorithme d'égalité stricte entre
      //        searchElement et elementK.
      //  iii.  Si same vaut true, on renvoie k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

/** Object.keys : nom des champs de l'objet */
// De MDN - https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}