import App from './App'
import {osName} from  '@constant.js' ;

export default class Android extends App{
  static osName = osName.android;

  requestType = "2";

}
