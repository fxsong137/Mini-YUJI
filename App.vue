<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.hideTabBar({})
			uni.setStorageSync('isNextShow',true)
			uni.setStorageSync('sexUsr',1) //用户选择的性别 1男 2女
			uni.setStorageSync('zan', false)
			uni.setStorageSync('care', false)
			uni.setStorageSync('updateZan', false)
			uni.setStorageSync("updateCare", false)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "./static/font/iconfont.css";
	/*每个页面公共css */
	page {
		height: 100%;
		background: #f6f6f8;
	}
	view {
		box-sizing: border-box;
	}
	
	.tui-modal-box {
		width: 430upx !important;
		padding: 30upx !important;
	}
</style>
