<template>
	<view class="search-activity">
		<view class="search">
			<mSearch :mode="2" button="inside" :text="searchText" :show="false" @search="search($event,3)"></mSearch>
		</view>
		<view class="care">
			<myCare  v-if="!showTip" @care="care" @zanClick="zanClick" @gto="gto" :activityList="activityList"></myCare>
			<view v-else style="text-align: center;font-size: 26rpx;margin-top: 100rpx;">暂无相关内容</view>
		</view>
	</view>
</template>

<script>
	import myCare from '@/components/my-components/my-care.vue'
	import mSearch from '@/components/mehaotian-search/mehaotian-search.vue';
	import {
		delComment,
		addComment,
		searchComment,
		gtoZan,
		Lunbo,
		Cate,
		getOpenid,
		shoucangOrZan
	} from '@/http/http.js'
	let that;
	export default {
		components: {
			myCare,
			mSearch
		},
		data() {
			return {
				showTip: true,
				scrollTop: 0,
				old: {
					scrollTop: 0,
				},
				isSroll: false,
				windowHeight: '',
				imgUrls: [],
				indicatorDots: true,
				autoplay: false,
				currentPage: 0,
				srcImg: '',
				activityId: null,
				scroll: false,
				activityList: [],
				load: true,
				percent: 0,
				isZan: false, //是否点赞    false 无   true点赞
				isCare: false, //是否收藏   true  是 false 否
				Hei: "", //这是swiper要动态设置的高度属性
				zanList: [], //已点赞活动
				pageData: {
					activityListAll: [],
					acPageCount: 0, //页面总数
					currentPage: 1, //当前数据显示的页面
					timer: null
				},
				imgHeight: '',
				searchText: ''
			}
		},
		onLoad(option) {
			console.log(option.search)
			that = this
			that.searchText = option.search
			that.initData()
		},
		methods: {
			initData: function() { //初始化数据
				that.showTip = false
				uni.showLoading({
					title: '加载中'
				});
				getOpenid().then(() => {
					searchComment({ //获取点赞数据
						"type": 6,
						"uid": uni.getStorageSync("userInfos").uinfo.id,
						"seo": '',
						"which_page": 1,
						"pageSize": 100,
					}).then((res) => {
						that.zanList = res.info.list


						that.getLunbo()

					})
				})
			},
			search: function(e) {
				if (!e) return;
				that.searchText = e
				that.activityList = []
				that.pageData.activityListAll = []
				that.initData()
			},
			care: function(e) {
				var activityId = e.id;
				var scid = e.scid;
				var message = that.activityList;
				var comment;
				e.care ? comment = delComment : comment = addComment
				var data = e.care ? {
					'id': scid
				} : {
					"type": 2,
					"rid": activityId,
					"mark": '1'
				}
				comment(data).then((res) => {
					console.log(res)
					if (res.ret == 0) {

						for (let j in message) {
							if (activityId == message[j].id) {
								message[j].care = !message[j].care
								message[j].scid = res.info || ''
								uni.showToast({
									title: message[j].care ? '收藏成功' : '取消收藏',
								})
								console.log(message[j])

								uni.$emit('careFn', message[j])
								uni.$emit('updateCare', message[j])
							}
						}
					}
				})
			},
			zanClick: function(e) {
				console.log(e)
				var activityId = e.id;
				var message = that.activityList;
				let lock = true;
				if (!lock) return;
				lock = false

				for (let i in message) { //遍历列表数据
					if (activityId == message[i].id) { //根据下标找到目标
						var zanState = message[i].zan == false ? 1 : 0;
						gtoZan({
							"goodsClassId": activityId,
							"isUp": zanState,
						}).then((res) => {
							if (res.ret == 0) {
								message[i].zan == false ? message[i].upCnt++ : message[i].upCnt - 1 < 1 ? message[i].upCnt = '' : message[i]
									.upCnt--
								message[i].zan = !message[i].zan
								uni.showToast({
									title: message[i].zan ? '点赞成功' : '取消点赞',
								})
								that.activityList = message

								uni.$emit('zanFn', message[i])
							}
							lock = true
						})
					}
				}
			},
			gto: function(e) {
				uni.navigateTo({
					url: `/pages/plane/activity/activity?activityId=${e.id}&name=${e.name}`
				})
			},
			/**
			 * 获取轮播图
			 */
			getLunbo: function() {
				Lunbo({
					"type": 10,
					"goodClassId": '',
					"orderDescCol": '',
					"orderIncCol": '',
					"which_page": '',
					"pageSize": '',
					"param": ''
				}).then((res) => {
					console.log(res)
					var imgUrls = [],
						iconUrls = []
					if (res.ret == 0) {
						var list = res.info.list;
						for (var i = 0; i < list.length; i++) {
							if (list[i].param == 1) {
								imgUrls.push(list[i].url);
							}
							if (list[i].param == 3) {
								iconUrls.push(list[i])
							}
						}
						that.imgUrls = imgUrls
						that.iconUrls = iconUrls
						that.getCate()
					}
				})
			},
			/**
			 * 获取活动
			 */
			getCate: function() {
				
				Cate({
					"getDetail": "1",
					"type": "2",
					"which_page": 1,
					"pageSize": 10,
					"id": "",
					"status": 1,
					"getAll": 1,
					"seo": that.searchText
				}).then((result) => {
					console.log(result)
					uni.hideLoading()
					that.pageData.acPageCount = Math.ceil(result.info.pageInfo.total_cnt / 10)
					//活动数量
					for (var i = 0; i < result.info.list.length; i++) {
						var name = result.info.list[i].name; // 活动名称
						var keycode = result.info.list[i].keycode; //活动类型名称
						var id = result.info.list[i].id; //活动id
						var mark = result.info.list[i].mark;
						var subType = result.info.list[i].subType;
						var urlA = ''; //活动封面图
						var counts = 0; //记录活动背景图数量 0就代表活动未开始
						var urlBg = []; //活动页面的背景图
						var smallUrl = ""; //活动类型图
						var logoUrl = ""; //logo图
						var type = '';
						var upCnt = '' //点赞数量
						var zan = false
						for (var j = 0; j < result.info.list[i].gcImgList.length; j++) {
							if (result.info.list[i].gcImgList[j].type == 3) {
								urlA = result.info.list[i].gcImgList[j].url;
							} else if (result.info.list[i].gcImgList[j].type == 6) {
								counts = counts + 1;
								urlBg.push(result.info.list[i].gcImgList[j].url);
							} else if (result.info.list[i].gcImgList[j].type == 8) {
								//logo
								if (result.info.list[i].gcImgList[j].seqno == 0) {
									logoUrl = result.info.list[i].gcImgList[j].url
								}
							}
							type = result.info.list[i].gcImgList[j].type;
							upCnt = result.info.list[i].upCnt

						}
						that.zanList.find((item) => {
							if (item.rid == result.info.list[i].id) {
								zan = true
							}
						})
						that.iconUrls.find((item) => {
							if (item.param1 == keycode) {
								smallUrl = item.url
							}
						})

						var listA = {
							'name': name,
							'keycode': keycode,
							'id': id,
							'mark': mark,
							'url': urlA,
							"counts": counts,
							'urlBg': urlBg,
							'smallUrl': smallUrl,
							'type': type,
							'logoUrl': logoUrl,
							'upCnt': upCnt == 0 ? '' : upCnt,
							'zan': zan,
							'care': false,
							'scid': '',
							'subType': subType
						};
						that.pageData.activityListAll.push(listA);
						
					}

					shoucangOrZan({
						"type": 2,
						"uid": uni.getStorageSync("userInfos").uinfo.id,
						"seo": '',
						"which_page": 1,
						"pageSize": 100,
					}).then((res) => {
						console.log(res)
						that.pageData.activityListAll.forEach((item, index) => {
							console.log(item)
							res.forEach((el, i) => {
								if (el.rid == item.id) {
									item.care = true
									item.scid = el.scid
								}
							})
						});


						that.activityList = that.activityList.concat(that.pageData.activityListAll)
						that.activityList.length?that.showTip = false : that.showTip = true
						that.load = false
						that.percent = 90
						that.isSroll = true

						uni.showTabBar({})

					})
				})
			},
		}
	}
</script>

<style>
	@import url("./searchActivity.css");
</style>
