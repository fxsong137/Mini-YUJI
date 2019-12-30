<template>
	<view class='cut-img-page'>
		<view class='cropper-wrapper-bg'>
			<view class="cropper-wrapper" style='margin-top: 25px'>
				<canvas class="cropper" disable-scroll="true" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"
				 :style="'width:' + cropperOpt.width + 'px;height:'+ cropperOpt.height + 'px;background-color: rgba(0, 0, 0, 0.8)'"
				 :canvas-id="cropperOpt.id">
				</canvas>
				<canvas class="cropper" disable-scroll="true" :style="'position: fixed; top: -'+cropperOpt.width * cropperOpt.pixelRatio + 'px; left: -' + cropperOpt.height * cropperOpt.pixelRatio + 'px; width:' + cropperOpt.width * cropperOpt.pixelRatio + 'px;height:' + cropperOpt.height * cropperOpt.pixelRatio+'px;'"
				 :canvas-id="cropperOpt.targetId">
				</canvas>
				<view class="getCropperImage">
					<view @click='cancleCropper'>取消</view>
					<view @click='rotateImg'>

					</view>
					<view @click="getCropperImage">确定</view>
				</view>
			</view>
		</view>
	</view>
	<!-- <avatar selWidth="280upx" :isShow="isShow" canRotate="false" selHeight="420upx" @close="close" @upload="upload" :avatarSrc="url"
	 avatarStyle="width: 100%; height: 100%; border-radius: 0;">
	</avatar> -->

</template>

<!-- // <script>
// 	import avatar from "../../components/yq-avatar/yq-avatar.vue";
// 	let that;
// 	export default {
// 		components: {
// 			avatar
// 		},
// 		data() {
// 			return {
// 				url: '',
// 				isShow: false
// 			}
// 		},
// 		mounted:function(){
// 			that.isShow = true
// 		},
// 		onLoad() {
// 			that = this
// 		},
// 		methods: {


// 			upload(rsp) {
// 				console.log(rsp)
// 				this.url = rsp.path;
// 				uni.setStorageSync('userTX_new', rsp.path)
// 				uni.navigateBack()
// 			},
// 			close() {
// 				uni.navigateBack()
// 			}
// 		}
// 	}
// </script> -->
<script>
	const WeCropper = require('@/utils/we-cropper.js')
	const device = uni.getSystemInfoSync() // 获取设备信息
	const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
	const system = device.system;
	let height = device.windowHeight - 100
	export default {
		data() {
			return {
				rotateI: 0,
				cropperOpt: {
					id: 'cropper', // 用于手势操作的canvas组件标识符
					targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
					pixelRatio: device.pixelRatio, // 传入设备像素比
					width, // 画布宽度
					height, // 画布高度
					scale: 2.5, // 最大缩放倍数
					zoom: 8, // 缩放系数
					cut: {
						x: (width - 280) / 2, // 裁剪框x轴起点
						y: (height - 440) / 2, // 裁剪框y轴期起点
						width: 280, // 裁剪框宽度
						height: 420 // 裁剪框高度
					}

					
				},
				chooseImg: false,
				imgSrc: '',
			}
		},
		onLoad: function(options) {
			console.log(device)
			const self = this;

			// const { cropperOpt } = this.data;
			new WeCropper(this.cropperOpt)
				.on('ready', (ctx) => {
					this.wecropper = ctx
					this.wecropper.updateCanvas()
				})
				.on('beforeImageLoad', (ctx) => {
					uni.showToast({
						title: '上传中',
						icon: 'loading',
						duration: 20000
					})
				})
				.on('imageLoad', (ctx) => {
					uni.hideToast()
				})
			this.chooseImgs();

		},
		methods: {
			chooseImgs() {
				const self = this;
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success(res) {
						const src = res.tempFilePaths[0]
						if (src) {
							self.wecropper.pushOrign(src)
							self.chooseImg = true
							self.rotateI = 0
						};
						uni.hideToast()
					},
					fail(res) {
						uni.hideToast();
						uni.navigateBack()
					}
				})
			},

			touchStart(e) {
				this.wecropper.touchStart(e)
			},
			touchMove(e) {
				this.wecropper.touchMove(e)
			},
			touchEnd(e) {
				this.wecropper.touchEnd(e)
			},
			// 获取裁剪后的图片
			getCropperImage() {
				let that = this;
				if (this.chooseImg) {

					this.wecropper.getCropperImage((src) => {


						console.log(src)
						if (src) {
							uni.setStorageSync('userTX_new', src)
							uni.navigateBack()
						} else {
							uni.hideToast()
							uni.showToast({
								title: '获取图片地址失败，请稍后再试！',
							})
						}
					})
				} else {
					uni.showToast({
						title: '您还没选择图片！',
						icon: 'none'
					})
				}

			},

			cancleCropper() {
				uni.hideToast()
				uni.navigateBack()
			},
			rotateImg() {
				const self = this;
				let rotateI = this.rotateI + 1;
				this.rotateI = rotateI
				self.wecropper.updateCanvas(rotateI)
			}
		}
	}
</script>


<style>
	@import url("./cutFace.css");
</style>
