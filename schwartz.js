/**
 * Generate ACII art from image or video
 *
 * @module   Schwartz
 * @version  1.1
 *
 * @author   Zaytsev Alexandr
 *
 * @example
 *    // Exapmple with image
 *    var
 *        body    = document.getElementsByTagName('body')[0],
 *        outDiv  = document.createElement('div'),
 *        schwartz = new Schwartz({
 *            container: outDiv,
 *            lineClassName: 'myCssClass'
 *        });
 *    // end of vars
 *
 *    body.appendChild(outDiv);
 *    schwartz.generateFromImage('/path/to/img.jpg');
 *
 *
 *    // Example with video
 *    var
 *        body    = document.getElementsByTagName('body')[0],
 *        video   = document.getElementsByTagName('video')[0],
 *        outDiv  = document.createElement('div'),
 *
 *        schwartz = new Schwartz({
 *            inverse: true,
 *            matrixDimensions: {
 *                x: 5,
 *                y: 10
 *            },
 *            container: outDiv,
 *            lineClassName: 'myCssClass'
 *        });
 *    // end of vars
 *
 *
 *    body.appendChild(outDiv);
 *    schwartz.generateFromVideo(video);
 */
!function( window, module ) {
    'use strict';

    var
        Schwartz = module();
        // end of vars

    // AMD
    if ( typeof define === 'function' && define.amd ) {
        define('Schwartz', [], function() {
            return Schwartz;
        });

    // YM Modules
    } else if ( typeof modules !== 'undefined' && typeof modules.define === 'function' ) {
        modules.define('Schwartz', [], function( provide ) {
            provide(Schwartz);
        });

    // Browser global
    } else {
        window.Schwartz = Schwartz;
    }
}( this, function() {
    'use strict';

    var
        Schwartz = (function() {
            var
                /**
                 * After parse image callback
                 *
                 * @memberOf    module:Schwartz~Schwartz
                 * @callback    parseImageCallback
                 *
                 * @param       {String[]}  stringArray     Art strings by line
                 */

                /**
                 * @memberOf     module:Schwartz~
                 *
                 * @constructs   Schwartz
                 *
                 * @param        {Object}               [options]
                 * @param        {Boolean}              [options.inverse=false]
                 * @param        {Object}               [options.textDimensions]
                 * @param        {Number}               [options.textDimensions.cols=80]
                 * @param        {Number}               [options.textDimensions.rows=40]
                 * @param        {String}               [options.lineTagName=pre]
                 * @param        {String}               [options.lineClassName]
                 * @param        {DOM Element}          [options.container]
                 * @param        {parseImageCallback}   [options.callback]
                 */
                Schwartz = function Schwartz( options ) {
                    // enforces new
                    if ( !( this instanceof Schwartz ) ) {
                        return new Schwartz(options);
                    }

                    // constructor body
                    this.canvas         = document.createElement('canvas');
                    this.imgObj         = new Image();
                    this.c              = this.canvas.getContext('2d');

                    this.inverse        = options.inverse || false;
                    this.lineTagName    = options.lineTagName || 'pre';
                    this.lineClassName  = options.lineClassName || false;
                    this.callback       = options.callback || false;

                    if ( options.container ) {
                        this.hasContainer = true;
                        this.outContainer = options.container;
                    }

                    if ( options.textDimensions ) {
                        this.dimW = options.textDimensions.cols || 80;
                        this.dimH = options.textDimensions.rows || 40;
                    } else {
                        this.dimW = 80;
                        this.dimH = 40;
                    }

                    charSet = ( this.inverse ) ? charSet : charSet.reverse();
                },

                /**
                 * Default symbols
                 *
                 * @memberOf    module:Schwartz~Schwartz
                 * @member      loadImage
                 * @private
                 *
                 * @type        {Array}
                 */
                charSet = [' ', '.', ',', ':', ';', '*', '|', '~', 'I', '1', '?', '7', '>', 'Y', 'F', '4', 'V', '#', '2', '9', '6', '8', '%', 'N', 'B', 'Q', 'M', '@', 'W'],

                /**
                 * ==============================
                 * ========PRIVATE METHODS=======
                 * ==============================
                 */


                /**
                 * After load image callback
                 *
                 * @memberOf    module:Schwartz~Schwartz
                 * @callback    loadImageCallback
                 *
                 * @param       {Object}    imageData
                 */

                /**
                 * @memberOf    module:Schwartz~Schwartz
                 * @method      loadImage
                 * @private
                 *
                 * @this        {Schwartz}
                 *
                 * @param       {String}                src
                 * @param       {loadImageCallback}     callback
                 */
                loadImage = function( src, callback ) {
                    var
                        self = this,

                        imageLoaded = function( ev ) {
                            var
                                imgW = self.imgObj.width,
                                imgH = self.imgObj.height,
                                img = ev.target,
                                imageData;
                            // end of vars

                            self.canvas.width = imgW;
                            self.canvas.height = imgH;

                            self.c.drawImage(img, 0, 0);
                            imageData = self.c.getImageData(0, 0, imgW, imgH);
                            callback.call(self, imageData);
                        };
                        // end of vars

                        this.imgObj.onload = imageLoaded;
                        this.imgObj.crossOrigin = 'use-credentials';
                        this.imgObj.src = src;
                },

                /**
                 * @memberOf    module:Schwartz~Schwartz
                 * @method      getSymbol
                 * @private
                 *
                 * @this        {Schwartz}
                 *
                 * @param       {Number}    val     Gray scale value
                 */
                getSymbol = function( val ) {
                    var
                        asciival;
                    // end of vars

                    if ( isNaN(val) ) {
                        asciival = charSet[charSet.length-1];
                    } else {
                        asciival = charSet[Math.round(val/(256/(charSet.length-1)))];
                    }

                    return asciival;
                },

                /**
                 * @memberOf    module:Schwartz~Schwartz
                 * @method      getPixelGroupAvg
                 * @private
                 *
                 * @this        {Schwartz}
                 *
                 * @param       {Object}    options
                 * @param       {Object}    options.pixels              Canvas image data
                 * @param       {Number}    options.x                   Inital x position on the canvas
                 * @param       {Number}    options.y                   Inital y position on the canvas
                 * @param       {Number}    options.stepX
                 * @param       {Number}    options.stepY
                 * @param       {Boolean}   [options.onlyOpacity=false] Get average of opacity
                 *
                 * @returns     {Number}                                Average gray scale value
                 */
                getPixelGroupAvg = function( options ) {
                    var
                        imgPixels   = options.pixels,
                        initX       = options.x,
                        initY       = options.y,
                        stepX       = options.stepX,
                        stepY       = options.stepY,
                        onlyOpacity = options.onlyOpacity || false,

                        sum         = 0,
                        count       = 0,

                        x, y,
                        index,
                        avg;
                    // end of vars

                    for ( x = initX; x < initX + stepX; x++ ) {
                        for ( y = initY; y < initY + stepY; y++ ) {
                            index = (y * 4) * imgPixels.width + x * 4;

                            if ( onlyOpacity ) {
                                avg = imgPixels.data[index + 3];
                            } else {
                                avg = (imgPixels.data[index] + imgPixels.data[index + 1] + imgPixels.data[index + 2]) / 3;
                            }

                            if ( !isNaN(avg) ) {
                                sum += avg;
                                count++;
                            }
                        }
                    }

                    return parseInt(sum/count, 10);
                },

                /**
                 * @memberOf    module:Schwartz~Schwartz
                 * @method      parseImage
                 * @private
                 *
                 * @this        {Schwartz}
                 *
                 * @param       {Object}    imageData   Canvas image data
                 */
                parseImage = function( imageData ) {
                    var
                        outContainer    = this.outContainer,
                        hasContainer    = this.hasContainer,
                        lineTagName     = this.lineTagName,
                        lineClassName   = this.lineClassName,
                        imgW            = imageData.width,
                        imgH            = imageData.height,
                        art             = [],
                        str,
                        symbol,
                        p,
                        x, y, avg;
                    //end of vars

                    this.dimX = Math.round(imgW/this.dimW);
                    this.dimY = Math.round(imgH/this.dimH);

                    // fast remove all container's childs
                    if ( hasContainer ) {
                        while ( outContainer.firstChild ) {
                            outContainer.removeChild(outContainer.firstChild);
                        }
                    }

                    for ( y = 0; y < imgH; ) {
                        str = '';

                        for ( x = 0; x < imgW; ) {
                            avg = getPixelGroupAvg({
                                pixels: imageData,
                                x: x,
                                y: y,
                                stepX: this.dimX,
                                stepY: this.dimY
                            });

                            symbol = getSymbol.call(this, avg);
                            str += symbol;

                            x += this.dimX;
                        }

                        art.push(str);

                        // Output image as text into container
                        if ( hasContainer ) {
                            p = document.createElement(lineTagName);
                            p.innerHTML = str;

                            if ( lineClassName ) {
                                p.className = lineClassName;
                            }

                            outContainer.appendChild(p);
                        }

                        y += this.dimY;
                    }

                    console.info(this.dimX);
                    console.info(this.dimY);

                    if ( typeof this.callback !== 'undefined' && typeof this.callback === 'function' ) {
                        this.callback(art);
                    }
                },

                /**
                 * @memberOf    module:Schwartz~Schwartz
                 * @method      videoTimerCallback
                 * @private
                 *
                 * @this        {Schwartz}
                 */
                videoTimerCallback = function() {
                    var
                        videoWidth  = this.videoWidth,
                        videoHeight = this.videoHeight,
                        self        = this,
                        imageData;
                    // end of vars

                    if ( this.video.paused || this.video.ended ) {
                        return;
                    }

                    this.c.drawImage(this.video, 0, 0, videoWidth, videoHeight);
                    imageData = this.c.getImageData(0, 0, videoWidth, videoHeight);
                    parseImage.call(this, imageData);

                    setTimeout(function () {
                        videoTimerCallback.call(self);
                    }, 0);
                };
            // end of vars


            /**
             * ==============================
             * ========PUBLIC METHODS========
             * ==============================
             */

            /**
             * @memberOf    module:Schwartz~Schwartz
             * @method      setCharSet
             * @public
             *
             * @param       {String}    str
             */
            Schwartz.prototype.setCharSet = function( str ) {
                var
                    // create local canvas
                    canvas  = document.createElement('canvas'),
                    c       = canvas.getContext('2d'),
                    all     = [],

                    i, avg, imgPixels;
                // end of vars

                canvas.width = 10;
                canvas.height = 20;
                c.fillStyle = "#111";
                c.strokeStyle = "#111";
                c.font = '20px monospace';
                charSet = [];

                for ( i = 0; i < str.length; i++ ) {
                    // reset canvas
                    canvas.width = canvas.width;

                    c.fillText(str[i], 0, 10, 10);
                    imgPixels = c.getImageData(0, 0, canvas.width, canvas.height);

                    avg = getPixelGroupAvg({
                        pixels: imgPixels,
                        x: 0,
                        y: 0,
                        stepX: canvas.width,
                        stepY: canvas.height,
                        onlyOpacity: true
                    });

                    all[avg] = str[i];
                }

                for ( i = 0; i < all.length; i++ ) {
                    if ( all[i] ) {
                        charSet.push(all[i]);
                    }
                }
            };

            /**
             * @memberOf    module:Schwartz~Schwartz
             * @method      setTextDimensions
             * @public
             *
             * @param       {Number}    cols
             * @param       {Number}    rows
             */
            Schwartz.prototype.setTextDimensions = function( cols, rows ) {
                this.dimW = cols;
                this.dimH = rows;
            };

            /**
             * @memberOf    module:Schwartz~Schwartz
             * @method      loadImg
             * @public
             *
             * @param       {String} src    Image source URI
             */
            Schwartz.prototype.generateFromImage = function( src ) {
                loadImage.call(this, src, parseImage);
            };

            /**
             * @memberOf    module:Schwartz~Schwartz
             * @method      loadImg
             * @public
             *
             * @param       {DOM Element}   video    Video DOM element
             */
            Schwartz.prototype.generateFromVideo = function( video ) {
                var
                    self = this;
                // end of vars

                this.video = video;
                this.videoWidth = video.videoWidth;
                this.videoHeight = video.videoHeight;

                video.addEventListener('play', function() {
                    videoTimerCallback.call(self);
                }, false);
            };

            return Schwartz;
        }());
    // end of vars


    return Schwartz;
});
