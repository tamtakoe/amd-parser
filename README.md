# amd-parser [![NPM version](https://badge.fury.io/js/amd-parser2.svg)](http://badge.fury.io/js/amd-parser)

> parse AMD-files

## Install with [npm](npmjs.org)

```sh
npm install amd-parser2
```

## Usage

```js
var amd = require('amd-parser2');
var parsed = amd.parse(amdFile);
```


## API
### amd.parse(file)

Parse AMD-file (requireJS, etc.)

#### Parameters

##### file
Type: `String` or `Buffer` or `Vinyl`

#### Return
Type: `Parsed`

Parsed file

#### Usage

```js
var file = fs.readFileSync('./app.js');
var parsed = amd.parse(file);
```


### parsed.get([field])

Return AMD-object

#### Parameters

##### field
Type: `String`

field is to be returned

#### Return
Type: `Object`

AMD-object or field value. Fields:

<pre>
start        - file start
name         - module name
dependencies - dependencies array
arguments    - arguments array
end          - file end
</pre>

#### Usage

```js
var file = 'define('app', ['dep1', 'dep2'], function(a, b) {})';
var parsed = amd.parse(file);

parsed.get('dependencies'); //['dep1', 'dep2']
```


### parsed.save()
### parsed.toString()
### parsed.toBuffer()
### parsed.toVinyl()

#### Return
Type: `String` or `Buffer` or `Vinyl`

Original (`save()`) or specified file format



### parsed.add(dependencies)

Add dependencies

#### Parameters

##### dependencies
Type: `String` or `Array`

dependencies names

#### Return
Type: `Parsed`

Parsed file

#### Usage

```js
var file = 'define(['dep1', 'dep2'], function(a, b) {})';
var parsed = amd.parse(file);

parsed.add('dep3');

parsed.save(); //define(['dep1', 'dep2', 'dep3'], function(a, b) {})
```



### parsed.clear()

Remove all dependencies

#### Return
Type: `Parsed`

Parsed file

#### Usage

```js
var file = 'define(['dep1', 'dep2'], function(a, b) {})';
var parsed = amd.parse(file);

parsed.clear();

parsed.save(); //define([], function(a, b) {})
```



### parsed.remove(dependencies)

Remove certain dependencies

#### Parameters

##### dependencies
Type: `String` or `Array`

dependencies names

#### Return
Type: `Parsed`

Parsed file

#### Usage

```js
var file = 'define(['dep1', 'dep2'], function(a, b) {})';
var parsed = amd.parse(file);

parsed.remove('dep1');

parsed.save(); //define(['dep2'], function(a, b) {})
```




### parsed.setName(name)

Set module name

#### Parameters

##### name
Type: `String`

Module name

#### Return
Type: `Parsed`

Parsed file

#### Usage

```js
var file = 'define('foo', [], function(a, b) {})';
var parsed = amd.parse(file);

parsed.setName('bar');

parsed.save(); //define('bar', [], function(a, b) {})
```




### parsed.clearName()

Clear module name

#### Return
Type: `Parsed`

Parsed file

#### Usage

```js
var file = 'define('foo', [], function(a, b) {})';
var parsed = amd.parse(file);

parsed.clearName();

parsed.save(); //define([], function(a, b) {})
```



## License

Copyright (c) 2014-2015 Oleg Istomin
Released under the MIT license

***