<template>
	<view>
		<view class='title'>修改<text style='color:#d02573;font-size:34rpx;font-weight:bold'>{{name}}</text>高度信息</view>
		<view class='box'>
			<view class='info'>
				<block v-for="(item,index) in heightList" :key="index">
					<view class='items'>
						<view class='lf item1'>{{item.name}}</view>
						<view class='lf item2'>
							<!-- <button class='arr lf' :data-index='index' @tap='minus'> -->
							<image class="img" :data-index='index' @tap='minus' src='http://cdn.jnhangqi.cn/lessicon.png'></image>
							<!-- </button> -->
							<view class='center lf'>
								<input type='number' v-model="item.value" class='ttx' :data-index='index' />
							</view>
							<!-- <button class='arr lf' :data-index='index' @tap='plus'> -->
							<image class="img" :data-index='index' @tap='plus' src='http://cdn.jnhangqi.cn/moreicon.png'></image>
							<!-- </button> -->
						</view>
					</view>
				</block>
			</view>
		</view>
		<view class='title'>修改 <text style='color:#d02573;font-size:34rpx;;font-weight:bold'>{{name}}</text> 围度信息</view>
		<view class='box'>
			<view class='info'>
				<block v-for="(item,index) in weightList" :key="index">
					<view class='items'>
						<view class='lf item1'>{{item.name}}</view>
						<view class='lf item2'>

							<image class="img" :data-index='index' @tap='minus1' src='http://cdn.jnhangqi.cn/lessicon.png'></image>

							<view class='center lf'>
								<input type='number' class='ttx' v-model="item.value" :data-index='index' />
							</view>

							<image class="img" :data-index='index' @tap='plus1' src='http://cdn.jnhangqi.cn/moreicon.png'></image>

						</view>
					</view>
				</block>
			</view>
		</view>
		<button class='submit' @tap='submit'>{{state =='update'?'修改体型':'新增体型'}}</button>
	</view>
</template>

<script>
	import {
		updateShapeParams,
		getShapeParams
	} from '@/http/http.js'
	let that;
	export default {
		data() {
			return {
				id: null,
				uid: null,
				state: null,
				name: "1号替身",
				heightList: [{
						'name': '身高',
						'value': 0
					},
					{
						'name': '肩宽',
						'value': 0
					},
					{
						'name': '上臂长',
						'value': 0
					},
					{
						'name': '前臂长',
						'value': 0
					},
					{
						'name': '胸高',
						'value': 0
					},
					{
						'name': '腰高',
						'value': 0
					},
					{
						'name': '臀膏',
						'value': 0
					},
					{
						'name': '上腿长',
						'value': 0
					},
					{
						'name': '小腿长',
						'value': 0
					}
				],
				weightList: [{
						'name': '体重',
						value: 0
					},
					{
						'name': '胸围',
						value: 0
					},
					{
						'name': '腰围',
						value: 0
					},
					{
						'name': '臀围',
						value: 0
					},
					{
						'name': '臂围',
						value: 0
					},
					{
						'name': '腿围',
						value: 0
					},
					{
						'name': '颈围',
						value: 0
					}
				],
			}
		},
		onLoad: function(options) {
			that = this
			that.state = options.state
			that.uid = uni.getStorageSync("userInfos").uinfo.id
			if (options.state == 'update') {
				that.id = options.id
				that.getShape()
			}
		},
		methods: {
			getShape() {
				getShapeParams({
					"id": that.id,
					"uid": wx.getStorageSync("userInfos").uinfo.id,
					"type": 99,
					"which_page": 1,
					"pageSize": 1,
				}).then((res) => {

					console.log(res);
					if (res.info.list.length > 0) {
						var heightList = JSON.parse(res.info.list[0].strval).heightList
						heightList.forEach((item, index) => {
							item.value = Number(item.value)
						});

						var weightList = JSON.parse(res.info.list[0].strval).weightList
						weightList.forEach((item, index) => {
							item.value = Number(item.value)
						});

						that.heightList = heightList
						that.weightList = weightList
					}
				})
			},
			//新增体型以及修改体型
			submit() {
				var list = {
					"heightList": that.heightList,
					"weightList": that.weightList
				};
				var listStr = JSON.stringify(list);
				var data = {
					"uid": that.uid,
					"type": 99,
					"flag": 0,
					"intval": '',
					"longval": '',
					"strval": listStr,
					"param1": '',
				}
				if (that.state == 'update') {
					data.id = that.id
				}
				console.log(data)
				updateShapeParams(data).then((res) => {

					if (res.ret == 0) {
						uni.showToast({
							title: that.state == 'update' ? '保存成功' : '新增成功',
							icon: 'success',
							duration: 3000
						});
						setTimeout(function() {
							uni.redirectTo({
								url: '/pages/user/myShape/myShape',
							})
						}, 2000);
					}
				})
			},
			minus(e) {
				const index = e.currentTarget.dataset.index;
				let count = that.heightList[index].value;
				if (count > 0) {
					count = count - 1;
				} else {
					count = count;
				}
				that.heightList[index].value = count;
			},
			minus1(e) {
				const index = e.currentTarget.dataset.index;
				let count = that.weightList[index].value;
				if (count > 0) {
					count = count - 1;
				} else {
					count = count;
				}
				that.weightList[index].value = count;
			},
			plus(e) {
				const index = e.currentTarget.dataset.index;
				let count = that.heightList[index].value;
				count = Number(count)  + 1;
				that.heightList[index].value = count;

			},
			plus1(e) {
				const index = e.currentTarget.dataset.index;
				let count = that.weightList[index].value;
				count = Number(count) + 1;
				that.weightList[index].value = count;
			},
		},
	}
</script>

<style>
	@import url("./updataShape.css");
</style>
