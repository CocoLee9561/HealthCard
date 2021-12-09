// 路由：开始

import {reportMessageChildRoutes,reportMessageStoreConfigs} from "./report-message/config";
import {outpatientMessageChildRoutes,outpatientMessageStoreConfigs} from "./outpatient-message/config";

export let messageChildRoutes = [
  ...reportMessageChildRoutes,
  ...outpatientMessageChildRoutes
];

// 路由：结束





// store：开始

export let messageStoreConfigs = [
  ...reportMessageStoreConfigs,
  ...outpatientMessageStoreConfigs
]
// store：结束
