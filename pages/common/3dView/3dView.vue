<template>
	<view>
		<web-view :webview-styles="webviewStyles" src="https://m.yujishishi.com/pages/3d/index.html"></web-view>
	</view>
	<!-- <view style="height: 100%; width: 100%;">
		<canvas type="webgl" id="c" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" @touchcancel="touchCancel"
		 @longtap="longTap" @tap="tap"  style="height: 100%; width: 100%;"></canvas>
	</view> -->

</template>

 <script>
	// import * as THREE from '@/utils/three.weapp.js'
	// import loadObj from './loadObj'
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}
			}
		},
		// onLoad() {
		// 	wx.createSelectorQuery()
		// 		.select('#c')
		// 		.node()
		// 		.exec((res) => {
		// 			const canvas = new THREE.global.registerCanvas(res[0].node)
		// 			loadObj(canvas, THREE)
		// 		})
		// },
		// onUnload() {
		// 	THREE.global.clearCanvas()
		// },
		// methods: {
		// 	touchStart: function(e) {
		// 		console.log('canvas', e)
		// 		THREE.global.touchEventHandlerFactory('canvas', 'touchstart')(e)
		// 	},
		// 	touchMove: function(e) {
		// 		console.log('canvas', e)
		// 		THREE.global.touchEventHandlerFactory('canvas', 'touchmove')(e)
		// 	},
		// 	touchEnd: function(e) {
		// 		console.log('canvas', e)
		// 		THREE.global.touchEventHandlerFactory('canvas', 'touchend')(e)
		// 	},
		// 	touchCancel: function(e) {
		// 		console.log('canvas', e)
		// 	},
		// 	longTap: function(e) {
		// 		console.log('canvas', e)
		// 	},
		// 	tap: function(e) {
		// 		console.log('canvas', e)
		// 	},
		// }

	}
</script>

<style>
</style>
