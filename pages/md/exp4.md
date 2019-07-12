# 基础实验四日志

*服务器IP：152.136.228.236*

*服务器端口：8000*

---

## 静态文件服务搭建
为了实现静态文件服务，首先将个人主页的代码全部拷贝到服务器中/home/ubuntu/homepage/jxqhhh.github.io文件夹下。然后，在/home/ubuntu/homepage文件下创建server.js，使用npm安装好相关JS库后，在server.js添加如下代码即可搭建静态文件服务：
```
var express = require(‘express')
app.use(express.static('jxqhhh.github.io'))
app.listen(8000, function () {})
```

---

## API服务搭建
为了搭建API服务，仍然使用Express.js框架。

考虑到本题的具体要求，只需要完善如下四处代码：
```
app.post(‘/api/compute', …)
app.post(‘/api/pair', …)
app.get(‘/api/pair', …)
app.delete(‘/api/pair', …)
```

具体来说，为了处理Content-Type类型为’multipart/form-data’的post请求，先使用如下中间件upload的none()方法，具体代码类似于：
```
var multer = require('multer')
var upload = multer()
app.post('/api/compute', upload.none(), function (req, res) {
  …
})
```

在使用了 upload.none() 方法后，可以直接在 function(req, res) {…} 中用req.body获取POST请求的一些参数。

至于/api/pair这个API，涉及到键值对的增删查改，为此在server.js中先声明一个常量如下：
```
const dict = {}
```

这之后，我们在处理/api/pair这个API的请求时，只需对dict的属性进行增删查改即可。

需要注意的是，我们还需要检查请求头中的hw-token字段是否正确。我们可以用 req.headers[‘hw-token’] 获取请求头的hw-token字段，再判断其是否合法。





