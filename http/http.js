//引入urlManger.js
import urlManager from '@/utils/url.js'
/**
 * 网络请求封装
 */

export const http = (url, method, param, isLoad, fn) => {

    let data = ''
    let header = {
        'content-type': 'application/json'
    }
    param.token = uni.getStorageSync('token')
    if (method == 'GET') {
        url += "?";
        Object.keys(param).forEach(function (key) {
            url += encodeURIComponent(key) + "=" + encodeURIComponent(param[key]) + "&";
        });
        url = url.substring(0, url.length - 1);
    } else {
        header = {
            'content-type': 'application/x-www-form-urlencoded'
        }
        data = param
    }
    return new Promise((resolve, reject) => {
        uni.request({
            url: url, //仅为示例，并非真实的接口地址
            data: data,
            header: header,
            success(res) {
                // console.log(res.data)
                if (res.data.ret == -6) {
                    uni.removeStorageSync('token')

                    getOpenid().then(() => {

                        fn(param).then((result) => {
                            resolve(result)
                        })
                    })


                } else {

                    resolve(res.data)
                }
            },
            fail() {
                uni.showToast({
                    title: '服务出现了点问题，请重试',
                    icon: 'none',
                    duration: 2000
                });
            }
        })
    })
}

/**
 * 获取openid
 * callback--回调函数
 * srcId--推荐人Id
 */
export const getOpenid = () => {
    return new Promise((resolve, reject) => {
        // if (uni.getStorageSync('token')) {
        //     resolve()
        // } else {
            uni.login({
                success: function (res) {
                    if (res.code) {
                        http(urlManager.wxLogin, 'GET', {
                            'code': res.code,
                            'coid': '1'
                        }, false).then((res) => {
							console.log(res)
                            uni.setStorageSync('token', res.info.token);
                            uni.setStorageSync('userInfos', res.info);
                            resolve(res.info)
                        })
                    }
                },
                fail: function (res) {
                    uni.showToast({
                        title: '服务出现了点问题，请重试',
                        icon: 'none',
                        duration: 2000
                    });
                },
            })
        // }
    })
}

/**
 *查询分类或者活动图片
   /goods/searchGcImg
     参数：
     token - login 时返回的 token
     param  查询type=10活动图片的区分 1是封面轮播图,2是人脸3,是活动类型标签
     param1   查询type=10 param=3的活动类型标签用得到,1=节日标签 2=造型标签 3=商家标签
      4=娱乐标签
     seqno  可以通过seqno序号查询图片
     goodClassId 查询指定活动的图片信息
     orderDescCol = "lastUrlTm" 按时间反序
     orderIncCol = "seqno" 按序号来排序
     which_page - 分页号，从1开始
     pageSize - 页大小，默认20


 * 
 */
export const Lunbo = (data) => {

    return new Promise((resolve, reject) => {

        http(urlManager.searchGcImg, 'GET', data, false, Lunbo).then((res) => {
            resolve(res)
        })


    })

}


/**
 * 获取活动
 * token – login(登录) 时返回的 token
   id    通过主键查询,分类id或者活动Id
   seo - 模糊查询，可选
   pid - 如果该分类是另一个分类的子分类，这里放另外一个分类的 id 
   type - 1-商品分类；2-活动
   getDetail - 获取分类详细信息，包括分类图片、分类中的商品等，可选
   which_page - 分页号，从1开始(第一页)
   isShow - 是否显示
   pageSize - 页大小，默认20(每页显示数据)
 
 */

export const Cate = (data) => {
    return new Promise((resolve, reject) => {

        http(urlManager.goodsCate, 'GET', data, false, Cate).then((res) => {
            resolve(res)
        })

    })
}

/**
 * 查询评论，查询收藏
/goods/searchComment
     参数：
     token - login 时返回的 token
     type -  1-活动评论; 2-活动收藏; 3-活动点赞数量; 4-评论点赞数量；5-活动评论数量；6-个人活动点赞，记录个人的 7-关注店铺
     uid - 用户ID，对于 type=2 有用，用于获取用户收藏的活动 type=7 获取关注店铺 
     seo - 模糊查询
     which_page - 页号
     pageSize - 页大小，默认20
 */
export const searchComment = (data) => {
    return new Promise((resolve, reject) => {

        http(urlManager.searchComment, 'GET', data, false, Cate).then((res) => {
            resolve(res)
        })

    })
}



/**
 * 获取收藏列表并算出对应显示的收藏按钮
 */
export const shoucangOrZan = (data) => {
    return new Promise((resolve, reject) => {
        var acList = []
        searchComment(data).then((res) => {
            if (res.ret == 0) {
                var list = res.info.list;
                for (var i = 0; i < list.length; i++) {
                    var obj = {}
                    obj.rid = list[i].rid;
                    obj.scid = list[i].id;
                    obj.goodCnt = list[i].goodCnt;
                    acList.push(obj);
                }
                resolve(acList)
            }
        })

    })
}


/**
* 对活动点赞
    /goods/upvoteGoodsClass
        参数：
        token - login 时返回的 token
        goodsClassId - 活动ID
        isUp - 1 增加点赞，0 - 取消点赞
 */
export const gtoZan = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.upvoteGoodsClass, 'GET', data, false, gtoZan).then((res) => {
            resolve(res)
        })
    })
}


/**
    对活动评论，收藏活动
    /goods/addComment
        参数：
        token - login 时返回的 token
        type - 1-活动评论; 2-活动收藏 7-关注店铺
        pid - 对评论进行回复时，放的是被评论的 ID
        rid - 活动ID
        mark - 评论内容
 */
export const addComment = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.addComment, 'GET', data, false, addComment).then((res) => {
            resolve(res)
        })
    })
}

/**
  删除评论，或收藏
  /goods/delComment
      参数：
      token - login 时返回的 token
      id - 评论或者收藏ID

 */
export const delComment = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.delComment, 'GET', data, false, delComment).then((res) => {
            resolve(res)
        })
    })
}

/**
 * 设置、更新小程序用户的微信信息，小程序需先调用 wx.getUserInfo() 获取这些信息：
      wx/setWappUInfo
        参数：
        token - login 时返回的 token
        nickName - 昵称
        country - 国家
        province - 省
        city - 市
        imgUrl - 微信头像
        sex - 性别
        birthday -生日
 * 
 */
export const setWappUInfo = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.setWappUInfo, 'GET', data, false, setWappUInfo).then((res) => {
            resolve(res)
        })
    })
}

/**
 * 查询用户信息：
/usr/searchUserData
     参数：
     token - login 时返回的 token
     id - 用户信息ID，可选
     uid - 用户ID
     type - 信息类型，比如说替身信息，用户头像，用户身体参数等等信息  自定义type=99
     which_page - 分页号，从1开始
     pageSize - 页大小，默认20    1
 * 
 * 
 */
export const getShapeParams = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.getShapeParam, 'GET', data, false, getShapeParams).then((res) => {
            resolve(res)
        })
    })
}

/**
 -----------删除用户体型信息：-------------
   /usr/delUserData
     参数：
     token - login 时返回的 token
     id - 用户信息ID，有不能删除的，在返回参数错误
 */

export const delShapeParams = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.delShapeParam, 'GET', data, false, delShapeParams).then((res) => {
            resolve(res)
        })
    })
}

/* --------------新增与修改个人体型参数----------------
     /usr/nuUserData
     参数：
     token - login 时返回的 token
     id - 新增的时候，不需要传此参数，系统会创建该id; 更新的时候，需要传
     uid - 用户ID   登录时候返回的用户信息中有
     type - 信息类型，比如说替身信息，用户头像，用户身体参数等等信息 新增是type=99   保存个人信息type=98 
     flag - 信息标志位；第0位 flag[0]=0表示可以被删除/1表示不能删除； flag[0]=0
     intval - integer 类型的值，根据 type 定  0
     longval - long类型的值，根据 type 定   0
     strval - string 类型的值，根据 type 定  身体参数json对象  个人信息json对象

     param1 - 附加参数，前端可以指定使用   null

*/
export const updateShapeParams = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.editShapeParam, 'GET', data, false, updateShapeParams).then((res) => {
            resolve(res)
        })
    })
}
/**
 * 上传客服消息，包括申请活动消息，同时可以上传图片
    /usr/upHelpMsg
     参数：
     token - login 时返回的 token
     type - 1-活动申请消息；2-客服消息
     uname - 姓名
     tel - 电话
     sex - 性别
     topic - 主题
     mark - 描述
     demandTmStr - 要求审核时间

 * 
 */
export const upHelpMsg = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.upHelpMsg, 'GET', data, false, upHelpMsg).then((res) => {
            resolve(res)
        })
    })
}

/**
 * 根据活动id 获取对应的活动信息
 */

// export const getRoleList = (data) => {
//     return new Promise((resolve, reject) => {
//         http(urlManager.getRoleList, 'GET', data, false, getRoleList).then((res) => {
//             resolve(res)
//         })
//     })
// }
/**
 * 
 * 上传文件到后台
 *  filePath: ''上传的文件的地址
 * data: {}上传文件附加参数
 * 
 * 
 */
export const uploadPic = (filePath, data) => {
    return new Promise((resolve, reject) => {
        uni.showLoading({
            title: '加载中...',
            mask: true
        });
        let param = data
        param.token = uni.getStorageSync('token');
        let url = urlManager.uploadPic
        if (param) {
            url += "?";
            Object.keys(param).forEach(function (key) {
                url += encodeURIComponent(key) + "=" + encodeURIComponent(param[key]) + "&";
            });
            url = url.substring(0, url.length - 1);
        }
		setTimeout(()=>{
			uni.hideLoading();
			reject()
		},6000)
        uni.uploadFile({
            //上传图片的网路请求地址
            url: url,
            //选择
            filePath: filePath,
            name: 'file',
            success: function (res) {
                if (JSON.parse(res.data).ret == -6) {
                    uni.removeStorageSync('token')
                    getOpenid().then(() => {
                        uploadPic(filePath, data).then((res) => {
                            resolve(res)
                        })
                    })
                } else {

                    uni.hideLoading();
                    resolve(res)
                }
            },
            fail: function (err) {
                uni.hideLoading();
                reject(err)
            }
        });
    })
}

/**
 * 发送短信
 */
export const sendMsg = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.sendMsg, 'GET', data, false, sendMsg).then((res) => {
            resolve(res)
        })
    })
}

//  统计本活动访问主页和访问店铺的数量

export const getCounts = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.getCount, 'GET', data, false, getCounts).then((res) => {
            resolve(res)
        })
    })
}


/**
 * 
 * 修改用户头像
 *  filePath: ''上传的文件的地址
 * data: {}上传文件附加参数
 * 
 * 
 */
export const updateUsr = (filePath, data ={}) => {
    return new Promise((resolve, reject) => {
        uni.showLoading({
            title: '加载中...',
            mask: true
        });
        let param = data
        param.token = uni.getStorageSync('token');
        let url = urlManager.updateUsr
        if (param) {
            url += "?";
            Object.keys(param).forEach(function (key) {
                url += encodeURIComponent(key) + "=" + encodeURIComponent(param[key]) + "&";
            });
            url = url.substring(0, url.length - 1);
        }
		setTimeout(()=>{
			uni.hideLoading();
			reject()
		},6000)
        uni.uploadFile({
            //上传图片的网路请求地址
            url: url,
            //选择
            filePath: filePath,
            name: 'file',
            success: function (res) {
                if (JSON.parse(res.data).ret == -6) {
                    uni.removeStorageSync('token')
                    getOpenid().then(() => {
                        uploadPic(filePath, data).then((res) => {
                            resolve(res)
                        })
                    })
                } else {

                    uni.hideLoading();
                    resolve(res)
                }
            },
            fail: function (err) {
                uni.hideLoading();
                reject(err)
            }
        });
    })
}


/**
 * 获取生成的图片或者视频
 */
export const searchCommImg = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.searchCommImg, 'GET', data, false, searchCommImg).then((res) => {
            resolve(res)
        })
    })
}

/**
 * 删除生成的图片或者视频
 */
export const batchDelCommImg = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.batchDelCommImg, 'GET', data, false, batchDelCommImg).then((res) => {
            resolve(res)
        })
    })
}


/**
 * 查询商家
 */
export const searchCompany = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.searchCompany, 'GET', data, false, searchCompany).then((res) => {
            resolve(res)
        })
    })
}

/**
 * 查询商品
 */
export const searchGoodsName = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.searchGoodsName, 'GET', data, false, searchGoodsName).then((res) => {
            resolve(res)
        })
    })
}

/**
 * 查询客服信息
 */
export const searchService = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.searchService, 'GET', data, false, searchService).then((res) => {
            resolve(res)
        })
    })
}

/**
 * 保存合成的图片
 */
export const upCommImg = (data) => {
    return new Promise((resolve, reject) => {
        http(urlManager.upCommImg, 'GET', data, false, upCommImg).then((res) => {
            resolve(res)
        })
    })
}


