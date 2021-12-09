//  process.env.NODE_ENV 的取值范围： 'testing' | 'production' | 'development'


// 域名:开始
let domain = null;

// domain = "blb-weixintest.clearofchina.com"  //开发 外网
// domain = "qlc-weixintest.clear-sz.com"    //测试 外网

// domain = "192.168.27.64:8080"   //开发
// domain = "192.168.50.14:8044"   //测试
// domain = "192.168.50.15:8080"   //仿真
// domain = "192.168.51.77:8035"   //仿真
// domain = "192.168.19.208:8045"   //演示上线地址

// domain = "medicalrecord-b-19-207.app.dev.clear-rdc.com"
// domain = "blb.9yiban.com"

// domain = "192.168.20.51:8089"   //云庆
domain = "192.168.20.97:8089" //超
    // domain = "192.168.20.52:8089"   //厚义
    // domain = "192.168.24.102:8089"    //国杰
    // domain = "192.168.20.80:8089"
    // domain = "192.168.24.102:8089"
    // domain = "192.168.20.62:8080"  //均
    // domain = "192.168.24.93:8089"

if (process.env.NODE_ENV === 'production') {
    domain = "www.jknys.cn:8060"; //正式
}

// 域名:结束





// 客户端ID: 结束






// 查报告的加密参数
const checkReport = {
    channelNo: "1b3a37ad7eb6fdb095263ea532a3ee4c",
    key: "30d20c0382e1ee9af78010169859d480"
};




// const baseURL = `http://${domain}/`;    //url的基地址，根url
const baseURL = '/blb1'; //url的基地址，根url







//微信的相关配置
const weChatConf = {
    jsApiList: ['chooseWXPay', 'scanQRCode', ], //微信接口列表
    payUseJSBridge: true, //是否使用  WeixinJSBridge 的支付接口
};


//客户端名称
const osName = {
    client: "client", //通用客户端类型
    browser: "browser", //浏览器
    app: "app", //包壳的App
    ios: "ios", //ios
    android: "android", //Android
    weChat: "wechat", //微信内
    alipay: "alipay", //支付宝
    streamApp: "StreamApp" //流应用
};



// payMethodMap ：支付类信息
const payMethodMap = {
    getMethodForType: function(payType) {

        let propInfo = this.findProperty(function(propValue, propkey, index) {

            switch (typeof propValue) {
                case "object":
                    {
                        return payType == propValue.type;
                    }

                default:
                    return false;
            }


        });

        return propInfo.value;
    },
    weChatWeb: {
        type: 7,
        name: "微信",
        icon: require('@icon/ic_wechatpay@2x.png'),
        orderNo: 1,
        selected: true
    }, //微信Web支付
    weChatPublic: {
        type: 5,
        name: "微信",
        icon: require('@icon/ic_wechatpay@2x.png'),
        orderNo: 2
    }, //微信公共号支付
    alipay: {
        type: 6,
        name: "支付宝",
        icon: require('@icon/ic_alipay@2x.png'),
        orderNo: 3
    }, //支付宝

    medicalCard: {
        type: 4,
        name: "就诊卡余额",
        icon: require('@icon/ic_medicalcard.png'),
        orderNo: 4
    }, //就诊卡余额支付


    checkoutCounter: {
        type: 10,
        name: "四川农信收银台",
        icon: require('@icon/ic_wechatpay@2x.png'),
        orderNo: 5,
    }, //收银台支付


    //dele: 测试的，需要删除
    alipayApp: {
        type: 2,
        name: "支付宝支付",
        icon: require('@icon/ic_alipay@2x.png'),
        orderNo: 6,
        selected: true
    }, //支付宝
};

const personModules = {
    P_WDGH: {
        name: '我的挂号',
        icon: require('@icon/my/ic_mynumber@2x.png'),
        isactive: 0,
        route: {
            path: '/myRegister'
        }
    },
    P_WDGZ: {
        name: '我的关注',
        icon: require('@icon/my/ic_myfocus@2x.png'),
        isactive: 0,
        route: {
            path: '/myFocus'
        }
    },
    P_WDSC: {
        name: '我的收藏',
        icon: require('@icon/my/ic_myfav@2x.png'),
        isactive: 0,
        route: {
            path: '/'
        }
    },
    P_JTCY: {
        name: '家庭成员',
        icon: require('@icon/my/ic_myfamily@2x.png'),
        isactive: 0,
        route: {
            path: "/memberList",
            query: {
                funKey: "GRZX",
                title: "就诊人管理",
                hideBack: true,
                prompt: "选中要编辑的就诊人",
                to: JSON.stringify({
                    name: "EditMember",
                    query: {
                        funKey: "GRZX",
                        title: "编辑就诊人",
                    }
                })
            }
        }
    },
    P_WYHS: {
        name: '我有话说',
        icon: require('@icon/my/ic_user_feedback@2x.png'),
        isactive: 0,
        route: {
            path: '/mySpeak'
        }
    },
    P_GYWM: {
        name: '关于我们',
        icon: require('@icon/my/ic_user_About-Us@2x.png'),
        isactive: 0,
        route: {
            path: '/aboutUs'
        }
    },
    P_SZ: {
        name: '设置',
        icon: require('@icon/my/ic_user_setting@2x.png'),
        isactive: 0,
        route: {
            path: '/setting'
        }
    },
    P_WDJC: {
        name: '我的检查',
        icon: require('@icon/my/ic_mycheck.png'),
        isactive: 0,
        route: {

        }
    },
    P_WDJZK: {
        name: '我的就诊卡',
        icon: require('@icon/my/ic_myfamily@2x.png'),
        isactive: 0,
        route: {
            path: '/myCardList',
            query: {
                funKey: 'WDJZK'
            }
        }
    }
}





//首页功能信息
let funModules = {
    YYJJ: {
        name: "医院简介",
        to: {
            name: "",
            path: "/hospitalInfo"
        },
        icon: require('@icon/homeicon_department@2x.png'),
        iconNor: require('@icon/homeicon_department_nor@2x.png'),
    },


    KSJS: {
        name: "科室介绍",
        to: {
            name: "",
            path: "/departmentIntro"
        },
        icon: require('@icon/homeicon_office@2x.png'),
        iconNor: require('@icon/homeicon_office_nor@2x.png'),
    },


    ZJJS: {
        name: "专家介绍",
        to: {
            name: '',
            path: "/doctorIntro"
        },
        icon: require('@icon/homeicon_professor@2x.png'),
        iconNor: require('@icon/homeicon_professor_nor@2x.png'),
    },


    YYDH: {
        name: "来院导航",
        to: {
            name: "Navigation",
        },
        icon: require('@icon/homeicon_nav@2x.png'),
        iconNor: require('@icon/homeicon_nav_nor@2x.png'),
    },


    DRGH: {
        name: "当日挂号",
        to: {
            name: "DepartmentList",
            query: {
                routeName: "curRegister",
                bookType: 1,
                funKey: 'DRGH',
                title: '选择科室',
                isFirstPatient: 0,
                hideBack: false,
                to: {
                    name: "DoctorList",
                    query: {
                        isFirstPatient: 0,
                        dataKey: 'curRegister',
                        bookType: 1,
                        funKey: "DRGH",
                        title: "医生列表",
                        isFirstPatient: false,
                        to: {
                            name: "DoctorInfo"
                        }
                    }
                }
            }
        },
        icon: require('@icon/homeicon_day@2x.png'),
        iconNor: require('@icon/homeicon_day_nor@2x.png'),
    },



    YYGH: {
        name: "预约挂号",
        to: {
            name: "DepartmentList",
            query: {
                routeName: "bookingRegister",
                bookType: 0,
                funKey: 'YYGH',
                title: '选择科室',
                isFirstPatient: 0,
                hideBack: false,
                to: {
                    name: "DoctorList",
                    query: {
                        dataKey: 'bookingRegister',
                        bookType: 0,
                        funKey: "YYGH",
                        title: "医生列表",
                        isFirstPatient: 0,
                        isFirstPatient: false,
                        to: {
                            name: "DoctorInfo"
                        }
                    }
                }
            },
        },
        icon: require('@icon/homeicon_registered@2x.png'),
        iconNor: require('@icon/homeicon_registered_nor@2x.png'),
    },


    YECX: {
        name: "余额查询",
        to: {
            name: "",
            path: ""
        },
        icon: require('@icon/homeicon_balance@2x.png'),
        iconNor: require('@icon/homeicon_balance_nor@2x.png'),
    },



    MZCZ: {
        name: "门诊充值",
        to: {
            name: "MemberList",
            query: {
                funKey: "MZCZ",
                title: "门诊充值",
                hideBack: true,
                prompt: "您要为谁充值？",
                to: {
                    name: "SelectCardPage",
                    query: {
                        dataKey: 'outpatientRecharge',
                        funKey: "MZCZ",
                        title: "门诊充值",
                        to: {
                            name: "PayForm",
                            query: {
                                funKey: 'MZCZ',
                                routeName: 'recharge'
                            }
                        }
                    }
                }

            },
        },
        icon: require('@icon/homeicon_recharge@2x.png'),
        iconNor: require('@icon/homeicon_recharge_nor@2x.png'),
    },
    CZJL: {
        name: "充值记录",
        to: {
            name: "MemberList",
            query: {
                funKey: "CZJL",
                title: "充值记录",
                hideBack: true,
                prompt: "您要查看谁的充值记录？",
                to: {
                    name: "SelectCardPage",
                    query: {
                        dataKey: 'outpatientRechargeList',
                        funKey: "CZJL",
                        title: "充值记录",
                        to: {
                            name: "RechargeList",
                            query: {
                                funKey: 'CZJL',
                                routeName: 'recharge'
                            }
                        }
                    }
                }

            },
        },
        icon: require('@icon/homeicon_recharge@2x.png'),
        iconNor: require('@icon/homeicon_recharge_nor@2x.png'),
    },


    JYJL: {
        name: "交易记录",
        to: {
            name: "",
            path: ""
        },
        icon: require('@icon/homeicon_trade@2x.png'),
        iconNor: require('@icon/homeicon_trade_nor@2x.png'),
    },


    // BGCX:{
    //   name:"报告查询",
    //   to:{
    //     name:"MemberList",
    //     query:{
    //       funKey:"BGCX",
    //       title:"报告查询",
    //       hideBack:true,
    //       prompt:"你要查询谁的报告？",
    //       to:{
    //         name:"QueryType",
    //         query:{
    //           funKey:"BGCX",
    //           title:"报告查询"
    //         }
    //       }
    //     },
    //   },
    //   icon:require('@icon/homeicon_inquire@2x.png'),
    //   iconNor:require('@icon/homeicon_inquire_nor@2x.png'),
    // },


    BGCX: {
        name: "报告查询",
        to: {
            name: "MemberList",
            query: {
                funKey: "BGCX",
                title: "报告查询",
                hideBack: true,
                prompt: "您要查询谁的报告？",
                to: {
                    name: "SelectCardPage",
                    query: {
                        dataKey: 'QueryReport:MemberList-SelectCardPage',
                        funKey: "BGCX",
                        title: "报告查询",
                        to: {
                            name: "ReportList",
                            query: {
                                funKey: "BGCX",
                            }
                        }
                    }
                }

            },
        },
        icon: require('@icon/homeicon_baogao@2x.png'),
        iconNor: require('@icon/homeicon_baogao_nor@2x.png'),
    },

    BGTX: {
        name: "报告提醒",
        to: {
            name: "",
            path: ""
        },
        icon: require('@icon/homeicon_remind@2x.png'),
        iconNor: require('@icon/homeicon_remind_nor@2x.png'),
    },


    SCBG: {
        name: "上传报告",
        to: {
            name: "",
            path: ""
        },
        icon: require('@icon/homeicon_update@2x.png'),
        iconNor: require('@icon/homeicon_update_nor@2x.png'),
    },


    JKK: {
        name: "健康卡",
        to: {
            name: "",
            path: ""
        },
        icon: require('@icon/homeicon_card@2x.png'),
        iconNor: require('@icon/homeicon_card_nor@2x.png'),
    },


    ZYQD: {
        name: "住院清单",
        to: {
            name: "MemberList",
            query: {
                funKey: "ZYQD",
                title: "住院清单",
                hideBack: true,
                prompt: "您要查询谁的住院清单？",
                to: {
                    name: "SelectCardPage",
                    query: {
                        dataKey: 'hospitalizationListCard',
                        funKey: "ZYQD",
                        title: "住院清单",
                        to: {
                            name: "HospitalizationList",
                            query: {
                                dataKey: 'hospitalizationList',
                                title: "住院清单",
                                funKey: "ZYQD",
                                routeName: 'hospitalizationList'
                            }
                        }
                    }
                }
            },
        },
        icon: require('@icon/homeicon_hospital@2x.png'),
        iconNor: require('@icon/homeicon_hospital_nor@2x.png'),
    },



    MZQD: {
        name: "门诊清单",
        to: {
            name: "MemberList",
            query: {
                funKey: "MZQD",
                title: "门诊清单",
                hideBack: true,
                prompt: "您要查询谁的门诊清单？",
                to: {
                    name: "SelectCardPage",
                    query: {
                        dataKey: 'outpatientListCard',
                        funKey: "MZQD",
                        title: "门诊清单",
                        to: {
                            name: "HospitalizationList",
                            query: {
                                dataKey: 'outpatientList',
                                title: "门诊清单",
                                funKey: "MZQD",
                                routeName: 'outpatientList'
                            }
                        }
                    }
                }
            },
        },
        icon: require('@icon/homeicon_outpatient@2x.png'),
        iconNor: require('@icon/homeicon_outpatient_nor@2x.png'),
    },





    ZYYJJ: {
        name: "住院预交金",
        to: {
            name: "MemberList",
            query: {
                funKey: "ZYYJJ",
                title: "住院预交金",
                hideBack: true,
                prompt: "您要查询谁的住院预交金？",
                to: {
                    name: "SelectCardPage",
                    query: {
                        dataKey: 'hospitalizationDeposit',
                        funKey: "ZYYJJ",
                        title: "住院预交金",
                        to: {
                            name: "HospitalizationDeposit",
                            query: {
                                funKey: "ZYYJJ",
                                routeName: 'deposit'
                            }
                        }
                    }
                }

            },
        },
        icon: require('@icon/homeicon_deposit@2x.png'),
        iconNor: require('@icon/homeicon_deposit_nor@2x.png'),
    },
    YJJL: {
        name: "预交记录",
        to: {
            name: "MemberList",
            query: {
                funKey: "YJJL",
                title: "预交记录",
                hideBack: true,
                prompt: "您要查询谁的预交记录？",
                to: {
                    name: "SelectCardPage",
                    query: {
                        dataKey: 'allDepositList',
                        funKey: "YJJL",
                        title: "预交记录",
                        to: {
                            name: "AllDepositList",
                            query: {
                                funKey: "YJJL",
                                routeName: 'deposit'
                            }
                        }
                    }
                }
            },
        },
        icon: require('@icon/homeicon_deposit@2x.png'),
        iconNor: require('@icon/homeicon_deposit_nor@2x.png'),
    },


    QHHZ: {
        name: "取号候诊",
        to: {
            name: "WaitingList",
            query: {
                funKey: "QHHZ",
                title: "取号候诊",
            },
        },
        icon: require('@icon/homeicon_lineup@2x.png'),
        iconNor: require('@icon/homeicon_lineup_nor@2x.png'),
    },


    JYDP: {
        name: "就医点评",
        to: {
            name: "ReviewDoctorList",
            query: {
                funKey: "JYDP",
                title: "就医点评",
            },
        },
        icon: require('@icon/homeicon_dianping@2x.png'),
        iconNor: require('@icon/homeicon_dianping_nor@2x.png'),
    },




    MZJF: {
        name: "门诊缴费",
        to: {
            name: "MemberList",
            query: {
                funKey: "MZJF",
                title: "门诊缴费",
                hideBack: false,
                prompt: "您要查询谁的门诊费用？",
                to: {
                    name: "SelectCardPage",
                    query: {
                        dataKey: 'outpatientPayment',
                        funKey: "MZJF",
                        title: "门诊缴费",
                        to: {
                            name: "OutpatientList",
                            query: {
                                funKey: "MZJF"
                            }
                        }
                    }
                }

            },
        },
        icon: require('@icon/homeicon_jiaofei@2x.png'),
        iconNor: require('@icon/homeicon_jiaofei_nor@2x.png'),
    },
    JFJL: {
        name: "缴费记录",
        to: {
            name: "MemberList",
            query: {
                funKey: "JFJL",
                title: "缴费记录",
                hideBack: false,
                prompt: "您要查询谁的缴费记录？",
                to: {
                    name: "SelectCardPage",
                    query: {
                        dataKey: 'AlreadyPayList',
                        funKey: "JFJL",
                        title: "缴费记录",
                        to: {
                            name: "AlreadyPayList",
                            query: {
                                funKey: "JFJL"
                            }
                        }
                    }
                }

            },
        },
        icon: require('@icon/homeicon_jiaofei@2x.png'),
        iconNor: require('@icon/homeicon_jiaofei_nor@2x.png'),
    },
    ZNDZ: {
        name: "智能导诊",
        to: {
            path: "/intelligentGuidance",
        },
        icon: require('@icon/homeicon_daozhen@2x.png'),
        iconNor: require('@icon/homeicon_daozhen_nor@2x.png'),
    },
    WDJZK: {
        name: '我的就诊卡',
        to: {
            path: '/myCardList',
            query: {
                funKey: 'WDJZK'
            }
        },
        icon: require('@icon/homeicon_mycard@2x.png'),
        iconNor: require('@icon/homeicon_mycard_nor@2x.png'),
    },
    HZCX: {
        name: "候诊查询",
        to: {
            name: "MemberList",
            query: {
                funKey: "HZCX",
                title: "候诊查询",
                hideBack: true,
                prompt: "您要查询谁的候诊信息？",
                to: {
                    name: "SelectCardPage",
                    query: {
                        dataKey: 'waitingDoctor',
                        funKey: "HZCX",
                        title: "候诊查询",
                        to: {
                            name: "WaitingDoctor",
                            query: {
                                funKey: 'HZCX'
                            }
                        }
                    }
                }

            },
        },
        icon: require('@icon/homeicon_houzhen@2x.png'),
        iconNor: require('@icon/homeicon_houzhen_nor@2x.png'),
    },
    YZRB: {
        name: '院长日报',
        to: {
            path: '/deanDaily',
            query: {
                funKey: 'YZRB'
            }
        },
        icon: require('@icon/homeicon_ribao@2x.png'),
        iconNor: require('@icon/homeicon_ribao_nor@2x.png'),
    },
    WDGH: {
        name: '我的挂号',
        icon: require('@icon/my/ic_mynumber@2x.png'),
        isactive: 0,
        to: {
            path: '/myRegister'
        }
    },
    WDGZ: {
        name: '我的关注',
        icon: require('@icon/my/ic_myfocus@2x.png'),
        isactive: 0,
        to: {
            path: '/myFocus'
        }
    },
    ZXJD: {
        name: '在线建档',
        icon: require('@icon/my/ic_myfocus@2x.png'),
        isactive: 0,
        to: {
            name: "MemberList",
            query: {
                funKey: "ZXJD",
                title: "在线建档",
                hideBack: true,
                prompt: "您要给谁在线建档？",
                to: {
                    path: "/buildRecord",
                    query: {
                        funKey: 'ZXJD'
                    }
                }
            }
        }
    },
    BDZYXX: {
        name: '绑定住院信息',
        isactive: 0,
        to: {
            name: "AddMemberCard",
            query: {
                funKey: "BDZYXX",
                title: "绑定住院信息",
                hideBack: true,
                to: -1
            }
        }
    },
    JZRGL: {
        name: '家庭成员',
        icon: require('@icon/my/ic_myfamily@2x.png'),
        isactive: 0,
        to: {
            path: "/memberList",
            query: {
                funKey: "GRZX",
                title: "就诊人管理",
                hideBack: true,
                prompt: "选中要编辑的就诊人",
                to: {
                    name: "EditMember",
                    query: {
                        funKey: "GRZX",
                        title: "编辑就诊人",
                    }
                }
            }
        }
    },
    GRZX: {
        name: '个人中心',
        to: {
            path: "/wxMy",
            query: {
                funKey: "GRZX",
                title: "个人中心",
            }
        }
    },
    HZZXWZ: {
        name: '在线问诊',
        to: {
            path: '/inquiryList'
        }
    },
    HZWDWZ: {
        name: '我的问诊',
        to: {
            path: '/myInquiry'
        }
    },
    HSJY: {
        name: '核酸检验',
        to: {
            name: "MemberList",
            query: {
                funKey: "HSJY",
                title: "核酸检验",
                hideBack: false,
                prompt: "您要为谁预约核酸检验？",
                to: {
                    name: "SelectCardPage",
                    query: {
                        dataKey: 'nucleicInscpet',
                        funKey: "HSJY",
                        title: "核酸检验",
                        to: {
                            name: "NucleicInscpetList",
                            query: {
                                funKey: "HSJY"
                            }
                        }
                    }
                }
            }
        }
    }
};








const loadindTexts = {
    request: "数据获取中",
    pageSwitch: "页面加载中"
};


//1:就诊卡 2:社保卡 3:健康卡 4:市民卡，5：住院号 6身份证
const cardTypes = {
    "1": {
        type: 1,
        name: "就诊卡",
        cardTypeName: '就诊卡',
        selected: true
    },
    "2": {
        type: 2,
        name: "社保卡",
        cardTypeName: '社保卡',
    },

    "3": {
        type: 3,
        name: "健康卡",
        cardTypeName: '健康卡',
    },

    "4": {
        type: 4,
        name: "市民卡",
        selected: true,
        cardTypeName: '市民卡',
    },

    "5": {
        type: 5,
        name: "住院号",
        cardTypeName: '住院号',
    },
    "6": {
        type: 6,
        name: "身份证",
        selected: true,
        cardTypeName: '身份证',
    },
    "7": {
        type: 7,
        name: "就诊卡",
        cardTypeName: '就诊卡',
        selected: true
    },
    "8": {
        type: 8,
        name: "住院号",
        cardTypeName: '住院号',
        selected: true
    }
};

const contactList = ['本人', '父亲', '母亲', '兄弟', '姐妹',
    '配偶', '儿子', '女儿', '亲属', '朋友', '其他'
];

const conSexList = ['请选择性别','男', '女'];

const idCardTypes = { 1: '中国大陆居民身份证', 2: '港澳居民通行证', 3: '台湾居民通行证', 4: '外国护照'}







const QR_Type = "qr";
const Bar_Type = "bar";

const qbrCode = {
    getKeyForId: function(qbrID) {
        return this.findKey(function(propValue, propkey, index) {

            switch (propkey) {
                case "getKeyForId":
                    {
                        return false;
                    }
                case "getPropValueForId":
                    {
                        return false;
                    }

                default:
                    {
                        return propValue == qbrID;
                    }
            }

        });
    },

    getPropValueForId: function(qbrID) {
        let key = this.getKeyForId(qbrID);
        return this[key];
    },


    QR: { // QR二维码
        type: QR_Type,
        id: 0,
    },
    EAN13: { //EAN一维条形码码标准版
        type: Bar_Type,
        id: 1,
    },


    EAN8: { //ENA一维条形码简版
        type: Bar_Type,
        id: 2,
    },


    AZTEC: { //Aztec二维码
        type: QR_Type,
        id: 3,
    },


    DATAMATRIX: { //Data Matrix二维码
        type: QR_Type,
        id: 4,
    },

    UPCA: { //UPC码标准版
        type: Bar_Type,
        id: 5,
    },


    UPCE: { //UPC码缩短版
        type: Bar_Type,
        id: 6,
    },



    CODABAR: { //Codabar码
        type: Bar_Type,
        id: 7,
    },


    CODE39: { //Code39一维条形码
        type: Bar_Type,
        id: 8,
    },



    CODE93: { //Code93码
        type: Bar_Type,
        id: 9,
    },



    CODE128: { //Code128码
        type: Bar_Type,
        id: 10,
    },


    ITF: { //ITF码
        type: Bar_Type,
        id: 11,
    },


    MAXICODE: { //MaxiCode二维码
        type: QR_Type,
        id: 12,
    },



    PDF417: { //PDF 417码
        type: Bar_Type,
        id: 13,
    },


    RSS14: { //RSS 14组合码
        type: Bar_Type,
        id: 14,
    },

    RSSEXPANDED: { //扩展式RSS组合码
        type: Bar_Type,
        id: 15,
    },

};


/**
 * 设置或者检查所有路由位置对象的属性名数组
 */
const locatPropsOfRouteData = ["to", "from", "back"];


/**
 * 设置特殊的路由位置
 * 目前用于：
 * - App 中在特殊位置时按设备的返回按钮会使App退出
 */
const specialLocats = [
    { name: "Home" }
];



//导航条样式
const navBarStyles = {
    backgroundColor: "#35495e", //导航栏背景色
    titleColor: "#FFFFFF", //标题颜色
    titleSize: "18px"
};



export { navBarStyles, locatPropsOfRouteData, specialLocats, baseURL, checkReport, weChatConf, osName, payMethodMap, funModules, personModules, loadindTexts, cardTypes,conSexList, contactList, idCardTypes, qbrCode, QR_Type, Bar_Type }
