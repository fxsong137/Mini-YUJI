<template>
	<view class="business">
		<view class="business-top ">
			<view class="scrollTop">

				<!-- <view class="banner">
					<image src="https://yjkj-0508.oss-cn-shenzhen.aliyuncs.com/FAC:30c31196298a4547a1bfe0ef5f175d27.jpg" mode=""></image>
				</view> -->
				<view class="b-title">
					<view class="b-left">
						<image :src="companyData.imgurl"></image>
					</view>
					<view class="b-right">
						<view class='b-info'>
							<view class="b-name">
								<view class="b-name-top">{{companyData.name}}</view>
								<view class="b-name-bottom">50人关注</view>
							</view>
							<view class="follow" @tap="changeFollow">
								<tui-icon name="plus" :size="14" color="#fff" v-if="!isFollow"></tui-icon>
								{{isFollow?'已关注':'关注'}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="topbar">

				<topBar :tabCur="tabCur" :tabList="tabList" @changeTab="changeTab"></topBar>

			</view>
		</view>
		<view class="business-nav">
			<view class="nav-item" :class="[tabCur == 3?'nav-show':'']">
				<view class="product-list">

					<view class="synopsis">
						<view class="synopsis-title">品牌简介</view>
						<view class="synopsis-content">
							{{companyData.mark}}
						</view>
					</view>
					<view class="contact" @tap="showModal" v-if="service">客服咨询</view>
				</view>
			</view>
			<view class="nav-item" :class="[tabCur == 2?'nav-show':'']">
				<scroll-view scroll-y="true" :style="'height:' + scrollHeight + 'px'" @scrolltolower="moreCare">
					<view class="product-list">
						<my-care style="width: 100%;" v-if="careIsNull" @care="care" @zanClick="zanClick" @gto="gto" :activityList="activityList"></my-care>
						<view v-else style='width:100%;text-align:center;font-size:30upx;color:#101010;padding-top:100upx'>暂无活动</view>
					</view>
				</scroll-view>
			</view>
			<view class="nav-item" :class="[tabCur == 1?'nav-show':'']">
				<scroll-view scroll-y="true" :style="'height:' + scrollHeight + 'px'"  @scrolltolower="moreGoods">

					<view class="product-list">
						<view class="goods-list">
							<view class="goods-item" v-for="(item,index) in goodsList" :key="index" @tap="toDoodsInfo(item)">
								<view class="item-top">
									<image v-if="item.isCanPrivate == 1" :src="item.imgList[0].url" mode="aspectFill"></image>
									<video :src="item.imgList[0].url" v-else :controls="false"></video>
								</view>
								<view class="item-bottom">
									<view class="item-tips">
										{{item.unit}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>

			</view>
			<view class="nav-item" :class="[tabCur == 0?'nav-show':'']">
				<scroll-view scroll-y="true" :style="'height:' + scrollHeight + 'px'"  @scrolltolower="moreGoods">
					<view class="goods-news">
						<goods-news @toDoodsInfo="toDoodsInfo" :goodsList="goodsList"></goods-news>
					</view>
				</scroll-view>
			</view>
		</view>

		<my-service :show="show" :service="service" @hideModal="hideModal"></my-service>
	</view>
</template>

<script>
	import tuiIcon from "@/components/Thor-ui/icon/icon"
	import tuiDivider from "@/components/Thor-ui/divider/divider"
	import topBar from '@/components/my-components/top-bar.vue'
	import wPicker from "@/components/w-picker/w-picker.vue";
	import mSearch from '@/components/mehaotian-search/mehaotian-search.vue';
	import goodsNews from '@/components/my-components/goods-news.vue'
	import myCare from '@/components/my-components/my-care.vue'
	import myService from "@/components/my-components/my-service.vue"
	import {
		delComment,
		addComment,
		searchComment,
		gtoZan,
		getOpenid,
		shoucangOrZan,
		searchCompany,
		searchGoodsName,
		searchService,
		Cate,
	} from '@/http/http.js'
	let that;
	export default {
		components: {
			tuiIcon,
			topBar,
			wPicker,
			mSearch,
			myCare,
			tuiDivider,
			goodsNews,
			myService
		},
		data() {
			return {
				activityList: [],
				careIsNull: true,
				tabCur: 0,
				tabList: ['上新', '商品', '活动', '咨询'],
				scrollHeight: '',
				goodsList: [], //商品数据
				goodsTotalPage: 0, //商品总页数
				goodsCurrentPage: 1, //商品当前页码
				windowHeight: '',
				show: false,
				coid: '',
				companyData: {},
				service: '',
				uid: uni.getStorageSync('userInfos').uinfo.id,
				careTotalPage: 0,
				careCurrentPage: 1,
				zanList: [],
				activityListAll: [],
				isFollow: false,
				followId: '',
			}
		},
		onLoad(options) {

			that = this
			that.coid = options.coid
			that.coid = 26
			try {
				that.windowHeight = uni.getSystemInfoSync().windowHeight;
			} catch (e) {
				console.log(e)
				// error
			}
			var query = uni.createSelectorQuery();

			query.select('.business-top').boundingClientRect((res) => {
				if (res) {

					that.scrollHeight = that.windowHeight - res.height

				}
			}).exec()
			that.initData()
			that.getCompany()
			that.getGoods()
			that.getService()
			that.getFollow()
			
		},
		methods: {
			
			getFollow: function() { //获取关注的店铺
				searchComment({
					type: 7,
					uid: that.uid,
					which_page: 1,
					pageSize: 100
				}).then((res)=>{
					console.log(res)
					if(res.ret == 0) {
						if(res.info.list.length) {
							res.info.list.forEach((el,i)=>{
								if(el.rid == that.coid) {
									that.isFollow = true
									that.followId = el.id
								}
							})
						} 
					}
				})
			},
			changeFollow: function() { //关注以及取消
				if(that.isFollow) {
					uni.showModal({
					    title: '提示',
					    content: '确定取消关注吗？',
					    success: function (res) {
					        if (res.confirm) {
								that.delFollow()
								
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}else {
					that.addFollow()
					
				}
				
			},
			addFollow: function() { //关注店铺
				
				addComment({
					type: 7,
					rid: that.coid,
					mark: '1'
				}).then((res)=>{
					console.log(res)
					if(res.ret == 0) {
						uni.showToast({
						    title: '关注成功',
						    duration: 2000,
							icon: 'none'
						});
						that.isFollow = true
						uni.$emit('getFollow')
					}
				})
			},
			delFollow: function() { //取消关注
				delComment({
					type: 7,
					id: that.followId,
				}).then((res)=>{
					if(res.ret == 0) {
						uni.showToast({
						    title: '已取消关注',
						    duration: 2000,
							icon: 'none'
						});
						that.isFollow = false
						uni.$emit('getFollow')
					}
				})
			},
			getGoods: function() { //获取商品数据
				searchGoodsName({
					coid: that.coid,
					getAll: 1,
					getDetail: 1,
					orderDescCol: "optm",
					"which_page": that.goodsCurrentPage,
					"pageSize": 5,
				}).then(res => {
					console.log(res)
					if (res.ret == 0) {
						that.goodsTotalPage = res.info.pageInfo.page_end
						if (res.info.list.length) {
							that.goodsList = that.goodsList.concat(res.info.list) 
						}
					}
				})
			},
			getCompany: function() { //查询商家信息
				searchCompany({
					id: that.coid
				}).then(res => {
					console.log(res)
					if (res.ret == 0) {
						that.companyData = res.info.list[0]
					}
				})
			},
			getService: function() { //查询客服
				searchService({
					type: 8,
					coid: that.coid
				}).then(res => {
					console.log(res)
					if (res.ret == 0) {
						if (res.info.list.length) {
							var obj = {
								qr: res.info.list[0].url,
								name: res.info.list[0].param1
							}
							uni.setStorageSync('service', obj)
							that.service = obj
							console.log(that.service)
						} else {
							uni.setStorageSync('service', '')
						}
					}
				})
			},
			changeTab: function(e) {
				console.log(e)
				that.tabCur = e
			},
			initData: function() {
				that.activityList = [],
					that.careIsNull = true,
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
							console.log(res)
							that.zanList = res

							that.searchCate()
						})
					})
			},
			searchCate: function() { // 获取活动
				Cate({
					"getDetail": true,
					"type": "2",
					"which_page": that.careCurrentPage,
					"pageSize": 4,
					"status": 1,
					"getAll": 1,
					"coid": that.coid
				}).then((res) => {
					console.log(res)
					if (res.ret == 0) {
						that.activityListAll = []
						that.careTotalPage = res.info.pageInfo.page_end
						if (res.info.list.length) {
								var list = res.info.list
							for (var i = 0; i <list.length; i++) {
								var name = list[i].name; // 活动名称
								var keycode = list[i].keycode; //活动类型名称
								var id = list[i].id; //活动id
								var mark = list[i].mark;
								var subType = list[i].subType;
								var urlA = ''; //活动封面图
								var counts = 0; //记录活动背景图数量 0就代表活动未开始
								var urlBg = []; //活动页面的背景图
								var logoUrl = ""; //logo图
								var type = '';
								var upCnt = list[i].upCnt //点赞数量
								var coid = list[i].coid //店铺id
								var zan = false
								for (var j = 0; j < list[i].gcImgList.length; j++) {
									if (list[i].gcImgList[j].type == 3) {
										urlA = list[i].gcImgList[j].url;
									} else if (list[i].gcImgList[j].type == 6) {
										counts = counts + 1;
										urlBg.push(list[i].gcImgList[j].url);
									} else if (list[i].gcImgList[j].type == 8) {
										//logo
										if (list[i].gcImgList[j].seqno == 0) {
											logoUrl = list[i].gcImgList[j].url
										}
									}
									type = list[i].gcImgList[j].type;

								}
								that.zanList.find((item) => {
									if (item.rid == list[i].id) {
										zan = true
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
									'type': type,
									'logoUrl': logoUrl,
									'upCnt': upCnt < 1 ? '' : upCnt,
									'zan': zan,
									'care': false,
									'scid': '',
									'subType': subType,
									'coid': coid
								};
								
								that.activityListAll.push(listA);
							}

							shoucangOrZan({
								"type": 2,
								"uid": uni.getStorageSync("userInfos").uinfo.id,
								"seo": '',
								"which_page": 1,
								"pageSize": 100,
							}).then((res) => {
								that.activityListAll.forEach((item, index) => {
									res.forEach((el, i) => {
										if (el.rid == item.id) {
											item.care = true
											item.scid = el.scid
										}
									})
								});
								that.activityList = that.activityList.concat(that.activityListAll)
								console.log(that.activityList)
								that.activityList.length == 0 ? that.careIsNull = false : that.careIsNull = true

							})
						}
					}
				})
			},
			moreCare: function() { //加载下一页活动
				console.log(123)
				if(that.careCurrentPage < that.careTotalPage ) {
					that.careCurrentPage = that.careCurrentPage +1
				} else {
					uni.showToast({
						icon: 'none',
						title: '已经是最后一页啦~',
					})
					return false;
				}
				that.searchCate()
			},
			moreGoods: function() {
				if(that.goodsCurrentPage < that.goodsTotalPage ) {
					that.goodsCurrentPage = that.goodsCurrentPage +1
				} else {
					uni.showToast({
						icon: 'none',
						title: '已经是最后一页啦~',
					})
					return false;
				}
				that.getGoods()
			},
			gto: function(e) {
				var pathName = e.subType == 1 ? 'activity' : 'video-home'
				that.$Router.push({
					name: pathName,
					params: {
						activityId: e.id,
						name: e.name
					}
				})

			},
			toMap: function() {
				uni.navigateTo({
					url: `/pages/map/map`
				})
			},
			toDoodsInfo: function(item) {
				uni.navigateTo({
					url: `/pages/user/business/goods-info/goods-info?goodsId=${item.id}&coid=${that.coid}`
				})
			},

			hideModal: function() { //隐藏弹出框
				that.show = false
			},
			showModal: function() { //显示弹出框
				that.show = true
			},
		}
	}
</script>

<style>
	@import url("./business.css");
</style>
