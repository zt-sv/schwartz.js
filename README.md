[schwartz.js](http://zt-sv.github.io/schwartz.js) [![Build Status](https://travis-ci.org/zt-sv/schwartz.js.svg)](https://travis-ci.org/zt-sv/schwartz.js)
========

May the schwartz be with you!

sCHwARTz - Character Art

## Installation
Install with [bower](http://bower.io/)
`bower install schwartz.js`

## API spec

### Constructor
````javascript
Schwartz new Schwartz(
    [Object options]
)
````
#### Options

##### options.inverse
Type: `Boolean`
Default: False

Inverse image

##### options.detail
Type: `Nubmer`
Default: 50

Depth of detail

##### options.render
Type: `Function`

Output callback

### Generate character art from image source
````javascript
void generateFromImage(
    String src
)
````

### Generate character art from video
````javascript
void generateFromVideo(
    DOMElement video
)
````

### Set up depth of detail

````javascript
void setDetail(
    Number n
)
````

### Set up characters

````javascript
void setCharSet(
    String str
)
````

### Inverse image

````javascript
void inverseImage()
````

##Usage Examples

### Generate from image
````javascript
var
    body    = document.getElementsByTagName('body')[0],

    render = function() {
        //
    },

    schwartz = new Schwartz({
        render: render,
        detail: 60
    });
// end of vars

schwartz.generateFromImage('/path/to/img.jpg');
````

### Generate from video
````javascript
var
    body    = document.getElementsByTagName('body')[0],
    video   = document.getElementsByTagName('video')[0],

    render = function() {
        //
    },

    schwartz = new Schwartz({
        render: render,
        inverse: true,
        detail: 50
    });
// end of vars

schwartz.generateFromVideo(video);
````

## License
Copyright (c) 2014 Alexandr Zaytcev. Licensed under the MIT license.
