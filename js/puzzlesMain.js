(function(){

    function Particle(context, xStart, yStart, xWidth, yHeight ){

        this.imagePart = context.getImageData(xStart, yStart, xStart+xWidth, yStart+yHeight);
        this.imagePartGray = context.getImageData(xStart, yStart, xStart+xWidth, yStart+yHeight);
        this.xOrigStart = xStart;
        this.xShuffledStart = xStart;
        this.xOrigWidth = xWidth;
        this.yOrigStart = yStart;
        this.yShuffledStart = yStart;
        this.yOrigHeight = yHeight;


    }

    Particle.prototype.imagePart = {};
    Particle.prototype.imagePartGray = {};
    Particle.prototype.xOrigStart = 0;
    Particle.prototype.xOrigWidth = 0;
    Particle.prototype.yOrigStart = 0;
    Particle.prototype.yOrigHeight = 0;
    Particle.prototype.xShuffledStart = 0;
    Particle.prototype.xShuffledWidth = 0;
    Particle.prototype.yShuffledStart = 0;
    Particle.prototype.yShuffledHeight = 0;
    Particle.prototype.borderedRed = false;


    Particle.prototype.setPixelsGray = function(){
        var grayIntensity;
        for(var i = 0; i < this.imagePartGray.data.length; i += 4){
            grayIntensity = (this.imagePartGray.data[i] + this.imagePartGray.data[i+1] + this.imagePartGray.data[i+2]) / 3;
            grayIntensity += 100; //lightening gray color
            this.imagePartGray.data[i] = grayIntensity;
            this.imagePartGray.data[i+1] = grayIntensity;
            this.imagePartGray.data[i+2] = grayIntensity;
        }
        return this;
    };

    Particle.prototype.drawColor = function(context){
        context.putImageData(this.imagePart, this.xShuffledStart, this.yShuffledStart);
        return this;
    };

    Particle.prototype.drawGray = function(context){
        context.putImageData(this.imagePartGray, this.xOrigStart, this.yOrigStart);
        return this;
    };
    Particle.prototype.drawBorder = function(color, context){

        context.strokeStyle = color;
        context.strokeRect(this.xOrigStart, this.yOrigStart, this.xOrigWidth, this.yOrigHeight);
        return this;
    }



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
        parts = getParts(originalContext);//.shuffle();

        drawParts(parts, originalContext);
       // partsShuffled = parts.shuffleParticles();
        console.log(partsShuffled);
        drawParts(parts, puzzleContext, 'colored');

    });

    puzzleImage.addEventListener('click', function(event){
        var xIndex = Math.floor(event.layerX/partWidth),
            yIndex = Math.floor(event.layerY/partHeight),
            linearIndex = yIndex * 5 + xIndex;

        for(var i = 0; i < parts.length; i++){
            if(parts[i].borderedRed){
                parts[i].borderedRed = false;
                parts[i].drawBorder('green', puzzleContext);
            }
        }
        if (!parts[linearIndex].borderedRed){
            parts[linearIndex].drawBorder('red', puzzleContext);
            parts[linearIndex].borderedRed = true;
        }

        /*puzzleContext.strokeRect(
            partsShuffled[linearIndex].x, partsShuffled[linearIndex].y,
            partsShuffled[linearIndex].width, partsShuffled[linearIndex].height);*/



    });

    function getParts(context){
        var parts = [],
            particle = new Particle(context, 0, 0, 100, 100);
        particle.setPixelsGray();
        for(var i = 0; i <= 4; i++){
            for( var j = 0; j <= 4; j++){
                particle = new Particle(context, j*partWidth,i*partHeight, partWidth, partHeight);
                particle.setPixelsGray();
                parts.push(particle);
            }
        }
        return parts;
    }

    function drawParts(parts, context, colored){
        var partsLocal = [], i, j, currentParticle = 0;

        if(colored === 'colored'){
            for(i = 0; i < parts.length; i++){
                parts[i].drawColor(context).drawBorder('green', context);
            }
            return;
        }
        for(i = 0; i < parts.length; i++){
            parts[i].drawGray(context).drawBorder('green', context);

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

            exchangeVar = this[randomIndex].x;
            this[randomIndex] = this[i];
            this[i] = exchangeVar;

        }

        return this;

    };
    Array.prototype.shuffleParticles = function(){
        var
            randomIndex,
            countOfElements = this.length;

        for(var i = 0; i < countOfElements; i++){

            randomIndex = getRandomInt(0, countOfElements - 1);

            this[i].xShuffledStart = this[randomIndex].xOrigStart;
            this[i].yShuffledStart = this[randomIndex].yOrigStart;
            this[randomIndex].xShuffledStart = this[i].xOrigStart;
            this[randomIndex].yShuffledStart = this[i].yOrigStart;


        }

        return this;

    };


    function getRandomInt(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

})();
