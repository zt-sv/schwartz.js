schwartz
========

«Use the schwartz, Lone Starr»

sCHwARTz - Character Art

## API spec

### Constructor
````javascript
new Schwartz(
    [Object options]
) -> {Schwartz}
````
#### Options

##### options.inverse
Type: `Boolean`
Default: False

Inverse image

##### options.matrixDimensions
Type: `Object`
Default: {"x": 5, "y": 10}

Dimensions

##### options.lineTagName
Type: `String`
Default: 'pre'

##### options.lineClassName
Type: `String`

##### options.container
Type: `DOM element`

Output container

##### options.callback
Type: `DOM element`

Output callback

### Generate character art from image source
````javascript
Schwartz.prototype.generateFromImage(
    String src
)
````

### Generate character art from video
````javascript
Schwartz.prototype.generateFromVideo(
    DOM element of video
)
````

### Set up characters

````javascript
Schwartz.prototype.setCharSet(
    String str
)
````

##Usage Examples

### Generate from image
````javascript
var
    body    = document.getElementsByTagName('body')[0],
    outDiv  = document.createElement('div'),
    schwartz = new Schwartz({
        container: outDiv,
        lineClassName: 'myCssClass'
    });
// end of vars

body.appendChild(outDiv);
schwartz.generateFromImage('/path/to/img.jpg');
````

### Generate from video
````javascript
var
    body    = document.getElementsByTagName('body')[0],
    video   = document.getElementsByTagName('video')[0],
    outDiv  = document.createElement('div'),

    schwartz = new Schwartz({
        inverse: true,
        matrixDimensions: {
            x: 5,
            y: 10
        },
        container: outDiv,
        lineClassName: 'myCssClass'
    });
// end of vars

body.appendChild(outDiv);
schwartz.generateFromVideo(video);
````

## License
Copyright (c) 2014 Alexandr Zaytcev. Licensed under the MIT license.
