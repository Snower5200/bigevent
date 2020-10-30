$(function() {
    // 点击去注册账号的链接
    $("#link_reg").on('click', function() {
        $(".login-box").hide()
        $(".reg-box").show()
    });
    // 点击去登录的链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    });
    // 从layui获取表单
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次是否一致
        repwd: function(value) {
            // 形参拿到确认密码的内容
            // 判断和密码的内容是否一致
            var pwd = $(".reg-box [name=password]").val()
            if (pwd !== value) {
                return '两次不一致';
            }
        }
    });
    // 监听注册表单的提交
    $("#form_reg").on('submit', function(e) {
        // 先阻止默认提交行为
        e.preventDefault();
        // 发起ajax的post请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录');
            // 模拟点击行为
            $("#link_login").click()
        })
    });
    $("#form_login").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = 'index.html'
            }
        })
    })
})