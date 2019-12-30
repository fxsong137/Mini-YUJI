<template>
	<view>
		<view :style='"width:100%;height:" + windowHeight + "px"' @click='jump' v-if="!load">
			<image :src='backdropImg' mode='scaleToFill' :style='"width:100%;height:" + windowHeight + "px"'></image>
		</view>
		<!-- 添加加载进度条 -->
		<view class="progress" v-if="load">
			<progress :percent="percent" stroke-width="2" backgroundColor='transparent'></progress>
		</view>
	</view>
</template>

<script>
	let that;
	import {
		Cate,
		getOpenid,
		searchCompany,
		
	} from '@/http/http.js'
	import {
		getPersonCode,
		compare
	} from '@/utils/util.js'
	import {
		compareUp
	} from '@/utils/util.js'
	export default {
		data() {
			return {
				activityId: null,
				//默认  
				current: 0,
				listArr: [],
				load: true,
				percent: 0,
				windowHeight: '',
				pageData: {
					timer: null
				},
				modeArr: [],
				videoList: [],
				bannerImg: '',
				backdropImg: '',
				coid: ''
			}
		},
		onLoad(options) {
			console.log(options)
			that = this;
			that.loading();

			//判断是否是扫码进入的
			if (options.activityId) {
				uni.setNavigationBarTitle({
					title: options.name
				})
				that.activityId = options.activityId
			} else {
				//扫码进入
				console.log(options)
				let info = getPersonCode(options.scene);
				console.log(info)
				var activityId = (info.activityId != null && info.activityId != "") ? info.activityId : '';
				that.activityId = activityId
			}

			uni.getSystemInfo({
				success(res) {
					that.windowHeight = res.windowHeight
				}
			})
			getOpenid().then(() => {
				that.getCate()
			})
		},
		methods: {
			getCate: function() {
				Cate({
					"getDetail": "1",
					"type": "2",
					"id": that.activityId,
				}).then((res) => {
					console.log(res)
					
					var activityInfo = res.info.list[0]
					that.coid = res.info.list[0].coid
					if (activityInfo.gcImgList.length) {
						that.videoList = []
						activityInfo.gcImgList.forEach((item, index) => {
							if (item.type == 17) {
								that.bannerImg = item.url
							}
							if (item.type == 6) {
								that.backdropImg = item.url
							}
							if (item.type == 4) {
								var obj = {}
								obj.url = item.url
								obj.param = item.param
								obj.param1 = item.param1
								obj.seqno = item.seqno
								obj.order = item.order * 1
								obj.id = item.id
								activityInfo.gcImgList.forEach((el, i) => {
									if (item.id == el.param) {
										obj.gif = el.url
									}
								})
								that.videoList.push(obj)
							}
						})

						console.log(that.videoList)
						if (that.videoList.length) {
							that.modeArr = that.videoList.sort(compareUp(that.videoList, 'order'))
						}
						var videoInfo = {
							banner: that.bannerImg,
							videoList: that.modeArr
						}
						uni.setStorageSync('videoInfo', videoInfo);
						that.getCompany()
					}
				})
			},
			getCompany: function() {
				searchCompany({
					id: that.coid
				}).then(res=>{
					clearInterval(that.pageData.timer);
					that.percent = 90
					that.load = false
					console.log(res)
					if(res.ret == 0) {
						uni.setStorageSync('companyData', res.info.list[0]);
					}
				})
			},
			
			loading: function() {
				that.percent = 0
				that.load = true
				//----定时器实现进度条加载----
				that.pageData.timer = setInterval(function() {
					if (that.percent < 90) {
						that.percent = that.percent + 2
					} else {
						clearInterval(that.pageData.timer);
						that.percent = 90
						that.load = false
					}
				}, 60);
			},
			jump: function(e) {

				uni.navigateTo({
					url: '/pages/video/video-activity/video-activity?activityId=' + that.activityId
				})

			},
		}
	}
</script>
<style>
	@import url("./video-home.css");
</style>
