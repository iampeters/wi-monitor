$(function() {
    $('#enterQuiz').click(function() {
        // fadeout the modal backdrop
        // aler('clicked');
    });

    $('.modal-backdrop').hide();
    // $('.quiz-wrapper').hide();
    setInterval(function() {
        $('.preloader').hide();
        $('.quiz-wrapper').show();
        $('.modal-backdrop').hide();
    }, 2000);

    // side bar nav
    $(".button-collapse").click(function() {
        $('#slide-out').css({
            "transform": "translateX(0)",
            "transition": ".3s all ease-in-out"
        });
        $('#sidenav-overlay').fadeIn();
    });

    $('#sidenav-overlay').click(function() {
        $('#slide-out').css({
            "transform": "translateX(-100%)",
            "transition": ".3s all ease-in-out"

        });
        $(this).fadeOut();
    });

    $('#submit').click(function() {
        $('input[type=radio]').removeAttr('checked');
        // alert('yo');
        // $(this).find('input:radio').attr('checked', 'checked');
    });
});