$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
        // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化分类失败')
                }
                // 调用模板引擎
                var htmlstr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlstr)
                    // 调用form.render重新渲染
                form.render()
            }
        })
    }
    // 初始化富文本编辑器
    initEditor()
        // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $("#btnChooseImage").on('click', function() {
        $("#coverFile").click()
    })
    $("#coverFile").on('change', function(e) {
        e.preventDefault()
        var file = e.target.files[0]
        if (file.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 定义发布文章的状态
    var art_state = '已发布'
    $("#btnSave2").on('click', function() {
        art_state = '存草稿'
    })

    $("#form-pub").on('submit', function(e) {
        e.preventDefault()
            // 基于form表单创建formdata对象
        var fd = new FormData($(this)[0])

        // 将文章的发布状态存到fd中
        fd.append('state', art_state)
            // fd.forEach(function(v, k) {
            //         console.log(k, v);
            //     })
            // 将封面裁剪过后的图片，输出为文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })


    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                location.href = '../artical/art_list.html'

            }
        })
    }
})