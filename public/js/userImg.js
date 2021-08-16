$('#userimg').on('change', function(){
    let image = $("#userimg")[0].files[0];
    let formdata = new FormData();
    formdata.append('userfile', image);
    $.ajax({
        url: '/user/upload',
        type: 'POST',
        data: formdata,
        contentType: false,
        processData: false,
        success:(data) => {
            $('#profileimg').attr('src', data.file);
            $('#navprofileimg').attr('src', data.file);
            $('#profileImg').attr('value', data.file);// sets posterURL hidden field
            if(data.err){
                $('#errorMsg').show();
                $('#errorMsg').text(data.err.message);
            } else{
                $('#errorMsg').hide();
            }
        }
    });
});