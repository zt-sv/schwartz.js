/**
 * Render from uploaded image
 */
!function( window, document ) {
    var
        body      = document.getElementsByTagName('body')[0],
        input     = document.getElementById('uploadInput'),
        imagePrev = document.getElementById('uploadedImagePreview'),
        canvas    = document.getElementById('uploadedImageContainer'),
        c         = canvas.getContext('2d'),

        handleFiles = function( e ) {
            var
                reader = new FileReader();
            // end of vars

            reader.onload = function ( event ) {
                imagePrev.setAttribute('src', event.target.result);
                schwartz.generateFromImage(URL.createObjectURL(e.target.files[0]));
            }

            reader.readAsDataURL(input.files[0]);
        },

        renderToCanvas = function( result ) {
            var
                rows = result.length,
                cols = result[0].length,

                font = '9px monospace',

                stepX, stepY, i, j, symbolInfo;
            // end of vars

            canvas.width  = imagePrev.width;
            canvas.height = imagePrev.height;

            stepX = Math.round(imagePrev.width/cols);
            stepY = Math.round(imagePrev.height/rows);

            for ( i = 0; i < rows; i++ ) {
                for ( j = 0; j < cols; j++ ) {
                    symbolInfo  = result[i][j];
                    c.fillStyle = 'rgb(' + symbolInfo.r +', ' + symbolInfo.g +', ' + symbolInfo.b +')';
                    c.font      = font;

                    c.fillText(symbolInfo.sym, j * stepY, i * stepX);
                }
            }
        },

        schwartz = new Schwartz({
            render: renderToCanvas
        });
    // end of vars

    // body.appendChild(outDiv);
    input.addEventListener('change', handleFiles);
}(
    this,
    this.document
);