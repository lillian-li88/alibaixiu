// 添加分类项的功能
$('#addCategory').on('submit',function(){
    var formData=$(this).serialize();
    $.ajax({
        type: "post",
        url: "/categories",
        data: formData,
        success: function () {
            location.reload()
        }
    });
    return false;
})

// - 向服务器端发送Ajax请求，获取分类页面数据
// - 使用模板引擎将服务器端返回的数据和HTML模板进行拼接
// - 将拼接好的内容展示在页面
$.ajax({
    type: "get",
    url: "/categories",
    success: function (response) {
        var html=template('categoryListTpl',{data:response});
        $('#categoryBox').html(html)
    }
});

// 通过事件委托为编辑按钮添加点击事件，在事件处理函数中获取到要修改的分类数据id
$('#categoryBox').on('click','.edit',function(){
    var id=$(this).attr('data-id');
    $.ajax({
        type: "get",
        url: "/categories/" + id,
        success: function (response) {
            var html=template('modifyCategoryTpl',response);
            $('#formBox').html(html)
        }
    });
})

// 给修改分类的按钮，绑定提交事件，在事件函数里面，注册表单默认提交行为，获取用户输入的值，调用接口，传递到后台，修改成功后，刷新页面
$('#formBox').on('submit','#modifyCategory',function(){
    var formData=$(this).serialize();
    var id=$(this).attr('data-id');
    $.ajax({
        type: "put",
        url: "/categories/" + id,
        data: formData,
        success: function (response) {
            location.reload()
        }
    });
    return false;
})

// - 通过事件委托的方式为删除按钮添加点击事件，在点击事件处理函数弹出删除确认框
// - 在用户点击了确认删除后，获取要删除的分类数据的id
// - 调用删除分类数据接口，实现删除分类数据功能，如果分类删除成功，刷新页面
$('#categoryBox').on('click','.delete',function(){
    if(confirm('您真的要进行删除操作吗？')){
        var id=$(this).attr('data-id');
        $.ajax({
            type: "delete",
            url: "/categories/" + id,
            success: function () {
                location.reload()
            }
        });
    }

})