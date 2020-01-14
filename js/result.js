'use strict';

$(function () {
        $.ajax({
            type: "post",
            url: "http://localhost:3000/api/pythonVectorScript"
        }).done(function (err) {
            console.log(err);
            $.ajax({
                type: "post",
                url: "http://localhost:3000/api/pythonCompareScript"
            }).done(function (data) {
                console.log(data);
            });
        });

    //   $(".compareImage").submit();

    
    // window.setTimeout(function(){

    //     // Move to a new location or you can do something else
    //     window.location.href = "../index.html";
    // }, 5000);

    console.log("Linked!");
    $("#countdown").countdown360({
        radius: 50, // radius of arc
        strokeStyle: "white", // the color of the stroke
        strokeWidth: 2, // the stroke width, dynamically calulated if omitted in options
        fillStyle: "rgba(0,0,0,0)", // the fill color
        fontColor: "white", // the font color
        fontFamily: "Gotham_Bold", // the font family
        fontSize: undefined, // the font size, dynamically calulated if omitted in options
        fontWeight: 700, // the font weight
        autostart: true, // start the countdown automatically
        seconds: 10, // the number of seconds to count down
        label: [], // the label to use or false if none, first is singular form, second is plural
        startOverAfterAdding: true, // Start the timer over after time is added with addSeconds
        smooth: true, // update the ticks every 16ms when true
        onComplete: function () {
            console.log('completed');
        }
    }).start();
    $("#resultTitle").fitText(0.76);
    scanned();
});

function scanned() {
    $.ajax({
        url: "js/paintings.json",
        type: 'GET',
        dataType: 'json'
    }).done(function (data) {
        console.log(data);
        let scanned = 0;
        let resultTitle = data[scanned].title;
        let resultArtist = data[scanned].artist;
        let resultYear = data[scanned].year;
        let resultDescription = data[scanned].description;
        let resultImage = data[scanned].url;
        let resultLocation = data[scanned].location;

        let newString = resultDescription.split(" ");
        let restrictedStringArray = [];
        for (let i = 0; i < 70; i++) {
            restrictedStringArray[i] = newString[i];
            console.log(i)
        };
        let newRestrictedString = restrictedStringArray.join(" ");

        $("#resultTitle").html(resultTitle);
        $("#resultArtist span").html(resultArtist);
        $("#resultYear span").html(resultYear);
        $("#resultDescription").html(newRestrictedString);
        $("#resultLocation span").html(resultLocation);
        $("#resultPainting").append(`<img id="resultImage" class="painting" src="${resultImage}" alt="">`);

    }).fail(function (a, b) {
        console.log(a, b);
    });
}