import { EXTENSION_NAME, cssPath } from "../utils/index.js";
import { lib, get, game } from "../../../noname.js";
//4.函数执行时机为游戏界面创建之后
export function arenaReady() {
	if (lib.config[`extension_${EXTENSION_NAME}_choosechar`]) {
		lib.init.css(cssPath + "xuanjiang", "style");
	}
}
