var
    datGui = new dat.GUI();

/**
 * Render from uploaded image
 */
!function( window, document, gui ) {
    var
        body      = document.getElementsByTagName('body')[0],
        input     = document.getElementById('uploadInput'),
        imagePrev = document.getElementById('uploadedImagePreview'),
        canvas    = document.getElementById('uploadedImageContainer'),
        c         = canvas.getContext('2d'),
        image     = 'http://13rentgen.github.io/schwartz.js/images/monalisa.jpg',

        detailController,

        handleFiles = function( e ) {
            var
                reader = new FileReader();
            // end of vars

            reader.onload = function ( event ) {
                imagePrev.setAttribute('src', event.target.result);
                image = URL.createObjectURL(e.target.files[0]);
                schwartz.generateFromImage(image);
            }

            reader.readAsDataURL(input.files[0]);
        },

        renderToCanvas = function( result ) {
            var
                rows    = result.length,
                cols    = result[0].length,

                yOffset = 0, // Free space beetween symbols
                xOffset = 0, // Free space beetween symbols

                font, stepX, stepY, i, j, symbolInfo;
            // end of vars

            canvas.width  = imagePrev.width;
            canvas.height = imagePrev.height;

            stepX = imagePrev.width/cols;
            stepY = imagePrev.height/rows;

            font  = stepY + 1 + 'px monospace';

            for ( i = 0; i < rows; i++ ) {
                for ( j = 0; j < cols; j++ ) {
                    symbolInfo  = result[i][j];
                    c.fillStyle = 'rgb(' + symbolInfo.r +', ' + symbolInfo.g +', ' + symbolInfo.b +')';
                    c.font      = font;

                    c.fillText(symbolInfo.sym, j * (stepX + xOffset), i * (stepY + yOffset));
                }
            }
        },

        schwartz = new Schwartz({
            render: renderToCanvas,
            detail: 60
        });
    // end of vars

    schwartz.generateFromImage(image);
    input.addEventListener('change', handleFiles);

    detailController  = gui.add(schwartz, 'detail', 1, 100);
    inverseController = gui.add(schwartz, 'inverse');
    gui.open();

    detailController.onFinishChange(function( value ) {
        schwartz.setDetail(value);
        schwartz.generateFromImage(image);
    });

    inverseController.onFinishChange(function( value ) {
        schwartz.inverseImage();
        schwartz.generateFromImage(image);
    });
}(
    this,
    this.document,
    datGui.addFolder('Uploaded image controller')
);

/**
 * Render test video
 */
!function( window, document, gui ) {
    var
        body      = document.getElementsByTagName('body')[0],
        video     = document.getElementsByTagName('video')[0],
        canvas    = document.getElementById('videoTestImageContainer'),
        c         = canvas.getContext('2d'),

        detailController,

        renderToCanvas = function( result ) {
            var
                rows    = result.length,
                cols    = result[0].length,

                yOffset = 0, // Free space beetween symbols
                xOffset = 0, // Free space beetween symbols

                font, stepX, stepY, i, j, symbolInfo;
            // end of vars

            canvas.width  = video.width;
            canvas.height = video.height;

            stepX = video.width/cols;
            stepY = video.height/rows;

            font  = stepY + 1 + 'px monospace';

            for ( i = 0; i < rows; i++ ) {
                for ( j = 0; j < cols; j++ ) {
                    symbolInfo  = result[i][j];
                    c.fillStyle = 'rgb(' + symbolInfo.r +', ' + symbolInfo.g +', ' + symbolInfo.b +')';
                    c.font      = font;

                    c.fillText(symbolInfo.sym, j * (stepX + xOffset), i * (stepY + yOffset));
                }
            }
        },

        schwartz = new Schwartz({
            render: renderToCanvas,
            detail: 35
        });
    // end of vars

    schwartz.generateFromVideo(video);

    detailController  = gui.add(schwartz, 'detail', 1, 100);
    inverseController = gui.add(schwartz, 'inverse');
    gui.open();

    detailController.onFinishChange(function( value ) {
        schwartz.setDetail(value);
        schwartz.generateFromVideo(video);
    });

    inverseController.onFinishChange(function( value ) {
        schwartz.inverseImage();
        schwartz.generateFromVideo(video);
    });
}(
    this,
    this.document,
    datGui.addFolder('Video controller')
);
