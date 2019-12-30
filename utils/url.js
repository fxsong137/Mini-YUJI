//服务器地址
const host = "https://m.yujishishi.com/fac";



//小程序用户登录  ok
const wxLogin = host + "/wx/wappLogin";

//用户个人信息更新 ok
const setWappUInfo = host + "/wx/setWappUInfo";
//上传用户照片并进行换脸计算，获取换脸后的图片  ok
const uploadPic = host + "/usr/upUsrCalcPic";
//查询指定图片信息 ok
const searchGcImg = host + "/goods/searchGcImg";
//查询分类或者活动 ok
const goodsCate = host + "/goods/searchGoodsClass";
//查询收藏 ok
const searchComment = host + "/goods/searchComment";
//对活动点赞 ok
const upvoteGoodsClass = host + "/goods/upvoteGoodsClass";
//收藏活动 ok
const addComment = host + "/goods/addComment";
// 取消收藏 ok
const delComment = host + "/goods/delComment";
//用户体型参数查询 ok
const getShapeParam = host + "/usr/searchUserData";
//用户体型参数删除 ok
const delShapeParam = host + "/usr/delUserData";
//用户体型参数新增/更新  ok
const editShapeParam = host + "/usr/nuUserData";
//功能反馈 ok
const upHelpMsg = host + "/usr/upHelpMsg";
//发送短信 ok
const sendMsg = host + "/msg/sendSms";
// 设置统计信息  ok
const getCount = host + "/goods/setSts";
//更新用户密码 ok
const setPass = host + "/usr/updatePass";
//注销用户 ok
const logout = host + "/usr/logout";
//更改用户头像 ok
const updateUsr = host + "/usr/updateUsr";

//获取生成的图片或者视频 ok
const searchCommImg = host + "/com/searchCommImg";
//删除生成的图片或者视频 ok
const batchDelCommImg = host + "/com/batchDelCommImg";

//查询商家
const searchCompany = host + "/com/searchCompany";

const searchGoodsName = host +  '/goods/searchGoodsName'  //查询商品图片
const searchService  =  host +  '/com/searchCommImg'  //查询客服信息
const upCommImg  =  host +  '/com/upCommImg'  //上传用户合成的照片
module.exports = {
	wxLogin: wxLogin,
	setWappUInfo: setWappUInfo,
	uploadPic: uploadPic,
	searchGcImg: searchGcImg,
	goodsCate: goodsCate,
	searchComment: searchComment,
	upvoteGoodsClass: upvoteGoodsClass,
	addComment: addComment,
	delComment: delComment,
	getShapeParam: getShapeParam,
	delShapeParam: delShapeParam,
	editShapeParam: editShapeParam,
	upHelpMsg: upHelpMsg,
	sendMsg: sendMsg,
	getCount: getCount,
	setPass: setPass,
	logout: logout,
	updateUsr: updateUsr,
	searchCommImg: searchCommImg,
	batchDelCommImg: batchDelCommImg,
	searchCompany: searchCompany,
	searchGoodsName: searchGoodsName,
	searchService: searchService,
	upCommImg: upCommImg,
}
