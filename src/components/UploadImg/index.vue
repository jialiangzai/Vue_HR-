<template>
  <!-- action 后台传的接口地址https://jsonplaceholder.typicode.com/posts/ -----
    自定义上传的回调 :http-request="upload"
     show-file-list 展示多文件上传列表
      on-success上传成功之后执行的回调
      before-upload 上传之前执行的回调
      回显致之前存储的图片地址
      如果重新上传就会把之前上传的cos地址存储到外边userInfo的staffPhoto-->
  <el-upload
    class="avatar-uploader"
    action="#"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="upload"
  >
    <!-- 默认插槽 默认显示+号 -->
    <!-- 自家公司服务器 -->
    <img v-if="staffPhoto" :src="staffPhoto" class="avatar" />
    <!-- 上传到腾讯云云 -->
    <!-- <img v-else-if="imageUrl" :src="imageUrl" class="avatar" /> -->
    <!-- 显示+ -->
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    <!-- 进度条 -->
    <el-progress
      v-show="showProgress"
      type="circle"
      :percentage="percentage"
      class="progress"
    />
  </el-upload>
</template>

<script>
// 导入cos的SDK调用
import COS from 'cos-js-sdk-v5'
// 初始化cos云上传实例(后台有上传方法)必传身份秘钥
const cos = new COS({
  SecretId: 'AKID2JMPE1qvDJCmTvdDTqxFgssaAVbRkxoR', // 身份识别ID
  SecretKey: 'Xw62h4GDwa4JIzUGqKgZyCAzwf9N5f06' // 身份秘钥
})
// 如果更改的是登录人同步头像

export default {
  name: 'UploadImg',
  props: {
    staffPhoto: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // imageUrl: '',
      // 进度条
      showProgress: false,
      // 进度 0-100
      percentage: 0
    }
  },
  methods: {
    // 自定义上传回调
    /**
     * 选中文件后就会触发
     * 当有upload时action就会失效而且on-success也会失效但是action是必传项所以为了满足需要就要设置为#
     */
    upload (res) {
      // 触发回调 拿到 file对象
      console.log(res.file)
      // 开始上传的时候显示进度条
      this.showProgress = true
      // 后续调用腾讯云cos后台接口上传图片
      if (res.file) {
        // 执行上传操作
        // putObject图片上云方法有两个参数第一个是{上传的配置}，第二个是成功后的回调函数
        cos.putObject({
          Bucket: 'hrsass-1255477649', /* 存储桶名字 hrsass-1255477649 */
          Region: 'ap-beijing', /* 存储桶所在地域，必须字段 ap-beijing */
          Key: res.file.name, /* 文件名必须是唯一的 相同名字图片重复上传，只会保留第一次 */
          StorageClass: 'STANDARD', // 上传模式, 标准模式对象的存储类型，枚举值为：STANDARD、STANDARD_IA、ARCHIVE、DEEP_ARCHIVE
          Body: res.file, // 上传文件对象
          onProgress: (progressData) => {
            // 上传的进度 百分比的数值
            // console.log('当前图片的上传进度', JSON.stringify(progressData)) // percent
            console.log('当前图片的上传进度', JSON.stringify(progressData.percent)) // percent
            // progressData进度对象 percent表示进度0-1
            this.percentage = progressData.percent * 100
          }
        }, (err, data) => {
          // 这里要是箭头函数不然后期取不到this
          // console.log(err || data)
          // 上传成功之后
          // err 是null 表明上传成功 data 会包含Location图片存储地址
          if (!err) {
            // this.imageUrl = `https://${data.Location}`
            console.log('图片地址', this.imageUrl)
            console.log('上云返回的地址', data.Location)
          }
          // 上云成功之后
          if (data.statusCode === 200) {
            // 有延迟
            setTimeout(() => {
              // 关闭进度条显示
              this.showProgress = false
              // 重置进度
              this.percentage = 0
              // 不能直接修改父组件staffPhoto数据 当然也可以直接传递子组件对象局部更改不推荐
              // this.imageUrl = `https://${data.Location}`
              this.$emit('update:staffPhoto', `https://${data.Location}`)
              console.log(this.$route.params.id)
            }, 800)
          }
        })
      }
    },
    // handleAvatarSuccess (res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw)
    // },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
}
</style>
