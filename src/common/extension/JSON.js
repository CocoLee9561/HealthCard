/**
 * 安全地解析字符串，不会抛出错误，返回一个解析结果的信息对象
 * @param text : string   必需， 一个有效的 JSON 字符串。
 * @param reviver : function   可选，一个转换结果的函数， 将为对象的每个成员调用此函数。
 * @returns {parsed: boolean, result: string | JSONObject }   解析的结果； parsed ：表示是否成功解析； result ： 最终解析的结果，如果成功解析，则该值为解析后的JSON对象，如果未成功解析，则该值为原字符串 text
 */
JSON.safelyParse = function (text, reviver) {
  let parseInfo = {
    parsed:true,
    result:text
  } ;

  try {
    parseInfo.result = JSON.parse(text,reviver);
  }catch (e) {
    parseInfo.parsed = false ;
  }

  return parseInfo ;
}
