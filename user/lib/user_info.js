$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度要在6位以内';
      }
    }
  });

  //获取用户的基本信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      // header 通过 baseAPI.js 获取
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        //调用 form.val() 快速为表单赋值
        form.val('formUserInfo', res.data);
      }
    });
  }

  initUserInfo();

  //重置按钮的绑定事件
  $('#btnReset').on('click', function (e) {
    //阻止表单默认的清空行为
    e.preventDefault();
    initUserInfo();
  });

  //监听表单的提交事件 
  $('.layui-form').on('submit', function (e) {
    //阻止表单默认的提交行为
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      //header通过 baseAPI.js 获取
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg('更新用户信息成功');
        //调用父页面的方法，重新渲染用户头像和用户的信息
        window.parent.getUserInfo();
      }
    });

  });
});