//根据当前关注的公众号或者生活号获取医院相关配置
export function hospitalInfo(params, dependent) {
    let getOptions = {
        urlPath: "/api/hospitalInfo",
        params: params,
        dependent: dependent,
        showLoading: false
    };
    return shareInst.http.get(getOptions);
}
export function queryRegHospAndDepts(params) {

    let getOptions = {
        urlPath: "/api/reghosp/queryRegHospAndDepts",
        params: params
    };
    return shareInst.http.get(getOptions);
}

//首页切换医院
export function getallcustomerhospital(params) {

    let postOptions = {
        urlPath: "/api/hospital/getallcustomerhospital",
        params: params
    };

    return shareInst.http.post(postOptions);
}

//登录获取短信验证码
export function getverificationcode(params) {
    let postOptions = {
        urlPath: "/api/user/getverificationcode",
        params: params
    };

    return shareInst.http.post(postOptions);
}

//登录注册接口
export function loginorregister(params) {
    let postOptions = {
        urlPath: '/api/user/loginorregister',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//用户退出登录
export function logout(params) {
    let postOptions = {
        urlPath: '/api/user/logout',
        params: params
    };
    return shareInst.http.post(postOptions);
}


//获取首页功能模块
export function getfunctionlist(data) {
    let postOptions = {
        urlPath: '/api/hospital/getfunctionlist',
        params: data
    };
    return shareInst.http.post(postOptions);
}



//获取科室列表
export function getregdepartmentlist(params) {

    let postOptions = {
        urlPath: '/api/registration/getregdepartmentlist',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//按专家获取医生列表
export function getregdoctorlistbydeptid(params) {

    let postOptions = {
        urlPath: '/api/registration/getregdoctorlistbydeptid',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//按时间获取预约医生列表
export function getregdoctorlistbydate(params) {

    let postOptions = {
        urlPath: '/api/registration/getregdoctorlistbydate',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//获取预约医生信息
export function getregdoctorinfo(params) {

    let postOptions = {
        urlPath: '/api/registration/getregdoctorinfo',
        params: params
    };

    return shareInst.http.post(postOptions);
}
//获取预约医生排班列表信息
export function getdocschedulelist(params) {

    let postOptions = {
        urlPath: '/api/registration/getdocschedulelist',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//获取排班信息
export function getregschedulelist(params) {

    let postOptions = {
        urlPath: '/api/registration/getregschedulelist',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//关注
export function collection(params) {

    let postOptions = {
        urlPath: '/api/registration/collection',
        params: params
    };

    return shareInst.http.post(postOptions);
}
//预约挂号
export function regconfirmation(params) {

    let postOptions = {
        urlPath: '/api/registration/regconfirmation',
        params: params
    };

    return shareInst.http.post(postOptions);
}
//获取家庭成员列表
export function getallrelativeinfo(params) {

    let postOptions = {
        urlPath: '/api/relative/getallrelativeinfo',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//保存家庭成员
export function saverelative(params) {

    let postOptions = {
        urlPath: '/api/relative/saverelative',
        params: params,
        contentType: "application/json;charset=UTF-8"
    };
    return shareInst.http.post(postOptions);
}
//添加/编辑卡
export function savecard(params) {

    let postOptions = {
        urlPath: '/api/relative/savecard',
        params: params,
        failPrompt: false,
        mainData: false
    };
    return shareInst.http.post(postOptions);
}


//获取微信的配置
export function getWeiXinCongfig(currentUrl) {

    let endNum = currentUrl.indexOf("#");
    let url = currentUrl.substring(0, endNum);

    let getOptions = {
        urlPath: "/portalwxapi/queryreport/getWeiXinCongfig",
        params: {
            url: url
        }
    };

    return shareInst.http.get(getOptions);
}

//获取微信的配置
export function getTextWeiXinCongfig(currentUrl) {

    let endNum = currentUrl.indexOf("#");
    let url = currentUrl.substring(0, endNum);

    let getOptions = {
        urlPath: "/api/test/getWeiXinCongfig",
        params: {
            url: currentUrl
        }
    };

    return shareInst.http.get(getOptions);
}
export function registersign(params) {

    let postOptions = {
        urlPath: "/api/qlc/registration/registersign",
        params: params
    };
    return shareInst.http.post(postOptions);
}
//就诊卡信息
export function payinfo(params) {

    let postOptions = {
        urlPath: "/api/pay/payinfo",
        params: params
    };
    return shareInst.http.post(postOptions);
}
export function payinfo1(params) {

    let postOptions = {
        urlPath: "/api/pay/payinfo",
        params: params,
        showLoading: false,
        failPrompt: false,
    };
    return shareInst.http.post(postOptions);
}
//获取用户点评
export function regreviewlist(params) {

    let postOptions = {
        urlPath: '/api/qlc/registration/regreviewlist',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//验证用户支付
export function syncvalidate(params) {

    let postOptions = {
        urlPath: '/api/qlc/outpatient/syncvalidate',
        params: params,
        mainData: false,
        showLoading: false,
    };
    return shareInst.http.get(postOptions);
}
//获取支付挂号结果
export function registerpayresult(params) {

    let postOptions = {
        urlPath: '/api/qlc/registration/registerpayresult',
        params: params,
        mainData: false,
        showLoading: false
    };
    return shareInst.http.post(postOptions);
}

export function regcancel(params) {

    let postOptions = {
        urlPath: '/api/registration/regcancel',
        params: params,
        mainData: false,
        failPrompt: false,
    };
    return shareInst.http.post(postOptions);
}




//获取医院支持卡类型
export function cardtype(params) {
    let getOptions = {
        urlPath: '/api/qlc/cardtype',
        params: params
    };
    return shareInst.http.get(getOptions);
}





// 就诊卡充值加签接口
export function unifiedorder(params) {
    let getOptions = {
        urlPath: '/api/recharge/unifiedorder',
        params: params
    };
    return shareInst.http.get(getOptions);
}
//修改亲友姓名
export function updaterealname(params) {

    let postOptions = {
        urlPath: '/api/relative/updaterealname',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//修改亲友身份证号
export function updateidcard(params) {

    let postOptions = {
        urlPath: '/api/relative/updateidcard',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//修改亲友手机号
export function updatemobilenumber(params) {

    let postOptions = {
        urlPath: '/api/relative/updatemobilenumber',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//修改亲友身高
export function updateheight(params) {

    let postOptions = {
        urlPath: '/api/relative/updateheight',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//修改亲友血型
export function updatebloodtype(params) {

    let postOptions = {
        urlPath: '/api/relative/updatebloodtype',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//修改亲友性别
export function updategender(params) {

    let postOptions = {
        urlPath: '/api/relative/updategender',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//修改亲友出生日期
export function updatebirthday(params) {

    let postOptions = {
        urlPath: '/api/relative/updatebirthday',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//修改亲友监护人姓名
export function updateguardianname(params) {

    let postOptions = {
        urlPath: '/api/relative/updateguardianname',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//修改亲友监护人证件号
export function updateguardiancardno(params) {

    let postOptions = {
        urlPath: '/api/relative/updateguardiancardno',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//修改亲友监护人手机号
export function updateguardianphone(params) {

    let postOptions = {
        urlPath: '/api/relative/updateguardianphone',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//修改亲友监护人证件类型
export function updateguardiancerttype(params) {

    let postOptions = {
        urlPath: '/api/relative/updateguardiancerttype',
        params: params
    };
    return shareInst.http.post(postOptions);
}

//修改亲友监护人证件类型
export function deletecard(params) {

    let postOptions = {
        urlPath: '/api/relative/deletecard',
        params: params
    };
    return shareInst.http.post(postOptions);
}

//获取所有地区列表
export function getallareas(params) {

    let postOptions = {
        urlPath: '/api/areas/getallareas',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//获取所有地区列表
export function getallareasdata(params) {

    let postOptions = {
        urlPath: '/api/areas/getallareasdata',
        params: params
    };
    return shareInst.http.post(postOptions);
}

//就诊卡充值支付结果
export function rechargepayresult(params) {

    let postOptions = {
        urlPath: '/api/recharge/rechargepayresult',
        params: params,
        mainData: false,
        showLoading: false
    };
    return shareInst.http.post(postOptions);
}
//删除亲友
export function deleterelativeinfo(params) {
    let postOptions = {
        urlPath: '/api/relative/deleterelativeinfo',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//待支付记录列表
export function pendingpaylist(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/pendingpaylist',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//缴费记录列表
export function alreadypaylist(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/alreadypaylist',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//文案提示
export function outpatientHint(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/hint',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//支付费用详情
export function pendingpaydetail(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/pendingpaydetail',
        params: params
    };
    return shareInst.http.post(postOptions);
}

//合单支付加签
export function mergeordersign(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/mergeordersign',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//校验支付结果
export function outpatientSyncvalidate(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/syncvalidate',
        params: params,
        showLoading: false
    };
    return shareInst.http.post(postOptions);
}

//合单支付结果
export function mergepayorderresult(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/mergepayorderresult',
        params: params,
        mainData: false,
        showLoading: false
    };
    return shareInst.http.post(postOptions);
}
//缴费记录结果
export function alreadypayresult(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/alreadypayresult',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//查询住院信息（当前和历史）4.6.2.请求住院基本信息接口(全流程住院信息新接口)
export function stayhospitalallinfo(params) {
    let postOptions = {
        urlPath: '/api/registration/stayhospitalallinfo',
        params: params,
    };
    return shareInst.http.post(postOptions);
}
//查询押金信息
export function deposit(params) {
    let postOptions = {
        urlPath: '/api/qlc/registration/deposit',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//查询住院费用总额列表--每天住院费用(原先的住院清单接口)
export function stayhospitallist(params) {
    let postOptions = {
        urlPath: '/api/registration/stayhospitallist',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//查询押金缴费记录清单
export function depositlist(params) {
    let postOptions = {
        urlPath: '/api/qlc/registration/depositlist',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//住院押金支付 -- 加签
export function stayhosordersign(params) {
    let postOptions = {
        urlPath: '/api/qlc/registration/stayhosordersign',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//住院押金支付 -- 获得支付结果
export function stayhospayresult(params) {
    let postOptions = {
        urlPath: '/api/qlc/registration/stayhospayresult',
        params: params,
        mainData: false,
        showLoading: false
    };
    return shareInst.http.post(postOptions);
}
//门诊清单接口
export function outpatientlist(params) {
    let postOptions = {
        urlPath: '/api/registration/outpatientlist',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//当天取号信息列表
export function gettodaytakenolist(params) {
    let postOptions = {
        urlPath: '/api/qlc/registration/gettodaytakenolist',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//判断是否已缴费
export function ispayorder(params) {
    let postOptions = {
        urlPath: '/api/qlc/registration/ispayorder',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//取号候诊支付加签
export function takenosign(params) {
    let postOptions = {
        urlPath: '/api/qlc/registration/takenosign',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//取号候诊支付结果
export function takenopayresult(params) {
    let postOptions = {
        urlPath: '/api/qlc/registration/takenopayresult',
        params: params,
        mainData: false,
        showLoading: false
    };
    return shareInst.http.post(postOptions);
}
//取号
export function gettakeno(params) {
    let postOptions = {
        urlPath: '/api/qlc/registration/gettakeno',
        params: params
    };
    return shareInst.http.post(postOptions);
}

/**
 * 挂号记录
 * page
 * regtype:0->预约挂号，1->当日挂号
 * page=1&regtype=0&rows=8&ticket=11936c6f4bd431d8fa5a88d32f23b68c&uid=2528
 */
export function getreghistorylist(params) {
    let postOptions = {
        urlPath: '/api/registration/getreghistorylist',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//获取用户点评所有信息
export function gettodayreview(params) {
    let postOptions = {
        urlPath: '/api/qlc/registration/gettodayreview',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//就医点评
export function review(params) {
    let postOptions = {
        urlPath: '/api/qlc/registration/review',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//获取我的关注医生列表
export function getcollectionlist(params) {
    let postOptions = {
        urlPath: '/api/registration/getcollectionlist',
        params: params
    };
    return shareInst.http.post(postOptions);
}

//充值记录列表查询
export function getrechargelist(params) {
    let postOptions = {
        urlPath: '/api/recharge/getrechargelist',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//充值记录明细
export function getrechargedetail(params) {
    let postOptions = {
        urlPath: '/api/recharge/getrechargedetail',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//获取个人中心配置列表
export function getpersonalcenterlist(params) {
    let postOptions = {
        urlPath: '/api/qlc/personal/getpersonalcenterlist',
        params: params
    };
    return shareInst.http.post(postOptions);
}
//查询业务卡
export function getcardinfo(params) {
    let postOptions = {
        urlPath: '/api/qlc/relative/getcardinfo',
        params: params
    };
    return shareInst.http.post(postOptions);
}






//查报告列表
export function queryReportList(params) {
    let getOptions = {
        urlPath: '/api/qlc/queryreportlist',
        params: params
    };
    return shareInst.http.post(getOptions);
}

//查报告详情
export function queryReportDetail(params) {

    let getOptions = {
        urlPath: '/api/qlc/queryreportdetaillist',
        params: params
    };
    return shareInst.http.get(getOptions);
}
//获取用户信息
export function getuserinfo(params) {

    let getOptions = {
        urlPath: '/api/qlc/personal/getuserinfo',
        params: params
    };
    return shareInst.http.get(getOptions);
}
//在线建档
export function onlinebuildrecord(params) {
    let getOptions = {
        urlPath: '/api/qlc/personal/onlinebuildrecord',
        params: params,
        mainData: false,
        failPrompt: false,
        loadText: '正在建卡，请稍候'
    };
    return shareInst.http.get(getOptions);
}
//获取上次预约科室
export function getlatestregdepartment(params) {
    let getOptions = {
        urlPath: '/api/registration/getlatestregdepartment',
        params: params,
        showLoading: false
    };
    return shareInst.http.get(getOptions);
}
//获取上次预约的医生
export function getlatestregdoctor(params) {
    let getOptions = {
        urlPath: '/api/registration/getlatestregdoctor',
        params: params,
        showLoading: false
    };
    return shareInst.http.get(getOptions);
}
//拉取已有业务卡
export function getalreadycard(params) {
    let getOptions = {
        urlPath: '/api/qlc/personal/getalreadycard',
        params: params,
        failPrompt: false,
        mainData: false
    };
    return shareInst.http.get(getOptions);
}
//修改亲友证件类型
export function updatecerttype(params) {
    let getOptions = {
        urlPath: '/api/relative/updatecerttype',
        params: params,
    };
    return shareInst.http.get(getOptions);
}
//修改亲友关系
export function updaterelationship(params) {
    let getOptions = {
        urlPath: '/api/relative/updaterelationship',
        params: params,
        mainData: false
    };
    return shareInst.http.get(getOptions);
}
//当日/预约挂号详情
export function getreghistorydetail(params) {
    let getOptions = {
        urlPath: '/api/registration/getreghistorydetail',
        params: params,
    };
    return shareInst.http.get(getOptions);
}
//扫码付列表
export function getscandata(params) {
    let getOptions = {
        urlPath: '/api/qlc/unifiedpay/getscandata',
        params: params,
        mainData: false,
    };
    return shareInst.http.get(getOptions);
}
//获取首页轮播图
export function gethomepagelist(params) {
    let getOptions = {
        urlPath: '/api/adv/gethomepagelist',
        params: params,
    };
    return shareInst.http.get(getOptions);
}
//在线生成条形码或者二维码接口
export function getbarcodeimage(params) {
    let getOptions = {
        urlPath: '/api/barcode/getbarcodeimage',
        params: params,
        mainData: false,
    };
    return shareInst.http.get(getOptions);
}
//支付测试
export function testPaySign(params) {
    let getOptions = {
        urlPath: '/test/api/wechat/wechatpaysign',
        params: params,
    };
    return shareInst.http.get(getOptions);
}

//获取所有地区
export function getallcustomerareas(params) {
    let getOptions = {
        urlPath: '/api/areas/getallcustomerareas',
        params: params,
    };
    return shareInst.http.get(getOptions);
}

export function guidance(url, params) {
    let getOptions = {
        urlPath: url,
        params: params,
        mainData: false
    };
    return shareInst.http.get(getOptions);
}
//报告消息推送
export function getreportdata(params) {
    let getOptions = {
        urlPath: '/api/message/getreportdata',
        params: params,
    };
    return shareInst.http.get(getOptions);
}
//获取微信推送门诊详情列表
export function getwxoutpaylist(params) {
    let getOptions = {
        urlPath: '/api/qlc/outpatient/getwxoutpaylist',
        params: params,
    };
    return shareInst.http.get(getOptions);
}
//
export function getcards(params) {
    let getOptions = {
        urlPath: '/api/qlc/personal/getcards',
        params: params,
    };
    return shareInst.http.get(getOptions);
}
export function waitingList(params, showLoading = false) {
    let getOptions = {
        urlPath: '/api/qlc/registration/waitinglist',
        params: params,
        showLoading: showLoading
    };
    return shareInst.http.get(getOptions);
}

export function presidentLogs(params) {
    let getOptions = {
        urlPath: '/api/qlc/personal/presidentlogs',
        params: params,
        mainData: false
    };
    return shareInst.http.get(getOptions);
}

export function selfMachineCount(params) {
    let getOptions = {
        urlPath: '/api/qlc/personal/selfmachinecount',
        params: params,
        mainData: false
    }
    return shareInst.http.get(getOptions);
}

export function getBindCardCode(params) {
    let getOptions = {
        urlPath: '/api/doctor/getbindcardcode',
        params: params,
    }
    return shareInst.http.get(getOptions);
}

export function getHomeFuncList(params) {
    let getOptions = {
        urlPath: '/hosintro/' + (params.hospCode || '188282') + '.json',
        params: params,
        mainData: false
    }
    return shareInst.http.get(getOptions);
}


export function getFuncList(params) {
    let getOptions = {
        urlPath: '/hosintro/' + params.type + '/' + (params.hospCode || '188282') + '.json',
        params: params,
        mainData: false
    }
    return shareInst.http.get(getOptions);
}

export function saverelativeext(params) {
    let getOptions = {
        urlPath: '/api/relative/saverelativeext',
        params: params,
        contentType: "application/json;charset=UTF-8"
    }
    return shareInst.http.post(getOptions);
}

//新UI界面中获取首页功能模块接口
export function getNewfunctionlist(data) {
    let postOptions = {
        urlPath: '/hosintro/index/' + (data.hospCode || '188282') + '.json',
        params: data,
        mainData: false
    }
    return shareInst.http.get(postOptions)
}

export function isHasMember(params) {
    let postOptions = {
        urlPath: '/api/relative/getrelative',
        params: params,
    }
    return shareInst.http.post(postOptions)
}


//文案提示
export function hintText(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/hintext',
        params: params
    };
    return shareInst.http.post(postOptions);
}


export function doctorLogin(params) {
    let postOptions = {
        urlPath: '/api/qlc/wzdoctor/login',
        params: params
    }
    return shareInst.http.post(postOptions);
}

export function doctorResetPwd(params) {
    let postOptions = {
        urlPath: '/api/qlc/wzdoctor/resetpwd',
        params: params
    }
    return shareInst.http.post(postOptions);
}
//医生获取所有主题 （待回答问题）dtoken=参数为登录返回的
export function reqDList(params) {
    let postOptions = {
        urlPath: '/api/qlc/wzthread/dlist',
        params: params
    }
    return shareInst.http.post(postOptions);
}
//点击单个问题 获取用户对话框
export function reqDListBytId(params) {
    let postOptions = {
        urlPath: '/api/qlc/wzthread/dlistbytid',
        params: params
    }
    return shareInst.http.post(postOptions);
}
//医生回复问题,医生界面不要上次附件功能
export function reqDoctorReply(params) {
    let postOptions = {
        urlPath: '/api/qlc/wzthread/post?dtoken=' + params.dtoken,
        data: params,
        loadText: '数据提交中'
    }
    return shareInst.http.post(postOptions);
}
//患者查询医生列表：医院id 获取问诊医生列表
export function reqDoctorList(params) {
    let postOptions = {
        urlPath: '/api/qlc/wzdoctor/list',
        params: params
    }
    return shareInst.http.post(postOptions);
}
//患者提问  附件的需要在研究下
export function reqThreadAsk(params) {
    let postOptions = {
        urlPath: '/api/qlc/wzthread/hzpost',
        data: params,
        loadText: '数据提交中'
    }
    return shareInst.http.post(postOptions);
}

export function uploadFile(params) {
    return shareInst.http.uploadFile({
        urlPath: '/api/qlc/attachment/upload',
        data: params,
        contentType: 'multipart/form-data'
    })
}

export function reqHzList(params) {
    let postOptions = {
        urlPath: '/api/qlc/wzthread/hzlist',
        params: params
    }
    return shareInst.http.post(postOptions)
}

/***********************核酸检验*************************/

export function natItemList(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/natItemList',
        params: params
    }
    return shareInst.http.post(postOptions)
}
//核酸检测预约(不支付)
export function natItemSub(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/natItemSub',
        params: params
    }
    return shareInst.http.post(postOptions)
}

//核酸检测预约加签 (调起支付)
export function natItemSign(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/natItemSign',
        params: params
    }
    return shareInst.http.post(postOptions)
}
//取消检测预约
export function natItemCancel(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/natItemCancel',
        params: params
    }
    return shareInst.http.post(postOptions)
}
// 获取结果
export function natItemResult(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/natItemResult',
        params: params,
        mainData: false,
        showLoading: false
    }
    return shareInst.http.post(postOptions)
}

export function natItemSignList(params) {
    let postOptions = {
        urlPath: '/api/qlc/outpatient/natItemSignList',
        params: params
    }
    return shareInst.http.post(postOptions)
}