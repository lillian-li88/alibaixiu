var logoutBtn=$('#logout');
logoutBtn.on('click',function(){
  //确认是否真的退出
    var isConfirm=confirm('您真的要退出吗');
    if(isConfirm){
        $.ajax({
          type: "post",
          url: "/logout",
          success: function () {
              location.href='login.html'
          },
          error:function(){
              alert('退出失败')
          }
      });
    }  
})