import Client from "./Client";
import {osName} from  '@constant.js' ;

export default class Browser extends Client{
  static osName = osName.browser;

  requestType = "2";
}
