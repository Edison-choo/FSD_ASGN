//edison
// const { Sequelize } = require("sequelize/types");

$(function() {
  $(".addOption").on({
    click: function () {
      $("#hidden").css({
        display: "none",
      });
      var option = $(".popUpContent li").first().html();
      $(".popUpContent li").last().after("<li class='toClean'></li>");
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
  $("#addMenu1 img").attr('src', '/img/no-image.jpg')
  $("#addMenu1 #menuImageUpload").val(null);
  $("#addMenu1 #menuImage").val("");
  $("#food .popUpContent #quantity").val(1);
  $("#food .popUpContent #remark").val("");
  $("#addSpecification1 .popUpContent #name").val("");
  $(".toClean").each((i, item) => {
    $(".toClean").eq(i).find("input").val("");
  })
  $("#addMenu1 .specification").each((i, item) => {
    $("#addMenu1 .specification").eq(i).find("input").prop('checked', false);
  })
}

function hideAll() {
  console.log("hiding all...")
  $(`#menuOrderedHidden`).hide();
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
            if ($("#exampleMenu").length) {
              $("#exampleMenu").remove();
            }
            let last = $(".foodRow tr").last().find('td').eq(1).text() != '' ? parseInt($(".foodRow tr").last().find('td').eq(1).text()) : 0;
            console.log(data.menu.specifications);
            $(".foodRow tr").last().after(`<tr>
            <td></td>
              <td>${last + 1}</td>
              <td>${data.menu.foodNo }</td>
              <td>${data.menu.name}</td>
              <td>${data.menu.type}</td>
              <td>${"$"+parseInt(data.menu.price).toFixed(2)}</td>
              <td>${data.menu.specifications}</td>
              <td><button class="buttonIcon" onclick="editMenu(${data.menu.id})" data-bs-toggle="modal" data-bs-target="#edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
              </td>
              <td><button onclick="triggerDelete(${data.menu.id})" type="button" class="btn-close" aria-label="Close" data-bs-toggle="modal" data-bs-target="#delete"></button></td>
              <td></td>
          </tr>`);
            // $(".foodRow tr").last().append($(".foodRow tr").first().html());
            // $(".foodRow tr").last().find('td').eq(1).text(last + 1);
            // $(".foodRow tr").last().find('td').eq(2).text(data.menu.foodNo);
            // $(".foodRow tr").last().find('td').eq(3).text(data.menu.name);
            // $(".foodRow tr").last().find('td').eq(4).text(data.menu.type);
            // $(".foodRow tr").last().find('td').eq(5).text("$"+parseInt(data.menu.price).toFixed(2));
            // $(".foodRow tr").last().find('td').eq(6).text(data.menu.specifications);
            // $(".foodRow tr").last().find('td').eq(7).find("button").attr("onclick", "editMenu("+data.menu.id+")");
            // $(".foodRow tr").last().find('td').eq(8).find("button").attr("onclick", `triggerDelete(${data.menu.id})`);
            $("#menuLength").text(parseInt($("#menuLength").text()) + 1);
            if (!(data.types.includes(data.menu.type))) {
              $("#typeLength").text(data.types.length + 1);
            }
            $(".successNoti span").text(data.success);
            $(".successNoti").css('display', 'flex');
            $("#closeAddMenu").trigger("click");
            $("#error").hide();
            cleanInput();
          } else if ('errors' in data) {
            // data.errors.each((i, item) => {
            //   var errorHtml = `<div class="alert alert-danger">${item.text}</div>`;
            // });
            // $(".row").first().before(errorHtml);
            console.log(data.errors)
            $("#addMenu1 #error").text(data.errors[0].text);
            $("#addMenu1 #error").css('display', 'flex');
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
        $("#menuLength").text(parseInt($("#menuLength").text()) - 1);
        $(".foodRow tr").eq(updatedId).remove();
        $(".successNoti span").text(data.success);
        $(".successNoti").css('display', 'flex');
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
        } else {
          $("#edit .popUpContent .specification").eq(i).find("input").prop('checked', false);
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
            $(".foodRow tr").eq(updatedID).find('td').eq(5).text("$"+parseInt(data.menu.price).toFixed(2));
            $(".foodRow tr").eq(updatedID).find('td').eq(6).text(data.menu.specifications);
            $(".successNoti span").text(data.success);
            $(".successNoti").css('display', 'flex');
            $("#edit #closeEditMenu").trigger("click");
            $("#error").hide();
          }
        }
    });
  })
  
});

// add specifications
$(function() {
  $("#addSpecificationForm").on('submit', function(e) {
    e.preventDefault();
    console.log("adding specifications...");
    let formdata = $("#addSpecificationForm").serializeArray();
    var $form = $(this);
    if (!$form.valid) return false;
    // $(".successMsg").hide();
    let name = $("#addSpecificationForm #name").val();
    console.log(name);
    $.ajax({
        url: "/menu/addSpec",
        type: "POST",
        data: formdata,
        dataType: 'json',
        success: (data) => {
          console.log(data, name);
          if ('success' in data) {
            console.log(data.optionList);
            console.log(name+" is successfully added");
            let last = $(".specRow tr").last().find('td').eq(1).text() != '' ? parseInt($(".specRow tr").last().find('td').eq(1).text()) : 0;
            $(".specRow tr").last().after(`<tr>
            <td></td>
              <td>${last+1}</td>
              <td>${name}</td>
              <td>${data.optionList}</td>
              <td></td>
              <td><button onclick="triggerDeleteSpec('${name}')" type="button" class="btn-close" aria-label="Close" data-bs-toggle="modal" data-bs-target="#deleteSpec"></button></td>
              <td></td>
          </tr>`);
            let addingHtml = `
            <div class="form-check specification">
              <input class="form-check-input" name="specifications" type="checkbox" value="${name}" id="flexCheckDefault${last}"/>
              <label class="form-check-label" for="flexCheckDefault${last}">${name} <a href="#" style="z-index: 100;" data-bs-toggle="tooltip" title="It will give user options ${data.optionList}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
              </svg></a></label>
            </div>`;
            if ($('#addMenu1 .specification').length) {
              $('#addMenu1 .specification').last().after(addingHtml);
              $('#edit .specification').last().after(addingHtml);
            } else {
              $('#addMenu1 .popUpContentTitle').last().after(addingHtml);
              $('#edit .popUpContentTitle').last().after(addingHtml);
            }
            $("#menuSpecLength").text(parseInt($("#menuSpecLength").text()) + 1);
            $(".successNoti span").text(data.success);
            $(".successNoti").css('display', 'flex');
            $("#addSpecification1 #closeSpec").trigger("click");
            $("#addSpecification1 #error").hide();
            cleanInput();
          } else {
            $("#addSpecification1 #error").hide();
            $("#addSpecification1 #error").text(data.error);
            $("#addSpecification1 #error").show();
          }
        }
    });
  })
  
});

function getNewSpec(name) {
  console.log("retrieving new spec..." + name);
  $.ajax({
    url: "/menu/getNewSpec/" + name,
    type: "GET",
    dataType: 'json',
    success: (data) => {
      console.log(data.menuSpec[0].name+" is successfully added");
      let last = parseInt($(".specRow tr").last().find('td').eq(1).text());
      $(".specRow tr").last().after("<tr></tr>");
      $(".specRow tr").last().append($(".specRow tr").first().html());
      $(".specRow tr").last().find('td').eq(1).text(last + 1);
      $(".specRow tr").last().find('td').eq(2).text(data.menuSpec.keys[0]);
      $(".specRow tr").last().find('td').eq(3).text(data.menuSpec.option);
      $(".specRow tr").last().find('td').eq(4)
      $(".specRow tr").last().find('td').eq(5).find("button").attr("onclick", `triggerDeleteSpec(${data.menuSpec.keys[0]})`);
    }
  });
};

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
        $("#addMenu1 .specification").each((i, item) => {
          if ($("#addMenu1 .specification").eq(i).find('input').val() == name) {
            $("#addMenu1 .specification").eq(i).remove();
          }
        });
        $("#edit .specification").each((i, item) => {
          if ($("#edit .specification").eq(i).find('input').val() == name) {
            $("#edit .specification").eq(i).remove();
          }
        });
        $("#menuSpecLength").text(parseInt($("#menuSpecLength").text()) - 1);
        $(".successNoti span").text(data.success);
        $(".successNoti").css('display', 'flex');
      },
  });
};

// booking food

// retrieve food data
function getFood(id) {
  console.log("retrieving food details..." + id);
  $.ajax({
    url: "/book/getFood",
    type: "GET",
    dataType: 'json',
    success: (data) => {
      let menus = data.menus;
      let types = data.types;
      let menuSpec = data.menuSpec;
      let menu = (menus.filter(f => f.id == id))[0];
      let image = menu.image == '' ? '/img/no-image.jpg' : menu.image;
      let specifications = menu.specifications.includes(",") ? menu.specifications.split(",") : [menu.specifications];
      console.log(menu, specifications);
      $("#food form").attr("action","/book/add/"+id);
      $("#food .menuImage img").attr("src",image);
      $("#food .popUpImage input").attr({"value":image});
      $("#food .popUpImage foodSpec").attr({"id":'menuImageErr'+id});
      $("#food .popUpContent .popUpContentTitle").html(`${menu.name}<br><span style="font-weight: 400;">$${menu.price.toFixed(2)}</span>`);
      let specificationDiv = '';
      for (i in menuSpec) {
        if (specifications.includes(i) && specifications != [""]) {
            specificationDiv += 
              `<div>
              <label for="">${i}:</label>
              <select name="specifications" class="form-select form-select-sm" aria-label=".form-select-sm example" required>  
                <option value="">Open this select menu</option>
              `;
            for (j=0;j<menuSpec[i].length;j++) {
              specificationDiv += `<option value="${menuSpec[i][j]['option']}">${menuSpec[i][j]['option']} +$${menuSpec[i][j]['addPrice'].toFixed(2)}</option>`;
            }
            specificationDiv += `</select>
            </div>`;
        }
      }
      $("#food .popUpContent #foodSpec").html(specificationDiv);
    },
  });
};

// add food to cart
$(function() {
  $("#addFoodForm").on('submit', function(e) {
    e.preventDefault();
    console.log("adding food to cart...", $("#addFoodForm").attr("action").substring(10));
    let formdata = $("#addFoodForm").serializeArray();
    var $form = $(this);
    let id = $("#addFoodForm").attr("action").substring(10);
    console.log(id);
    $.ajax({
        url: "/book/add/"+id,
        type: "POST",
        data: formdata,
        dataType: 'json',
        success: (data) => {
          if ('success' in data) {
            if ($(`#${id} .menuOrdered`).length) {
              // pass
            } else {
              $(`#${id} .menuOrderedHidden`).show();
              $(`#${id} .menuOrderedHidden button`).attr('onclick', `editAll(${id})`);
            }
            $(`#${id}`).css('margin-bottom', '60px');
            $("#food #closeFood").trigger("click");
            $("#error").hide();
            $(".successNoti span").text(data.success);
            $(".successNoti").css('display', 'flex');
            cleanInput();
          }
        }
    });
  })
  
});

// get cart data
function editAll(id) {
  console.log("retrieving all cart details..." + id);
  $.ajax({
    url: "/book/getCart",
    type: "GET",
    dataType: 'json',
    success: (data) => {
      console.log(data.cart);
      let cart = data.cart;
      let menus = data.menus;
      let menuSpec = data.menuSpec;
      let foodList = cart.filter((f) => f.id == id)[0].orders;
      $("#updateAll h5").text(menus.filter(f => f.id == id)[0].name);
      let addingHtml = '';
      for (i in foodList) {
        addingHtml += `<button style="margin-bottom: 20px;" id="selectOrder" type="button" onclick="edit(${id},${foodList[i].uniqueId})" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#editFood">Order ${foodList[i].uniqueId}&nbsp; X${foodList[i].quantity}</button>`;
      }
      $("#updateAll .modal-body div").html(addingHtml);
    },
  });
};

function edit(id, uniqueId) {
  console.log("retrieving cart details..." + uniqueId);
  $("#updateAll button").first().trigger("click");
  $.ajax({
    url: "/book/getCart",
    type: "GET",
    dataType: 'json',
    success: (data) => {
      console.log(data.cart);
      let cart = data.cart;
      let menus = data.menus;
      let menuSpec = data.menuSpec;
      let foodList = cart.filter((f) => f.id == id)[0].orders;
      let foodDetail = menus.filter(f => f.id == id)[0];
      let food = foodList.filter(f => f.uniqueId == uniqueId)[0];
      foodDetail.specifications = foodDetail.specifications.includes(",") ? foodDetail.specifications.split(",") : [foodDetail.specifications];
      $("#editFood form").attr("action", `/book/update/${id}/${uniqueId}`);
      $("#editFood img").attr("src", food.image);
      $("#editFood .menuImage input").attr("value", food.image);
      $("#editFood .popUpContentTitle").html(`${foodDetail.name}
      <br><span style="font-weight: 400;">$${foodDetail.price.toFixed(2)}`);
      $("#editFood .quantity input").eq(1).attr("value", food.quantity);
      let addingHtml = '<option value="">Open this select menu</option>';
      let addingHtml2 = '';
      let index = 0;
      for (spec in menuSpec) {
        if (foodDetail.specifications.includes(spec)) {
          addingHtml2 += `<div>
          <label for="">${spec}:</label>
          <select name="specifications" class="form-select form-select-sm" aria-label=".form-select-sm example" required>  
          </select>
          </div>`;
        }
      }
      $("#editFood #specificationsSelect").html(addingHtml2);
      for (spec in menuSpec) {
        if (foodDetail.specifications.includes(spec)) {
          for (i in menuSpec[spec]) {
            if (food.specifications.includes(menuSpec[spec][i].option)) {
              addingHtml += `<option value="${menuSpec[spec][i].option}" selected>${menuSpec[spec][i].option} +$${menuSpec[spec][i].addPrice.toFixed(2)}</option>`;
            } else {
              addingHtml += `<option value="${menuSpec[spec][i].option}">${menuSpec[spec][i].option} +$${menuSpec[spec][i].addPrice.toFixed(2)}</option>`;
            }
          }
          $("#editFood select").eq(index).html(addingHtml);
          index += 1;
          addingHtml = '<option value="">Open this select menu</option>';
        }
      }
      $("#editFood #remark").attr("value", food.remark);
    },
  });
};

// edit food to cart
$(function() {
  $("#editFoodForm").on('submit', function(e) {
    e.preventDefault();
    console.log("updating food to cart...");
    let formdata = $("#editFoodForm").serializeArray();
    var $form = $(this);
    let id = $("#editFoodForm").attr("action").substring(14);
    console.log(id);
    $.ajax({
        url: $("#editFoodForm").attr('action'),
        type: "POST",
        data: formdata,
        dataType: 'json',
        success: (data) => {
          if ('success' in data) {
            $("#editFood #closeEdit").trigger("click");
            $("#error").hide();
            $(".successNoti span").text(data.success);
            $(".successNoti").css('display', 'flex');
            cleanInput();
          }
        }
    });
  })
  
});

// delete food from cart
$(function() {
  $("#deleteFood").on('click', function(e) {
    e.preventDefault();
    console.log("deleting food to cart...");
    let paraId = $("#deleteFood").attr("href").substring(13);
    id = paraId.replace('/', '-');
    console.log(paraId);
    $.ajax({
        url: '/book/delete/'+paraId,
        type: "GET",
        dataType: 'json',
        success: (data) => {
          if ('success' in data) {
            $(`#${id}`).remove();
            $("#error").hide();
            $(".successNoti span").text(data.success);
            $(".successNoti").css('display', 'flex');
          }
        }
    });
  })
});


// create data table for menu
$(function() {
  let count = 0;
  let addingHtml = '';
  $(".foodRow tr").each((i, item) => {
    if (i !== 0) {
      count += 1
    }
    if (i > 5) {
      $(".foodRow tr").eq(i).css('display', 'none');
    }
  })
  console.log(count);
  for (i=0;i<count/5;i++) {
    if (i == 0){
      addingHtml += `
      <li class="page-item active" aria-current="page"><a class="page-link" onclick="changePage(${i+1})">${i+1}</a></li>
      `
    } else if (i == 1 || i == 2) {
      addingHtml += `
      <li class="page-item"><a class="page-link" onclick="changePage(${i+1})">${i+1}</a></li>
      `;
      $(".pagination .next").removeClass('disabled');
    } else {
      addingHtml += `
      <li class="page-item" ><a class="page-link" onclick="changePage(${i+1})">${i+1}</a></li>
      `;
    }
  }
  $(".page-inside").html(addingHtml);
})

// change page button
function changePage(id) {
  $(".foodRow tr").each((i, item) => {
    if (i != 0) {
      // console.log(i, (id-1)*5, i, id*5);
      if (i> (id-1)*5 && i <= id*5) {
        $(".foodRow tr").eq(i).css('display', 'table-row');
      } else {
        $(".foodRow tr").eq(i).css('display', 'none');
      }
    }
  })
  $(".page-inside .active").removeClass('active');
  $(".page-inside .page-item").eq(id-1).addClass('active');
  if (id == 1) {
    $(".pagination .previous").addClass('disabled');
    $(".pagination .next").removeClass('disabled');
  }else if (id == parseInt($(".page-inside .page-item").length)) {
    $(".pagination .next").addClass('disabled');
    $(".pagination .previous").removeClass('disabled');
  } else {
    $(".pagination .previous").removeClass('disabled');
    $(".pagination .next").removeClass('disabled');
  }
}

$(".pagination .previous a").on('click', function(){
  if ($(".page-inside .active a").text() == '2') {
    $(".pagination .previous").addClass('disabled');
  }
  changePage(parseInt($(".page-inside .active a").text()) - 1);
  $(".pagination .next").removeClass('disabled');
})

$(".pagination .next a").on('click', function(){
  changePage(parseInt($(".page-inside .active a").text()) + 1);
  if ($(".page-inside .active a").text() == parseInt($(".page-inside .page-item").length)) {
    $(".pagination .next").addClass('disabled');
  }
  $(".pagination .previous").removeClass('disabled');
})