<template>
	<view style='width:100%;height: 100%;'>
		<view class="search">
			<mSearch :mode="2" button="inside" :show="false" @search="search($event,3)"></mSearch>
		</view>
		<scroll-view scroll-y :scroll-with-animation='true' :scroll-top='scrollTop' :style='"width:100%;height:" + windowHeight + "px"'
		 id='pad' @scroll="onScroll" @scrolltolower="scrolltolower" v-if="!load && !refresh">
			<swiper circular :indicator-dots="true" :autoplay="true" :interval="5000" :duration="1000" :style="'width:100% !important;height:' + Hei">
				<block v-for="(item,index) in imgUrls" :key="index">
					<swiper-item style='height:auto !important'>
						<image :src="item" class="slide-image" mode="widthFix" style="width:100%;display:block" @load='imgH' />
					</swiper-item>
				</block>
			</swiper>
			<view class="titleA"  v-if="careIsNull">点击下方活动图片开始体验</view>
			<!-- 顶部轮播 -->
			<view class="product-list">
				<my-care style="width: 100%;" v-if="careIsNull" @care="care" @zanClick="zan" @gto="gto" :activityList="activityList"></my-care>
				<view v-else style='width:100%;text-align:center;font-size:30upx;color:#101010;padding-top:100upx'>暂无活动</view>
			</view>
		</scroll-view>
		<!-- 回到顶部按钮 -->
		<view class='gotoTop' @tap='returnTop' v-if='scroll'>
			返回顶部
		</view>
		<view v-if="load" style='width:100%;height:100%;position: fixed;top:0;z-index:9999'>
			<image src='http://cdn.jnhangqi.cn/startBg.jpg' mode='scaleToFill' style='width:100%;height:100%' />
		</view>

		<view class="progress" v-if="load">
			<progress :percent="percent" stroke-width="2" backgroundColor='transparent' />
		</view>
		
	</view>
</template>

<script>
	import mSearch from '@/components/mehaotian-search/mehaotian-search.vue';
	import myCare from '@/components/my-components/my-care.vue'
	import {
		Lunbo,
		Cate,
		getOpenid,
		shoucangOrZan,
		gtoZan,
		addComment,
		delComment,
		searchComment
	} from '@/http/http.js'
	import {
		getWindowInfo
	} from '@/utils/util.js'
	let that;
	export default {
		components: {
			mSearch,
			myCare,
		},
		data() {
			return {
				loadding: false,
				pullUpOn: true,
				scrollTop: 0,
				old: {
					scrollTop: 0,
				},
				isSroll: false,
				windowHeight: '',
				imgUrls: [],
				activityId: null, //活动id
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
				careIsNull: true,
				refresh: false
			}
		},

		onLoad() {
			that = this
			getWindowInfo().then((el) => {
				const query = uni.createSelectorQuery();
				query.select('.search').boundingClientRect((res) => {
					if (res) {
						that.windowHeight = el.windowHeight - res.height
						console.log(that.windowHeight)
					}
				}).exec()
			})
			that.loading();
			that.initData()
			uni.$on('careFn', that.careFn)
			uni.$on('zanFn', that.zanFn)
		},
		methods: {

			initData: function() { //初始化数据
				uni.showLoading({
					title: '加载中'
				});
				that.refresh = true
				getOpenid().then(() => {
					searchComment({ //获取点赞数据
						"type": 6,
						"uid": uni.getStorageSync("userInfos").uinfo.id,
						"seo": '',
						"which_page": 1,
						"pageSize": 100,
					}).then((res) => {
						console.log(res)
						that.zanList = res.info.list
						that.pageData = {
							activityListAll: [],
							acPageCount: 0, //页面总数
							currentPage: 1, //当前数据显示的页面
							timer: null
						}
						that.isSroll = false
						that.scrollTop = 0
						that.activityList = []
						that.old = {
							scrollTop: 0
						}

						that.getLunbo()

					})
				})
			},
			/**
			 * 获取活动
			 */
			getCate: function(currentPage) {
				
				Cate({
					"getDetail": true,
					"type": "2",
					"which_page": currentPage,
					"pageSize": 10,
					"status": 1,
					"getAll": 1
				}).then((result) => {
					console.log(result)
					uni.hideLoading()
					uni.stopPullDownRefresh()
					that.pageData.activityListAll = []
					that.pageData.acPageCount = result.info.pageInfo.page_end
					console.log(that.pageData)
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
						var upCnt = result.info.list[i].upCnt//点赞数量
						console.log(upCnt)
						var coid = result.info.list[i].coid //店铺id
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
							'subType': subType,
							'coid': coid
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
						that.pageData.activityListAll.forEach((item, index) => {
							res.forEach((el, i) => {
								if (el.rid == item.id) {
									item.care = true
									item.scid = el.scid
								}
							})
						});

						clearInterval(that.pageData.timer);
						that.activityList = that.activityList.concat(that.pageData.activityListAll)
						console.log(that.activityList)
						that.activityList.length == 0 ? that.careIsNull = false : that.careIsNull = true
						that.load = false
						that.percent = 90
						that.isSroll = true
						that.refresh = false
						uni.showTabBar({})

					})
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
					"param": 1
				}).then((res) => {
					console.log(res)
					var imgUrls = [],
						iconUrls = []
					if (res.ret == 0) {
						var list = res.info.list;
						for (var i = 0; i < list.length; i++) {
							imgUrls.push(list[i].url);
						}
						that.imgUrls = imgUrls
						that.iconUrls = iconUrls
						that.getCate(that.pageData.currentPage)
					}
				})
			},
			imgH: function(e) {
				var winWid = uni.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
				var imgh = e.detail.height; //图片高度
				var imgw = e.detail.width;
				var swiperH = winWid * imgh / imgw + "px";

				that.Hei = swiperH //设置高度

			},
			loading: function() {
				that.percent = 0,
					that.load = true

				//----定时器实现进度条加载----
				that.pageData.timer = setInterval(function() {
					if (that.percent < 90) {

						that.percent = that.percent + 1

					}
				}, 60);
			},

			/**
			 * 回到顶部
			 */
			returnTop: function() {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
			},
			/**
			 * 页面滚动事件
			 */
			onScroll: function(e) {

				e.detail.scrollTop > 500 ? this.scroll = true : this.scroll = false
				this.old.scrollTop = e.detail.scrollTop
			},
			//点击这个进行收藏 或取消
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
							if (message[j].id == activityId) {
								message[j].care = !message[j].care
								message[j].scid = res.info || ''
								uni.showToast({
									title: message[j].care ? '收藏成功' : '取消收藏',
								})
								console.log(message[j])

								uni.$emit('updateCare', message[j])
							}
						}
					}
				})
			},
			//点赞或取消事件
			zan: function(e) {
				console.log(e)
				var activityId = e.id;
				var message = that.activityList;

				var lock = true;
				if (!lock) return;
				lock = false

				for (let j in message) { //遍历列表数据
					if (message[j].id == activityId) { //根据下标找到目标
						var zanState = message[j].zan == false ? 1 : 0;
						gtoZan({
							"goodsClassId": activityId,
							"isUp": zanState,
						}).then((res) => {
							console.log(res)
							if (res.ret == 0) {
								message[j].zan == false ? message[j].upCnt++ : message[j].upCnt - 1 < 1 ? message[j].upCnt = '' : message[j].upCnt--
								message[j].zan = !message[j].zan
								uni.showToast({
									title: message[j].zan ? '点赞成功' : '取消点赞',
								})
								uni.$emit('updateZan', message[j])
							}
							lock = true
						})
					}
				}

			},
			gto: function(e) {
				var activityId = e.id;
				var name = e.name;
				var counts = e.counts;
				uni.setStorage({
					key: 'activityName',
					data: name,
					success: function() {
						//如果轮播图数量为0 提示活动未开展
						if (counts == 0) {
							uni.showModal({
								title: '活动未启动',
								content: '敬请期待...',
								showCancel: false
							})
							
						} else {
							var pathName = e.subType == 1?'activity':'video-home'
							that.$Router.push({ name: pathName, params: { activityId: activityId,name:name }})
								
						}
					}
				})

			},
			scrolltolower: function() {

				if (!that.isSroll) return false
				that.isSroll = false
				var currentIndex = that.pageData.currentPage
				//执行分页 先判断总页数是否大于1 
				if (that.pageData.acPageCount > 1) {
					//  判断要执行的页面是否是最后一页
					if (currentIndex < that.pageData.acPageCount) {
						that.pageData.currentPage = currentIndex + 1

						that.getCate(that.pageData.currentPage)

					} else {
						uni.showToast({
							icon: 'none',
							title: '已经是最后一页啦~',
						})
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: '已经是最后一页啦~',
					})
				}
			},
			careFn: function(e) {
				var arr = that.activityList.concat()
				arr.forEach((item, index) => {
					if (e.id == item.id) {
						item.care = e.care
						item.scid = e.scid
					}
				});

			},
			zanFn: function(e) {


				var arr = that.activityList.concat()
				arr.forEach((el, i) => {
					if (el.id == e.id) {
						el.zan = e.zan
						el.upCnt = e.upCnt
					}
				})
			},
			search: function(e) {
				if (!e) return;
				that.$Router.push({ name: 'searchActivity', params: { search: e }})
			}
		},
		onPullDownRefresh() {
			that.initData()
		}
	}
</script>

<style>
	@import url("./index.css");
</style>
