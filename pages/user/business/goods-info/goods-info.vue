<template>
	<view>
		<view class="swiper">
			<swiper :indicator-dots="true"  indicator-active-color="#FD5D59" indicator-color="rgba(253,93,89,.3)" :interval="3000"
			 :duration="500">
				<swiper-item v-for="(item,index) in goods.imgList" :key="index">
					<view class="swiper-item" @tap="showImg(index)" v-if="goods.isCanPrivate == 1">
						<image :src="item.url" mode="aspectFill"></image>
					</view>
					<view class="swiper-item" v-else>
						<video :src="item.url" controls autoplay loop></video>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="info">
			<view class="title">
				{{goods.unit?goods.unit:''}}
			</view>
			<!-- <view class="goods-color">
				颜色: 红-白-黑
			</view>
			<view class="goods-size">
				尺码: S-M-L
			</view> -->
		</view>
		<view class="introduce"  v-if="goods.isCanPrivate == 1">
			<tui-divider bgcolor="#f6f6f8">商品详情</tui-divider>
			<image @load='imgH' :style="'width:100% !important;height:' + imgHei" :src="item.url" mode="aspectFit" v-for="(item,index) in goods.imgList" :key="index"  @tap="showImg(index)"></image>
		</view>
		<view class="operation">
			<view class="operation-left">
				<view class="operation-item" @tap="toBusiness">
					<tui-icon name="shop" :size="26" color="#fff"></tui-icon>
					<text>店铺</text>
				</view>
				<view class="operation-item" @tap="showModal">
					<tui-icon name="wechat" :size="26" color="#fff"></tui-icon>
					<text>聊天</text>
				</view>
				<view class="operation-item" @tap="saveImg">
					<tui-icon name="bottom" :size="26" color="#fff"></tui-icon>
					<text>下载</text>
				</view>
			</view>
			<view class="operation-right">
				<view class="operation-btn">
					一键换脸
				</view>
			</view>
		</view>
		<my-service :show="show"  :service="service" @hideModal="hideModal"></my-service>
		
	</view>
</template>

<script>
	import tuiIcon from "@/components/Thor-ui/icon/icon"
	import tuiButton from "@/components/Thor-ui/button/button"
	import tuiDivider from "@/components/Thor-ui/divider/divider"
	import myService from "@/components/my-components/my-service.vue"
	import {
		searchGoodsName,
		searchService
	
	} from '@/http/http.js'
	let that;
	export default {
		components: {
			tuiIcon,
			myService,
			tuiButton,
			tuiDivider
		},
		data() {
			return {
				swiperList: ['../../../../static/img/banner01.jpg', '../../../../static/img/banner01.jpg',
					'../../../../static/img/banner01.jpg'
				],
				imgList: ['https://yjkj-0508.oss-cn-shenzhen.aliyuncs.com/FAC:520ee39adbc7445b8da1d9bc4255de0c.jpg',
					'https://yjkj-0508.oss-cn-shenzhen.aliyuncs.com/FAC:30c31196298a4547a1bfe0ef5f175d27.jpg'
				],
				qrUrl: ['https://yjkj-0508.oss-cn-shenzhen.aliyuncs.com/FAC:30c31196298a4547a1bfe0ef5f175d27.jpg'],
				show: false,
				imgHei: '',
				goods: {},
				goodsId: '',
				coid: '',
				service: ''
			}
		},
		onLoad(options) {
			that = this;
			console.log(options.goodsId)
			that.goodsId = options.goodsId
			that.coid = options.coid
			that.getGoods()
			that.getService()
		},
		methods: {
			getGoods: function() {
				searchGoodsName({
					id: that.goodsId,
					getAll: 1,
					getDetail: 1,
					orderDescCol: "optm"
				}).then(res=>{
					console.log(res)
					if(res.ret == 0) {
						if(res.info.list.length) {
							that.goods = res.info.list[0]
							console.log(that.goods)
						}
					}
				})
			},
			getService: function() { //查询客服
				searchService({
					type: 8,
					coid: that.coid
				}).then(res=>{
						console.log(res)
					if(res.ret == 0 ) {
						if(res.info.list.length) {
							var obj = {
								qr: res.info.list[0].url,
								name : res.info.list[0].param1
							}
							uni.setStorageSync('service',obj)
							that.service = obj
							console.log(that.service)
						} else {
							uni.setStorageSync('service', '')
						}
					}
				})
			},
			showImg: function(index) {
				var arr = []
				that.goods.imgList.forEach((el, i) => {
					arr.push(el.url)
				})
				uni.previewImage({
					urls: arr,
					current: index
				});
			},

			saveImg: function() {
				console.log(123)


				var num = 0
				that.imgList.forEach((item, index) => {
					uni.getImageInfo({
						src: item,
						success: function(res) {
							console.log(res)
							uni.saveImageToPhotosAlbum({
								filePath: res.path,
								success: function() {
									console.log('save success');
									num++
									if (num == that.imgList.length) {
										uni.showToast({
											title: '保存相册成功',
											duration: 2000
										});
									}
								},
								fail: (err) => {
									console.log(err)
								}
							});
						},
						fail(err) {
							console.log(err)
						}
					})
				})
			},
			toBusiness: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			hideModal: function() { //隐藏弹出框
				that.show = false
			},
			showModal: function() { //显示弹出框
				if(!that.service) {
					uni.showToast({
						title: '暂无客服',
						icon: 'none',
						mask: true
					})
					return false;
				}
				that.show = true
			},
			imgH: function(e) {
				var winWid = uni.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
				var imgh = e.detail.height; //图片高度
				var imgw = e.detail.width;
				
			
				that.imgHei = winWid * imgh / imgw + "px";
			
			},
			

		},

	}
</script>

<style>
	@import url("./goods-info.css");
</style>
