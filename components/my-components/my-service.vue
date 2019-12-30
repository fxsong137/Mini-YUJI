<template>
	<tui-modal :show="show" @cancel="hideModal" :custom="true">
		<view class="qr-box">
			<button type="primary" open-type="share"></button>
			<view class="title">微信扫描二维码添加客服</view>
			<image :src="service.qr" class="qr" @tap="share"></image>
			<view class="text">微信号：{{service.name}}</view>
			<view class="copy-btn" @tap="copy">点击复制</view>
		</view>
	</tui-modal>
</template>

<script>
	import tuiModal from "@/components/Thor-ui/modal/modal"
	export default {
		components: {
			tuiModal
		},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			service: {
				type: [Object,String]
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			share: function() {
				uni.previewImage({
					urls: [this.service.qr],
				});
			},
			copy: function() {
				uni.setClipboardData({
					data: this.service.name,
					success: function() {
						console.log('success');
					}
				});
			},
			hideModal: function() {
				this.$emit('hideModal')
			}
		}
	} 
</script>

<style>

	.qr-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}
	.qr {
		width: 300upx;
		height:300upx;
		margin-bottom: 20upx;
	}
	
	.qr-box .title {
		font-size: 28upx;
	}
	.qr-box .text {
		font-size: 28upx;
		text-align: center;
	}
	
	.copy-btn {
		padding: 0upx 30upx;
		height: 40upx;
		line-height: 40upx;
		text-align: center;
		background: #000;
		color: #fff;
		border-radius: 100upx;
		font-size: 26upx;
		margin-top: 10upx;
	}
</style>
