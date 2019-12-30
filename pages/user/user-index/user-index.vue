<template>
	<view>
		<view class="user">
			<view class="user-icon">
				<image :src="userInfos.imgurl "></image>
			</view>
			<view class="user-info">
				<view class='name'>
					<view class="user-name">{{userInfos.name}}</view>
					<view @tap="toSelfInfo">个人信息</view>
				</view>
			</view>
			<uni-icon type="arrowright" size="20" color="#000"></uni-icon>
		</view>
		<view class="container">
			<view class="tab-view">
				<view v-for="(item,index) in tabbar" :key="index" class="tab-bar-item" :class="[currentTab==index ? 'active' : '']"
				 :data-current="index" @tap.stop="swichNav">
					<text class="tab-bar-title">{{item}}</text>
				</view>
			</view>
			<swiper class="tab-content" :current="currentTab" duration="300" @change="switchTab" :style="{height:winHeight+'px'}">
				<swiper-item>
					<scroll-view scroll-y :style="{height:winHeight+'px'}">
						<!--start 内容部分可直接删除-->
						<view class="product-list" v-if="videoIsNull">
							<!--商品列表-->
							<view class="pro-item" @longpress="showDel" v-for="(item,index) in videoList" :key="index" >
								<image src="../../../static/img/2.jpg" class="pro-img" />
								<view class="shadow" v-if="showCheckbox">
									<checkbox-group @change="Checkbox($event,item.id)">
										<checkbox class="checkbox" />
									</checkbox-group>
								</view>
							</view>
							<!--商品列表-->
						</view>
						<view v-else style='width:100%;text-align:center;font-size:30upx;color:#101010;padding-top:100upx'>暂无视频</view>
						<!--end 内容部分可直接删除-->
					</scroll-view>
					<view class="operation" v-if="showCheckbox">
						<view class="opera-item" @tap="closeCheckbox">取消</view>
						<view class="opera-item" @tap="remove('video')">删除({{selectDel.length}})</view>
					</view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y class="scoll-y" :style="{height:winHeight+'px'}">
						<!--start 内容部分可直接删除-->
						<view class="product-list" v-if="imgIsNull">
							<view class="pro-item" @longpress="showDel" @touchstart="handleTouchStart" @touchend="handleTouchEnd" v-for="(item,index) in imgList"
							 :key="index">
								<image :src="item.url" mode="aspectFill" class="pro-img" @tap="previewImage(index)" />
								<view class="shadow" v-if="showCheckbox">
									<checkbox-group @change="Checkbox($event,item.id)">
										<checkbox class="checkbox" />
									</checkbox-group>
								</view>
							</view>
						</view>
						<view v-else style='width:100%;text-align:center;font-size:30upx;color:#101010;padding-top:100upx'>暂无图片</view>
						<!--end 内容部分可直接删除-->
					</scroll-view>
					<view class="operation" v-if="showCheckbox">
						<view class="opera-item" @tap="closeCheckbox">取消</view>
						<view class="opera-item" @tap="remove('img')">删除({{selectDel.length}})</view>
					</view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y class="scoll-y" @scrolltolower="careScrolltolower" :style="{height:winHeight+'px'}">
						<!--start 内容部分可直接删除-->
						<view class="product-list">
							<my-care style="width: 100%;" v-if="careIsNull" @care="care" @zanClick="zanClick" @gto="gto" :activityList="activityList"></my-care>
							<view v-else style='width:100%;text-align:center;font-size:30upx;color:#101010;padding-top:100upx'>暂无收藏</view>
						</view>
						<!--end 内容部分可直接删除-->
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y class="scoll-y" :style="{height:winHeight+'px'}" v-if="followList.length">
						<!--start 内容部分可直接删除-->
						<view class="product-list" v-for="(item,index) in followList" :key="index">
							<view class="follow-box">
								<view class="follow-left" @tap="toBusiness">
									<view class="icon">
										<image :src="item.ridInfo.imgurl" mode=""></image>
									</view>
									<view class="name">
										{{item.ridInfo.name}}
									</view>
								</view>
								<view class="follow-right" @tap="clearFollow(item.id)">
									已关注
								</view>
							</view>
						</view>
						<!--end 内容部分可直接删除-->
					</scroll-view>
					<view v-else style='width:100%;text-align:center;font-size:30upx;color:#101010;padding-top:100upx'>暂无关注</view>
				</swiper-item>
			</swiper>

		</view>
	</view>
</template>

<script>
	import uniIcon from "@/components/uni-ui/uni-icon/uni-icon.vue"
	import myCare from '@/components/my-components/my-care.vue'
	import {
		delComment,
		searchComment,
		gtoZan,
		Lunbo,
		getOpenid,
		shoucangOrZan,
		searchCommImg,
		batchDelCommImg
	} from '@/http/http.js'
	let that;
	export default {
		components: {
			uniIcon,
			myCare
		},
		data() {
			return {
				// shoucang
				activityList: [],
				// iconUrls: [], //活动类型图片
				careIsNull: true, //是否有收藏数据
				careTotalPage: 0, //收藏总的页面数量
				careCurrentPage: 1, //收藏当前页码
				isCareSroll: false, // 加载下一页收藏
				
				imgIsNull: true, //是否有图片数据
				imgTotalPage: 0, //图片总的页面数量
				imgCurrentPage: 1, //图片当前页码
				isImgSroll: false, // 加载下一页图片
				
				videoIsNull: true, //是否有视频数据
				videoTotalPage: 0, //视频总的页面数量
				videoCurrentPage: 1, //视频当前页码
				isVideoSroll: false, // 加载下一页视频
				
				zanList: [],
				zan: [], //记录点赞的数据
				acList: [],
				// shoucang
				showCheckbox: false, //显示选择框
				selectDel: [],
				uid: null,
				userInfos: {},
				tabbar: ["视频", "照片", "收藏", "关注"],
				winHeight: "", //窗口高度
				currentTab: 0, //预设当前项的值
				scrollLeft: 0, //tab标题的滚动条位置
				CommImgList: [], //生成的图片列表
				followList: [],
				imgList: [],
				videoList: [],
			}
		},
		onLoad: function() {
			that = this
			that.uid = uni.getStorageSync("userInfos").uinfo.id
			var userInfos = uni.getStorageSync("userInfos").uinfo
			console.log(userInfos)
			if (!userInfos || !that.uid) {
				getOpenid().then((res) => {
					console.log(res)
					that.userInfos = res.unifouserInfos
					that.uid = res.unifouserInfos.id
				})
			} else {
				that.userInfos = userInfos
			}

			uni.getSystemInfo({
				success: function(ret) {
					let calc = ret.windowHeight;
					that.winHeight = calc - 30;
					console.log(calc)
					const query = uni.createSelectorQuery();
					query.select('.user').boundingClientRect((res) => {
						if (res) {
							console.log(res.height)
							that.winHeight = that.winHeight - res.height
						}
					}).exec()
					const querys = uni.createSelectorQuery();
					querys.select('.tab-view').boundingClientRect((res) => {
						if (res) {
							console.log(res.height)
							that.winHeight = that.winHeight - res.height
						}
					}).exec()
				}
			});
			// that.getLunbo()
			that.initData()
			that.getCommImg('img',1)
			that.getCommImg('video',1)
			that.getFollow()
			uni.$on('updateZan', that.updateZan)
			uni.$on('updateCare', that.updateCare)
			uni.$on('changeUser', that.changeUser)
			uni.$on('getFollow', that.getFollow)
		},
		watch: {
			currentTab() {
				that.showCheckbox = false
				that.selectDel = []
			}
		},
		methods: {

			initData: function() {
				that.activityList = [],
					that.careIsNull = true,
					// that.iconUrls = [], //活动类型图片
					that.careTotalPage = 0, //总的页面数量
					that.careCurrentPage = 1, //当前数据显示的页面
					that.zanList = [],
					that.zan = [], //记录点赞的数据
					that.acList = [],
					getOpenid().then(() => {
						shoucangOrZan({ //获取点赞数据
							"type": 6,
							"uid": that.uid,
							"seo": '',
							"which_page": 1,
							"pageSize": 100,
						}).then((res) => {
							that.zanList = res

							that.searchComment()
						})
					})
			},
			getFollow: function() { //获取关注的店铺
				searchComment({
					type: 7,
					uid: that.uid,
					which_page: 1,
					pageSize: 100
				}).then((res) => {
					console.log(res)
					if (res.ret == 0) {

						that.followList = res.info.list

					}
				})
			},
			delFollow: function(id) { //取消关注
				delComment({
					type: 7,
					id: id,
				}).then((res) => {
					if (res.ret == 0) {
						uni.showToast({
							title: '已取消关注',
							duration: 2000,
							icon: 'none'
						});
						that.followList.forEach((el,i)=>{
							if(el.id == id) {
								that.followList.splice(i,1)
							}
						})
					}
				})
			},
			getCommImg: function(type,page) { //获取生成的图片或者视频 type = img 图片 video 视频 
				var data = {
					type: 9,
					orderDescCol: "lastUrlTm",
					param: type,
					"which_page": page,
					"pageSize": 10,
					// rid: that.uid,
				}
				searchCommImg(data).then((res) => {
					console.log(res)
					if (res.ret == 0) {
						if(type == 'img') {
							that.imgTotalPage = res.info.pageInfo.page_end
							that.imgList = that.imgList.concat(res.info.list) 
							that.imgList.length == 0 ? that.imgIsNull = false : that.imgIsNull = true
						} else {
							that.videoTotalPage = res.info.pageInfo.page_end
							that.videoList = that.videoList.concat(res.info.list) 
							that.videoList.length == 0 ? that.videoIsNull = false : that.videoIsNull = true,
							console.log(that.videoIsNull)
						}
					}
				})
			},

			changeUser: function() { //更改信息
				that.uid = uni.getStorageSync("userInfos").uinfo.id
				var userInfos = uni.getStorageSync("userInfos").uinfo
				if (!userInfos || !that.uid) {
					getOpenid().then((res) => {
						console.log(res)
						that.userInfos = res.unifouserInfos
						that.uid = res.unifouserInfos.id
					})
				} else {
					that.userInfos = userInfos
				}
			},
			toSelfInfo: function() {
				uni.navigateTo({
					url: '../user-info/user-info'
				});
			},
			// 滚动切换标签样式
			switchTab: function(e) {
				let that = this;
				this.currentTab = e.detail.current;
				this.checkCor();
			},
			// 点击标题切换当前页时改变样式
			swichNav: function(e) {
				let cur = e.currentTarget.dataset.current;
				if (this.currentTab == cur) {
					return false;
				} else {
					
					this.currentTab = cur
				}
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor: function() {
				if (this.currentTab > 3) {
					//这里距离按实际计算
					this.scrollLeft = 300
				} else {
					this.scrollLeft = 0
				}
			},
			careScrolltolower: function() { //收藏数据下一页
				if (that.careCurrentPage < that.careTotalPage && that.isCareSroll) {
					that.isCareSroll = false
					that.careCurrentPage = that.careCurrentPage + 1
					that.searchComment()
				} else {
					uni.showToast({
						icon: 'none',
						title: '没有更多数据啦~',
					})
				}
				console.log(that.careCurrentPage)
				console.log(that.careTotalPage)
			},
			// 收藏 B
			searchComment: function() {
				searchComment({
					"type": 2,
					"uid": uni.getStorageSync("userInfos").uinfo.id,
					"seo": '',
					"which_page": that.careCurrentPage,
					"pageSize": 5,
					"orderDescCol": "optm"
				}).then((res) => {
					console.log(res)
					that.isCareSroll = true
					if (res.ret == 0) {
						that.acList = []
						var list = res.info.list;
						for (var i = 0; i < list.length; i++) {
							var keycode = list[i].ridInfo.keycode
							var scid = list[i].id;
							var activityID = list[i].rid;
							var subType = list[i].ridInfo.subType;
							var name = list[i].ridInfo.name;
							var imgList = list[i].ridInfo.gcImgList;
							var url = '';
							var logoUrl = '';
							var smallUrl = '';
							var upCnt = '' //点赞数量
							var zan = false
							for (var k = 0; k < imgList.length; k++) {
								if (imgList[k].type == 3) {
									url = imgList[k].url;
								}
								if (imgList[k].type == 8) {
									if (imgList[k].seqno == 0) {
										logoUrl = imgList[k].url
									}
								}
								upCnt = res.info.list[i].ridInfo.upCnt
							}

							that.zanList.find((item) => {
								if (item.rid == activityID) {
									zan = true
								}
							})

							// that.iconUrls.find((item) => {
							// 	if (item.param1 == keycode) {
							// 		smallUrl = item.url
							// 	}
							// })
							var listA = {
								'name': name,
								'url': url,
								'scid': scid,
								'id': activityID,
								'logoUrl': logoUrl,
								'smallUrl': smallUrl,
								'zan': zan,
								'upCnt': upCnt == 0 ? '' : upCnt,
								'care': true,
								'subType': subType
							};
							that.acList.push(listA);
						}
						that.activityList = that.activityList.concat(that.acList)
						that.careTotalPage = res.info.pageInfo.page_end
						that.activityList.length == 0 ? that.careIsNull = false : that.careIsNull = true

					}
				})
			},
			/**
			 * 获取公共图片
			 */
			// getLunbo: function() {
			// 	Lunbo({
			// 		"type": 10,
			// 		"goodClassId": '',
			// 		"orderDescCol": '',
			// 		"orderIncCol": '',
			// 		"which_page": '',
			// 		"pageSize": '',
			// 		"param": ''
			// 	}).then((res) => {
			// 		var iconArr = []
			// 		if (res.ret == 0) {
			// 			var list = res.info.list;
			// 			for (var i = 0; i < list.length; i++) {
			// 				if (list[i].param == 3) {
			// 					iconArr.push(list[i])
			// 				}
			// 			}
			// 			that.iconUrls = iconArr
			// 		}
			// 	})
			// },
			/**
			 * //取消收藏的操作
			 */
			care: function(e) {
				console.log(e);
				// 执行取消收藏的操作
				delComment({
					'id': e.scid
				}).then((res) => {
					if (res.ret == 0) {
						that.activityList = that.activityList.filter((item) => {
							if (item.scid != e.scid) {
								return item;
							}
						})

						that.activityList.length == 0 ? that.careIsNull = false : that.careIsNull = true,
							e.care = false
						uni.$emit('careFn', e)
						uni.showToast({
							title: '取消收藏',
						})
					} else {
						uni.showToast({
							title: '取消失败',
						})
					}
				})
			},
			//点赞事件
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
				console.log(e)
				if (e.subType == 1) {

					uni.navigateTo({
						url: `/pages/plane/activity/activity?activityId=${e.id}&name=${e.name}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/video/video-home/video-home?activityId=${e.id}&name=${e.name}`
					})
				}

			},
			updateZan: function(zan) {
				var arr = that.activityList.concat()

				arr.forEach((el, i) => {
					if (el.id == zan.id) {
						el.zan = zan.zan
						el.upCnt = zan.upCnt
					}
				})
			},
			updateCare: function(updateCare) {

				if (updateCare.care) {
					that.activityList.unshift(updateCare)
				} else {
					that.activityList.forEach((el, i) => {
						if (el.id == updateCare.id) {
							that.activityList.splice(i, 1)
						}
					})
				}

				that.activityList.length == 0 ? that.careIsNull = false : that.careIsNull = true


			},
			// 前往商铺
			toBusiness: function() {
				uni.navigateTo({
					url: `/pages/user/business/business`
				})
			},
			toVideoReplace: function() { //前往视频播放
				if (that.showCheckbox) return;
				uni.navigateTo({
					url: `/pages/video/video-replace/video-replace`
				})
			},
			clearFollow: function(id) {
				uni.showModal({
					title: '提示',
					content: '确定不再关注？',
					success: function(res) {
						if (res.confirm) {
							that.delFollow(id)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			showDel: function() {
				that.showCheckbox = true
			},
			closeCheckbox: function() {
				that.showCheckbox = false
				that.selectDel = []
			},
			Checkbox: function(e, item) {
				console.log(e)
				console.log(item)
				// console.log(e.detail.value.length)
				if (e.detail.value.length) {
					that.selectDel.push(item)
				} else {
					that.selectDel.forEach((el, i) => {
						if (el == item) {
							that.selectDel.splice(i, 1)
						}
					})
				}
				console.log(that.selectDel)
			},
			remove: function(type) {
				if (!that.selectDel.length) {
					that.showCheckbox = false
					return false;
				}
				uni.showModal({
					title: '提示',
					content: '确定要删除吗？',
					success: function(res) {
						if (res.confirm) {
							if(type == 'img') {
								that.imgList = []
							} else {
								that.videoList = []
							}
							that.delImg(type)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			delImg: function(type) { //删除生成的图片或者视频
				batchDelCommImg({
					idsStr: that.selectDel.join()
				}).then(res => {
					if (res.ret == 0) {		
						that.getCommImg(type,1)
						that.showCheckbox = false
						that.selectDel = []
					}
				})
			},
			previewImage: function(el, index) { //预览图片
				if (this.endTime - this.startTime < 350) {
					var obj = []
					that.imgList.forEach((el, i) => {
						console.log(el)
						obj.push(el.url)
					})
					uni.previewImage({
						urls: obj,
						current: index
					});
				}
			},
			//touch start
			handleTouchStart: function(e) {
				this.startTime = e.timeStamp;
			},

			//touch end
			handleTouchEnd: function(e) {
				this.endTime = e.timeStamp;
			},

		}
	}
</script>

<style>
	@import url("./user-index.css");
</style>
