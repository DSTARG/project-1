(function ($) {
        $.fn.slider = function (user) {
            var option = $.extend({
                timeSlideOut: 2000,
                //time for automatic slider!
                counter: false,
                //(true,false) for number
                caption: false,
                //(true,false) for data-title
                nextAndPrevios: false,
                //(true,false) for button next and previos
                animateIn: "fade",
                //(fade,slide,swipLeft,swipRight,random)
                animateOut: "fade",
                //(fade,slide,swipLeft,swipRight,random)
                controler: false,
                //(true,false) for button controler
                speed: 1000,
                //(time) for animate fade slider and caption!
                touch: false,
                //(true,false) for touch left or right!
                timer: false,
                //(true,false)for timerLoading
                sort: "A",
                //(random,A)for sort slider in automatic slider!
                pauseHover: false,
                //(true,false)for pause with hover
                autoSlide: true,
                //(true,false)for automatic next Slider
                zoomHover: false,
                //(true,false)for zoom and rotate with hover
                disableLinkImage: false
                //(true,false)for preventDefault!
            }, user);

            $(document).ready(function () {

                var sliders = $("body").find(".slider");
                var slidersLength = sliders.length;
                sliders.each(function () {


                    var i = 0;
                    slider = $(this);
                    var slides = slider.find("ul li");
                    var slidesLength = slides.length;
                    var counter = $("<div>").addClass('counter');
                    var caption = $("<div>").addClass('caption');
                    var buttonControl = $("<div>").addClass('buttonControl');
                    var nextB = $("<div>").addClass('next');
                    var previosB = $("<div>").addClass('previos');
                    var timer = $("<div>").addClass('timer');
                    var autoS;

                    var sW = true;

                    function rand(s, e) {
                        return (s + Math.floor(Math.random() * (e - s)));
                    }

                    function autoSlider() {
                        if (option.autoSlide) {


                            if (option.sort === "random") {


                                autoS = setInterval(function () {

                                    var x = rand(0, slidesLength);
                                    if (x === i) {
                                        x++
                                    }
                                    showSlider(x)
                                }, option.timeSlideOut);
                            } else {
                                autoS = setInterval(function () {
                                    showSlider(i + 1)

                                }, option.timeSlideOut);
                            }
                        }
                    }

                    autoSlider();

                    if (option.touch && typeof $.fn.swipe) {
                        $(slider).on("dragstart", function (ev) {
                            ev.preventDefault();
                        });
                        $(slider).find("ul li img").swipeleft(function () {
                            showSlider(i + 1, "swipLeft", "swipLeft")
                        });
                        $(slider).find("ul li img").swiperight(function () {
                            showSlider(i - 1, "swipRight", "swipRight")
                        })
                    }

                    if (option.zoomHover) {
                        $(slides).find("img").addClass('zoom')
                    }
                    if (option.disableLinkImage) {
                        $(slides).find("a").click(
                            function (ev) {
                                ev.preventDefault();
                            }
                        )


                    }

                    if (option.pauseHover) {
                        slider.hover(function () {

                            if (option.timer) {
                                timer.fadeOut(option.speed / 4);
                                timer.css({"animation-name": "x"});
                            }

                            clearInterval(autoS)
                        }, function () {
                            if (option.timer) {
                                timer.fadeIn(option.speed / 2);
                                timer.css({"animation-name": "x"});
                                timer.css({"animation-name": "timer"});

                            }
                            autoSlider()
                        })
                    }
                    if (option.counter) {
                        counter.html((i + 1) + "/" + slidesLength);
                        slider.append(counter)
                    }
                    if (option.caption) {
                        if ($(slides[i]).is("[data-title]")) {
                            caption.html($(slides[i]).attr("data-title"));
                            slider.append(caption);
                            caption.fadeIn(option.speed);
                        }

                    }
                    if (option.controler) {

                        for (var v = 0; v < slidesLength; v++) {
                            btn = $("<div>").addClass('btn').html(v + 1).attr('data-sl', v);
                            buttonControl.append(btn);

                        }
                        slider.append(buttonControl);
                        buttonControl.find(".btn").click(function () {
                            if (Number($(this).attr('data-sl')) !== i) {
                                showSlider(Number($(this).attr('data-sl')));
                            }


                        }).eq(0).addClass('select');


                    }
                    if (option.nextAndPrevios) {
                        slider.append(nextB).append(previosB);
                        nextB.click(function () {

                            showSlider(i + 1, "swipLeft", "swipRight")

                        });
                        previosB.click(function () {
                            showSlider(i - 1, "swipRight", "swipLeft")
                        })

                    }
                    if (option.timer) {

                        slider.append(timer);
                        timer.css({"animation-duration": option.timeSlideOut - 20 + "ms"})

                    }


                    function inSlide(animateIn) {
                        var x = (animateIn !== undefined) ? animateIn : option.animateIn;
                        if (x === "random") {
                            x = ["fade", "slide", "swipLeft", "swipRight"];
                            x = x[rand(0, x.length)]
                        }
                        switch (x) {

                            case "slide":
                                $(slides[i]).slideDown(option.speed);
                                break;
                            case "swipLeft":
                                $(slides[i]).css({left: slider.width() + "px", "display": "list-item"});
                                $(slides[i]).animate({left: 0}, option.speed);
                                break;
                            case "swipRight":
                                $(slides[i]).css({left: -1 * slider.width() + "px", "display": "list-item"});
                                $(slides[i]).animate({left: 0}, option.speed);
                                break;

                            case "fade":
                            default:


                                $(slides[i]).fadeIn(option.speed);
                                break;
                        }


                    }

                    function outSlide(animateOut) {
                        var x = (animateOut !== undefined) ? animateOut : option.animateOut;
                        if (x === "random") {
                            x = ["fade", "slide", "swipLeft", "swipRight"];
                            x = x[rand(0, x.length)]
                        }

                        switch (x) {

                            case "slide":
                                $(slides[i]).slideUp(option.speed);
                                break;
                            case "swipLeft":

                                sW = false;

                                $(slides[i]).animate({left: -1 * slider.width() + "px"}, option.speed, function () {
                                    $(this).css({"left": "0", "display": "none"});
                                    sW = true;
                                });


                                break;
                            case "swipRight":
                                sW = false;

                                $(slides[i]).animate({left: slider.width() + "px"}, option.speed, function () {
                                    $(this).css({"left": "0", "display": "none"});
                                    sW = true;
                                });


                                break;

                            case "fade":
                            default:
                                $(slides[i]).fadeOut(option.speed);
                                break;
                        }

                    }

                    function showSlider(s, animeIn, animeOut) {

                        if (sW) {

                            caption.finish();
                            outSlide(animeOut);
                            i = (s + slidesLength) % slidesLength;
                            inSlide(animeIn);
                            if (option.counter) {
                                counter.html((i + 1) + "/" + slidesLength);
                            }
                            if (option.caption) {
                                if ($(slides[i]).is("[data-title]")) {
                                    caption.html($(slides[i]).attr("data-title"));
                                    caption.fadeOut(option.speed / 3).fadeIn(option.speed / 2);

                                } else {
                                    caption.fadeOut(option.speed / 2);
                                }
                            }
                            if (option.controler) {
                                buttonControl.find(".btn").removeClass('select');
                                buttonControl.find(".btn").eq(i).addClass('select');
                            }
                            $(slides).removeClass('current');
                            $(slides[i]).addClass('current');
                            if (option.timer) {
                                timer.fadeOut(option.speed / 4);
                                timer.fadeIn(option.speed / 2);


                            }
                        }
                    }
                });
                return this;
            })


        }

    }


)(jQuery);


//$(slides[i]).css({display:"list-item"})