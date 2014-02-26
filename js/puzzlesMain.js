(function(){

    window.addEventListener('load', function(){

        var image = document.getElementsByClassName('hidden')[0],
            originalImage = document.getElementsByClassName('original')[0],
            originalContext = originalImage.getContext('2d'),
            puzzleImage = document.getElementsByClassName('shuffled')[0],
            puzzleContext = puzzleImage.getContext('2d'),
            parts;

        originalImage.width = image.width;
        originalImage.height = image.height;
        puzzleImage.width = image.width;
        puzzleImage.height = image.height;
        originalContext.drawImage(image, 0, 0, image.width, image.height);
        console.log(originalContext);
        parts = getParts(originalContext).shuffle();
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

        context.strokeStyle = 'red';
        for(var i = 0; i <= 4; i++){

            for( var j = 0; j <= 4; j++){

                context.strokeRect(i*100,j*100,i*100+100,j*100+100);

            }

        }
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
/*jQuery(function($){

    var image,originalImage,originalContext;
    image = $('.hidden').get(0);
    originalImage = document.getElementsByClassName('original')[0];
    originalContext = originalImage.getContext('2d');

    console.log(image);
    console.log(image.width);
    console.log(originalImage);
    originalImage.width = image.width;
    originalImage.height = image.height;
    originalContext.drawImage(image, 0, 0, image.width, image.height);
    console.log(image.src);


});*/
