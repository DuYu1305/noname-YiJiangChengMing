/**by倘若
 * 2V2排位系统类
 * 管理玩家的段位、星星、士气和连胜等数据，处理游戏结果并提供数据变化详情
 */
class RankSystem {
	/**
	 * 初始化排位系统
	 * 设置段位配置、段位顺序，并初始化玩家数据
	 */
	constructor() {
		// 段位配置：每个大段位所需的星星数量及是否允许掉星
		this.rankConfig = {
			卫士: { starCount: 3, canLoseStar: false }, // 卫士需要3颗星升级，失败不掉星
			校尉: { starCount: 4, canLoseStar: false }, // 校尉需要4颗星升级，失败不掉星
			中郎将: { starCount: 5, canLoseStar: true }, // 中郎需要5颗星升级，失败会掉星
			领军: { starCount: 6, canLoseStar: true }, // 领军需要6颗星升级，失败会掉星
			大将: { starCount: 7, canLoseStar: true }, // 大将需要7颗星升级，失败会掉星
			枭雄: { starCount: Infinity, canLoseStar: true }, // 枭雄星星无上限，失败会掉星
		};

		// 段位从低到高的顺序
		this.rankOrder = ["卫士", "校尉", "中郎将", "领军", "大将", "枭雄"];

		// 初始化玩家数据（从localStorage读取或创建新数据）
		this.initPlayerData();
	}

	/**
	 * 初始化玩家数据
	 * 从localStorage读取保存的数据，如果没有则创建默认数据
	 */
	initPlayerData() {
		const savedData = localStorage.getItem("rankSystemData");

		if (savedData) {
			// 读取已保存的数据
			this.playerData = JSON.parse(savedData);

			// 确保数据兼容性：如果没有连胜数据则添加
			if (this.playerData.winStreak === undefined) {
				this.playerData.winStreak = 0;
			}

			// 检查是否需要进行赛季重置（每月初一重置）
			this.checkSeasonReset();
		} else {
			// 创建默认初始数据
			this.playerData = {
				rank: "卫士", // 当前大段位（初始为最低段位）
				subRank: 5, // 当前小段位（5为最低，1为最高）
				stars: 0, // 当前星星数量
				morale: 0, // 当前士气值
				lastDailyWin: null, // 最后一次每日首胜的日期
				seasonStart: this.getFirstDayOfMonth(), // 当前赛季开始日期
				winStreak: 0, // 当前连胜次数
			};
			this.saveData(); // 保存初始数据
		}
	}

	/**
	 * 检查是否需要进行赛季重置
	 * 每个月的第一天会触发赛季重置
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
	 * @returns {string} 当月第一天的日期
	 */
	getFirstDayOfMonth() {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
	}

	/**
	 * 赛季重置处理
	 * 段位降级两个大段位，小段位变为5，重置星星、士气和连胜
	 */
	resetSeason() {
		// 计算新段位（降级两个大段位）
		const currentRankIndex = this.rankOrder.indexOf(this.playerData.rank);
		let newRankIndex = currentRankIndex - 2;

		// 确保不会低于最低段位
		if (newRankIndex < 0) newRankIndex = 0;

		// 获取新段位所需星星数量
		const newRankStarCount = this.rankConfig[this.rankOrder[newRankIndex]].starCount;

		// 重置赛季数据
		this.playerData = {
			rank: this.rankOrder[newRankIndex], // 新段位
			subRank: 5, // 小段位从5开始
			stars: 0, // 星星清零
			morale: 0, // 士气清零
			lastDailyWin: null, // 每日首胜记录清零
			seasonStart: this.getFirstDayOfMonth(), // 更新赛季开始日期
			winStreak: 0, // 连胜清零
		};

		this.saveData();
		console.log("赛季已重置，段位已调整");
	}

	/**
	 * 保存玩家数据到localStorage
	 * 确保刷新页面后数据不会丢失
	 */
	saveData() {
		localStorage.setItem("rankSystemData", JSON.stringify(this.playerData));
	}

	/**
	 * 处理游戏结果并返回数据变化详情
	 * @param {boolean} isWin - 是否胜利
	 * @param {boolean} useStarCard - 是否使用加星卡（默认不使用）
	 * @returns {object} 包含详细变化信息的对象
	 */
	handleGameResult(isWin, useStarCard = false) {
		// 保存操作前的状态，用于后续计算变化
		const previousState = {
			rank: this.playerData.rank,
			subRank: this.playerData.subRank,
			stars: this.playerData.stars,
			morale: this.playerData.morale,
			winStreak: this.playerData.winStreak,
		};

		// 根据胜负情况处理，并获取士气加分详情
		let moraleDetails;
		if (isWin) {
			moraleDetails = this.handleWin(useStarCard); // 处理胜利逻辑，获取士气加分详情
		} else {
			moraleDetails = this.handleLoss(); // 处理失败逻辑，获取士气加分详情
		}

		// 记录士气兑换前的状态，用于计算变化
		const moraleBeforeExchange = this.playerData.morale;
		const starsBeforeExchange = this.playerData.stars;

		// 检查士气是否足够兑换星星
		this.checkMoraleExchange();

		// 计算并返回数据变化详情，包含士气加分来源
		const changes = this.calculateChanges(previousState, isWin, useStarCard, moraleBeforeExchange, starsBeforeExchange, moraleDetails);

		// 保存更新后的数据
		this.saveData();

		return changes;
	}

	/**
	 * 计算游戏前后的数据变化详情
	 * @param {object} previous - 游戏前的状态
	 * @param {boolean} isWin - 是否胜利
	 * @param {boolean} useStarCard - 是否使用加星卡
	 * @param {number} moraleBeforeExchange - 士气兑换前的士气值
	 * @param {number} starsBeforeExchange - 士气兑换前的星星数
	 * @param {object} moraleDetails - 士气加分的具体来源信息
	 * @returns {object} 详细的变化信息
	 */
	calculateChanges(previous, isWin, useStarCard, moraleBeforeExchange, starsBeforeExchange, moraleDetails) {
		// 计算大段位变化
		const rankChanged = previous.rank !== this.playerData.rank;
		const rankIncreased = rankChanged && this.rankOrder.indexOf(this.playerData.rank) > this.rankOrder.indexOf(previous.rank);
		const rankDecreased = rankChanged && !rankIncreased;

		// 计算小段位变化（注意：小段位数字越小等级越高）
		const subRankChanged = previous.subRank !== this.playerData.subRank;
		const subRankIncreased = subRankChanged && this.playerData.subRank < previous.subRank;
		const subRankDecreased = subRankChanged && !subRankIncreased;

		// 计算星星总变化量
		const totalStarsChange = this.playerData.stars - previous.stars;

		// 计算士气变化（区分游戏获得和兑换消耗）
		const moraleChangeFromGame = moraleBeforeExchange - previous.morale; // 游戏直接获得的士气
		const moraleUsedInExchange = moraleBeforeExchange - this.playerData.morale; // 兑换星星消耗的士气
		const totalMoraleChange = this.playerData.morale - previous.morale; // 士气总变化

		// 计算连胜变化
		const winStreakChange = this.playerData.winStreak - previous.winStreak;

		// 整理星星来源（游戏直接获得和士气兑换）
		let starsFromGame = 0;
		if (isWin) {
			// 胜利时获得的星星（基础1颗 + 加星卡1颗）
			starsFromGame = useStarCard ? 2 : 1;
		} else {
			// 失败时失去的星星
			starsFromGame = previous.stars > this.playerData.stars ? -1 : 0;
		}
		const starsFromMoraleExchange = totalStarsChange - starsFromGame;

		// 返回详细的变化信息
		return {
			// 基础信息
			isWin, // 是否胜利
			useStarCard, // 是否使用加星卡

			// 大段位变化详情
			rank: {
				previous: previous.rank, // 之前的大段位
				current: this.playerData.rank, // 当前的大段位
				changed: rankChanged, // 大段位是否有变化
				increased: rankIncreased, // 大段位是否提升
				decreased: rankDecreased, // 大段位是否降低
			},

			// 小段位变化详情
			subRank: {
				previous: previous.subRank, // 之前的小段位
				current: this.playerData.subRank, // 当前的小段位
				changed: subRankChanged, // 小段位是否有变化
				increased: subRankIncreased, // 小段位是否提升
				decreased: subRankDecreased, // 小段位是否降低
			},

			// 星星变化详情
			stars: {
				previous: previous.stars, // 之前的星星数
				current: this.playerData.stars, // 当前的星星数
				change: totalStarsChange, // 星星总变化量
				fromGame: starsFromGame, // 来自游戏结果的星星
				fromMoraleExchange: starsFromMoraleExchange, // 来自士气兑换的星星
			},

			// 士气变化详情
			morale: {
				previous: previous.morale, // 之前的士气值
				current: this.playerData.morale, // 当前的士气值
				change: totalMoraleChange, // 士气总变化量
				fromGame: moraleChangeFromGame, // 来自游戏结果的士气
				usedInExchange: moraleUsedInExchange, // 兑换星星消耗的士气
				// 士气加分的具体来源
				details: moraleDetails
			},

			// 连胜变化详情
			winStreak: {
				previous: previous.winStreak, // 之前的连胜次数
				current: this.playerData.winStreak, // 当前的连胜次数
				change: winStreakChange, // 连胜变化量
			},
		};
	}

	/**
	 * 计算连胜额外士气加成
	 * 连胜次数越多，加成越高，最多不超过50点
	 * @returns {number} 连胜额外士气值
	 */
	calculateWinStreakBonus() {
		if (this.playerData.winStreak <= 1) {
			return 5 * this.playerData.winStreak; // 1连胜：+5士气
		} else if (this.playerData.winStreak === 2) {
			return 10; // 2连胜：+10士气
		} else if (this.playerData.winStreak === 3) {
			return 15; // 3连胜：+15士气
		} else if (this.playerData.winStreak > 3 && this.playerData.winStreak <= 6) {
			return 25; // 4连胜及以上：+25士气
		}else{
			return 40; // 7连胜及以上：+40士气（上限）
		}
	}

	/**
	 * 处理胜利逻辑
	 * 增加星星、士气，更新连胜次数，检查段位升级
	 * @param {boolean} useStarCard - 是否使用加星卡
	 * @returns {object} 士气加分的具体来源信息
	 */
	handleWin(useStarCard) {
		// 增加连胜次数
		this.playerData.winStreak += 1;

		// 胜利获得星星（基础1颗 + 加星卡1颗）
		let starsToAdd = 1;
		if (useStarCard) starsToAdd += 1;
		this.playerData.stars += starsToAdd;

		// 检查是否需要升级段位
		this.checkPromotion();

		// 计算胜利获得的士气
		const moraleDetails = {
			base: 15, // 基础士气值
			streakBonus: 0,
			dailyWinBonus: 0
		};

		// 添加连胜额外士气
		moraleDetails.streakBonus = this.calculateWinStreakBonus();

		// 检查是否是每日首胜（额外+30士气）
		const today = new Date().toISOString().split("T")[0];
		if (this.playerData.lastDailyWin !== today) {
			moraleDetails.dailyWinBonus = 30;
			this.playerData.lastDailyWin = today; // 更新每日首胜记录
		}

		// 计算总士气增加量
		const totalMoraleToAdd = moraleDetails.base + moraleDetails.streakBonus + moraleDetails.dailyWinBonus;

		// 添加士气值
		this.playerData.morale += totalMoraleToAdd;

		// 返回士气加分的具体来源信息
		return moraleDetails;
	}

	/**
	 * 处理失败逻辑
	 * 可能减少星星或降低段位，重置连胜，少量增加士气
	 * @returns {object} 士气加分的具体来源信息
	 */
	handleLoss() {
		// 失败重置连胜次数
		this.playerData.winStreak = 0;

		const currentRankConfig = this.rankConfig[this.playerData.rank];

		// 检查当前段位是否允许掉星
		if (currentRankConfig.canLoseStar) {
			// 特殊处理：枭雄0星失败会降级到大将1段4星
			if (this.playerData.rank === "枭雄" && this.playerData.stars === 0) {
				this.playerData.rank = "大将";
				this.playerData.subRank = 1;
				this.playerData.stars = this.rankConfig[this.playerData.rank].starCount - 1; // 大将1段需要5颗星，所以降级后为4颗
			}
			// 有星星（>=1）则只减星星到0星，不降级
			else if (this.playerData.stars > 0) {
				this.playerData.stars -= 1;
			}
			// 只有当星星本来就是0且不是枭雄时，才会触发降级
			else if (this.playerData.stars === 0 && this.playerData.rank !== "枭雄") {
				this.checkDemotion();
			}
		}

		// 失败也获得少量士气（5点）
		this.playerData.morale += 5;

		// 返回失败时的士气加分信息
		return {
			base: 5, // 失败时的基础士气值
			streakBonus: 0,
			dailyWinBonus: 0
		};
	}

	/**
	 * 检查是否可以升级段位
	 * 只有当星星数量超过当前小段位所需星星时才会升级
	 */
	checkPromotion() {
		// 枭雄段位不限制星星数量，不需要检查升级
		if (this.playerData.rank === "枭雄") return;

		const currentRankConfig = this.rankConfig[this.playerData.rank];
		const requiredStars = currentRankConfig.starCount; // 当前段位所需星星数

		// 关键规则：必须星星数量超过所需星星才升级（而不是等于）
		if (this.playerData.stars > requiredStars) {
			// 计算超出的星星数量（用于升级后的星星数）
			const extraStars = this.playerData.stars - requiredStars;

			// 检查是否可以升小段位（小段位数字减小表示升级）
			if (this.playerData.subRank > 1) {
				this.playerData.subRank -= 1; // 小段位升级（如5→4）
				this.playerData.stars = extraStars; // 保留超出的星星
			} else {
				// 小段位已是1级，需要升大段位
				const currentRankIndex = this.rankOrder.indexOf(this.playerData.rank);
				const nextRankIndex = currentRankIndex + 1;

				// 检查是否可以升大段位（未达到最高段位）
				if (nextRankIndex < this.rankOrder.length) {
					this.playerData.rank = this.rankOrder[nextRankIndex]; // 大段位升级
					this.playerData.subRank = 5; // 新大段位从5级开始
					this.playerData.stars = extraStars; // 保留超出的星星
				}
			}

			// 递归检查，可能连续升级（如星星足够多可以连升多级）
			this.checkPromotion();
		}
	}

	/**
	 * 检查是否需要降级
	 * 当星星为0时失败会触发降级，降级后星星数为新段位所需星星数减1
	 */
	checkDemotion() {
		// 获取当前段位所需星星数量
		const currentRankStarCount = this.rankConfig[this.playerData.rank].starCount;

		// 小段位不是5级，可以降小段位（小段位数字增大表示降级）
		if (this.playerData.subRank < 5) {
			this.playerData.subRank += 1; // 小段位降级（如4→5）
			// 降级后星星数为当前段位所需星星数减1
			this.playerData.stars = currentRankStarCount - 1;
		} else {
			// 小段位已是5级，需要降大段位
			const currentRankIndex = this.rankOrder.indexOf(this.playerData.rank);
			const prevRankIndex = currentRankIndex - 1;

			// 检查是否可以降大段位（未达到最低段位）
			if (prevRankIndex >= 0) {
				this.playerData.rank = this.rankOrder[prevRankIndex]; // 大段位降级
				this.playerData.subRank = 1; // 降大段位后变为1级
				// 获取新段位所需星星数量，降级后星星数为新段位所需星星数减1
				const newRankStarCount = this.rankConfig[this.playerData.rank].starCount;
				this.playerData.stars = newRankStarCount - 1;
			} else {
				// 已经是最低段位，保持0星
				this.playerData.stars = 0;
			}
		}
	}

	/**
	 * 检查士气是否可以兑换星星
	 * 每100点士气兑换1颗星星，剩余士气保留
	 */
	checkMoraleExchange() {
		if (this.playerData.morale >= 100) {
			const starExchange = Math.floor(this.playerData.morale / 100); // 可兑换的星星数
			this.playerData.stars += starExchange; // 增加星星
			this.playerData.morale = this.playerData.morale % 100; // 保留剩余士气

			// 检查是否需要因兑换星星而升级段位
			this.checkPromotion();
		}
	}

	/**
	 * 获取当前玩家的排位信息
	 * @returns {object} 包含当前段位、星星、士气等信息的对象
	 */
	getPlayerRankInfo() {
		return {
			段位: this.playerData.rank,
			小段位: this.playerData.subRank,
			星星数量: this.playerData.stars,
			当前小段位满星数量: this.playerData.rank === "枭雄" ? "无上限" : this.rankConfig[this.playerData.rank].starCount,
			距离下一级所需星星: this.playerData.rank === "枭雄" ? "无上限" : this.rankConfig[this.playerData.rank].starCount - this.playerData.stars + 1,
			士气值: this.playerData.morale,
			连胜次数: this.playerData.winStreak,
			连胜额外士气加成: this.calculateWinStreakBonus(),
			距离兑换一颗星星还需士气: 100 - (this.playerData.morale % 100),
		};
	}

	/**
	 * 手动重置玩家数据（用于测试或用户操作）
	 * @returns {boolean} 是否成功重置
	 */
	resetPlayerData() {
		if (confirm("确定要重置所有排位数据吗？")) {
			localStorage.removeItem("rankSystemData");
			this.initPlayerData();
			return true;
		}
		return false;
	}
}

// 使用示例

// const result = rankSystem.handleGameResult(true);
// console.log("基础士气:", result.morale.details.base);
// console.log("连胜加成:", result.morale.details.streakBonus);
// console.log("首胜加成:", result.morale.details.dailyWinBonus);
// // 创建排位系统实例
// const rankSystem = new RankSystem();
//
// // 测试校尉1段0星失败降级
// // rankSystem.playerData.rank = '校尉';
// // rankSystem.playerData.subRank = 1;
// // rankSystem.playerData.stars = 0;
// // console.log('降级前:', rankSystem.getPlayerRankInfo());
// //
// // const changes = rankSystem.handleGameResult(false);
// // console.log('校尉1段0星失败后:', rankSystem.getPlayerRankInfo());
// // // 应该显示校尉2段3星（校尉需要4颗星，4-1=3）
// //
// // // 测试校尉5段0星失败降级
// // rankSystem.playerData.rank = '校尉';
// // rankSystem.playerData.subRank = 5;
// // rankSystem.playerData.stars = 0;
// // const changes2 = rankSystem.handleGameResult(false);
// // console.log('校尉5段0星失败后:', rankSystem.getPlayerRankInfo());
// // // 应该显示卫士1段2星（卫士需要3颗星，3-1=2）
//
const rankSystem = new RankSystem();
// rankSystem.playerData.rank = '枭雄';
// rankSystem.playerData.stars = 0;
export default rankSystem;
// 使用示例
// // 创建排位系统实例
//
// // 处理一场胜利并获取变化详情
// const winChanges = rankSystem.handleGameResult(true);
// console.log('胜利后的变化:', winChanges);
//
// // 处理一场使用加星卡的胜利
// const winWithCardChanges = rankSystem.handleGameResult(true, true);
// console.log('使用加星卡胜利后的变化:', winWithCardChanges);
//
// // 处理一场失败
// const lossChanges = rankSystem.handleGameResult(false);
// console.log('失败后的变化:', lossChanges);
//
// // 展示玩家当前排位信息
// console.log('当前排位信息:', rankSystem.getPlayerRankInfo());
//
// // 根据变化信息给用户反馈
// if (winChanges.rank.increased) {
//   alert(`恭喜！您已从${winChanges.rank.previous}升级到${winChanges.rank.current}`);
// }
// if (winChanges.stars.change > 0) {
//   console.log(`获得了${winChanges.stars.change}颗星星`);
// }


//测试升级大段位
// _yjcm.rankSystem.playerData.rank = '领军';
// _yjcm.rankSystem.playerData.subRank = 1;
// _yjcm.rankSystem.playerData.stars = 5;
//测试升级小段位
// _yjcm.rankSystem.playerData.rank = '领军';
// _yjcm.rankSystem.playerData.subRank = 2;
// _yjcm.rankSystem.playerData.stars = 5;
//测试枭雄
