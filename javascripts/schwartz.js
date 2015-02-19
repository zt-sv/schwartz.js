/**
 * Generate ACII art from image or video
 *
 * @module   Schwartz
 * @version  1.6
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
 *            textDimensions: {
 *                cols: 200,
 *                rows: 120
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
                 * @param       {Object[][]}  res       Art strings by line
                 * @param       {Number}      res.r     Red channel average
                 * @param       {Number}      res.g     Green channel average
                 * @param       {Number}      res.b     Blue channel average
                 * @param       {Number}      res.a     Alpha channel average
                 * @param       {Number}      res.c     Composite average
                 * @param       {Number}      res.sym   Symbol
                 */

                /**
                 * @memberOf     module:Schwartz~
                 *
                 * @constructs   Schwartz
                 *
                 * @param        {Object}               [options]
                 * @param        {Boolean}              [options.inverse=false]
                 * @param        {Number}               [options.detail=50]
                 * @param        {String}               [options.lineTagName=pre]
                 * @param        {String}               [options.lineClassName]
                 * @param        {DOM Element}          [options.container]
                 * @param        {parseImageCallback}   [options.render]
                 */
                Schwartz = function Schwartz( options ) {
                    // enforces new
                    if ( !( this instanceof Schwartz ) ) {
                        return new Schwartz(options);
                    }

                    // constructor body
                    this.canvas        = document.createElement('canvas');
                    this.imgObj        = new Image();
                    this.c             = this.canvas.getContext('2d');

                    this.inverse       = options.inverse || false;
                    this.lineTagName   = options.lineTagName || 'pre';
                    this.lineClassName = options.lineClassName || false;
                    this.callback      = options.render || false;

                    /**
                     * Default symbols
                     *
                     * @memberOf    module:Schwartz~Schwartz
                     * @member      loadImage
                     * @private
                     *
                     * @type        {Array}
                     */
                    this.charSet        = [' ', '.', ',', ':', ';', '*', '|', '~', 'I', '1', '?', '7', '>', 'Y', 'F', '4', 'V', '#', '2', '9', '6', '8', '%', 'N', 'B', 'Q', 'M', '@', 'W'];

                    if ( options.container ) {
                        this.hasContainer = true;
                        this.outContainer = options.container;
                    }

                    if ( options.detail && options.detail <= 100 && options.detail > 0 ) {
                        this.detail = options.detail;
                    } else {
                        this.detail = 50;
                    }

                    this.charSet = ( this.inverse ) ? this.charSet : this.charSet.reverse();
                },

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

                    // console.info(val);

                    if ( isNaN(val) ) {
                        asciival = this.charSet[this.charSet.length-1];
                    } else {
                        asciival = this.charSet[(this.charSet.length * val / 256 ) | 0];
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
                 *
                 * @return      {Object}    res
                 * @return      {Number}    res.r                       Red channel average
                 * @return      {Number}    res.g                       Green channel average
                 * @return      {Number}    res.b                       Blue channel average
                 * @return      {Number}    res.a                       Alpha channel average
                 * @return      {Number}    res.c                       Composite average
                 */
                getPixelGroupAvg = function( options ) {
                    var
                        imgPixels = options.pixels,
                        initX     = options.x,
                        initY     = options.y,
                        stepX     = options.stepX,
                        stepY     = options.stepY,

                        count     = 0,
                        sumR      = 0,
                        sumG      = 0,
                        sumB      = 0,
                        sumA      = 0,
                        sumC      = 0,

                        r, g, b, a, c,

                        x, y,
                        index;
                    // end of vars

                    for ( x = initX; x < initX + stepX; x++ ) {
                        for ( y = initY; y < initY + stepY; y++ ) {
                            index = (y * 4) * imgPixels.width + x * 4;

                            r = imgPixels.data[index];
                            g = imgPixels.data[index + 1];
                            b = imgPixels.data[index + 2];
                            a = imgPixels.data[index + 3];
                            c = (imgPixels.data[index] + imgPixels.data[index + 1] + imgPixels.data[index + 2]) / 3;

                            if ( !isNaN(r) && !isNaN(g) && !isNaN(b) && !isNaN(a) && !isNaN(c) ) {
                                sumR += r;
                                sumG += g;
                                sumB += b;
                                sumA += a;
                                sumC += c;
                                count++;
                            }
                        }
                    }

                    return {
                        r: (sumR/count) | 0,
                        g: (sumG/count) | 0,
                        b: (sumB/count) | 0,
                        a: (sumA/count) | 0,
                        c: (sumC/count) | 0
                    };
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
                        outContainer  = this.outContainer,
                        hasContainer  = this.hasContainer,
                        lineTagName   = this.lineTagName,
                        lineClassName = this.lineClassName,
                        imgW          = imageData.width,
                        imgH          = imageData.height,
                        art           = [],
                        strChar,
                        str,
                        symbol,
                        p,
                        x, y, avg;
                    //end of vars

                    this.dimX = Math.round((imgW * 100 / this.detail)/200);
                    this.dimY = Math.round((imgH * 100 / this.detail)/200);

                    this.dimX = ( this.dimX < 1) ? 1 : this.dimX;
                    this.dimY = ( this.dimY < 1) ? 1 : this.dimY;

                    // fast remove all container's childs
                    if ( hasContainer ) {
                        while ( outContainer.firstChild ) {
                            outContainer.removeChild(outContainer.firstChild);
                        }
                    }

                    for ( y = 0; y < imgH; ) {
                        str = [];
                        strChar = '';

                        for ( x = 0; x < imgW; ) {
                            avg = getPixelGroupAvg({
                                pixels: imageData,
                                x: x,
                                y: y,
                                stepX: this.dimX,
                                stepY: this.dimY
                            });

                            symbol = getSymbol.call(this, avg.c);
                            strChar += symbol;
                            avg.sym = symbol;
                            str.push(avg)

                            x += this.dimX;
                        }

                        art.push(str);

                        // Output image as text into container
                        if ( hasContainer ) {
                            p = document.createElement(lineTagName);
                            p.innerHTML = strChar;

                            if ( lineClassName ) {
                                p.className = lineClassName;
                            }

                            outContainer.appendChild(p);
                        }

                        y += this.dimY;
                    }

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
                    canvas = document.createElement('canvas'),
                    c      = canvas.getContext('2d'),
                    all    = [],

                    i, avg, imgPixels;
                // end of vars

                canvas.width  = 10;
                canvas.height = 20;
                c.fillStyle   = '#000';
                c.font        = '18px monospace';
                this.charSet  = [];

                for ( i = 0; i < str.length; i++ ) {
                    // reset canvas
                    canvas.width = canvas.width;

                    c.fillText(str[i], 0, 18);
                    imgPixels = c.getImageData(0, 0, canvas.width, canvas.height);

                    avg = getPixelGroupAvg({
                        pixels: imgPixels,
                        x: 0,
                        y: 0,
                        stepX: canvas.width,
                        stepY: canvas.height
                    });

                    all[avg.a] = str[i];
                }

                for ( i = 0; i < all.length; i++ ) {
                    if ( all[i] ) {
                        this.charSet.push(all[i]);
                    }
                }

                this.charSet = ( this.inverse ) ? this.charSet : this.charSet.reverse();
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

                this.video       = video;
                this.videoWidth  = video.videoWidth;
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
