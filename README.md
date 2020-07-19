# fuzzy [![Build Status](https://img.shields.io/travis/mattyork/fuzzy/master.svg)](https://travis-ci.org/mattyork/fuzzy) [![npm version](https://badge.fury.io/js/fuzzy.svg)](https://badge.fury.io/js/fuzzy)

1k standalone fuzzy search / fuzzy filter a la Sublime Text's command-p fuzzy file search. Works in both node and browser.

## Get it

Node:

```bash
$ yarn add fuzzy 
$ node
> var fuzzy = require('fuzzy');
> console.log(fuzzy)
{ test: [Function],
  match: [Function],
  filter: [Function] }
```

Browser:

```html
<script src="/path/to/fuzzy.js"></script>
<script>
  console.log(fuzzy);
  // Object >
  //   filter: function (pattern, arr, opts) {
  //   match: function (pattern, string, opts) {
  //   test: function (pattern, string) {
</script>
```

## Use it

Padawan: Simply filter an array of strings.

```javascript
var list = ['baconing', 'narwhal', 'a mighty bear canoe'];
var results = fuzzy.filter('bcn', list)
var matches = results.map(function(el) { return el.string; });
console.log(matches);
// [ 'baconing', 'a mighty bear canoe' ]
```

Jedi: Wrap matching characters in each string

```javascript
var list = ['baconing', 'narwhal', 'a mighty bear canoe'];
var options = { pre: '<', post: '>' };
var results = fuzzy.filter('bcn', list, options)
console.log(results);
// [
//   {string: '<b>a<c>o<n>ing'           , index: 0, score: 3, original: 'baconing'},
//   {string: 'a mighty <b>ear <c>a<n>oe', index: 2, score: 3, original: 'a mighty bear canoe'}
// ]
```

Jedi Master: sometimes the array you give is not an array of strings. You can
pass in a function that creates the string to match against from each element
in the given array

```javascript
var list = [
    {rompalu: 'baconing', zibbity: 'simba'}
  , {rompalu: 'narwhal' , zibbity: 'mufasa'}
  , {rompalu: 'a mighty bear canoe', zibbity: 'saddam hussein'}
];
var options = {
    pre: '<'
  , post: '>'
  , extract: function(el) { return el.rompalu; }
};
var results = fuzzy.filter('bcn', list, options);
var matches = results.map(function(el) { return el.string; });
console.log(matches);
// [ '<b>a<c>o<n>ing', 'a mighty <b>ear <c>a<n>oe' ]
```

## Contributing
Fork the repo!

    git clone <your_fork>
    cd fuzzy
    yarn
