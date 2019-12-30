<template>
	<view class="video-replace">
		<view class="video">
			<video class="myVideo" id="myVideo" :src="videoItem.url" autoplay loop @error="videoErrorCallback" :controls="false"></video>
			<cover-image :src="imgSrc"></cover-image>
		</view>
		<view class="replace" :style="'height:' + replaceHeight +'px'">
			<view class="updater">
				<view class="updater-left" @tap="toCompany">
					<view class="icon">
						<image :src="companyData.imgurl"></image>
					</view>
					<view class="name">{{companyData.name}}</view>
				</view>
				<view class="update-right">
					版权说明
				</view>
			</view>
			<view class="video-name">{{videoItem.param}}</view>
			<view class="video-tips">
				<view class="tip">{{videoItem.param1}}</view>
				<!-- <view class="tip">#美女</view> -->
			</view>
			<view class="replace-btn">
				<image src="https://yjkj-0508.oss-cn-shenzhen.aliyuncs.com/FAC:ede1d4079a694f7590f1ed616ca3691f.png"></image>
				<view class="btn">换脸</view>
			</view>
			<view class="replace-bottom">
				<div class="share">
					<view class="iconfont iconstar"></view>
					<view class="share-text">分享</view>
				</div>
				<view class="create">立即生成</view>
			</view>
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
				videoSrc: '',
				imgSrc: '../../../static/img/logo.png',
				videoItem: {},
				companyData: {}
			}
		},
		onLoad: function(options) {
			that = this
			that.videoItem = JSON.parse(options.videoItem) 
			console.log(that.videoItem)
			getWindowInfo().then((el) => {
				console.log(el.windowHeight)
				const query = uni.createSelectorQuery();
				query.select('.video').boundingClientRect((res) => {
					if (res) {
						that.replaceHeight = el.windowHeight - res.height
					}
				}).exec()
			})
			that.companyData = uni.getStorageSync('companyData')
			console.log(that.companyData)
			
		},
		methods: {
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
					var coid = that.companyData.id
					uni.navigateTo({
						url: `/pages/user/business/business?coid=${coid}`
					})
				}
			}
		}
	}
</script>

<style>
	@import url("./video-replace.css");
</style>
