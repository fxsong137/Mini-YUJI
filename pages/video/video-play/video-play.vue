<template>
	<view class="video-replace">
		<view class="video">
			<video id="myVideo" :src="src" autoplay loop @error="videoErrorCallback" :controls="false"></video>
		</view>
		<view class="swiper">
			<scroll-view :scroll-x="true" class='tsList' :scroll-with-animation="true">
				<block v-for="(item,index) in roleList" :key="index">
					<view class="item">
						<view class='img'>
							<image src='https://yjkj-0508.oss-cn-shenzhen.aliyuncs.com/FAC:30c31196298a4547a1bfe0ef5f175d27.jpg' />
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
		<view class="replace">
			<view class="updater">
				<view class="updater-left">
					<view class="icon">
						<image src="https://yjkj-0508.oss-cn-shenzhen.aliyuncs.com/FAC:ede1d4079a694f7590f1ed616ca3691f.png"></image>
					</view>
					<view class="name">羽迹试试上传</view>
				</view>
				<view class="update-right">
					版权说明
				</view>
			</view>
			<view class="video-name">圣母玛利亚风2019</view>
			<view class="video-tips">
				<view class="tip">#保罗·高缇耶设计</view>
				<view class="tip">#美女</view>
			</view>

		</view>
		<view class="replace-bottom">

			<button class="create"  @tap="share">分享</button>
			<view class="create" @tap="goToIndex">主页</view>
			<view class="create">访问店铺</view>
		</view>
	</view>
</template>
 
<script>
	import {
		getWindowInfo
	} from '@/utils/util.js'
	let that;
	export default {
		data() {
			return {
				replaceHeight: 0,
				src: '../../../static/video/01.mp4',
				roleList: '123'
			}
		},
		onLoad: function() {
			that = this
			getWindowInfo().then((el) => {
				console.log(el.windowHeight)
				const query = uni.createSelectorQuery();
				query.select('.video').boundingClientRect((res) => {
					if (res) {
						that.replaceHeight = el.windowHeight - res.height
					}
				}).exec()
			})
		},
		methods: {
			goToIndex() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			share() {
				
				uni.getProvider({
				    service: 'share',
				    success: function (res) {
				        console.log(JSON.stringify(res))
				        
				    }
				});
				// uni.share({
				// 	provider: "weixin",
				// 	scene: "WXSceneSession",
				// 	type: 1,
				// 	summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
				// 	success: function(res) {
				// 		console.log("success:" + JSON.stringify(res));
				// 	},
				// 	fail: function(err) {
				// 		console.log("fail:" + JSON.stringify(err));
				// 	}
				// });
			}
		}
	}
</script>

<style>
	@import url("./video-play.css");
</style>
