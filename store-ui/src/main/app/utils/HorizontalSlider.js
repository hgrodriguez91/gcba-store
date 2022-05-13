var HorizontalSlider = function($selector, $sliderScrollContainer)
{
    $selector.each(function(){
        var $slider = $sliderScrollContainer.children('ul'),
            $item = $slider.children('li'),
            items = $item.size(), // Cantidad de items
            $buttons = $('.navigation-btn', $(this)),
            marginLeft = 0;

        $(window).resize(function(){ // Al resizear la pantalla, reseteo el scroll al principio
            marginLeft = 0;
            $slider.css({marginLeft: marginLeft + 'px'});
        });

        $buttons.on('click', function(e){
            if ($(this).hasClass('prev'))
            {
                if (marginLeft < 0){
                    marginLeft += $item.width();
                }
                else
                {
                    marginLeft = (-1 * (items - Math.round($sliderScrollContainer.width() / $item.width())) * $item.width());
                }
            }
            else if ($(this).hasClass('next'))
            {
                if (marginLeft > (-1 * (items - Math.round($sliderScrollContainer.width() / $item.width())) * $item.width())){
                    marginLeft -= $item.width();
                }
                else
                {
                    marginLeft = 0;
                }
            }
            $slider.css({marginLeft: marginLeft + 'px'});
            return false;
        });
    });

    this.selectItem = function(i)
    {
        $selector.each(function(){
            var $slider = $sliderScrollContainer.children('ul'),
                $item = $slider.children('li'),
                marginLeft = (i - 1) * ($item.width() * -1);

            $slider.css({marginLeft: marginLeft + 'px'});
        });
    };
};
