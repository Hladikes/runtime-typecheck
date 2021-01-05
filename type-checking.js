// TODO Array item checking


function _isObject(val) {
  return val === null ? false : typeof val === 'object' && !val.push
}

function _isArray(val) {
  return Array.isArray(val)
}

function _isAnonymousFunction(fn) {
  return typeof fn === 'function' && fn.name === ''
}

function _toTypesStringArray(arr) {
  return arr
    .map(t => {
      if (typeof t === 'function') {
        return t.name.toLowerCase()
      } else {
        return t
      }
    })
}

function _typeMatches(value, type) {

  if (_isArray(type)) {
    // Check for multiple types, including null as Nullable type
    // example [ Number, String ] or [ Number, null ] 

    let matches = false
    for (let t of type) {
      if (t === null) {
        matches = matches || value === t
      } else {
        matches = matches || _typeMatches(value, t)
      }
      if (matches) return matches
    }
    return matches
  } else {
    if (type === Array) {
      return _isArray(value)
    } else {
      return typeof value === type.name.toLowerCase()
    }
  }
}

function ensureObject(obj) {
  if (!_isObject(obj)) {
    throw 'Structure can be checked only with object'
  }

  return { 
    matchesStructure(structureObj) {
      // Check for properties match

      let matches = true

      for (let property in structureObj) {
        let propertyType = structureObj[property]

        if (!(typeof propertyType === 'function' || _isArray(propertyType) || _isObject(propertyType))) {
          throw `Value of template property must be a type function, nested object or array of type functions`
        }
        
        matches = matches && obj.hasOwnProperty(property)

        if (!matches) {
          throw `Given object is missing property '${property}'`
        }
      }

      for (let property in obj) {
        matches = matches && structureObj.hasOwnProperty(property)
        if (!matches) {
          // console.log(property, obj)
          throw `Given object has property '${property}' which was not defined in template structure`
        }
      }

      if (!matches) throw 'Structure of given object does not match given template structure'

      // If the program reaches this point, it means that keys of both objects matches

      for (let property in obj) {
        let propertyValue = obj[property]
        let propertyType = structureObj[property]

        if (property === propertyType.name) {
          // this case happens if user wrote his custom callback
          // function which returns multiple possible types
          propertyType = propertyType()
        }

        if (_isObject(propertyValue)) {
          // propertyType is in this case nested structure
          matches = matches && !!ensureObject(propertyValue).matchesStructure(propertyType)
        } else if (_isArray(propertyValue)) {
          // Check if every item of array matches type or structure
          if (propertyValue.length !== 1) {
            throw 'Array template must have only one item to type of all other items'
          }

          let type = propertyValue[0]

          if (_isAnonymousFunction(type)) {
            throw 'Using callback functions to represent type of an item in array is not yet supported'
          }

          if (_isObject(type)) {

          } else {
            matches = matches && propertyValue.every(i => _typeMatches(i, type))
          }
        } else {
          // propertyType is function in this case
          matches = matches && _typeMatches(propertyValue, propertyType)

          if (!matches) {
            if (_isArray(propertyType)) {
              throw `Value '${propertyValue}' does not match any of types ${_toTypesStringArray(propertyType).join(' or ')}`
            } else {
              // console.log('propertyType', propertyType)
              throw `Value '${propertyValue}' does not match type '${propertyType.name}'`
            }
          }
        }
      }

      return matches ? obj : false
    }
  }
}


let obj = {
  username: 'Adam',
  password: 'heslo',
  personalInfo: {
    age: 34,
    favAnimal: 'Panda'
  },
  badges: [ 'yellow', 'red', 'orange' ]
}

let template = {
  username: String,
  password: String,
  personalInfo: {
    age: [ Number, null ],
    favAnimal: [ String, null ]
  },
  badges: () => [ Array, null ]
}

ensureObject(obj).matchesStructure(template)