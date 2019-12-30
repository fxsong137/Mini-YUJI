<template>
	<view style="background:#fff">
		<view class="banner" :style="'width:100% !important;height:' + Hei">
			<image :src="banner" mode="widthFix"  @load='imgH' alt=""/>
		</view>
		<view class="content">
			<view class="product-list">
				<!--商品列表-->
				<view class="pro-item" @tap="toVideoReplace(item)" v-for="(item,index) in videoList" :key="index">
					<image :src="item.gif" class="pro-img" />
					<!-- <video :src="item.url" class="pro-img" ></video> -->
					<view class="pro-bottom">
						<view class="pro-text">{{item.param}}</view>
						<view class="pro-text1">{{item.param1}}</view>
					</view>
				</view>
				<!--商品列表-->
			</view>
			<!--加载loadding-->
			<tui-loadmore :visible="loadding" :index="3" type="primary"></tui-loadmore>
			<tui-nomore :visible="!pullUpOn"></tui-nomore>
			<!--加载loadding-->
		</view>
		<view class="footer">
			<view class="watch">立即观看</view>
		</view>
		<view v-if="false">
			
			<view class="moving1"></view>
			<view class="moving2"></view>
			<view class="moving3"></view>
			<view class="making">
				<!-- 视频生成中<br/> -->
				10s
			</view>
		</view>
	</view>
</template>

<script>
	let that;
	export default {
		data() {
			return {
				Hei: '',
				productList:'123456789',
				videoInfo: '',
				banner: '',
				videoList: [],
				activityId: ''
			}
		},
		onLoad:function(options){
			that = this
			that.activityId = options.activityId
			that.videoInfo =  uni.getStorageSync('videoInfo');
			console.log(that.videoInfo)
			if(that.videoInfo) {
				that.banner = that.videoInfo.banner
				that.videoList = that.videoInfo.videoList
			}
		},
		methods: {
			imgH(e) {
				var winWid = uni.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
				var imgh = e.detail.height; //图片高度
				var imgw = e.detail.width;
				var swiperH = winWid * imgh / imgw + "px";
			
				that.Hei = swiperH //设置高度
			
			},
			toVideoReplace(e) {
				console.log(e)
				uni.navigateTo({
					url: `../video-replace/video-replace?videoItem=${JSON.stringify(e)}`
				})
			}
		}
	}
</script>

<style>
	@import url("./video-activity.css");
</style>
