(function($){

/*    $(function(){     //WTF? In this way it doesn't working!
        var field = new GameField();
        field.createField();
        console.log(field);
    });*/

    $(window).on('load', function(){

        var field = new GameField();
        field.createField();
        console.log(field);

    });

//region =================== Implementation ================
    //region ================= Particle Class ==============

    function Particle(pixels, originalIndex, shuffledIndex){

        this.$element = $('<canvas>');
        this.$element.addClass('particle');
        this.$element.get(0).width = 100;
        this.$element.get(0).height = 100;
        this.$element.get(0).getContext('2d').putImageData(pixels, 0, 0);
        this.$element.get(0).originalIndex = originalIndex;
        this.$element.get(0).shuffledIndex = shuffledIndex;

        this.$element.draggable({zIndex: 100}).disableSelection();

    }

//endregion

//region ================= Game Field Class ============

    function GameField(){

        this.particles = [];
        this.shuffledIndexes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].shuffle();

    }

    GameField.prototype.createField = function(){

        var originalImage = $('#hidden-original').get(0),
            drownImage = $('.help-view').get(0),
            drownImageContext  = drownImage.getContext('2d'),
            imageWidth = 500,//originalImage.width*(originalImage.width/500),
            imageHeight = 500,//originalImage.height*(originalImage.height/500),
            pixelsColor,
            self;
        drownImage.width = imageWidth;
        drownImage.height = imageHeight;
        drownImageContext.drawImage(originalImage, 0, 0, imageWidth, imageHeight);
        pixelsColor = drownImageContext.getImageData(0, 0, imageWidth, imageHeight);

        this.getParticles(drownImageContext, 100, 100);
        this.placeParticles();

        self = this;

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
                ui.draggable.get(0).shuffledIndex = $(this).index('.place');
                ui.draggable.appendTo(this);
                if(self.checkSequence()){
                    $('#when-collected').text('Все правильно !!!');
                }
            }
        }).disableSelection();

        drownImageContext.putImageData(this.convertColors(pixelsColor), 0, 0);

    };

    GameField.prototype.convertColors = function(pixelsArray){

        var pxLength = pixelsArray.data.length, gray, i;
        for(i = 0; i < pxLength; i += 4){
            gray = (pixelsArray.data[i] + pixelsArray.data[i+1] + pixelsArray.data[i+2]) / 3;
            gray = gray > 127 ? 255 : 0;
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
            $places.eq(this.particles[i].$element.get(0).shuffledIndex).append(this.particles[i].$element.get(0));
        }
    };

    GameField.prototype.checkSequence = function(){

        for(var i = 0; i < this.particles.length; i++){
            if(this.particles[i].$element.get(0).originalIndex != this.particles[i].$element.get(0).shuffledIndex){
                return false;
            }
        }
        return true;

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

//endregion


})(jQuery);

