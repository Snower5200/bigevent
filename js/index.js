$(function() {
    // 调用获取用户信息
    getUserInfo();


    var layer = layui.layer;
    $("#btnlogout").on('click', function() {
            // 提示是否退出
            layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
                //do something
                // 清空本地存储中token
                localStorage.removeItem('token')
                    // 重新跳转登录页
                location.href = '/login.html'
                    // 关闭询问框
                layer.close(index);
            });
        })
        // 获取用户基本信息

    // 渲染用户头像

})

function renderAvatar(user) {
    var name = user.nicname || user.username
        // 设置欢迎文本
    $("#welcome").html('欢迎&nbsp;&nbsp' + name)
    if (user.user_pic !== null) {
        // 渲染图片头像
        $(".layui-nav-img").attr('src', user.user_pic).show();
        $(".text-avatar").hide()
    } else {
        // 渲染文本头像
        $(".layui-nav-img").hide();
        // 把获取的第一个字符转换为大写
        var first = name[0].toUpperCase();
        $(".text-avatar").html(first).show();
    }
}

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用渲染头像
            renderAvatar(res.data)
        },
        // 无论成功或失败都会调用
        // complete: function(res) {
        //     // 在complete中，有responseJSON可以拿到服务器响应的数据
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }

        // }
    })
};