<template>
	<view style="width:100%">
		
		<view v-for="(activity,index) in activityList" :key="index" style='width:100%;'>
			<!-- 忆梦想 主题活动 -->
			<view class='areaBox' :style='"height:" + Hei'>
				<image :src='activity.url' mode='scaleToFill' :style='"width:100%;height:" + Hei' @load='imgH' @tap='gto(activity)' :data-counts='activity.counts'
				 :data-activityId='activity.id' :data-urlBg='activity.urlBg[0]?activity.urlBg[0]:""' :data-name='activity.name' />
				<view class='title'>
					{{activity.name}}
					<view class='logoUrl'>
						<image :src='[activity.logoUrl?activity.logoUrl:""]' mode='widthFix' style='width:100%;height:auto;display:block' />
					</view>
					<view class='tabUrl'>
						<image v-if="activity.subType == 2" src='https://m.yujishishi.com/pages/img/video.png' mode='widthFix' style='width:100%;height:auto;display:block' />
						<image v-else src='https://m.yujishishi.com/pages/img/plane.png' mode='widthFix' style='width:100%;height:auto;display:block' />
					</view>
				</view>
				<!-- 分享 点赞 收藏  -->
				<view class="bottom-box">
		
					<view class='btnBoxs'>
						<button class='btnShare button' :data-activityId='activity.id' :data-name='activity.name' open-type='share'>
							<image class="image" src='../../static/img/shares.png' />
						</button>
						<view class='btnShare zan'>
							<!--<canvas canvas-id="canvas-{{activity.id}}" style="position:absolute;transform: translateX(-50%);bottom: 0;left: 20%;width: 200rpx;height: 200rpx;" /> -->
							<image @tap='zanClick(activity)'  class="image" :src='"../../static/img/zan"+ [activity.zan ? "A": ""] + ".png"' />
							<text class="text">{{activity.upCnt}}</text>
						</view>
						<!-- 收藏 -->
						<view class='btnShare' @tap='care(activity)'>
							<image class="image" :src='"../../static/img/shoucang"+[activity.care ? "A": ""] + ".png"' />
						</view>
		
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'care',
		props: {
			activityList: Array
		},
		data() {
			return {
				Hei: ''
			}
		},
		methods: {
			imgH(e) {
				var winWid = uni.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
				var imgh = e.detail.height; //图片高度
				var imgw = e.detail.width;
				var swiperH = winWid * imgh / imgw + "px";
				this.Hei = swiperH //设置高度
			},
			care(e) {
				this.$emit('care',e)
			},
			zanClick(e) {
				this.$emit('zanClick',e)
			},
			gto(e) {
				console.log(e)
				this.$emit('gto',e)
			}
		}
	}
</script>

<style>
	/* 收藏 */
	.areaBox {
	  border: 1px solid #cfcfcf;
	  margin-bottom: 10upx;
	  border-radius: 10upx;
	  position: relative;
	  background-color: #fff;
	  overflow: hidden;
	width: 100%;
	  
	}
	
	
	.titleA {
	  font-size: 24upx;
	  text-align: center;
	  height: 50upx;
	  line-height: 50upx;
	  font-weight: 600;
	}
	.title {
	  width: 100%;
	
	  position: absolute;
	  top: 0;
	  left: 0;
	  height: 36upx;
	  line-height: 36upx;
	  text-align: center;
	  color: #fff;
	  background: rgba(0, 0, 0, .3);
	  font-size: 20upx;
	}
	
	.logoUrl {
	  position: absolute;
	  top: 10upx;
	  left: 10upx;
	  width: 48upx;
	  border-radius: 100upx;
	  overflow: hidden;
	}
	
	.tabUrl {
	  position: absolute;
	  top: 0;
	  right: 20upx;
	  width: 34upx;
	}
	
	.i1 {
	  width: 7%;
	}
	
	.t1 {
	  margin-left: 3%;
	  margin-top: 5upx;
	  font-size: 28upx;
	  width: 50%;
	}
	
	.t2 {
	  width: 40%;
	  margin-top: 0;
	  font-size: 28upx;
	  text-align: right;
	}
	
	.tB {
	  font-size: 28upx;
	  color: #898989;
	  margin-left: 10%;
	  padding: 20upx 0;
	}
	
	
	@keyframes fadeIn {
	  0% {
	    opacity: 0;
	  }
	
	  50% {
	    opacity: 0.5;
	  }
	
	  100% {
	    opacity: 1;
	  }
	}
	
	image {
	  animation: fadeIn 1s both;
	}
	
	/* 返回到顶部 */
	.gotoTop {
	  position: fixed;
	  right: 5%;
	  bottom: 50upx;
	  padding: 10upx;
	  font-size: 28upx;
	  color: #fff;
	  background-color: #000;
	  opacity: .5;
	}
	
	/* 进度条 */
	.progress {
	  width: 100%;
	  position: fixed;
	  top: 0;
	  left: 0;
	  z-index: 99999;
	}
	
	.bottom-box {
	  width: 100%;
	  position: absolute;
	  left: 0;
	  bottom: 0;
	  height: 60upx;
	  padding: 0 20upx;
	  box-sizing: border-box;
	  background: rgba(0,0,0,.3);
	}
	
	.btnBoxs {
	  display: flex;
	  justify-content: space-between;
	  box-sizing: border-box;
	  height: 60upx;
	  line-height: 60upx;
	  align-items: center;
	}
	
	.btnShare {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  color: #fff;
	  font-size: 28upx;
	  width: 120upx;
	}
	.zan {
	  justify-content: flex-start;
	  margin-left: 100upx;
	  position: relative;
	}
	.text {
	  margin-left: 10upx;
	  font-size: 24upx;
	}
	.btnShare .image {
	  width: 30upx;
	  height: 30upx;
	
	}
	
	.button {
	  padding: 0;
	  margin: 0;
	  background-color: transparent;
	  border: none;
	}
	
	button::after {
	  background-color: transparent;
	  border: none;
	  outline: none;
	}
	/* 收藏 */
</style>
