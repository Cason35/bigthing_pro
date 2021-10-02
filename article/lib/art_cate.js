$(function () {
  var layer = layui.layer;
  var form = layui.form;

  //获取文章分类的列表
  function initArtCateList () {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      //header通过 baseAPI.js 获取
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类的列表失败');
        }
        let htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
      }
    });
  }

  initArtCateList(); 
  
  var indexAdd = null;
  //添加类别按钮的点击事件
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章类别',
      content: $('#dialog-add').html()
    });
  });

  //通过代理的形式，为 form-add 表单绑定提交事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      //header通过 baseAPI.js 获取
      data: $('#form-add').serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('添加失败');
        }
        layer.msg('添加成功');
        initArtCateList(); 
        layer.close(indexAdd);
      }
    });
  });

  //通过代理的形式，为删除按钮添加点击事件
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id');
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        //header通过 baseAPI.js 获取
        success: function (res) {
          if (res.status !== 0) {
            console.log(res);
            return layer.msg('删除分类失败');
          }
          layer.msg(res.message);
          layer.close(index);
          initArtCateList(); 
        }
      });
    });  
  });

  var indexEdit = null;
  //通过代理的形式，为编辑按钮添加点击事件
  $('tbody').on('click', '.btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    });

    var id = $(this).attr('data-id')
    // 发起请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function(res) {
        form.val('form-edit', res.data)
    }
})
  });

  //通过代理的形式，为 form-edit表单绑定提交事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      //header通过 baseAPI.js 获取
      data: $('#form-edit').serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改失败');
        }
        layer.msg('修改成功');
        initArtCateList(); 
        layer.close(indexEdit);
      }
    });
  });

});