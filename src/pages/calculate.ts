export const calculate = (
  arr: string[][], // 我的核心
  _obj: Record<string, number>, // 技能数记录对象
  level: number, // 当前递归层级
  startIndex: number, // 当前循环开始索引
  nodeNum: number, // 需要的核心数
  firstSkillArr: (string | null)[], // 核心第一技能记录数组
  assistNode: string | null // 次要核心
): false | number[] => {
  let result: number[] = [];
  for (let i = startIndex; i < arr.length; i++) {
    const obj = { ..._obj };
    let flag = false;
    // 先清除当前记录的可能存在的缓存
    firstSkillArr[level - 1] = null;
    if (firstSkillArr.includes(arr[i][0])) {
      continue;
    }
    firstSkillArr[level - 1] = arr[i][0];
    arr[i].forEach((item) => {
      if (!obj[item]) {
        obj[item] = 1;
      } else {
        obj[item] += 1;
        if ((assistNode && obj[assistNode] > 1) || obj[item] > 2) {
          flag = true;
        }
      }
    });
    // 不符合要求直接跳过
    if (flag) {
      continue;
    }
    // 最后一层时判断是否满足条件
    if (
      level === nodeNum &&
      Object.keys(obj).every(
        (key) => (key === assistNode && obj[key] === 1) || obj[key] === 2
      )
    ) {
      result.push(i);
      break;
    } else if (level < nodeNum) {
      const r = calculate(
        arr,
        obj,
        level + 1,
        i + 1,
        nodeNum,
        firstSkillArr,
        assistNode
      );
      if (!r) continue;
      result.unshift(i);
      result = result.concat(r);
      break;
    }
  }
  if (result.length) {
    return result;
  }
  return false;
};
