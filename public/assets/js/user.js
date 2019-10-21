
//表单发生提交行为
$('#userForm').on('submit',function(){
    //获取表单中的数据并格式化为字符串
    var formData=$(this).serialize();
    // console.log(formData);
    //发送请求
    $.ajax({
        type: "post",
        url: "/users",
        data: formData,
        success: function () {
            //重新刷新页面
            location.reload();
        },
        error:function(){
            alert('用户添加失败')
        }
    });
    //阻止默认提交行为
    return false;
})


//用户头像上传功能
//为表单添加change事件
$('#modifyBox').on('change','#avatar',function(){
    // 创建formData对象上传二进制文件
    //this.files[0]表示用户选择的一个文件
    // console.log(this.files[0]);
    var formData=new FormData();
    formData.append('avatar',this.files[0]);
    $.ajax({
        type: "post",
        url: "/upload",
        data: formData,
        //告诉$.ajax不要解析请求参数
        processData:false,
        //告诉$.ajax不要设置请求参数的类型
        contentType:false,
        success: function (response) {
            //图片预览
            // console.log(response);
            $('#preview').attr('src',response[0].avatar);
            //设置隐藏域的值
            $('#hiddenAvatar').val(response[0].avatar)
        }
    });
})

//向服务器端发送请求 索要用户列表数据
$.ajax({
    type: "get",
    url: "/users",
    success: function (response) {
        // console.log(response);
        var html=template('userTpl',{data:response});
        // console.log(html);
        //将拼接好的内容渲染到页面
        $('#userBox').html(html)
    }
});

//通过事件委托的形式为编辑按钮点击添加事件
$('#userBox').on('click','.edit',function(){
    //获取被点击用户的id
    var id=$(this).attr('data-id');
    //根据id获取用户详细信息
    $.ajax({
        type: "get",
        url: "/users/"+id,
        success: function (response) {
            // console.log(response);
            var html=template('modifyTpl',response);
            // console.log(html);
            $('#modifyBox').html(html)
        }
    });
})
//为修改表单添加提交表单事件
$('#modifyBox').on('submit','#modifyForm',function(){
    //获取用户在表单中输入的内容
    var formData=$(this).serialize();
    // console.log(formData); 
    var id=$(this).attr('data-id');
    $.ajax({
        type: "put",
        url: "/users/"+id,
        data: formData,
        success: function (response) {
            // console.log(response);
            location.reload();
        }
    });
    //阻止表单默认提交行为
    return false;
})

//删除用户
$('#userBox').on('click','.delete',function(){
    // 确认用户是否进行删除操作
    if(confirm('确定要删除此用户吗')){
        // 获取到当前被点击的用户的id
        var id=$(this).attr('data-id');
        // 调用删除用户接口，根据id删除用户，如果删除功能，刷新当前页面，让页面显示最新的内容
        $.ajax({
            type: "delete",
            url: "/users/"+id,
            success: function (response) {
                // console.log(response);
                location.reload();
            }
        });
    }
})

//批量删除
var selectAll=$('#selectAll');
var deleteMany=$('#deleteMany');
//用户按钮跟随全选按钮变化
selectAll.on('change',function(){
    //获取到全选按钮当前的状态
    var status=$(this).prop('checked');
    if(status){
        //显示批量删除按钮
        deleteMany.show()
    }else{
        //隐藏批量删除按钮
        deleteMany.hide()
    }
   // 获取到所有的用户并将用户的状态和全选按钮保持一致
   $('#userBox').find('input').prop('checked',status)
})
//全选按钮跟随用户按钮变化
$('#userBox').on('change','.userStatus',function(){
// - 获取到所有用户 在所有用户中过滤出选中的用户
// - 判断选中用户的数量和所有用户的数量是否一致
// - 如果一致 就说明所有的用户都是选中的
// - 否则 就是有用户没有被选中
    var inputs=$('#userBox').find('input');
    if(inputs.length==inputs.filter(':checked').length){
        selectAll.prop('checked',true)
    }else{
        selectAll.prop('checked',false)
    }
    // 如果选中的复选框的数量大于0 就说明有选中的复选框
    if(inputs.filter(':checked').length>0){
         //显示批量删除按钮
         deleteMany.show()
    }else{
         //隐藏批量删除按钮
         deleteMany.hide()
    }
})
// 给批量删除按钮注册点击事件，在事件函数里面，先获取选中用户的id，存入到数组中
deleteMany.on('click',function(){
    var ids=[];
    var checkedUser=$('#userBox').find('input').filter(':checked');
    //循环复选框，得到复选框身上的data-id值
    checkedUser.each(function(index,element){
       ids.push($(element).attr('data-id'));
    })
    // 调用删除接口，把数组里面的id拼接成需要的字符串形式
    if(confirm('确定要进行批量删除操作吗？')){
        $.ajax({
            type: "delete",
            url: "/users/" + ids.join('-'),
            success: function (response) {
                location.reload();
            }
        });
    }
})