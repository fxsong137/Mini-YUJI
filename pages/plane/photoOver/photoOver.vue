<template>
	<view>
		<view class='content'>
			<image :src='[bgImg?bgImg:""]' mode='widthFix' style='width:100%;height:auto'></image>
			<!-- 顶部活动跳转链接 -->
			<view class='nav' @tap='activity'>也想有个活动?请点击这里</view>
			<!-- 放置生成好的图片 -->
			<view class='photoOver' @tap="showImg" @longpress='share'>
				<image :src='serverImgUrl' mode='widthFix' style='width:100%;height:auto '></image>
			</view>
			<view class='operate'>
				<button class='save' @tap='saveTohone'>保存图片</button>
				<button class='logo' @tap='goHome'>主页</button>
				<button class='save1' @tap='toCompany'>访问商店</button>
			</view>

		</view>
		<canvas canvas-id='canvas' :style='"width:" +canvasWidth + "px; height:" + canvasHeight + "px;position:fixed;left:100%;top:100%"'></canvas>

		<!-- 自定义保存成功提示弹框 -->
		<view class='modal' v-if='!isOk'>
			<view class='bg'></view>
			<view class='by'>
				<view style='width:100%'>保存成功，可以分享啦！</view>
				<view class='ok' @tap='ok'>确定</view>
			</view>
		</view>

		<!-- 添加加载进度条 -->
		<!-- <view class="progress" v-if="load">
			<progress :percent="percent" stroke-width="2" backgroundColor='transparent'></progress>
		</view> -->
	</view>
</template>

<script>
	import {
		getCounts,
		upCommImg
	} from '@/http/http.js'
	import {
		imageZoomHeightUtil
	} from '@/utils/util.js'
	let that;
	export default {
		data() {
			return {
				isOk: true,
				isShare: true,
				param: null,
				param1: null,
				bgImg: null,
				activityId: null,
				canvasHeight: null,
				canvasWidth: null,
				imgInfo: null,
				pathImg: null,
				filePath: '',
				mgs: '',
				serverImgUrl: "",
				load: true,
				percent: 0,
				pageData: {
					timer: null,
					url: null,
					name: null,
				},
			}
		},
		onLoad(options) {
			that = this;

			that.activityId = options.activityId
			that.serverImgUrl = options.serverImgUrl

			uni.getStorage({
				key: 'activityName',
				success: function(result) {
					that.pageData.url = `pages/plane/activity/activity?activityId=${options.activityId}&name=${result.data}`;
					that.pageData.name = `羽迹小程序-${result.data}`;
				}
			})

			uni.getStorage({
				key: 'list',
				success: function(res) {
					that.bgImg = res.data.bgImg
					that.param1 = res.data.param1
					that.param = res.data.param
				}
			})
			// 获取系统信息，设置canvas宽
			uni.getSystemInfo({
				success(res) {
					that.canvasWidth = res.windowWidth
				}
			})
		},
		methods: {
			share: function() {
				// 				uni.showActionSheet({
				// 					itemList: ['分享给好友', '再来一次', '保存图片'],
				// 					success: function(res) {
				// 
				// 						that[`share${res.tapIndex + 1}`]()
				// 					},
				// 					fail: function(res) {
				// 						console.log(res.errMsg);
				// 					}
				// 				});
			},
			share1: function() { //分享给好友
				console.log('分享给好友')
				uni.showShareMenu({

				})

			},
			share2: function() { //再来一次
				console.log('再来一次')
				uni.navigateTo({
					url: '/pages/plane/photo_page/photo_page?activityId=' + that.activityId
				})
			},
			share3: function() { //保存图片
				console.log('保存图片')
				uni.saveImageToPhotosAlbum({
					filePath: imageUrl,
					success(res) {
						that.setData({
							isOk: false,

						});
					}
				});
			},
			showImg: function() {
				uni.previewImage({
					urls: [that.serverImgUrl]
				})
			},

			//访问活动主页 点击量统计
			goHome: function() {
				//访问活动主页 点击量统计
				getCounts({
					"type": 1, // 1 - 活动点击量；2 - 商铺主页点击量
					"rid": that.activityId, //活动id
					"mask": 0,
				}).then((res) => {

					uni.switchTab({
						url: '/pages/index/index',
					})
				})
			},
			saveTohone: function() {
				uni.showToast({
					title: '正在保存',
					icon: 'loading',
					duration: 2000
				});
				if(that.serverImgUrl) {
					that.saveImg()
				}

			},
			saveImg: function() {
				var uid = uni.getStorageSync('userInfos').uinfo.id
				upCommImg({
					type: 9,
					rid: uid,
					noFile: 1,
					url: that.serverImgUrl,
					param: 'img'
				}).then((res)=>{
					if(res.ret == 0) {
						uni.showToast({
							title: '保存成功',
							icon: 'none',
							duration: 2000
						});
					}
					console.log(res)
				})
			},
			/**
			 * 绘制画布回调函数
			 */
			// drawCallBack: function() {
			// 	uni.canvasToTempFilePath({
			// 		canvasId: 'canvas',
			// 		fileType: 'jpg',
			// 		success: function(res) {

			// 			that.saveImage(res.tempFilePath);
			// 		},
			// 		fail: function(res) {
			// 			uni.hideLoading();
			// 			uni.showToast({
			// 				icon: 'none',
			// 				title: '生成失败!',
			// 			});
			// 		}
			// 	})
			// },
			// // 保存图片
			// saveImage: function(imageUrl) {
			// 	console.log(imageUrl)
			// 	uni.saveImageToPhotosAlbum({
			// 		filePath: imageUrl,
			// 		success(res) {
			// 			that.isOk = false
			// 		}
			// 	});
			// },
			ok: function() {
				that.isOk = true
			},
			activity: function() {
				uni.navigateTo({
					url: '/pages/common/activityApply/activityApply',
				})
			},
			toCompany: function() {
				var pages = getCurrentPages();
				var pageRoute = pages[pages.length - 1].route; 
				var old = false
				var oldIndex = 0
				var index = 0
				pages.forEach((el,i)=>{
					if(el.route == 'pages/user/business/business') {
						old = true
						oldIndex = i
					}
					if(el.route == pageRoute) {
						index = i
					}
				})
				if(old) {
					uni.navigateBack({
						delta: index - oldIndex
					})
				}else {
					var coid = uni.getStorageSync('coid')
					uni.navigateTo({
						url: `/pages/user/business/business?coid=${coid}`
					})
				}
			}
		},
		/*
		 * 分享
		 */
		onShareAppMessage(option) {
			if (option.from === 'button') {
				return {
					title: that.pageData.name,
					path: that.pageData.url,
					success: function(res) {
						console.log('成功', res)
					}
				}
			} else if (option.from === 'menu') {
				return {
					title: '首页',
					path: '/pages/index/index',
					success: function(res) {
						console.log('成功', res)
					}
				}
			}

		},
	}
</script>

<style>
	@import url("./photoOver.css");
</style>
