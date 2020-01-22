'use strict'
$(function () {
    console.log("jquery ready");
    const ensor = $("#grootmeester1-container");
    const eyck = $("#grootmeester2-container");
    const rubens= $("#grootmeester3-container");
    const meesters = [ensor, eyck,rubens];
    const borders = ["left", "right", "top", "bottom"]; 
    const popUpMargin = 150;
        setInterval(function(){
        animation()
    }, 3000);
    function animation(){
        let randomX = Math.floor(Math.random()*(window.innerWidth-popUpMargin));
        let randomY = Math.floor(Math.random()*(window.innerHeight-popUpMargin));
        if(randomX < popUpMargin){
            randomX = popUpMargin;
        }else if(randomX > window.innerWidth-popUpMargin){
            randomX= window.innerWidth- popUpMargin;
        }
        if(randomY < popUpMargin){
            randomY = popUpMargin;
        }else if(randomY > window.innerheight-popUpMargin){
            randomY = window.innerheight- popUpMargin;
        }
        let randomMeester = meesters[Math.floor(Math.random()*meesters.length)];
        for(let meester of meesters){
            meester.removeClass();
            meester.css({"opacity": "0"});
        }
        randomMeester.css("opacity", "1");
        let randomBorder = borders[Math.floor(Math.random()*borders.length)];
    
        //Wie dit leest is dom
        switch(randomBorder) {
            case "top":
                $(randomMeester).removeClass();
                randomMeester.addClass("anim2");
                randomMeester.css({"transform": "rotate(170deg)",
                                    "left": randomX,
                                    "right": "initial",
                                    "top": "initial",
                                    "bottom": "initial"});
                break;
            case "right":
                $(randomMeester).removeClass();
                randomMeester.addClass("anim3");
                randomMeester.css({"transform": "rotate(-80deg)",
                                    "top": randomY,
                                    "right": "initial",
                                    "left": "initial",
                                    "bottom": "initial"});
                break;
            case "bottom":
                $(randomMeester).removeClass();
                randomMeester.addClass("anim4");
                randomMeester.css({"transform": "rotate(0deg)",
                                    "left": randomX,
                                    "right": "initial",
                                    "top": "initial",
                                    "bottom": "initial"});
                break;
            case "left":
                $(randomMeester).removeClass();
                randomMeester.addClass("anim1");
                randomMeester.css({"transform": "rotate(90deg)",
                                    "top": randomY,
                                    "right": "inital",
                                    "left": "initial",
                                    "bottom": "initial"});
                break;
            default:
          } 
          setTimeout(function(){
            for(let meester of meesters){
                meester.removeClass();
                meester.css({"opacity": "0"});
            }
           }, 2000);
         
    }
});
