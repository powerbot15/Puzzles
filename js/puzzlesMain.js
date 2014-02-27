(function(){

    window.addEventListener('load', function(){

        var image = document.getElementsByClassName('hidden')[0],
            originalImage = document.getElementsByClassName('original')[0],
            originalContext = originalImage.getContext('2d'),
            puzzleImage = document.getElementsByClassName('shuffled')[0],
            puzzleContext = puzzleImage.getContext('2d'),
            parts,
            grayImage;

        originalImage.width = puzzleImage.width = image.width;
        originalImage.height = puzzleImage.height = image.height;


        originalContext.drawImage(image, 0, 0, image.width, image.height);
        parts = getParts(originalContext).shuffle();
        grayImage = changeColorsToGrayScale(originalContext);
        originalContext.clearRect(0, 0, image.width, image.height);
        originalContext.putImageData(grayImage, 0, 0);

        drawParts(parts, puzzleContext);
        drawGrid(originalContext);
        drawGrid(puzzleContext);

    });

    function getParts(context){
        var parts = [];

        for(var i = 0; i <= 4; i++){
            for( var j = 0; j <= 4; j++){
                parts.push(context.getImageData(i*100,j*100,i*100+100,j*100+100));
            }
        }
        return parts;
    }

    function drawParts(parts, context){
        for(var i = 0; i <= 4; i++){
            for( var j = 0; j <= 4; j++){
                context.putImageData(parts.shift(), i*100, j*100);
            }
        }
    }

    function drawGrid(context){

        context.strokeStyle = 'black';
        for(var i = 0; i <= 4; i++){

            for( var j = 0; j <= 4; j++){

                context.strokeRect(i*100,j*100,i*100+100,j*100+100);

            }

        }
    }

    function changeColorsToGrayScale(context){
        var pixelsData = context.getImageData(0, 0, context.canvas.width, context.canvas.height),
            grayIntensity;
        for(var i = 0; i < pixelsData.data.length; i += 4){
            grayIntensity = (pixelsData.data[i] + pixelsData.data[i+1] + pixelsData.data[i+2]) / 3;
            grayIntensity += 100;
            pixelsData.data[i] = grayIntensity;
            pixelsData.data[i+1] = grayIntensity;
            pixelsData.data[i+2] = grayIntensity;
        }
        return pixelsData;
    }

    Array.prototype.shuffle = function(){
        var
            randomIndex,
            exchangeVar,
            countOfElements = this.length;

        for(var i = 0; i < countOfElements; i++){

            randomIndex = getRandomInt(0, countOfElements - 1);

            exchangeVar = this[randomIndex];
            this[randomIndex] = this[i];
            this[i] = exchangeVar;

        }

        return this;

    };


    function getRandomInt(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

})();
