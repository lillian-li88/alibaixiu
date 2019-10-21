// 给表单注册submit事件，获取内容，调用接口
$('#modifyForm').on('submit',function(){
    var formData=$(this).serialize();
    $.ajax({
        type: "put",
        url: "/users/password",
        data: formData,
        success: function () {
           location.href='/admin/login.html'
        }
    });
    //阻止默认提交
    return false;
})