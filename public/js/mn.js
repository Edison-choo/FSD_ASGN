//edison

$(function () {
  $(".addOption").on({
    click: function () {
      $("#hidden").css({
        display: "none",
      });
      var option = $(".popUpContent li").first().html();
      $(".popUpContent li").last().after("<li></li>");
      $(".popUpContent li").last().append(option);
      var num = $(".popUpContent li").length;
      $(".popUpContent li:last-child input")
        .first()
        .attr({ id: "option" + num, name: "option" + num });
      $(".popUpContent li:last-child label")
        .first()
        .attr({ for: "option" + num });
      $(".popUpContent li:last-child input")
        .last()
        .attr({ id: "addPrice" + num, name: "addPrice" + num });
      $(".popUpContent li:last-child label")
        .last()
        .attr({ for: "addPrice" + num });
    },
  });

  $(".removeOption").on({
    click: function () {
      var options = $(".popUpContent li");
      if (options.length > 2) {
        $(".popUpContent li").last().remove();
        $("#hidden").css({
          display: "none",
        });
      } else {
        $("#hidden").text("Options cannot be removed furthermore");
        $("#hidden").css({
          display: "block",
        });
      }
    },
  });

  // function getdata(){
  //     $.ajax({
  //         url:'/task/gettask',
  //         method:'get',
  //         dataType:'json',
  //         success:function(response){
  //                 if(response.msg=='success'){
  //                     $('tr.taskrow').remove()
  //                     if(response.data==undefined || response.data==null || response.data==''){
  //                         $('.tblData').hide();
  //                     }else{
  //                     $('.tblData').show();
  //                 }
  //             }
  //         },
  //         error:function(response){
  //             alert('server error');
  //         }
  //     });
  // }
});

$("#menuImageUpload").on("change", function () {
  let image = $("#menuImageUpload")[0].files[0];
  let formdata = new FormData();
  formdata.append("menuImageUpload", image);
  $.ajax({
    url: "/menu/upload",
    type: "POST",
    data: formdata,
    contentType: false,
    processData: false,
    success: (data) => {
      $("#menuImg").attr("src", data.file);
      $("#menuImage").attr("value", data.file); // sets posterURL hidden field
      if (data.err) {
        $("#menuImageErr").show();
        $("#menuImageErr").text(data.err.message);
      } else {
        $("#menuImageErr").hide();
      }
    },
  });
});

function uploadImg(id) {
    console.log("executing..." + id);
    let image = $("#menuImageUpload"+id)[0].files[0];
    let formdata = new FormData();
    formdata.append("menuImageUploadE", image);
    $.ajax({
        url: "/menu/uploadEdit",
        type: "POST",
        data: formdata,
        contentType: false,
        processData: false,
        success: (data) => {
        $("#menuImg"+id).attr("src", data.file);
        $("#menuImage"+id).attr("value", data.file); // sets posterURL hidden field
        if (data.err) {
            $("#menuImageErr"+id).show();
            $("#menuImageErr"+id).text(data.err.message);
        } else {
            $("#menuImageErr"+id).hide();
        }
        },
    });
}

