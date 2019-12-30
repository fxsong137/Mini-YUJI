export const getWindowInfo = () => { //获取系统信息
	return new Promise((resolve, reject) => {

		uni.getSystemInfo({
			success(res) {
				resolve(res)
			}
		})
	})
}

export const getPersonCode = (data) => { //获取扫码进来时的参数
	if (data) {
		let arr;
		let obj = {};
		let appScene = decodeURIComponent(data);
		if (appScene.indexOf("&") != -1) {
			arr = appScene.split("&");
		} else {
			arr = appScene.split(" ");
		}
		for (let i of arr) {
			obj[i.split(":")[0]] = i.split(":")[1];
		}
		return obj
	}
}


export const compare = (property) => { //排序方法
	return function(a, b) {
		var value1 = a[property];
		var value2 = b[property];
		return value1 - value2;
	}
}


/***
 * 按照显示图片的宽等比例缩放得到显示图片的高
 * @params originalWidth  原始图片的宽
 * @params originalHeight 原始图片的高
 * @params imageWidth     显示图片的宽，如果不传就使用屏幕的宽
 * 返回图片的宽高对象
 ***/
export const imageZoomHeightUtil = (originalWidth, originalHeight, imageWidth) => {
	let imageSize = {};
	if (imageWidth) {
		imageSize.imageWidth = imageWidth;
		imageSize.imageHeight = (imageWidth * originalHeight) / originalWidth;
	} else { //如果没有传imageWidth,使用屏幕的宽
		uni.getSystemInfo({
			success: function(res) {
				imageWidth = res.windowWidth;
				imageSize.imageWidth = imageWidth;
				imageSize.imageHeight = (imageWidth * originalHeight) / originalWidth;
			}
		});
	}
	return imageSize;
}

/***
 * 按照显示图片的高等比例缩放得到显示图片的宽
 * @params originalWidth  原始图片的宽
 * @params originalHeight 原始图片的高
 * @params imageHeight    显示图片的高，如果不传就使用屏幕的高
 * 返回图片的宽高对象
 ***/
export const imageZoomWidthUtil = (originalWidth, originalHeight, imageHeight) => {
	let imageSize = {};
	if (imageHeight) {
		imageSize.imageWidth = (imageHeight * originalWidth) / originalHeight;
		imageSize.imageHeight = imageHeight;
	} else { //如果没有传imageHeight,使用屏幕的高
		uni.getSystemInfo({
			success: function(res) {
				imageHeight = res.windowHeight;
				imageSize.imageWidth = (imageHeight * originalWidth) / originalHeight;
				imageSize.imageHeight = imageHeight;
			}
		});
	}
	return imageSize;
}



/**
 * 手机号验证
 */
export const checkPhone = (phone) => {
	//验证手机号是否为空
	if (phone == "" || phone == null) {
		uni.showToast({
			title: '请输入手机号',
			icon: 'none',
			duration: 2000
		})
		return false;
	}
	//格式校验
	var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(19[0-9]{1})|(17[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
	if (!phone.match(myreg)) {
		uni.showToast({
			title: '手机格式不正确',
			icon: 'none',
			duration: 2000
		})
		return false;
	}
	return true;
}

export const checkMail = (mail) => {
	var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
	//验证是否为空
	if (mail == "" || mail == null) {
		uni.showToast({
			title: '请输入邮箱',
			icon: 'none',
			duration: 2000
		})
		return false;
	}
	//格式验证
	if (!reg.test(mail)) {
		uni.showToast({
			title: '邮箱格式不正确',
			icon: 'none',
			duration: 2000
		})
		return false;
	}
	return true;
}


 export const  random = (n) => {
	var charts = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var res = '';
    for (var i = 0; i < n; i++) {
      var id = Math.ceil(Math.random() * 9);
      res += charts[id];
    }
    return res;
  }

export const compareUp = (data,propertyName) => { // 升序排序
    if ((typeof data[0][propertyName]) != "number") { // 属性值为非数字
		return function(object1, object2) {
			var value1 = object1[propertyName];
			var value2 = object2[propertyName];
			return value1.localeCompare(value2);
		}
	}
	else {
		return function(object1, object2) { // 属性值为数字
			var value1 = object1[propertyName];
			var value2 = object2[propertyName];
			return value1 - value2;
		}
	}
}
export const compareDown = (data,propertyName) => { // 降序排序
    if ((typeof data[0][propertyName]) != "number") { // 属性值为非数字
		return function(object1, object2) {
			var value1 = object1[propertyName];
			var value2 = object2[propertyName];
			return value2.localeCompare(value1);
		}
	}
	else {
		return function(object1, object2) { // 属性值为数字
			var value1 = object1[propertyName];
			var value2 = object2[propertyName];
			return value2 - value1;
		}
	}
}


export const dateFormat = (thisDate) => {
	var date = new Date(thisDate)
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	var D = date.getDate() + ' ';
	return Y+M+D;
}