<template>
	<view>
		<view class='conbox'>
			<image :src='backgroundRole' mode='widthFix' style='width:100%;height:auto'></image>
			<!--点击拍照区域 -->
			<view class='photo' @click="gotoShow">
				<!-- <button type="primary"class='photo'>拍照</button> -->
				<image :src='src' class="show-image" mode="aspectFill" style="width:100%;height:100%" v-if='!imgShow'></image>
			</view>
			<!-- 选择性别 -->
			<view class='become1' @click='selectSex'>
				<image :src='[sex == 1?"http://cdn.jnhangqi.cn/radioNAN.png":"http://cdn.jnhangqi.cn/radioNV.png"]' mode='widthFix'
				 style='width:100%;height:auto'></image>
			</view>
			<!-- 下次显示 -->
			<checkbox class='nextShow' @click='isNextShow' :checked='isCheck'></checkbox>
			<button class='define' @click='submit'></button>
			<!-- 编辑照片 -->
			<!-- <view class='cut' @click='chooseIMG'>重新拍照</view> -->
		</view>
		<!-- 添加加载进度条 -->
		<!-- <view class="progress" v-if="load">
			<progress :percent="percent" stroke-width="2" backgroundColor='transparent'></progress>
		</view> -->
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
				cuttype: null,
				isCheck: uni.getStorageSync('isNextShow') || true,
				backgroundRole: uni.getStorageSync('activityImg')[1].url || "",
				activityId: null,
				isJZ: false,
				imgShow: false,
				index: 0,
				name: "",
				imgId: "",
				sex: uni.getStorageSync('sexUsr') || 1, //1男性  2女性
				serverImgUrl: "",
				src: uni.getStorageSync('userTX_new') || uni.getStorageSync('userTX') || "", //默认是点击拍照的图片 当用户上传图片后变成用户图片
			}
		},
		onLoad(option) {
			that = this;
			that.activityId = option.activityId
		},
		onShow() {
			if(uni.getStorageSync('userTX_new')) {
				that.src = uni.getStorageSync('userTX_new')
			}
		},
		methods: {
			submit() {
				if (that.src == '' || that.src == undefined || that.src == null) {
					uni.showToast({
						title: '请上传照片',
						icon: 'none',
						mask: true
					})
					return;
				}

				// that.loading();
				const roleLsitArray = uni.getStorageSync('roleLsitArray')
				let param = roleLsitArray[0].param;
				let rid = roleLsitArray[0].rid;
				let sex = uni.getStorageSync('sexUsr');

				// console.log('rid' + rid);
				// console.log('url' + url);
				// console.log('sex' + sex);
				//显示合成照片
				uploadPic(that.src, {
					"typeId": param,
					"isCalc": "1",
					"useMask": "1",
					"sex": sex 
				}).then((res) => {
					console.log(res)
					let pictureHC = JSON.parse(res.data).info;
					uni.setStorageSync('pictureHC',pictureHC)
					that.$Router.push({ name: 'roleList', params: { activityId: that.activityId,param: param, rid: rid }})
				}).catch((err)=>{
					console.log(err)
					uni.showToast({
					    title: '照片有误，请检查照片五官是否清晰可见',
						icon: 'none',
					    duration: 3000
					});
				})

			},
			isNextShow: function() {
				that.isCheck = !that.isCheck
			},
			//选择性别
			selectSex: function() {
				that.sex = this.sex == 2 ? "1" : "2"
				
			},
			gotoShow: function() {
				that.$Router.push({ name: 'cutFace'})
			},
		},
		watch: {
			sex(a) {
				uni.setStorageSync('sexUsr', that.sex)
			},
			isCheck(a) {
				uni.setStorageSync('isNextShow', a)
			}
		}
	}
</script>

<style>
	@import url("./photo_page.css");
</style>
