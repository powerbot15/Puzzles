(function($){

//region ================= Particle Class ==============

    function Particle(pixels, originalIndex, shuffledIndex){

        this.$element = $('<canvas>');
        this.$element.addClass('particle');
        this.$element.get(0).width = 100;
        this.$element.get(0).height = 100;
        this.context = this.$element.get(0).getContext('2d');
        this.context.putImageData(pixels, 0, 0);
        this.originalIndex = originalIndex;
        this.shuffledIndex = shuffledIndex;

        this.$element.draggable({zIndex: 100}).disableSelection();

    }

    Particle.prototype.element = {};
    Particle.prototype.context = {};
    Particle.prototype.originalIndex = 0;
    Particle.prototype.shuffledIndex = 0;

    Particle.prototype.moveOnDrop = function(){
        //TODO implement doings when particle dropped on tha area of original view
    };

//endregion

//region ================= Game Field Class ============

    function GameField(){

        this.particles = [];
        this.shuffledIndexes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].shuffle();
        this.createField();

    }
    GameField.prototype.particles = [];
    GameField.prototype.shuffledIndexes = [];

    GameField.prototype.createField = function(){

        var originalImage = document.getElementById('hidden-original'),
            drownImage = document.getElementsByClassName('help-view')[0],
            drownImageContext  = drownImage.getContext('2d'),
            imageWidth = originalImage.width,
            imageHeight = originalImage.height,
            pixelsColor;
        drownImage.width = imageWidth;
        drownImage.height = imageHeight;
        drownImageContext.drawImage(originalImage, 0, 0, imageWidth, imageHeight);
        pixelsColor = drownImageContext.getImageData(0, 0, imageWidth, imageHeight);

        this.getParticles(drownImageContext, 100, 100);

        this.placeParticles();

        $('body').droppable({
            drop: function(e, ui){
                ui.draggable.css('top', '0px');
                ui.draggable.css('left', '0px');
            }
        });

        $('.place').droppable({
            drop: function (e, ui) {
                var td = $(this),
                    distanceX = Math.abs(ui.position.left),
                    distanceY = Math.abs(ui.position.top);

                if (td.children().length > 0){
                    ui.draggable.css('top', '0px');
                    ui.draggable.css('left', '0px');
                    return;
                }

                ui.draggable.css('top', '0px');
                ui.draggable.css('left', '0px');
                ui.draggable.appendTo(this);

            }
        }).disableSelection();

        drownImageContext.putImageData(this.convertColors(pixelsColor), 0, 0);

    };


    GameField.prototype.convertColors = function(pixelsArray){

        var pxLength = pixelsArray.data.length, gray, i;
        for(i = 0; i < pxLength; i += 4){
            gray = (pixelsArray.data[i] + pixelsArray.data[i+1] + pixelsArray.data[i+2]) / 3;
            gray = gray > 127 ? 0 : 255;
            pixelsArray.data[i] = pixelsArray.data[i+1] = pixelsArray.data[i+2] = gray;
        }
        return pixelsArray;
    };

    GameField.prototype.getParticles = function(context, particleWidth, particleHeight){
        var originalIndex = 0;

        for(var i = 0; i <= 4; i++){
            for( var j = 0; j <= 4; j++){

                this.particles.push(new Particle(
                    context.getImageData(j * particleWidth, i * particleHeight,
                    j * particleWidth + particleWidth,
                    i * particleHeight + particleHeight),
                    originalIndex,
                    this.shuffledIndexes[originalIndex])
                );
                originalIndex++;

            }
        }

    };

    GameField.prototype.placeParticles = function(){
        var $places = $('.shuffled-view .place'), i;

        for(i = 0; i < $places.length; i++){
            $places.eq(this.particles[i].shuffledIndex).append(this.particles[i].$element.get(0));
        }
    };

//endregion

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

    window.addEventListener('load', function(){

        var field = new GameField();
        field.createField();
        console.log(field);
    });
})(jQuery);

