module.exports = {
     ossId: process.env.ALI_OSS_ID || "your-oss-access-key-id",
     ossSecret: process.env.ALI_OSS_SECRET || "your-oss-access-key-secret",
     ossBucket: process.env.ALI_OSS_BUCKET || "bucket-name",
     ossEndpoint: process.env.ALI_OSS_ENDPOINT || "https://oss-cn-hangzhou.aliyuncs.com",
     // path prefix, default: /
     ossPath: process.env.ALI_OSS_PATH || "my-app-files",
     // Bucket mode: [public, private], default: public
     ossMode: process.env.ALI_OSS_MODE || "public",
}
