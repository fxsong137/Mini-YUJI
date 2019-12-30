<template>
	<view class="my-shape">

		<view style="width:100%;" v-if="!load">
			<view v-if="!shape">
				<view class='tt'>
					<view class="t-name">替身名称</view>
					<view class='default'>默认</view>
					<image class='delete' @tap="delShape" src='http://cdn.jnhangqi.cn/delecticon.png'></image>

				</view>
				<view class="model">
					<view class="tt-box">
						<view class="box-left">
							<image src="http://cdn.jnhangqi.cn/txDefault.jpg" />
						</view>
						<view class="box-right">
							<view class="tt-info">
								<view class='info'>身高:
									<text class='size'>{{height}}</text>
								</view>
								<view class='info'>体重:
									<text class='size'>{{weight}}</text>
								</view>
								<view class='info'>三围:
									<text class='size'>{{w1}}</text>
									<text class='size'>{{w2}}</text>
									<text class='size'>{{w3}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class='update' @tap='updateBtn'>
						修改体型
					</view>
				</view>
			</view>
			<view class="shapeAdd" v-if="shape" @tap="addShapeParam">
				新增体型
			</view>
		</view>
		<!-- 添加加载进度条 -->
		<view class="progress" v-if="load">
			<progress :percent="percent" stroke-width="2" backgroundColor='transparent'></progress>
		</view>
	</view>
</template>

<script>
	import {
		getShapeParams,
		delShapeParams
	} from '@/http/http.js'
	let that;
	export default {
		data() {
			return {
				height: 100,
				weight: 50,
				w1: 150,
				w2: 150,
				w3: 150,
				id: null, //体型 id
				uid: uni.getStorageSync("userInfos").uinfo.id, //登录返回的用户id
				shape: true,
				load: true,
				percent: 0,
				pageData: {
					timer: null
				},
			}
		},
		onLoad: function() {
			that = this
			that.loading()
			that.getShape()
		},
		methods: {
			getShape() {
				getShapeParams({
					// "id": "",
					"uid": that.uid,
					"type": 99,
					"which_page": 1,
					"pageSize": 1,
				}).then((res) => {
					clearInterval(that.pageData.timer);
					that.percent = 100
					that.load = false
					console.log(res)
					if (res.info.list.length > 0) {
						that.shape = false
						that.id = res.info.list[0].id
						that.height = JSON.parse(res.info.list[0].strval).heightList[0].value
						that.weight = JSON.parse(res.info.list[0].strval).weightList[0].value
						that.w1 = JSON.parse(res.info.list[0].strval).weightList[1].value
						that.w2 = JSON.parse(res.info.list[0].strval).weightList[2].value
						that.w3 = JSON.parse(res.info.list[0].strval).weightList[3].value

					} else {
						// 数据不存在 
						that.shape = true
					}
				})
			},
			//删除体型
			delShape() {
				uni.showModal({
					title: '提示',
					content: '确定删除这个替身吗？',
					success: function(res) {
						if (res.confirm) {
							delShapeParams({
								"id": that.id
							}).then((res) => {

								if (res.ret == 0) {
									uni.showToast({
										title: '删除成功',
										icon: 'success',
										duration: 3000
									});
									setTimeout(function() {
										uni.redirectTo({
											url: '/pages/user/myShape/myShape',
										})
									}, 1000);
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			loading() {
				that.percent = 0
				that.load = true
				//----定时器实现进度条加载----
				that.pageData.timer = setInterval(function() {
					if (that.percent < 90) {
						that.percent = that.percent + 10
					}
				}, 100);
			},
			addShapeParam() {
				wx.redirectTo({
					url: '/pages/user/updataShape/updataShape?state=add'
				})
			},
			updateBtn() {
				wx.redirectTo({
					url: `/pages/user/updataShape/updataShape?state=update&id=${that.id}`
				})
			}
		}
	}
</script>

<style>
	@import url("./myShape.css");
</style>
