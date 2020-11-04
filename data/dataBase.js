
import config from '../config.js';

export default class DataBase {

  // 分类
  static getTypesData() {
    var basesData = wx.getStorageSync("shop_tag_basedata");
    var typelist = basesData.data.type_tag;
    var typesData = [];
    var typeArr = [0, 2, 4, 3, 7];
    var typeNameArr = ["流行趋势", "上衣", "裤子", "裙子", "套装"];
    for (var j = 0; j < typeArr.length; j++) {
      var event = typeArr[j];
      var type_data = {};
      var arr = [];
      for (var i = 0; i < typelist.length; i++) {
        var type = typelist[i].type;
        var class_type = typelist[i].class_type;

        if (event == type && class_type == 1) {
          var newpic = config.Upyun + typelist[i].pic;
          typelist[i]["newpic"] = newpic;

          arr.push(typelist[i]);
          type_data['typename'] = typeNameArr[j];
          type_data['types'] = arr;
        }
      }
      typesData.push(type_data);
    }
    return typesData;
  }

  // 品牌
  static getBrandsData() {
    var data = [];
    var basesData = wx.getStorageSync("shop_tag_basedata");
    var typelist = basesData.data.supp_label;
    for (var i = 0; i < typelist.length; i++) {
      var type = typelist[i].type;
      if (type == 1) {
        data.push(typelist[i]);
      }
    }
    console.log(data.sort(compare('sort')));
    data = data.sort(compare('sort'));
    return data;
  }
  
  // 热搜
  static gethotTitleData() {
    var hotTitle_Data = ["连衣裙款式", "上衣款式", "版型", "短袖", "两件套", "短裤", "长裙", "中长裙", "裤子版型", "超短裤", "裙子版型", "上衣组合形式"]
    return hotTitle_Data;
  }
}

//按sort从大到小排序
function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return  value2 - value1;
  }
}