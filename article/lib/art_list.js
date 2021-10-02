$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  // 定义时间格式过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = padZero(dt.getFullYear());
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  }

  // 补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }
  // 定义一个查询的参数对象，将来请求对象时用
  var q = {
    pagenum: 1,  //	页码值
    pagesize: 2, //每页显示多少条数据
    cate_id: '', //	文章分类的 Id
    state: ''    //文章的状态，可选值有：已发布、草稿
  }

  initTable();

  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      //header通过 baseAPI.js 获取
      data: q,
      success: function (res) {
        if(res.status !== 0) {
          return layer.msg('获取文章列表失败！');
        }
        //通过模板引擎渲染数据
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
        //调用渲染分页的方法
        renderPage(res.total);
      }
    });
  }

  initCate();

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      //header通过 baseAPI.js 获取
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！');
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      }
    })
  }

  // 为筛选表单绑定 submit 事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable();
  });

  //定义渲染分页的方法
  function renderPage (total) {
    //console.log(total);
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox',    // 分页容器的 Id
      count: total,       // 总数据条数
      limit: q.pagesize,  // 每页显示几条数据
      curr: q.pagenum,     // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      //分页发生切换的时候，触发 jump 回调
      // 触发 jump 回调的方式有两种：
      // 1. 点击页码的时候，会触发 jump 回调  （此时 first 值为 undefined）
      // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调  （此时 first 值为 true）
      jump: function (obj, first) {
        // 将最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr;
        // 把最新的条目数赋值到 q.pagesize 中
        q.pagesize = obj.limit;
        // 通过 first 判断是什么触发 jump 回调， 避免死循环
        if (!first) {
          // 重新渲染表格
          initTable();
        }
        
      }
    });
  }

  // 通过代理方式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    //获取当前页面中删除按钮的个数
    var len = $('.btn-delete').length;
    //获取删除按钮的编号
    var id = $(this).attr('data-id');
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！');
          }
          layer.msg('删除分类成功！');
          layer.close(index);
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          if (len === 1) {
            //此时页面上只有一个删除按钮，删除完后要请求上一页的数据
            //页码值最小为 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        }
      });
    });
  });
});