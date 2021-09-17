$(function () {
  // 点击 a标签实现登录与注册的跳转
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });

  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  });

  //从layui中获取form对象
  var form = layui.form;
  var layer = layui.layer;
  
  //通过 form.verify() 实现自定义校验规则
  form.verify({
    pwd: [
      /^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'
    ],

    //校验俩次密码是否一致
    repwd: function (value) {
      let pwd = $('.reg-box [name=password]').val();
      if (pwd !== value) {
        return '两次密码不一致！';
      }
    }
  });

  //监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault();
    let data = {
      username: $('.reg-box [name=username]').val(),
      password: $('.reg-box [name=password]').val()
    }
    $.post('/api/reguser', data,
    function (res) {
      if (res.status !== 0) {
        return alert(res.message);
      }
      layer.msg('注册成功');
      
      //模拟人为的点击事件，返回登录框中
      $('#link_login').click();
    });
  });

  //监听登录表单的提交事件
  $('#form_login').on('submit', function (e) {
    e.preventDefault();
    let data = {
      username: $('.login-box [name=username]').val(),
      password: $('.login-box [name=password]').val()
    }
    $.post('/api/login', data,
    function (res) {
      if (res.status !== 0) {
        return alert(res.message);
      }
      layer.msg('登录成功');
      //将身份验证信息 token 存到localStorage中
      localStorage.setItem('token', res.token);
      //跳转到后台首页
      location.href = '/index.html';
    });
  });
});