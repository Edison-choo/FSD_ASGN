//edison
// const { Sequelize } = require("sequelize/types");

$(function() {
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
  function getdata(){
      $.ajax({
          url:'/task/gettask',
          method:'get',
          dataType:'json',
          success:function(response){
                  if(response.msg=='success'){
                      $('tr.taskrow').remove()
                      if(response.data==undefined || response.data==null || response.data==''){
                          $('.tblData').hide();
                      }else{
                      $('.tblData').show();
                  }
              }
          },
          error:function(response){
              alert('server error');
          }
      });
    }
});

function cleanInput() {
  console.log("emptying input");
  $("#addMenu1 .popUpContent #foodName").val("");
  $("#addMenu1 .popUpContent #foodType").val("");
  $("#addMenu1 .popUpContent #foodPrice").val("");
}

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
};

// Add new food to menu
// function addMenu() {
//   console.log("opening add...");
//   let formdata = $("#addMenuForm").serializeArray();
$(function() {
  $("#addMenuForm").on('submit', function(e) {
    e.preventDefault();
    // e.stopPropagation();
    // e.stopImmediatePropagation();
    console.log("opening add...");
    let formdata = $("#addMenuForm").serializeArray();
    var $form = $(this);
    if (!$form.valid) return false;
    // $(".successMsg").hide();
    $.ajax({
        url: "/menu/addMenu",
        type: "POST",
        data: formdata,
        dataType: 'json',
        success: (data) => {
          if ('menu' in data) {
            console.log(data.menu.name+" successfully updated");
            let last = parseInt($(".foodRow tr").last().find('td').eq(1).text());
            console.log(last);
            $(".foodRow tr").last().after("<tr></tr>");
            $(".foodRow tr").last().append($(".foodRow tr").first().html());
            $(".foodRow tr").last().find('td').eq(1).text(last + 1);
            $(".foodRow tr").last().find('td').eq(2).text(data.menu.foodNo);
            $(".foodRow tr").last().find('td').eq(3).text(data.menu.name);
            $(".foodRow tr").last().find('td').eq(4).text(data.menu.type);
            $(".foodRow tr").last().find('td').eq(5).text("$"+data.menu.price);
            $(".foodRow tr").last().find('td').eq(6).text(data.menu.specifications);
            $(".foodRow tr").last().find('td').eq(7).find("button").attr("onclick", "editMenu("+data.menu.id+")");
            $(".foodRow tr").last().find('td').eq(8).find("button").attr("onclick", `triggerDelete(${data.menu.id})`);
            $(".successMsg").text(data.success);
            $(".successMsg").show();
            $("#close").trigger("click");
            $("#error").hide();
            cleanInput();
          } else if ('errors' in data) {
            // data.errors.each((i, item) => {
            //   var errorHtml = `<div class="alert alert-danger">${item.text}</div>`;
            // });
            // $(".row").first().before(errorHtml);
            console.log(data.errors)
            $("#addMenu1 #error").text(data.errors[0].text);
            $("#addMenu1 #error").show();
            // $(".addMenu1 #menuImage").val(data.menuImage);
            // $(".addMenu1 #foodName").val(data.foodName);
            // $(".addMenu1 #foodType").val(data.foodType);
            // $(".addMenu1 #foodPrice").val(data.foodPrice);
            // $(".addMenu1 .specifications").each(function(i, item){
            //   if (specifications.includes($(".addMenu1 .specifications").eq(i).find("input").val())) {
            //     $(".addMenu1 .specifications").eq(i).find("input").prop('checked', true);
            //   }
            // })
          } else {
            $("#addMenu1 #error").hide();
            $("#addMenu1 #error").text(data.error);
            $("#addMenu1 #error").show();
          }
        }
    });
  })
  
});

// delete menu
function triggerDelete(id) {
  console.log("opening delete..." + id);
  $("#delete button").last().attr("onclick",`deleteMenu(${id})`);
};

function deleteMenu(id) {
  console.log("deleting..." + id);
  $.ajax({
      url: "/menu/delete/"+id,
      type: "GET",
      dataType: 'json',
      success: (data) => {
        $(".popUpDelete button").first().trigger('click');
        let updatedId;
        $(".foodRow tr").each((i,item)=>{
          if ($(".foodRow tr").eq(i).find('td').eq(2).text() == data.menu.foodNo) {
            updatedId = i;
          }
        });
        $(".foodRow tr").each((i,item)=>{
          if (i > updatedId) {
            $(".foodRow tr").eq(i).find('td').eq(1).text(parseInt($(".foodRow tr").eq(i).find('td').eq(1).text())-1)
          }
        });
        $(".foodRow tr").eq(updatedId).remove();
        $(".successMsg").text(data.success);
        $(".successMsg").show()
      },
  });
};

// edit food in menu
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
};

$(function() {
  $("#updateMenuForm").on('submit', function(e) {
    e.preventDefault();
    console.log("opening add...");
    let formdata = $("#updateMenuForm").serializeArray();
    var $form = $(this);
    if (!$form.valid) return false;
    $(".successMsg").hide();
    let id = $("#edit .menuImage img").attr("id").substring(7);
    let foodNo = $("#edit .popUpContent #foodNo").attr("value");
    $.ajax({
        url: "/menu/update/"+id,
        type: "POST",
        data: formdata,
        dataType: 'json',
        success: (data) => {
          if ('menu' in data) {
            let updatedID;
            $(".foodRow tr").each((i,item)=>{
              if ($(".foodRow tr").eq(i).find('td').eq(2).text() == foodNo) {
                updatedID = i;
              }
            });
            $(".foodRow tr").eq(updatedID).find('td').eq(2).text(data.menu.foodNo);
            $(".foodRow tr").eq(updatedID).find('td').eq(3).text(data.menu.name);
            $(".foodRow tr").eq(updatedID).find('td').eq(4).text(data.menu.type);
            $(".foodRow tr").eq(updatedID).find('td').eq(5).text("$"+data.menu.price);
            $(".foodRow tr").eq(updatedID).find('td').eq(6).text(data.menu.specifications);
            $(".successMsg").text(data.success);
            $(".successMsg").show();
            $("#edit #close").trigger("click");
            $("#error").hide();
          }
        }
    });
  })
  
});

// delete specifications
function triggerDeleteSpec(name) {
  console.log("triggering delete spec..." + name);
  $("#deleteSpec button").last().attr("onclick",`deleteMenuSpec('${name}')`);
};

function deleteMenuSpec(name) {
  console.log("deleting spec..." + name);
  $.ajax({
      url: "/menu/deleteSpec/"+name,
      type: "GET",
      dataType: 'json',
      success: (data) => {
        $("#deleteSpec button").first().trigger('click');
        let deleted;
        $(".specRow tr").each((i,item)=>{
          if ($(".specRow tr").eq(i).find('td').eq(2).text() == name) {
            deleted = i;
          }
        });
        $(".specRow tr").each((i,item)=>{
          if (i > deleted) {
            $(".specRow tr").eq(i).find('td').eq(1).text(parseInt($(".specRow tr").eq(i).find('td').eq(1).text())-1)
          }
        });
        $(".specRow tr").eq(deleted).remove();
        $(".successMsg").text(data.success);
        $(".successMsg").show()
      },
  });
};