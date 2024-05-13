/**
 * 判断两个值是否相同（浅比较）
 */
export function sameValue(val1, val2) {
  const type1 = Object.prototype.toString.call(val1);
  const type2 = Object.prototype.toString.call(val2);

  // 数据类型不相同，值肯定不相同
  if (type1 !== type2) return false;

  // 非对象直接判断相等性
  if (type1 !== '[object Object]') return val1 === val2;

  // 比较属性
  const keys1 = Object.keys(val1);
  const keys2 = Object.keys(val2);
  // 属性个数不同
  if (keys1.length !== keys2.length) return false;
  // 属性值判断
  for (let i = 0; i < keys1.length; i++) {
    if (val1[keys1[i]] !== val2[keys1[i]]) return false;
  }
  return true;
}
