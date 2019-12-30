<template>
	<view>
		<view :style='"width:100%;height:" + windowHeight + "px"' @click='jump' v-if="!load">
			<image :src='listArr.url' mode='scaleToFill' :style='"width:100%;height:" + windowHeight + "px"'></image>
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
		getOpenid
	} from '@/http/http.js'
	import {
		getPersonCode,
		compare
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
				}
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
					"which_page": 1,
					"pageSize": 10,
					"id": that.activityId,
					"status": 1,
				}).then((res) => {
					console.log(res)
					clearInterval(that.pageData.timer);
					that.percent = 90
					that.load = false
					var list = res.info.list
					that.coid = res.info.list[0].coid
					uni.setStorageSync('coid',that.coid )
					if (!list.length) {
						uni.showModal({
							title: '提示',
							showCancel: false,
							content: '此活动已结束或者已下线',
							success: function(res) {
								if (res.confirm) {
									that.$Router.pushTab({ name: 'index'})
								}
							}
						});
						return false;
					}
					var roleList = [];
					var arr = [];
					for (var j = 0; j < list[0].gcImgList.length; j++) {
						if (list[0].gcImgList[j].type == 6) {
							var params = {
								'url': list[0].gcImgList[j].url,
								'seqno': list[0].gcImgList[j].seqno
							}
							arr.push(params);
						} else if (list[0].gcImgList[j].type == 7) {
							var arrList = {
								'bgImg': list[0].gcImgList[j].url,
								'param': list[0].gcImgList[j].param,
								'param1': list[0].gcImgList[j].param1
							};
							//  图片路径存入缓存
							uni.setStorage({
								key: 'list',
								data: arrList,
								success: function(res) {
									console.log('异步保存成功');
								}
							})
						} else if (list[0].gcImgList[j].type == 9) {
							let item = {};
							item.imgUrl = list[0].gcImgList[j].url;
							item.name = list[0].gcImgList[j].param;
							item.rid = list[0].gcImgList[j].rid;
							item.type = list[0].gcImgList[j].type;
							item.param = list[0].gcImgList[j].param
							roleList.push(item);
						}
					}
					var listA = arr.sort(compare('seqno'));
					//存储当前页面的背景图为轮播页面第一页
					that.listArr = listA[0]

					uni.setStorageSync('activityImg', listA)
					uni.setStorageSync('roleLsitArray', roleList)
					// app.globalData.activityImg = listA; //将这个活动的所有轮播背景图保存到全局

				})
			},
			loading() {
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
				const isNextShow = uni.getStorageSync('isNextShow');
				const uAgoImgUrl = uni.getStorageSync('uAgoImgUrl');
				var pathName = ''
				if (uAgoImgUrl == null || isNextShow) {
					pathName = 'photo_page'
				} else {
					pathName = 'roleList'
				}
				
				that.$Router.push({ name: pathName, params: { activityId: that.activityId }})
			}
		}
	}
</script>

<style>
	@import url("./activity.css");
</style>
