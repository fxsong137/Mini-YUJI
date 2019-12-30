<template>
	<view>
		<view class="my-top">
			<!-- <view class="search">
				<mSearch :mode="2" button="inside" :show="false" @search="search($event,3)"></mSearch>
			</view> -->
			<view class="tab-box">
				<view class="my-tab">
					<view class="tab-item" :class="[tabIndex == 1?'active':'']" @tap="changeTab(1)">推荐</view>
					<view class="tab-item" :class="[tabIndex == 2?'active':'']" @tap="changeTab(2)">热门</view>
					<view class="tab-item" :class="[tabIndex == 3?'active':'']" @tap="changeTab(3)">换装</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="scroll" :style="'height:'+ scrollHeight + 'px'">
			<view class="product-box">
				<view class="product-list" v-if="!showTip">
					<view class="pro-item" @tap="toVideoReplace(item)" v-for="(item,index) in videoList" :key="index">
						<video :src="item.url" class="pro-img"> </video>
						<view class="pro-bottom">
							<view class="pro-text">{{item.param}}</view>
							<view class="pro-text1">{{item.param1}}</view>
						</view>
					</view>
				</view>
				
				<view v-else style="position: absolute; top: 10%;width: 100%;text-align:center;font-size: 30upx;">
					暂无视频
				</view>
				
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
	import mSearch from '@/components/mehaotian-search/mehaotian-search.vue';
	import {
		Cate,
		getOpenid
	} from '@/http/http.js'
	let that;
	export default {
		components: {
			mSearch,
		},
		data() {
			return {
				Hei: '',
				
				scrollTop: 0,
				pageIndex: 1,
				winHeight: uni.getSystemInfoSync().windowHeight,
				scrollHeight: '',
				tabIndex: 1,
				currentPage: 1, //当前页码
				acPageCount: null, //总页数
				videoList: [],
				showTip: true
			}
		},
		onLoad: function() {
			that =  this;
			const query = uni.createSelectorQuery();
			query.select('.my-top').boundingClientRect((res) => {
				if (res) {
					console.log(res.height)
					that.scrollHeight = that.winHeight -  res.height
				}
			}).exec()
			that.init()
		},
		methods: {
			init: function() {
				that.tabIndex = 1
				that.currentPage = 1
				that.acPageCount = null
				that.showTip = false
				that.videoList = []
				uni.showLoading({
					title: '加载中'
				});
				getOpenid().then(() => {
					that.getCate()
				})
			},
			search: function(e, val) {
				console.log(e, val);
				that['val' + val] = e;
			},
			imgH: function(e) {
				var winWid = uni.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
				var imgh = e.detail.height; //图片高度
				var imgw = e.detail.width;
				var swiperH = winWid * imgh / imgw + "px";
			
				that.Hei = swiperH //设置高度
			
			},
			toVideoReplace: function(e) {
				uni.navigateTo({
					url: `../video-replace/video-replace?videoItem=${JSON.stringify(e)}`
				})
			},
			changeTab: function(e) {
				that.tabIndex = e
			},
			/**
			 * 获取活动
			 */
			getCate: function() {
				Cate({
					"getDetail": "1",
					"type": "2",
					"which_page": that.currentPage,
					"pageSize": 100,
					"status": 1,
					"subType": 2,
					getAll: 1
				}).then((result) => {
					console.log(result)
					uni.hideLoading()
					uni.stopPullDownRefresh()
					if(result.ret == 0) {
						
						var list = result.info.list
						var arr = []
						that.acPageCount = result.info.pageInfo.page_end
						list.forEach((item,index)=>{
							// console.log(item)
							if(item.subType == 2 && item.gcImgList.length) {
								item.gcImgList.forEach((e,i)=>{
									if(e.type == 4) {
										arr.push(e)
									}
								})
							}
						})
						that.videoList = that.videoList.concat(arr)
						that.videoList.length?that.showTip = false : that.showTip = true
					}
					
				})
			},
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop - that.tabHeight
		},
		onPullDownRefresh() {
			that.init()
		}
	
	}
</script>

<style>
	@import url("./video-hall.css");
</style>
