function bannerUpload(id) {
    console.log("test")
    let image = $("#bannerfile"+id)[0].files[0];
    let formdata = new FormData();
    formdata.append('bannerfile', image);
    $.ajax({
        url: '/createPromotions/upload/'+id,
        type: 'POST',
        data: formdata,
        contentType: false,
        processData: false,
        success:(data) => {
            $('#bannerimg').attr('src', data.file);
            $('#bannerhidden').attr('value', data.file);// sets posterURL hidden field
            if(data.err){
                $('#errorMsg').show();
                $('#errorMsg').text(data.err.message);
            } else{
                $('#errorMsg').hide();
            }
        }
    });
}

// $('#bannerfile').on('change', function(){
//     console.log("test")
//     let image = $("#bannerfile")[0].files[0];
//     let formdata = new FormData();
//     formdata.append('bannerfile', image);
//     $.ajax({
//         url: '/createPromotions/upload',
//         type: 'POST',
//         data: formdata,
//         contentType: false,
//         processData: false,
//         success:(data) => {
//             $('#bannerimg').attr('src', data.file);
//             $('#bannerhidden').attr('value', data.file);// sets posterURL hidden field
//             if(data.err){
//                 $('#errorMsg').show();
//                 $('#errorMsg').text(data.err.message);
//             } else{
//                 $('#errorMsg').hide();
//             }
//         }
//     });
// });
