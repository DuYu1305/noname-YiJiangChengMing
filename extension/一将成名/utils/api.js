import rankSystem from "./rankSystem.js";
import gameModeManager from "./GameModeManager.js";
import doudizhuStats from "./DoudizhuStats.js";
import scoreSystem from "./scoreSystem.js"

window._yjcm = {
	rankSystem,
	gameModeManager,
	doudizhuStats,
	scoreSystem
};
window._pushYjcmJsFn = pushYjcmJsFn;
window._yjcmJsFn = [
];
/**
 * 添加要执行的函数对象
 * 一将的结算index是100 比如你要在一将结算之前执行 请填写小于100的值，或者大于100就是一将结算后执行
 * @param {*} obj 要执行的函数对象
 * @param {*} obj.index 要执行的函数对象的顺序
 * @param {*} obj.fn 要执行的函数 调用时会把胜负结果传给函数
 */
export function pushYjcmJsFn(obj){
	window._yjcmJsFn.push(obj);
}
export async function executeYjcmJsFn(bool){
	window._yjcmJsFn.sort((a, b) => a.index - b.index);
	for(let i = 0; i < window._yjcmJsFn.length; i++){
		await window._yjcmJsFn[i].fn(bool);
	}
	window._yjcmJsFn = []
	console.log("一将的结算已执行");
	return
}
