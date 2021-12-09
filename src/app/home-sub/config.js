// 路由：开始

import { bookingRoutesConfigs, bookingStoreConfigs } from './booking/config'
import { departmentListStoreConfigs } from './department/config'
import { hospitalRoutesConfigs, hospitalStoreConfigs } from './hospital/config'
import { outpatientChildRoutes, outpatientStoreConfigs } from './outpatient/config'
import { hospitalizationChildRoutes, hospitalizationStoreConfigs } from './hospitalization/config'
import { reportChildRoutes, reportStoreConfigs } from './report/config'
import { waitingChildRoutes, waitingStoreConfigs } from "./waiting/config";
import { reviewChildRoutes, reviewStoreConfigs } from "./review/config";

import { queryReportChildRoutes, queryReportStoreConfigs } from "./query-report/config";
import { introChildRoutes, introStoreConfigs } from "./intro/config";
import { payTestChildRoutes, payTestStoreConfigs } from "./test/config";

import DepartmentList from './department/DepartmentList'

import Navigation from './navigation/Navigation'
import { navigationStoreConfigs } from './navigation/config'

import { guidanceChildRoutes, guidanceStoreConfigs } from "./guidance/config";
import { myCardChildRoutes, myCardStoreConfigs } from "./my-card/config";
import { deanDailyChildRoutes, deanDailyStoreConfigs } from "./dean-daily/config";
import { buffetBusinessChildRoutes, buffetBusinessStoreConfigs } from "./buffet-business/config";
import { inquiryRoutesConfigs, inquiryStoreConfigs } from "./online-inquiry/config"

import { nucleicInscpetRoutesConfigs, nucleicInscpetStoreConfigs } from "./nucleic-inscpet/config"

export let homeSubChildRoutes = [{
        path: '/departmentList',
        name: 'DepartmentList',
        meta: {
            title: "选择科室",
            isShow: true
        },
        component: DepartmentList
    },
    {
        path: '/Navigation',
        name: 'Navigation',
        component: Navigation
    },
    ...hospitalRoutesConfigs,
    ...bookingRoutesConfigs,
    ...outpatientChildRoutes,
    ...hospitalizationChildRoutes,
    ...reportChildRoutes,
    ...waitingChildRoutes,
    ...reviewChildRoutes,
    ...queryReportChildRoutes,
    ...introChildRoutes,
    ...payTestChildRoutes,
    ...guidanceChildRoutes,
    ...myCardChildRoutes,
    ...deanDailyChildRoutes,
    ...buffetBusinessChildRoutes,
    ...inquiryRoutesConfigs,
    ...nucleicInscpetRoutesConfigs
];

// 路由：结束





// store：开始

export let homeSubStoreConfigs = [{
            state: {
                changePatient: 0,
            },
            mutations: {
                updateChangePatient(state, params) {
                    state.changePatient = params
                }
            }
        },
        ...bookingStoreConfigs,
        ...departmentListStoreConfigs,
        ...hospitalStoreConfigs,
        ...outpatientStoreConfigs,
        ...hospitalizationStoreConfigs,
        ...reportStoreConfigs,
        ...waitingStoreConfigs,
        ...reviewStoreConfigs,
        ...navigationStoreConfigs,
        ...queryReportStoreConfigs,
        ...introStoreConfigs,
        ...payTestStoreConfigs,
        ...guidanceStoreConfigs,
        ...myCardStoreConfigs,
        ...deanDailyStoreConfigs,
        ...buffetBusinessStoreConfigs,
        ...inquiryStoreConfigs,
        ...nucleicInscpetStoreConfigs
    ]
    // store：结束