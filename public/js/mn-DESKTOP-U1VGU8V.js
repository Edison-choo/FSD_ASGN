//edison

$(function() {
    $(".addOption").on({
        click: function(){
            var option = $("#popUpContent li").first().html();
            console.log( $("#popUpContent li").first().html());
            $("#popUpContent li").last().after(option);
            // $("#popUpContent li input").last().attr({
                
            // });
        }
    });
});

// function addOption() {
//     var option = $("#popUpContent li").first();
//     $("#popUpContent li").last().after(option);
// };