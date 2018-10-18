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

    //Bar Chart
    const ctx = $("#barChart");
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Mathematics", "Eng. Language", "Comp. Science", "Agric Science", "Biology", "Geography"],
            datasets: [{
                label: 'Score',
                data: [25, 50, 35, 5, 10, 15],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Chart Showing Individual Subject Scores'
            }
        }
    });


    // Pie Chart
    const cty = $("#pieChart");
    let pieChart = new Chart(cty, {
        type: 'pie',
        data: {
            labels: ["Win", "Draw", "Lose"],
            datasets: [{
                label: 'Score',
                data: [20, 50, 30],
                backgroundColor: [
                    'rgba(0, 200, 83, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                // borderColor: [
                //     'rgba(255,99,132,1)',
                //     'rgba(54, 162, 235, 1)',
                //     'rgba(255, 206, 86, 1)'
                // ],
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                animateScale: true
            },
            title: {
                display: true,
                text: 'Chart Showing % Wins, Losses and Draws'
            }
        }
    });
});