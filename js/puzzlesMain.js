(function(){

    function Particle(context, xStart, yStart, xWidth, yHeight ){

        this.imagePart = context.getImageData(xStart, yStart, xWidth, yHeight);
        this.imagePartGray = context.getImageData(xStart, yStart, xWidth, yHeight);
        this.xOrigStart = xStart;
        this.xOrigWidth = xWidth;
        this.yOrigStart = yStart;
        this.yOrigWidth = yHeight;

    }

    Particle.prototype.imagePart = {};
    Particle.prototype.imagePartGray = {};
    Particle.prototype.xOrigStart = 0;
    Particle.prototype.xOrigWidth = 0;
    Particle.prototype.yOrigStart = 0;
    Particle.prototype.yOrigWidth = 0;
    Particle.prototype.xShuffledStart = 0;
    Particle.prototype.xShuffledWidth = 0;
    Particle.prototype.yShuffledStart = 0;
    Particle.prototype.yShuffledHeight = 0;


    Particle.prototype.setPixelsGray = function(){
        var grayIntensity;
        for(var i = 0; i < this.imagePartGray.data.length; i += 4){
            grayIntensity = (this.imagePartGray.data[i] + this.imagePartGray.data[i+1] + this.imagePartGray.data[i+2]) / 3;
            grayIntensity += 100;
            this.imagePartGray.data[i] = grayIntensity;
            this.imagePartGray.data[i+1] = grayIntensity;
            this.imagePartGray.data[i+2] = grayIntensity;
        }
    };
    Particle.prototype.drawColor = function(context){
        context.putImageData(this.imagePart, this.xShuffledStart, this.yShuffledStart);
    };



    var image = document.getElementsByClassName('hidden')[0],
        originalImage = document.getElementsByClassName('original')[0],
        originalContext = originalImage.getContext('2d'),
        puzzleImage = document.getElementsByClassName('shuffled')[0],
        puzzleContext = puzzleImage.getContext('2d'),
        partWidth = 100,
        partHeight = 100,
        parts, partsShuffled,
        particle,

        grayImage;

    window.addEventListener('load', function(){

        originalImage.width = puzzleImage.width = image.width;
        originalImage.height = puzzleImage.height = image.height;


        originalContext.drawImage(image, 0, 0, image.width, image.height);
        parts = getParts(originalContext).shuffle();
        grayImage = changeColorsToGrayScale(originalContext);
        originalContext.clearRect(0, 0, image.width, image.height);
        originalContext.putImageData(grayImage, 0, 0);

        drawParts(parts, puzzleContext);
        partsShuffled = getParts(puzzleContext);
        drawGrid(originalContext);
        drawGrid(puzzleContext);

    });

    puzzleImage.addEventListener('click', function(event){
        var xIndex = Math.floor(event.layerX/partWidth),
            yIndex = Math.floor(event.layerY/partHeight),
            linearIndex = yIndex * 5 + xIndex;

        puzzleContext.strokeStyle = 'red';

        puzzleContext.strokeRect(
            partsShuffled[linearIndex].x, partsShuffled[linearIndex].y,
            partsShuffled[linearIndex].width, partsShuffled[linearIndex].height);



    });

    function getParts(context){
        var parts = [],
            particle = new Particle(context, 0, 0, 100, 100);
        particle.setPixelsGray();
        for(var i = 0; i <= 4; i++){
            for( var j = 0; j <= 4; j++){
                particle = context.getImageData(i*partWidth,j*partHeight,i*partWidth+partWidth,j*partHeight+partHeight);
                particle.x = i*partWidth;
                particle.y = j*partHeight;
                particle.xWidth = partWidth;
                particle.yHeight = partHeight;
                console.log(particle);
                parts.push(particle);
            }
        }
        return parts;
    }

    function drawParts(parts, context){
        var partsLocal = [], i, j;
        for(i = 0; i < parts.length; i++){
            partsLocal.push(parts[i]);
        }
        for(i = 0; i <= 4; i++){
            for(j = 0; j <= 4; j++){
                context.putImageData(partsLocal.shift(), i*partWidth, j*partHeight);
            }
        }
    }

    function drawGrid(context){

        context.strokeStyle = 'black';
        for(var i = 0; i <= 4; i++){

            for( var j = 0; j <= 4; j++){

                context.strokeRect(i*partWidth,j*partHeight,i*partWidth+partWidth,j*partHeight+partHeight);

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
