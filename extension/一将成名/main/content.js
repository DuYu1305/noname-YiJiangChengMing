import { lib, get, game, ui } from "../../../noname.js";
import { EXTENSION_NAME } from "../utils/index.js";
import { choosechar } from "../extension/choosechar.js";
import { gameSettlement } from "../extension/gameSettlement.js";
//3.函数执行时机为游戏数据加载之后、界面加载之前
export function content(config, pack) {
	if (lib.config[`extension_${EXTENSION_NAME}_choosechar`]) {
		choosechar();
	}
	
	gameSettlement();
}
