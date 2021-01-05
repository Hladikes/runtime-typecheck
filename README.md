# runtime-typecheck

## Library for runtime type checking in javascript

### Example
```javascript
let obj = {
  username: 'Adam',
  password: 'heslo',
  personalInfo: {
    age: 34,
    favAnimal: 'Panda'
  },
  // badges: [ 'yellow', 'red', 'orange' ]
}

let template = {
  username: String,
  password: String,
  personalInfo: {
    age: () => [ Number, null ], // null -> can be nullable
    favThing: () => [ String, Number, null ] // Check for multiple types
  },
  // badges: () => [ Array, null ]
}

ensureObject(obj).matchesStructure(template) // returns given object if matches, false if not
```

## 🟥 Support for array comming soon

## 🟥 More examples comming soon ...