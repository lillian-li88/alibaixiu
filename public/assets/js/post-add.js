// 获取文章分类数据，并将数据显示在所属分类的下拉列表中，供管理员选择
$.ajax({
    type: "get",
    url: "/categories",
    success: function (response) {
        var html=template('categoryTpl',{data:response})
        $('#category').html(html)
    }
});

// 显示文字封面图片上传的功能，然后把图片的路径放在隐藏域中
$('#feature').on('change',function(){
    var formData=new FormData();
    formData.append('cover',this.files[0]);
    $.ajax({
        type: "post",
        url: "/upload",
        data: formData,
        processData:false,
        contentType:false,
        success: function (response) {
            // console.log(response);
            var html=template('categoryTpl',{data:response});
            $('#thumbnail').val(response[0].cover)
        }
    });
})

// 给表单绑定submit事件，取消默认行为，在里面获取表单里面的内容，调用接口，传递到服务器
$('#postForm').on('submit',function(){
    var formData=$(this).serialize();
    $.ajax({
        type: "post",
        url: "/posts",
        data:formData,
        success: function (response) {
            location.href='/admin/posts.html'
        }
    });
    return false;
})