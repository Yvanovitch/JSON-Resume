//Rotation de la Terre
$(document).ready(function() {
    var angle = Math.floor((Math.random() * 360) + 1);
    $("#img_human_belt").rotate(angle); //Initialisation
   
    setInterval(function() {
        angle += 0.1;
        $("#img_human_belt").rotate(angle);
    }, 50);
    
    
});


//Gestion resize :
$(document).ready(function() {
    var top = $(window).width() * 0.25;
    $('#img_human_belt').css({"top": top});

    var top2 = $(window).width() * 0.06;
    $('#img_usine').css({"top": top2 * 0.9, "left": top2 * 0.2});
    $('#img_fog').css({"top": top2 * 0.2, "left": top2 * 1.5});
    $('#consommationSlider').css({"height": top2 * 1.7, "top": top2 * 1.4, "left": top2 * 2.2});

    $(window).on('resize', function() {
        //human belt position
        top = $(window).width() * 0.25;
        $('#img_human_belt').css({"top": top});
        
        //Usine size & position
        top2 = $(window).width() * 0.06 ;
        $('#img_usine').css({"top": top2*0.9, "left":top2*0.2});
        $('#img_fog').css({"top": top2 * 0.2, "left":top2*1.5});
        $('#consommationSlider').css({"height": top2 * 1.7, "top": top2*1.4, "left":top2*2.2});
        $('#merci').css({"top":top2, "height":top*0.5});
    });
});


//Gestion Opacité de la fumée
$(document).ready(function() {
    //Rotation nuage
    var fogIsVisible = true;
    var angle = Math.floor((Math.random() * 360) + 1);
    $("#img_human_belt").rotate(angle - 1); //Initialisation

    setInterval(function() {
        angle += 0.04;
        if (fogIsVisible) {
            $("#img_fog_belt").rotate(angle);
        }
    }, 50);

//Gestion opacité nuage usine
    var opacity = 1;
    var currentOpacity = 1;
    var previousOpacity = 1;
    $("#consommationSlider").slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 1,
        step: 0.1,
        value: 1,
        slide: function(event, ui) {
            opacity = ui.value;
            console.log(opacity + " ui : " + ui.value);
            $("#img_fog").css({"moz-opacity": opacity,
                "opacity": opacity,
                "filter": "alpha(opacity=" + opacity + ")"});
        }
    });

    //Gestion opacité fog belt
    setInterval(function() {
        if (opacity < currentOpacity) {
            currentOpacity = currentOpacity - 0.02;
        } else if (opacity > currentOpacity + 0.02) {
            //console.log("parse " + currentOpacity + 0.02);
            currentOpacity = currentOpacity + 0.02;
        }

        if (previousOpacity != currentOpacity) {
            $("#img_fog_belt").css({"moz-opacity": currentOpacity,
                "opacity": currentOpacity,
                "filter": "alpha(opacity=" + currentOpacity + ")"});
            //console.log("current : " + currentOpacity);

            if (currentOpacity <= 0) {
                fogIsVisible = false;
                currentOpacity = 0;
                $('#merci').css({"display": "block"});
            } else if (!fogIsVisible) {
                fogIsVisible = true;
                $('#merci').css({"display": "none"});
            }
        }
    }, 150);
});

//Autre :
$(document).ready(function() {
    //Affichage des remerciements
    
     $("#credit").hover(function () {
         $("#remerciement").css({"display":"block"});
     }, function () {
         $("#remerciement").css({"display": "none"});
    });
});

//Défilement du descriptif
$(document).ready(function fond() {
    var initTop = 300;//$('header').css('top');
    $(window).scroll(function(e) {
        var scrolled = $(window).scrollTop();
        $('header').css('top', initTop - (scrolled * 0.2) + 'px');
    });
});