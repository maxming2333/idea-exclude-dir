# #DSP页面前端开发规范  
目录规范

```
.
├── README.md
├── fis-conf.js
├── package.json
└── src
    ├── css
    │   ├── _copyright.scss
    │   ├── _var.scss
    │   ├── fl_style1.scss
    │   ├── fl_style2.scss
    │   └── hj_style2.scss
    ├── html
    │   ├── category
    │   │   ├── card
    │   │   │   ├── fl_kp.html
    │   │   │   └── fl_kp_b.html
    │   │   ├── fighting
    │   │   │   ├── fl_gd.html
    │   │   │   └── fl_gd_b.html
    │   │   └── round
    │   │       ├── fl_hh.html
    │   │       └── fl_hh_b.html
    │   ├── collection
    │   │   ├── card
    │   │   ├── fighting
    │   │   │   ├── hj_gd.html
    │   │   │   └── hj_gd_b.html
    │   │   └── round
    │   │       ├── hj_hh.html
    │   │       └── hj_hh_b.html
    │   └── common
    │       ├── copyright.html
    │       └── meta.html
    ├── images
    │   ├── banner-demo.jpg
    │   └── title-kp.png
    └── js
        ├── app
        └── lib

```

### 怎么运行项目

首先安装 fis3

```
tnpm install fis3 -g
```

然后进入项目运行

```
tnpm ii
tnpm start
fis3 release
```

### 怎么输出最终文件

```
fis3 release pro -cu // 生成预览效果
fis3 release pro-zip -cu // 生成可供上传的压缩包
```

运行后会在项目的上一层目录生成一个`output`文件夹，最终文件全部放在 `output`文件夹里面

请把images上传到对应位置，不要修改文件名，上传路径要对

然后把 `output.zip` 压缩包上传到 [http://dashboard.admin.9game.cn:9021/](http://dashboard.admin.9game.cn:9021/)



