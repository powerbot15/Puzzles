(function($){

/*    $(function(){     //WTF? In this way it doesn't working!
        var field = new GameField();
        field.createField();
        console.log(field);
    });*/

    $(window).on('load', function(){
        var $imageToUse = $('#hidden-original'),
            field = new GameField(),
            $menuItems = $('.menu-item'),
            delay = 500;

        $menuItems.each(function(){
            var self = this;
            setTimeout(function(){
                $(self).animate({
                    width: "+=120"
                }, 200);
            }, delay);

            delay += 200;
            console.log(this);

        });
        $imageToUse.get(0).src = 'img/mushroom.jpg';

        $('#menu').on('click','li', function(event){
            $imageToUse.get(0).src = event.target.id;
            return false;
        });

        $imageToUse.on('load', function(){
            field.createField();
        });

    });

//region =================== Implementation ================
    //region ================= Particle Class ==============

    function Particle(pixels, originalIndex, shuffledIndex){
        var elementHTML;
        this.$element = $('<canvas>');
        this.$element.addClass('particle');
        elementHTML = this.$element.get(0);
        elementHTML.width = 100;
        elementHTML.height = 100;
        elementHTML.getContext('2d').putImageData(pixels, 0, 0);
        elementHTML.originalIndex = originalIndex;
        elementHTML.shuffledIndex = shuffledIndex;

        this.$element.draggable({zIndex: 100}).disableSelection();


    }

//endregion

//region ================= Game Field Class ============

    function GameField(){

        this.particles = [];
        this.shuffledIndexes = this.createPlainIndexes(25).shuffle();

    }

    GameField.prototype.createPlainIndexes = function(count){
        var resultArray = [], i;
        for(i = 0; i < count; i++){
            resultArray.push(i);
        }
        return resultArray;
    };
    GameField.prototype.createField = function(){

        var originalImage = $('#hidden-original').get(0),
            drownImage = $('.help-view').get(0),
            drownImageContext  = drownImage.getContext('2d'),
            winString = $('#when-collected'),
            imageWidth = 500,//originalImage.width*(originalImage.width/500),
            imageHeight = 500,//originalImage.height*(originalImage.height/500),
            pixelsColor,
            self;

        winString.text('');
        drownImage.width = imageWidth;
        drownImage.height = imageHeight;
        drownImageContext.drawImage(originalImage, 0, 0, imageWidth, imageHeight);
        pixelsColor = drownImageContext.getImageData(0, 0, imageWidth, imageHeight);
        this.shuffledIndexes = this.createPlainIndexes(25).shuffle();
        this.createParticlesFromImage(drownImageContext, 100, 100);
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
                    winString.text('Все правильно !!!');
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

    GameField.prototype.createParticlesFromImage = function(context, particleWidth, particleHeight){
        var originalIndex = 0;
        this.particles = [];
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

        $('.place').children().remove();

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

