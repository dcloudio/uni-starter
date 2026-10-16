<template>
	<button open-type="chooseAvatar" @chooseavatar="bindchooseavatar" @click="uploadAvatarImg" class="box" :class="{'showBorder':border}"  :style="{width,height,lineHeight:height}">
		<cloud-image v-if="avatar_file" :src="resolvedAvatarUrl" :width="width" :height="height"></cloud-image>
		<uni-icons v-else :style="{width,height,lineHeight:height}" class="chooseAvatar" type="plusempty" size="30"
			color="#dddddd"></uni-icons>
	</button>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	const uniIdCo = uniCloud.importObject("uni-id-co", { customUI: true })
	/**
	* uni-id-pages-avatar
	* @description 用户头像组件
	* @property {String} width	图片的宽，默认为：50px
	* @property {String} height	图片的高，默认为：50px
	*/
	export default {
		data() {
			return {
				isPC: false,
				resolvedAvatarUrl: ''
			}
		},
		props: {
			//头像图片宽
			width: {
				type: String,
				default () {
					return "50px"
				}
			},
			//头像图片高
			height: {
				type: String,
				default () {
					return "50px"
				}
			},
			border:{
				type: Boolean,
				default () {
					return false
				}
			}
		},
		async mounted() {
			// #ifdef H5
			const platform = uni.getSystemInfoSync().platform
			this.isPC = !['ios', 'android'].includes(platform) || platform === 'harmonyos';
			// #endif
		},
		computed: {
			hasLogin() {
				return store.hasLogin
			},
			userInfo() {
				return store.userInfo
			},
			avatar_file() {
				return store.userInfo.avatar_file
			}
		},
		watch: {
			avatar_file: {
				immediate: true,
				handler(val) {
					this.resolveAvatarUrl(val && val.url)
				}
			}
		},
		methods: {
			// 内置云存储 (cloud://) 由 cloud-image 自行通过 uniCloud.getTempFileURL 换链
			// http(s) / 本地路径直接渲染
			// 扩展存储 (qiniu:// 等) 必须经云端 extStorageManager.getTempFileURL，调 uni-id-co 的 getTempFileURL
			async resolveAvatarUrl(url) {
				if (!url) {
					this.resolvedAvatarUrl = ''
					return
				}
				if (
					url.startsWith('cloud://') ||
					url.startsWith('http://') ||
					url.startsWith('https://') ||
					url.startsWith('/') ||
					url.startsWith('data:')
				) {
					this.resolvedAvatarUrl = url
					return
				}
				try {
					const res = await uniIdCo.getTempFileURL({ fileID: url })
					if (res && res.tempFileURL) {
						this.resolvedAvatarUrl = res.tempFileURL
					}
				} catch (e) {
					console.error('uni-id-pages-avatar: getTempFileURL failed', e)
				}
			},
			setAvatarFile(avatar_file) {
				// 使用 clientDB 提交数据
				mutations.updateUserInfo({avatar_file})
			},
			// 调云端拿上传参数后按 mode 分流；返回 { name: cloudPath, url: fileID }
			async doUploadAvatar(filePath, extname) {
				const cloudPath = this.userInfo._id + '' + Date.now() + '.' + (extname || 'jpg')
				let options
				try {
					options = await uniIdCo.getUploadFileOptions({ cloudPath })
				} catch (e) {
					uni.showModal({
						content: e.errMsg || '获取上传参数失败',
						showCancel: false
					})
					throw e
				}
				if (options.mode === 'ext') {
					await new Promise((resolve, reject) => {
						uni.uploadFile({
							...options.uploadFileOptions,
							filePath,
							success: (res) => {
								if (res.statusCode >= 200 && res.statusCode < 300) {
									resolve(res)
								} else {
									reject(new Error(`Upload failed, statusCode=${res.statusCode}, data=${res.data}`))
								}
							},
							fail: reject
						})
					})
					return { name: options.cloudPath, url: options.fileID }
				}
				const res = await uniCloud.uploadFile({
					filePath,
					cloudPath: options.cloudPath,
					fileType: "image"
				})
				console.log('res', res, options)
				return { name: options.cloudPath, url: res.fileID }
			},
			async bindchooseavatar(res){
				let avatarUrl = res.detail.avatarUrl
				let extname = avatarUrl.split('.')[avatarUrl.split('.').length - 1]
				let avatar_file = {
					extname,
					name:'',
					url:''
				}
				try{
					uni.showLoading({
						title: "更新中",
						mask: true
					});
					const uploaded = await this.doUploadAvatar(avatarUrl, extname)
					avatar_file.name = uploaded.name
					avatar_file.url = uploaded.url
					uni.hideLoading()
				}catch(e){
					uni.hideLoading()
					console.error(e);
				}
				console.log('avatar_file',avatar_file);
				this.setAvatarFile(avatar_file)
			},
			uploadAvatarImg(res) {
				// #ifdef MP-WEIXIN
				return false // 微信小程序走 bindchooseavatar方法
				// #endif

				// #ifndef MP-WEIXIN
				if(!this.hasLogin){
					return uni.navigateTo({
						url:'/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
					})
				}
				const crop = {
					quality: 100,
					width: 600,
					height: 600,
					resize: true
				};
				uni.chooseImage({
					count: 1,
					crop,
					success: async (res) => {
						let tempFile = res.tempFiles[0],
							avatar_file = {
								// #ifdef H5
								extname: tempFile.name.split('.')[tempFile.name.split('.').length - 1],
								// #endif
								// #ifndef H5
								extname: tempFile.path.split('.')[tempFile.path.split('.').length - 1]
								// #endif
							},
							filePath = res.tempFilePaths[0]

						//非app端剪裁头像，app端用内置的原生裁剪
						// #ifdef H5
						if (!this.isPC) {
							filePath = await new Promise((callback) => {
								uni.navigateTo({
									url: '/uni_modules/uni-id-pages/pages/userinfo/cropImage/cropImage?path=' +
										filePath + `&options=${JSON.stringify(crop)}`,
									animationType: "fade-in",
									events: {
										success: url => {
											callback(url)
										}
									},
									complete(e) {
										console.log(e);
									}
								});
							})
						}
						// #endif

						uni.showLoading({
							title: "更新中",
							mask: true
						});
						try {
							const uploaded = await this.doUploadAvatar(filePath, avatar_file.extname)
							avatar_file.name = uploaded.name
							avatar_file.url = uploaded.url
							uni.hideLoading()
							this.setAvatarFile(avatar_file)
						} catch (e) {
							uni.hideLoading()
							console.error(e)
						}
					}
				})
				// #endif
			}
		}
	}
</script>

<style>
	/* #ifndef APP-NVUE */
	.box{
		overflow: hidden;
	}
	/* #endif */
	.box{
		padding: 0;
	}

	.chooseAvatar {
		/* #ifndef APP-NVUE */
		display: inline-block;
		box-sizing: border-box;
		/* #endif */
		border-radius: 10px;
		text-align: center;
		padding: 1px;
	}
	.showBorder{
		border: solid 1px #ddd;
	}
</style>
