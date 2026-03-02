/**
 * 多模式天梯计分系统
 * 支持身份天梯、军五天梯和国战天梯
 * 每月月初重置积分，包含连胜加分和赛季继承机制
 */
class ScoreSystem {
	constructor() {
		// 初始化模式配置
		this.modeConfigs = {
			身份天梯: {
				内奸: { win: 90, lose: -20 },
				主公: { win: 50, lose: -50 },
				忠臣: { win: 50, lose: -50 },
				反贼: { win: 40, lose: -40 },
			},
			军五天梯: {
				内奸: { win: 90, lose: -20 },
				主公: { win: 50, lose: -50 },
				忠臣: { win: 50, lose: -50 },
				反贼: { win: 40, lose: -40 },
			},
			国战天梯: {
				通用: { win: 50, lose: -50 },
			},
		};

		// 赛季初始积分
		this.initialScore = 1200;

		// 初始化玩家数据
		this.initPlayerData();
	}

	/**
	 * 初始化玩家数据，从localStorage读取或创建新数据
	 */
	initPlayerData() {
		const savedData = localStorage.getItem("scoreSystemData");

		if (savedData) {
			this.playerData = JSON.parse(savedData);
			// 检查是否需要赛季重置
			this.checkSeasonReset();
		} else {
			// 默认初始数据
			this.playerData = {
				// 各模式数据
				modes: {
					身份天梯: {
						score: this.initialScore, // 初始积分1200
						winStreak: 0, // 当前连胜次数
						bestStreak: 0, // 最佳连胜记录
						previousSeasonScore: this.initialScore, // 上赛季积分
					},
					军五天梯: {
						score: this.initialScore,
						winStreak: 0,
						bestStreak: 0,
						previousSeasonScore: this.initialScore,
					},
					国战天梯: {
						score: this.initialScore,
						winStreak: 0,
						bestStreak: 0,
						previousSeasonScore: this.initialScore,
					},
				},
				seasonStart: this.getFirstDayOfMonth(), // 赛季开始日期
			};
			this.saveData();
		}
	}

	/**
	 * 检查是否需要进行赛季重置（每月初一重置）
	 */
	checkSeasonReset() {
		const currentFirstDay = this.getFirstDayOfMonth();

		// 如果当前月份与赛季开始月份不同，进行赛季重置
		if (this.playerData.seasonStart !== currentFirstDay) {
			this.resetSeason();
		}
	}

	/**
	 * 获取当月第一天的日期字符串（格式：YYYY-MM-DD）
	 */
	getFirstDayOfMonth() {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
	}

	/**
	 * 赛季重置处理，应用积分继承系统
	 */
	resetSeason() {
		// 对每个模式应用赛季继承规则
		Object.keys(this.playerData.modes).forEach(mode => {
			const modeData = this.playerData.modes[mode];

			// 保存上赛季积分
			const previousScore = modeData.score;

			// 应用继承规则计算新赛季积分
			let newScore;
			if (previousScore >= 2000) {
				// 2000分以上统一掉到1600分
				newScore = 1600;
			} else {
				// 其他情况：老赛季积分-400，但不低于1200
				newScore = Math.max(this.initialScore, previousScore - 400);
			}

			// 更新模式数据
			this.playerData.modes[mode] = {
				score: newScore, // 新赛季积分
				winStreak: 0, // 重置连胜
				bestStreak: 0, // 重置最佳连胜
				previousSeasonScore: previousScore, // 记录上赛季积分
			};
		});

		// 更新赛季开始日期
		this.playerData.seasonStart = this.getFirstDayOfMonth();
		this.saveData();
		console.log("赛季已重置，应用积分继承规则");
	}

	/**
	 * 保存数据到localStorage
	 */
	saveData() {
		localStorage.setItem("scoreSystemData", JSON.stringify(this.playerData));
	}

	/**
	 * 计算连胜额外加分
	 * 连胜越多加成越多，但最多不超过50
	 */
	calculateWinStreakBonus(winStreak) {
		if (winStreak < 3) {
			return 0; // 小于3连胜：+0
		} else if (winStreak >= 3 && winStreak < 6) {
			return 20; // 3-6连胜：+20
		} else {
			return 30; // 6连胜：+30
		}
	}

	/**
	 * 处理游戏结果并更新积分
	 * @param {string} mode - 游戏模式：身份天梯、军五天梯、国战天梯
	 * @param {boolean} isWin - 是否胜利
	 * @param {string} role - 身份角色（国战可以为null）
	 * @returns {object} 包含详细积分变化的对象
	 */
	handleGameResult(mode, isWin, role = null) {
		// 验证模式是否有效
		if (!this.modeConfigs[mode]) {
			throw new Error(`无效的游戏模式: ${mode}`);
		}

		// 保存处理前的状态
		const previousState = {
			score: this.playerData.modes[mode].score,
			winStreak: this.playerData.modes[mode].winStreak,
		};

		// 获取基础分
		let baseScore;
		if (mode === "国战天梯") {
			baseScore = isWin ? this.modeConfigs[mode].通用.win : this.modeConfigs[mode].通用.lose;
		} else {
			// 验证角色是否有效
			if (!this.modeConfigs[mode][role]) {
				throw new Error(`在${mode}中无效的角色: ${role}`);
			}
			baseScore = isWin ? this.modeConfigs[mode][role].win : this.modeConfigs[mode][role].lose;
		}

		// 处理连胜
		let streakBonus = 0;
		if (isWin) {
			// 胜利则增加连胜
			this.playerData.modes[mode].winStreak += 1;
			// 计算连胜加成（基于当前已增加的连胜次数）
			streakBonus = this.calculateWinStreakBonus(this.playerData.modes[mode].winStreak);

			// 更新最佳连胜记录
			if (this.playerData.modes[mode].winStreak > this.playerData.modes[mode].bestStreak) {
				this.playerData.modes[mode].bestStreak = this.playerData.modes[mode].winStreak;
			}
		} else {
			// 失败则重置连胜
			this.playerData.modes[mode].winStreak = 0;
		}

		// 计算总得分变化
		const totalScoreChange = baseScore + streakBonus;

		// 更新积分（确保积分不会低于0）
		this.playerData.modes[mode].score = Math.max(0, this.playerData.modes[mode].score + totalScoreChange);

		// 保存数据
		this.saveData();

		// 返回详细的变化信息，清晰展示加分情况
		return {
			模式: mode,
			结果: isWin ? "胜利" : "失败",
			身份: role || "通用",
			基础分: baseScore,
			连胜次数: this.playerData.modes[mode].winStreak,
			连胜加分: streakBonus,
			总得分变化: totalScoreChange,
			变化详情: `${isWin ? "+" : ""}${baseScore}（基础分） ${streakBonus > 0 ? "+" : ""}${streakBonus}（连胜加分） = ${totalScoreChange > 0 ? "+" : ""}${totalScoreChange}`,
			赛前积分: previousState.score,
			赛后积分: this.playerData.modes[mode].score,
			当前最佳连胜: this.playerData.modes[mode].bestStreak,
		};
	}

	/**
	 * 获取指定模式的当前数据
	 * @param {string} mode - 游戏模式
	 * @returns {object} 包含当前积分、连胜等信息的对象
	 */
	getModeData(mode) {
		if (!this.modeConfigs[mode]) {
			throw new Error(`无效的游戏模式: ${mode}`);
		}

		return {
			模式: mode,
			当前积分: this.playerData.modes[mode].score,
			当前连胜: this.playerData.modes[mode].winStreak,
			最佳连胜: this.playerData.modes[mode].bestStreak,
			上赛季积分: this.playerData.modes[mode].previousSeasonScore,
			当前赛季开始日期: this.playerData.seasonStart,
		};
	}

	/**
	 * 获取所有模式的当前数据概览
	 * @returns {object} 包含所有模式数据的对象
	 */
	getAllModeData() {
		const result = {};
		Object.keys(this.modeConfigs).forEach(mode => {
			result[mode] = this.getModeData(mode);
		});
		return result;
	}

	/**
	 * 手动重置所有数据（用于测试）
	 */
	resetAllData() {
		if (confirm("确定要重置所有计分数据吗？")) {
			localStorage.removeItem("scoreSystemData");
			this.initPlayerData();
			return true;
		}
		return false;
	}
}

// 使用示例
const scoreSystem = new ScoreSystem();
export default scoreSystem;
//
// // 身份天梯-内奸胜利
// const result1 = scoreSystem.handleGameResult('身份天梯', true, '内奸');
// console.log('身份天梯-内奸胜利详情:', result1);
// // 输出结果中可以清晰看到:
// // - 基础分是多少
// // - 连胜加了多少分
// // - 总分变化情况
//
// // 再赢一场，测试连胜加分
// const result2 = scoreSystem.handleGameResult('身份天梯', true, '内奸');
// console.log('身份天梯-内奸再次胜利:', result2);
//
// // 军五天梯-反贼失败
// const result3 = scoreSystem.handleGameResult('军五天梯', false, '反贼');
// console.log('军五天梯-反贼失败详情:', result3);
//
// // 国战天梯-胜利
// const result4 = scoreSystem.handleGameResult('国战天梯', true);
// console.log('国战天梯-胜利详情:', result4);
//
// // 获取身份天梯数据
// console.log('身份天梯当前数据:', scoreSystem.getModeData('身份天梯'));
//
