'use strict';

$(function () {

    console.log('ready');
    let timer = 4;

    setInterval(() => {
        console.log('interval');
        $(".tijd").html(timer);

        timer--;

        if (timer == 1) {
            $(".hand1").css({
                opacity: 0.1
            });
            $(".hand2").css({
                opacity:1
            })

        }else if(timer == -1){
            window.location.replace("paint.html");
        }
        
    }, 1000);
});