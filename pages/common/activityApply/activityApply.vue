<template>
	<view style='width:100%;position: relative'>
		<image src='../../../static/img/banner.jpg' mode='widthFix' style='width:100%;height:auto' />
		<view class='info1'>
			<view class='question'>我们如何称呼您?</view>
			<view class='item1' style=' display: flex;align-items: center;'>
				<view class='name'>
					<input placeholder='例如:张某某' class='txt' placeholder-style='color:#fec7c0' v-model="userName" />
				</view>
				<view class='sex'>
					<radio-group class="radio-group" @change="radioChange">
						<label class="radio" v-for="(item,index) in items" :key="index">
							<radio :value="item.name" :checked="item.checked" />
							{{item.name}}
						</label>
					</radio-group>
				</view>
			</view>
		</view>
		<view class='info2'>
			<view class='question'>您公司的名字?</view>
			<view class='item1'>
				<input placeholder='例如:xxx市xxx有限公司' class='txt1' placeholder-style='color:#fec7c0' v-model="companyName" />
			</view>
		</view>
		<view class='info3'>
			<view class='question'>活动的主要内容?</view>
			<view class='item1'>
				<input placeholder='例如:xxx品牌在线试穿活动' class='txt1' placeholder-style='color:#fec7c0' v-model="activity" />
			</view>
		</view>
		<view class='info4'>
			<view class='question'>计划发布的时间?</view>
			<view class='item1'>
				<input placeholder='例如:2019年8月' class='txt1' placeholder-style='color:#fec7c0' v-model="time" />
			</view>
		</view>
		<!-- 收入手机号 -->
		<view class='phone '>
			<view class='phoneTip '>
				手机号:
			</view>
			<view class='phoneTxt '>
				<input type='text' class='phoneV' placeholder='请输入手机号' placeholder-style='color:#CDC9C9;font-size:26rpx' v-model="phone" />
			</view>
		</view>
		<!-- 验证码 -->
		<view class='phone phone1' style='margin-top:4rpx'>
			<view class='phoneTip '>
				验证码:
			</view>
			<view class='phoneTxt1 '>
				<input type='text' class='phoneV' placeholder='请输入6位验证码' placeholder-style='color:#CDC9C9;font-size:26rpx' v-model="yzm" />
			</view>
			<button class='yzm' @tap='getCode' :disabled='isDis'>{{timerInfo}}</button>
		</view>
		<view class='submit' @tap='submit'>提交</view>

	</view>
</template>

<script>
	import {
		sendMsg,
		upHelpMsg
	} from '@/http/http.js'
	import {
		checkPhone,
		random
	} from '@/utils/util.js'
	let that;
	export default {
		data() {
			return {
				isDis: false,
				items: [{
						value: '0',
						name: '男士',
						checked: 'true'
					},
					{
						value: '1',
						name: '女士'
					}
				],
				count: 59,
				timerInfo: '获取验证码',
				timer: '',
				userName: '',
				yzm: '', //验证码
				time: '', //活动时间
				phone: '', //电话
				companyName: '', //公司名称
				activity: '', //活动内容,
				sex: "0",
				
			}
		},
		onLoad() {
			that = this;
		},
		methods: {
			getCode: function() {
				if (!checkPhone(that.phone)) {
					return false
				}
				that.isDis = true
				that.timer = setInterval(function() {
					if (that.timerInfo == '1s') {
						clearInterval(that.timer);
						that.isDis = false
						that.timerInfo = '重新获取'
						that.count = 59
					} else {
						that.timerInfo = (that.count--) + 's'
						
					}
				}, 1000);
				that.code = random(6)
				sendMsg({
					"mobile": that.phone, 
					"msgInfo": that.code, 
					"templateId": "SMS_170415493"
				}).then((res) => {
					console.log(res)
					if (res.ret == 0 ) {
						uni.showToast({
						    title: '验证码已发送',
						    duration: 2000
						});
					}
				})

			},
			submit: function() {
				if (that.userName == "") {
					that.showMsg("请输入您的姓名");
					return;
				} else if (that.companyName == "") {
					that.showMsg("请输入您的公司名称");
					return;
				} else if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.phone))) {
					that.showMsg("请输入正确的联系方式");
					return;
				} else if (that.activity == "") {
					that.showMsg("请输入活动主题");
					return;
				} else if (that.yzm == "") {
					that.showMsg("请输入您的验证码");
					return;
				}
				if (that.yzm != that.code) {
					that.showMsg("请输入正确的验证码");
					return;
				}
				that.code = random(6)
				upHelpMsg({
					sex: that.sex,
					uname: that.userName,
					topic: that.activity,
					coName: that.companyName,
					demandTmStr: that.time,
					tel: that.phone,
					type: '1'
				}).then((result)=>{
						console.log(result)
						if (result.ret == 0) {
							uni.showModal({
								title: "提示",
								content: '提交成功',
								showCancel: false,
								confirmColor: "#db3c40",
								success:function(res) {
									if(res.confirm) {
										uni.navigateBack({
										    delta: 1
										});
										
									}
								}
							});
						} else {
							that.showMsg('提交失败');
						}
						
					})
					
			},
			showMsg: function(msg) {
				uni.showModal({
					title: "提示",
					content: msg,
					showCancel: false,
					confirmColor: "#db3c40"
				});
			}
		}
	}
</script>

<style>
	@import url("./activityApply.css");
</style>
