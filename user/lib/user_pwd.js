$(function () {
  var form = layui.form;
  var layer = layui.layer;

  form.verify({
    pwd: [/^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    samePwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新密码不能与旧密码相同';
      }
    },
    rePwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return '俩次密码不一致';
      }
    }
  });

  //为layui-form表单绑定提交事件
  $('.layui-form').on('submit', function (e) {
    //阻止表单提交
    e.preventDefault();

    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      //header通过 baseAPI.js 获取
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg('密码修改成功');
        //重置表单
        $('.layui-form')[0].reset();
      }
    });
  });
});