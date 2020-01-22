/*
 * Writed by
 * (c) 2020 
 * Toon, Wouter, Julien, Tom, Andres
 * JQUERY: https://code.jquery.com/jquery-3.4.1.min.js
 */
/*SECOND SCREEN*/
'use strict';
let timer = 60;
$(function () {

    console.log('result.js beginning');

    //SEND IMAGE TO MAKE VECTORS
    $.ajax({
        type: "post",
        url: "http://localhost:3000/api/pythonVectorScript"
    }).done(function (err) {
        $(".fake").attr("src", `../backEnd/artworks/result.jpg`)
        console.log(err);
        //COMPARE IMAGE WITH DATABASE
        $.ajax({
            type: "post",
            url: "http://localhost:3000/api/pythonCompareScript"
        }).done(function (data) {
            console.log(data);
            //GET MOST SIMILAR IMAGE OUT OF DATABASE
            $.ajax({
                type: "get",
                url: "http://localhost:3000/api/getSimilarImages"
            }).done(function (data) {
                console.log(data[2].filename);
                let imageName = data[2].filename;
                $(".original").attr("src", `../backEnd/artworks/${imageName}.jpg`)

                //GET JSON WITH INFORMATION FROM IMAGE TO DISPLAY
                $.ajax({
                    method: "get",
                    url: "http://localhost:3000/api/getJsonOfPainting"
                }).done(function (result) {
                    // console.log(result)
                    for (let schilderij in result) {
                        if (result[schilderij].url == imageName + ".jpg") {
                            console.log(result[schilderij]);
                            $("#resultTitle").text(result[schilderij].title);
                            $(".artistName").text(result[schilderij].artist)
                            $(".paintingYear").text(result[schilderij].year)
                            $("#resultDescription").text(result[schilderij].description)
                            $("#resultLocation").text(result[schilderij].location);

                        }

                    }
                    //GET THE LABELS OF SIMILARITIES FROM PAINTED IMAGE
                    $.ajax({
                        method: "get",
                        url: "http://localhost:3000/api/getLabels"
                    }).done(function (result) {
                        console.log(result)
                        console.log(result[0]);
                        


                        // $("#similarities").append(result[similarity].labels)





                    })
                })
            });

        });
    });

    



    window.setTimeout(function () {
        $('.animation-container .left').addClass("active");
        $('.animation-container .right').addClass("active");
        $('.animation-container .top').addClass("active");
        $('.top-text').delay(5000).fadeIn('slow');
        $('.left-text').delay(500).fadeIn('slow');
        $('.right-text').delay(3000).fadeIn('slow');
    }, 1000);
    window.setTimeout(function () {
  
        let element = $("#resultPopUp");
        let getCanvas;
        html2canvas(element, {
            onrendered: function (canvas) {
                // $("body").append(canvas);
                console.log("gemaakt")
                getCanvas = canvas;
                let QRimage = getCanvas.toDataURL("image/jpg");
                $.ajax({
                    method: "POST",
                    url: "http://localhost:3000/api/uploadtoCloudinary",
                    data: {
                        "qr": QRimage
                    }

                }).done(function (result) {
                    $("#qrcode-container section").append(`<img src="${result}" alt=""></img>`)
                    $('#loadingPopup div').hide();
                    $('#loadingPopup').css({
                        "width": "0",
                        'transition': "0.5s ease-in-out",
                        // "opacity": "0"
                    });
                    setInterval(() => {
                        let barWidth = $("#timeBar").width() - ($("#timeBar").width() / timer);
                        $("#timeBar").css({
                          "width": barWidth
                        });
                        timer--;
                        
                    
                        if (timer == 0) {
                            window.location.replace("../pages/tutorial.html");
                          
                          
                          // CODE VOOR RESULTAAT OP TE SLAAN
                        }
                      }, 1000);
                    
                    // console.log(result);
                })

            }
        });

    }, 11000);
});