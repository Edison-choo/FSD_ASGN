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

function editMenu(id) {
  console.log("opening edit..." + id);
  $.ajax({
      url: "/menu/getMenu",
      type: "GET",
      dataType: 'json',
      success: (data) => {
      let menus = data[1];
      let menu = (menus.filter(f => f.id == id))[0];
      let image = menu.image == '' ? '/img/no-image.jpg' : menu.image;
      let specifications = menu.specifications.includes(",") ? menu.specifications.split(",") : [menu.specifications];
      console.log(menu);
      $("#edit form").attr("action","/menu/update/"+id);
      $("#edit .menuImage img").attr("src",image);
      $("#edit .menuImage img").attr("id", 'menuImg'+id);
      $("#edit .popUpImage input").first().attr({"id":'menuImageUpload'+id, "onchange":"uploadImg("+id+")"});
      $("#edit .popUpImage input").last().attr({"id":'menuImage'+id, "value":image});
      $("#edit .popUpImage div:last-child").attr({"id":'menuImageErr'+id});
      $("#edit .popUpContent #foodNo").attr("value",menu.foodNo);
      $("#edit .popUpContent #foodName").attr("value",menu.name);
      $("#edit .popUpContent #foodType").attr("value",menu.type);
      $("#edit .popUpContent #foodPrice").attr("value",menu.price.toFixed(2));
      $("#edit .popUpContent .specification").each(function(i, item){
        if (specifications.includes($("#edit .popUpContent .specification").eq(i).find("input").val())) {
          $("#edit .popUpContent .specification").eq(i).find("input").prop('checked', true);
        }
      })
      },
  });
}

function addMenu() {
  console.log("opening add...");
  let menuImage = $("#addMenu1 #menuImageUpload").val();
  let foodName = $("#addMenu1 #foodName").val();
  let foodType = $("#addMenu1 #foodType").val();
  let foodPrice = $("#addMenu1 #foodPrice").val();
  let specifications = [];
  console.log($("#addMenu1 .specification"));
  $("#addMenu1 .specification").each(function (i, item){
    if ($("#addMenu1 .specification").eq(i).find('input').is(':checked')) {
      specifications.push($("#addMenu1 .specification").eq(i).find('input').val());
    }
  });
  specifications = specifications == [] ? undefined : specifications;
  let formdata = new FormData();
  formdata.append("menuImage", menuImage);
  formdata.append("foodName", foodName);
  formdata.append("foodType", foodType);
  formdata.append("foodPrice", foodPrice);
  formdata.append("specifications", specifications);
  
  // $.ajax({
  //     url: "/menu/addMenu",
  //     type: "POST",
  //     data: formdata,
  //     contentType: false,
  //     processData: false,
  //     success: (data) => {

  // });
}

// function getMenu() {

// }

