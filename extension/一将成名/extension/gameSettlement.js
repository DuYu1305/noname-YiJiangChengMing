import { lib, get, game } from "../../../noname.js";
import doudizhuStats from "../utils/DoudizhuStats.js";
import { isTargetMode, EXTENSION_NAME } from "../utils/index.js";

import gameModeManager, { GameModeType } from "../utils/GameModeManager.js";
import scoreSystem from "../utils/scoreSystem.js";
import rankSystem from "../utils/rankSystem.js";
import { createRankAn } from "../utils/rankAn.js";
import { pushYjcmJsFn, executeYjcmJsFn } from "../utils/api.js";
export function gameSettlement() {
	let shenfenMap = {
		nei: "内奸",
		zhong: "忠臣",
		fan: "反贼",
		zhu: "主公",
	};

	lib.onover.push(async function (bool) {
		if (lib.config[`extension_${EXTENSION_NAME}_addBackHomeBtn`]) {
			ui.create.control("返回主页", function () {
				window.location.reload();
			});
		}

		console.log("game", game.me, game.me.identity, game.me.identityShown);
		let currentMode = gameModeManager.getCurrentMode();
		let currentModeType = null;
		let currentModeId = null;
		if (currentMode) {
			currentModeType = currentMode.modeType;
			currentModeId = currentMode.modeId;
		}
		if (isTargetMode("doudizhu", "huanle")) {
			// 如果 bool 为 true 那么 游戏胜利 如果 bool 为 false 那么 游戏失败 如果都不是 那么 游戏平局
			if (bool === true) {
				doudizhuStats.recordGame(true);
			} else if (bool === false) {
				doudizhuStats.recordGame(false);
			}
		} else if (isTargetMode("versus", "two") && currentModeType === GameModeType.RANKED && currentModeId == "versus") {
			// if (ui.dialog && lib.config[`extension_${EXTENSION_NAME}_closeDialog`]) {
			// 	ui.dialog.classList.add("dialog-hide");
			// }
			if (lib.config[`extension_${EXTENSION_NAME}_paweijiesuanAn`]) {
				// setTimeout(async()=>{
				pushYjcmJsFn({
					index: 100,
					fn: createRankAn,
				});
				// },2600)
			} else {
				if (bool) {
					rankSystem.handleGameResult(bool);
				} else if (bool === false) {
					rankSystem.handleGameResult(bool);
				}
			}
		} else if (isTargetMode("identity", "normal") && currentModeType === GameModeType.RANKED && currentModeId == "identity") {
			let playerNumber = lib.config.mode_config.identity.player_number;
			if (playerNumber === 8) {
				console.log("排位军八");
				let res;
				if (bool === true) {
					res = scoreSystem.handleGameResult("身份天梯", true, shenfenMap[game.me.identity]);
				} else if (bool === false) {
					res = scoreSystem.handleGameResult("身份天梯", false, shenfenMap[game.me.identity]);
				}
				console.log("军八res", res);
			}
			//排位军八
		} else if (isTargetMode("identity", "normal") && currentModeType === GameModeType.RANKED && currentModeId == "identity5") {
			let playerNumber = lib.config.mode_config.identity.player_number;
			if (playerNumber == 5) {
				let res;
				if (bool === true) {
					res = scoreSystem.handleGameResult("军五天梯", true, shenfenMap[game.me.identity]);
				} else if (bool === false) {
					res = scoreSystem.handleGameResult("军五天梯", false, shenfenMap[game.me.identity]);
				}
				console.log("军五res", res);
			}
		} else if (isTargetMode("guozhan", "normal") && currentModeType === GameModeType.RANKED && currentModeId == "guozhan") {
			let res;
			if (bool === true) {
				res = scoreSystem.handleGameResult("国战天梯", true);
			} else if (bool === false) {
				res = scoreSystem.handleGameResult("国战天梯", false);
			}
			console.log("国战res", res);
		}
		await executeYjcmJsFn(bool);
		//清空模式信息 再来一局 不需要清楚
		// gameModeManager.clearCurrentMode();
	});

	window._testpw = async bool => {
		pushYjcmJsFn({
			index: 100,
			fn: createRankAn,
		});
		await executeYjcmJsFn(bool);
	};
}
