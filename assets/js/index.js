$(function () {
  getUserInfo();

  var layer = layui.layer;

  //退出按钮的点击事件
  $('#btnLogout').on('click', function () {
    //提示用户是否退出
    layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
      //do something 
      //1.清空本地存储中的token
      localStorage.removeItem('token');
      //2.跳转到登录页面    
      location.href = '/login.html';
      //关闭comfirm询问框
      layer.close(index);
    });
  });
});

//获取用户的基本信息
function getUserInfo () {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers 就是请求头配置对象
    // 
    //通过baseAPI.js获取
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      //调用 renderAvatar 渲染用户的头像
      renderAvatar(res.data);
    },
    //通过baseAPI.js获取
    // complete: function (res) {
    //   if (res.responseJSON.status !== 0) {
    //     localStorage.removeItem('token');
    //     location.href = '/login.html';
    //   }
    // }
  });
}

//渲染用户的头像
function renderAvatar (user) {
  let name = user.nickname || user.username;
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
  if (user.user_pic !== null) {
    //有头像时
    $('.layui-nav-img').attr('src', user.user_pic).show();
    $('.text-avatar').hide();
  } else {
    //无头像时
    $('.layui-nav-img').hide();
    var first = name[0].toUpperCase();
    $('.text-avatar').html(first).show();
  }
}