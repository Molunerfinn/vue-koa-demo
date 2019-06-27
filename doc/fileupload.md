阿里云文件上传说明

https://help.aliyun.com/document_detail/112718.html?spm=a2c4g.11174283.2.29.24687da2mUXNyS

服务端签名后直传
https://help.aliyun.com/document_detail/31926.html?spm=a2c4g.11186623.6.1315.3ddb7eaeX9Z5xi

服务端签名直传并设置上传回调
https://help.aliyun.com/document_detail/31927.html?spm=a2c4g.11186623.2.13.2b9f6e28Mq7bg1#concept-qp2-g4y-5db

fieldname：上传的字段名
originalname：上传的文件名
encoding：文件的编码类型
mimetype：文件的MIME类型
destination：存储的目录（和destination回调函数中的目录名一致）
filename：保存的文件名（和filename回调函数中的文件名一致）
path：保存的相对路径
size：文件的大小（单位：字节byte）
