<template>
	<view class="user-info">
		<view class="user">
			<view class="user-icon">
				<avatar selWidth="560upx" :canRotate="false" :isShow="isShowCut" selHeight="560upx" @upload="upload" :avatarSrc="img"
				 avatarStyle="width: 140upx; height: 140upx; border-radius: 100%;">
				</avatar>
				<!-- <image :src="img" mode="aspectFit"></image> -->
			</view>
			<view class="update" @tap="showCut">更换头像
				<uni-icon type="arrowright" size="18" color="#333"></uni-icon>
			</view>
		</view>
		<view class="list-item">

			<tui-list-view>
				<tui-list-cell :arrow="true" class="tui-list">
					<view class="tui-list-cell-name">
						<input type="text" v-model="name" @focus="focus" @blur="changeName" />
					</view>
					<view class="tui-right">昵称</view>
				</tui-list-cell>

				<tui-list-cell @click="showSex" :arrow="true" class="tui-list">
					<view class="tui-list-cell-name">{{sexValue}}</view>
					<view class="tui-right">性别</view>

				</tui-list-cell>
				<tui-list-cell @click="showDate" :arrow="true" class="tui-list">
					<view class="tui-list-cell-name">{{date}}</view>
					<view class="tui-right">生日</view>
				</tui-list-cell>

			</tui-list-view>
		</view>
		<view class="list-item">
			<tui-list-view>
				<tui-list-cell @click="toMyShape" :arrow="true" class="tui-list">
					<text class="tui-list-cell-name">我的体型</text>
				</tui-list-cell>

			</tui-list-view>
			<tui-list-view>
				<tui-list-cell @click="to3D" :arrow="true" class="tui-list">
					<text class="tui-list-cell-name">3D模型</text>
				</tui-list-cell>

			</tui-list-view>
		</view>
		<view class="list-item">

			<tui-list-view>
				<!-- <tui-list-cell @click="detail" :arrow="true" class="tui-list">
					<text class="tui-list-cell-name">用户协议</text>
				</tui-list-cell> -->

				<tui-list-cell @click="toFeedBack" :arrow="true" class="tui-list">
					<view class="tui-list-cell-name">问题反馈</view>
				</tui-list-cell>
				<!-- <tui-list-cell @click="detail" :arrow="true" class="tui-list">
					<view class="tui-list-cell-name">关于羽迹试试</view>
				</tui-list-cell> -->

			</tui-list-view>
		</view>
		<w-picker mode="date" @confirm="changeDate" ref="date" startYear="1970" endYear="2030" themeColor="#f00" current></w-picker>
		<w-picker mode="selector" @confirm="changeSex" ref="sex" themeColor="#f00" :defaultVal="defaultSex" :selectList="sexArr"></w-picker>
	</view>
</template>

<script>
	import tuiListView from "@/components/Thor-ui/list-view/list-view"
	import tuiListCell from "@/components/Thor-ui/list-cell/list-cell"
	import uniIcon from "@/components/uni-ui/uni-icon/uni-icon.vue"
	import wPicker from "@/components/w-picker/w-picker.vue";
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	import {
		getOpenid,
		setWappUInfo,
		updateUsr
	} from '@/http/http.js'
	let that;
	export default {
		components: {
			tuiListView,
			tuiListCell,
			uniIcon,
			wPicker,
			avatar
		},
		data() {
			return {
				isShowCut: false,
				userInfos: {},
				name: '',
				date: '1980-01-01',
				sexArr: [{
						label: '女',
						value: '0'
					},
					{
						label: '男',
						value: '1'
					}
				],
				defaultSex: [0],
				sexValue: '女',
				sex: '0',
				img: ''
			}
		},
		onShow() {
			that.isShowCut = false
		},
		onLoad() {
			that = this
			var userInfos = uni.getStorageSync("userInfos").uinfo

			if (!userInfos) {
				getOpenid().then((res) => {
					console.log(res)
					that.userInfos = res.uinfo
					that.init(that.userInfos)
				})
			} else {
				that.userInfos = userInfos
				that.init(that.userInfos)
			}

		},
		methods: {
			init: function(userInfos) {

				that.name = userInfos.name
				that.img = userInfos.imgurl
				that.sex = userInfos.sex
				that.sexValue = that.sex == 1 ? '男' : '女'
				that.defaultSex = that.sex == 1 ? [1] : [0]
				that.date = userInfos.birthday
			},
			changeDate: function(e) {
				console.log(e.result)
				if (that.date == e.result) return;
				console.log('进来了')
				that.date = e.result
				that.setInfo({
					birthday: that.date
				})

			},
			showDate: function() {
				that.$refs.date.show();
			},
			focus: function() {
				that.oldName = that.name
			},
			changeName: function() { //修改昵称
				if (that.name == that.oldName) {
					console.log('没改')
				} else {
					uni.showModal({
						title: '提示',
						content: `昵称确定修改成 ${that.name} 吗？`,
						success(res) {
							if (res.confirm) {
								that.setInfo({
									nickName: that.name
								})
							} else if (res.cancel) {
								that.name = that.oldName
							}
						}
					})
				}
			},
			setInfo: function(data) {
				setWappUInfo(data).then((res) => {
					if (res.ret == 0) {
						getOpenid().then(() => {
							uni.$emit('changeUser')
						})
					} else {
						console.log('修改失败')
					}
				})
			},
			uploadIcon: function(url) { //修改用户头像
				console.log(url)
				updateUsr(url).then((res) => {
					if (JSON.parse(res.data).ret == 0) {
						getOpenid().then(() => {
							uni.$emit('changeUser')
						})
					} else {
						console.log('修改失败')
					}
				})
			},
			showSex: function() {
				that.$refs.sex.show();
			},
			changeSex: function(e) { // 修改性别
				console.log(e.checkArr)
				if (that.sex == e.checkArr.value) return;
				that.sex = e.checkArr.value
				that.sexValue = e.checkArr.label
				that.setInfo({
					sex: that.sex
				})
			},
			upload: function(res) {
				that.oldImg = that.img
				that.img = res.path
				that.isShowCut = false
				that.uploadIcon(that.img)
			},
			showCut: function() {
				that.isShowCut = true
			},
			to3D: function() {
				wx.navigateTo({
					url: '/pages/common/3dView/3dView'
				})
			},
			toFeedBack: function() {
				wx.navigateTo({
					url: '/pages/user/feedback/feedback'
				})
			},
			toMyShape: function() {
				wx.navigateTo({
					url: '/pages/user/myShape/myShape'
				})
			}
		}
	}
</script>

<style>
	@import url("./user-info.css");
</style>
