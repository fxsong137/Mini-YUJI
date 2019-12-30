<template>
	<view>
		<view class='conbox' v-if="!load">
			<image :src='backgroundRole' mode='widthFix' style='width:100%;height:auto' />
			<!-- 显示合成图区域 -->
			<view class='area1'>
				<image :src='photoOver' mode='widthFix' style='width:100%;height:auto' />
			</view>
			<!-- 点击重新拍照区域 -->
			<view class='area2' @tap='againPhoto' />
			<!-- 点击确定区域 -->
			<view class='area3' @tap='finish' />
			<!-- 性别选择区域 -->
			<view class='sexArea' @tap='selectSex'>
				<image :src='[sex ==1?"http://cdn.jnhangqi.cn/radioNAN.png":"http://cdn.jnhangqi.cn/radioNV.png"]' mode='widthFix'
				 style='width:100%;height:auto' />
			</view>
			<!-- 角色列表显示区域 -->
			<scroll-view :scroll-x="true" class='tsList' :scroll-left="navScrollLeft" :scroll-with-animation="true">
				<block v-for="(item,index) in roleList" :key="index">
					<view :class=" [currentTab == index ?'item cur':'item']" :data-current="index" @tap="create" :data-rid="item.rid"
					 :data-param="item.param">
						<view class='img'>
							<image :src='item.imgUrl' mode='widthFix' style='width:100%;' />
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
		<!-- 添加加载进度条 -->
		<view class="progress" v-if="load">
			<progress :percent="percent" stroke-width="2" backgroundColor='transparent' />
		</view>
	</view>
</template>

<script>
	import {
		uploadPic
	} from '@/http/http.js'
	let that;
	export default {
		data() {
			return {
				sex: uni.getStorageSync('sexUsr') || '', //1男性  2女性
				activityId: null,
				backgroundRole: uni.getStorageSync('activityImg')[2].url || '',
				photoOver: null,
				roleList: uni.getStorageSync('roleLsitArray') || {},
				touxiang: uni.getStorageSync('userTX_new') || uni.getStorageSync('userTX') || "",
				param: null,
				load: false,
				percent: 0,
				imgHC: [],
				rid: ''
			}
		},
		onLoad(options) {
			console.log(options.path)
			that = this;
			that.activityId = options.activityId
			const path = uni.getStorageSync('pictureHC')
			if (!path) {
				that.loading();

				var param = that.roleList[0].param;
				var rid = that.roleList[0].rid;
				uploadPic(that.touxiang, {
					"typeId": param,
					"isCalc": "1",
					"useMask": "1",
					"sex": that.sex
				}).then((res) => {

					var img = {
						param: param,
						path: JSON.parse(res.data).info,
						rid: rid
					}
					that.photoOver = JSON.parse(res.data).info
					that.imgHC.push(img)
					that.rid = rid

					clearInterval(that.timer);
					that.percent = 90
					that.load = false
				})
			} else {

				var img = {
					param: options.param,
					path: path,
					rid: options.rid
				}
				that.photoOver = path
				that.imgHC.push(img)
				that.rid = options.rid
			}
		},
		watch: {
			sex(a) {
				uni.setStorageSync('sexUsr', a)
			}
		},
		methods: {
			loading() {
				that.percent = 0,
					that.load = true
				//----定时器实现进度条加载----
				that.timer = setInterval(function() {
					if (that.percent < 90) {
						that.percent = that.percent + 1
					}
				}, 600);
			},
			againPhoto() {
				that.$Router.push({ name: 'photo_page', params: { activityId: that.activityId }})
			},
			//选择性别
			selectSex() {
				that.sex = that.sex == 2 ? "1" : "2"
			},
			create(e) {
				// that.loading();
				var rid = e.currentTarget.dataset.rid;
				var param = e.currentTarget.dataset.param;
				var find = that.imgHC.find((item) => {
					return item.param == param
				});
				if (find) {
					that.photoOver = find.path
					that.rid = rid
				} else {

					//显示合成照片
					uploadPic(that.touxiang, {
						"typeId": param,
						"isCalc": "1",
						"useMask": "1",
						"sex": that.sex
					}).then((res) => {

						var img = {
							param: param,
							path: JSON.parse(res.data).info,
							rid: rid
						}

						that.photoOver = JSON.parse(res.data).info
						that.imgHC.push(img)
						that.rid = rid

					})

				}
			},
			finish() {
				
				uploadPic(that.touxiang, {
					"typeId": that.rid,
					"isCalc": "1",
					"useMask": "1",
					"sex": that.sex
				}).then((res) => {
					wx.navigateTo({
						url: `/pages/plane/photoOver/photoOver?activityId=${that.activityId}&serverImgUrl=${JSON.parse(res.data).info}`
					})
				})
			}
		},
	}
</script>

<style>
	@import url("./roleList.css");
</style>
