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
  badges: [ 'yellow', 'red', 'orange' ]
}

let template = {
  username: String,
  password: String,
  personalInfo: {
    age: () => [ Number, null ], // null -> can be nullable
    favAnimal: () => [ String, Number, null ] // Check for multiple types
  },
  badges: [ String ]
}

ensureObject(obj).matchesStructure(template) // returns given object if matches, false if not
```
### Another, more practical example

```javascript
// Actual data from backend
let socialData = {
  users: [
    {
      name: 'Alice',
      age: 23,
      favColors: [ 'red', 'green', 'blue' ]
    },
    {
      name: 'Bob',
      age: 27,
      favColors: [ 'red', 'cyan', 'black' ]
    }
  ],
  posts: [
    {
      from: 'Alice',
      text: 'I am alice'
    },
    {
      from: 'Bob',
      text: 'And I am Bob!'
    }
  ]
}

// Define the template which should represent data comming from backend
let template = {
  users: [
    {
      name: String,
      age: Number,
      favColors: [ String ]
    }
  ],
  posts: [
    {
      from: String,
      text: () => [ String, null ]
    }
  ]
}

ensureObject(socialData).matchesStructure(template)
```

## 🟥 More examples comming soon ...