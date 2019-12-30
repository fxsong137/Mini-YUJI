<template>
	<view>
		<view class='content'>
			<view class='questionBox'>
				<view class='ww'>
					<view class='title'>反馈问题类型</view>
					<view class='items'>

						<view v-for="(item,index) in types" :key="index" :class="'item ' + [indexId==index?'cur':'']" :data-menuindex='index'
						 @tap='select'>{{item}}</view>

					</view>
					<view class='txt'>
						<textarea v-model="content" placeholder='选择问题类型,帮助我们更好处理您的问题' placeholder-class='tt' class='mulTxt' :minlength="min"
						 :maxlength="max"> </textarea>
						<!--显示字数部分 -->
						<view class='count'>
							<text style='font-size:26rpx'> {{content.length}}</text>/{{max}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 收入手机号 -->
		<view class='phone clearfix'>
			<view class='phoneTip lf'>
				手机号:
			</view>
			<view class='phoneTxt lf'>
				<input type='number' class='phoneV' v-model="phone" maxlength="11" placeholder='请输入手机号' />
			</view>

		</view>
		<button class='submit' @tap='submit'>提交</button>
	</view>
</template>

<script>
	import {
		upHelpMsg
	} from '@/http/http.js'
	let that;
	export default {
		data() {
			return {
				phone: null,
				indexId: 0,
				content: '',
				types: ['功能异常', '体验问题', '新功能建议', '其他'],
				min: 5, //最少字数
				max: 500, //最多字数 (根据自己需求改变) 
				files: []
			}
		},
		onLoad() {
			that = this
		},
		methods: {
			select(e) {
				let index = e.currentTarget.dataset.menuindex
				that.indexId = index
			},

			showMsg(msg) {
				uni.showModal({
					title: "提示",
					content: msg,
					showCancel: false,
					confirmColor: "#db3c40"
				});
			},
			submit() {
				console.log(that.types[that.indexId]);
				if (that.content == null || that.content == '' || that.content == undefined) {
					that.showMsg("请输入问题内容");
					return;
				} else if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.phone))) {
					that.showMsg("请输入正确的联系方式");
					return;
				}
				var timestamp = Date.parse(new Date());
				var date = new Date(timestamp);
				//获取年份  
				var Y = date.getFullYear();
				//获取月份  
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
				//获取当日日期 
				var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
				var t = (Y + '-' + M + '-' + D);
				upHelpMsg({
					"type": 2,
					"uname": '0',
					"tel": that.phone,
					"sex": 1,
					"topic": that.types[that.indexId],
					"mark": that.content,
					"demandTmStr": t
				}).then((result) => {

					if (result.ret == 0) {
						uni.showToast({
							title: '提交成功',
							icon: 'success',
							duration: 1500
						});
						setTimeout(function() {
							uni.switchTab({
								url: '/pages/user/user-index/user-index',
							})
						}, 1500);
					} else {
						that.showMsg('提交失败');
					}
				})

			}
		}
	}
</script>

<style>
	@import url("./feedback.css");
</style>
