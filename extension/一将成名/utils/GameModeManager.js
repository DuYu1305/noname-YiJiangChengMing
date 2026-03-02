//by倘若
// 游戏模式类型定义
export const GameModeType = {
	CASUAL: "casual", // 休闲模式
	RANKED: "ranked", // 排位模式
};

// 具体模式定义
const GameModes = {
	[GameModeType.CASUAL]: [
		{ id: "versus", name: "休闲22" },
		{ id: "guozhan", name: "休闲国战" },
		{ id: "identity", name: "休闲军八" },
	],
	[GameModeType.RANKED]: [
		{ id: "versus", name: "排位22" },
		{ id: "guozhan", name: "国战模式" },
		{ id: "identity", name: "军八模式" },
		{ id: "identity5", name: "军五模式" },
	],
};

// 游戏模式管理类 - 处理模式选择和页面间传递
export class GameModeManager {
	// 存储当前选择的游戏模式到localStorage，供跳转后页面使用
	setCurrentMode(modeType, modeId) {
		// 验证模式有效性
		if (!Object.values(GameModeType).includes(modeType)) {
			throw new Error("无效的模式类型");
		}

		const modeExists = GameModes[modeType].some(mode => mode.id === modeId);
		if (!modeExists) {
			throw new Error("无效的模式ID");
		}

		// 存储当前模式信息
		const modeInfo = {
			modeType,
			modeId,
			modeName: this.getModeName(modeType, modeId),
			enteredTime: new Date().toISOString(),
		};

		localStorage.setItem("currentGameMode", JSON.stringify(modeInfo));
		return modeInfo;
	}

	// 获取当前游戏模式信息（从localStorage读取）
	getCurrentMode() {
		const modeStr = localStorage.getItem("currentGameMode");
		return modeStr ? JSON.parse(modeStr) : null;
	}

	// 清除当前游戏模式信息
	clearCurrentMode() {
		localStorage.removeItem("currentGameMode");
	}

	// 获取模式名称
	getModeName(modeType, modeId) {
		const mode = GameModes[modeType]?.find(m => m.id === modeId);
		return mode ? mode.name : null;
	}

	// 获取所有模式列表
	getAllModes() {
		return { ...GameModes };
	}
}
let gameModeManager = new GameModeManager();
export default gameModeManager;
// // 实例化管理器
// const gameModeManager = new GameModeManager();
// // 存储选择的模式
// gameModeManager.setCurrentMode(GameModeType.CASUAL, "versus");

// // 游戏加载时获取当前模式
// const currentMode = gameModeManager.getCurrentMode();
// if (currentMode) {
// 	console.log(`当前模式: ${currentMode.modeName}`);
// 	// 可以根据模式类型初始化不同的游戏规则
// } 
