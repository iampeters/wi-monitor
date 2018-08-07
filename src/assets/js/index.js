"use strict";
$(function() {
    const uri = $('.linker').attr('value');


    setInterval(() => {
        $.ajax({
            url: 'http://localhost/wi-monitor/src/app/api/sample.php',
            method: 'post',
            data: {
                key: uri
            }

        }).done(function(data2) {
            var data = JSON.parse(data2);
            $('.p2_wrong').text(data.o_wrong);
            $('.p2_correct').text(data.o_correct);
            $('.p2_score').text(data.o_scores);
            $('.p2_questions').text(data.o_question);

            $('.question').text(data.question);
            $('.p1_wrong').text(data.wrong);
            $('.p1_correct').text(data.correct);
            $('.p1_score').text(data.scores);
            $('.p1_questions').text(data.p_question);

        });
    }, 1000);

    // Get answers
    setInterval(() => {
        $.ajax({
            url: 'http://localhost/wi-monitor/src/app/api/getAnswers.php',
            method: 'post',
            data: {
                key: uri
            }

        }).done(function(data2) {
            var data = JSON.parse(data2);

            $('.option1').text(data.option2);
            $('.option2').text(data.option1);
            $('.option3').text(data.option4);
            $('.option4').text(data.option3);


            // console.log(data);
            // for (var key in data) {
            //     if (data.hasOwnProperty(key)) {
            //         // console.log(data[key]);

            //         var txt = '<div class="col-12 col-md-6 p-0 ">';
            //         txt += '<label for="' + key + '" class="form-check-label btn btn-white btn-mod">';
            //         txt += '<span class="ans">' + data[key] + '</span>';
            //         txt += '</label>';
            //         txt += '</div>';

            //         $('.append').html(txt);

            //     }
            // }
        });
    }, 1000)

});