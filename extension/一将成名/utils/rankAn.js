import { lib, get, game } from "../../../noname.js";
import doudizhuStats from "./DoudizhuStats.js";
import { isTargetMode, EXTENSION_NAME } from "./index.js";
import gameModeManager, { GameModeType } from "./GameModeManager.js";
import scoreSystem from "./scoreSystem.js";
import rankSystem from "./rankSystem.js";
async function loadJson() {
	try {
		if (window._YJCM_JIESUAN.rankjson) {
			return window._YJCM_JIESUAN.rankjson;
		}
		const response = await fetch(`extension/${EXTENSION_NAME}/resource/image/mode/paiwei/rank.json`);
		if (!response.ok) throw new Error("加载失败");
		const data = await response.json();
		console.log("JSON数据:", data);
		window._YJCM_JIESUAN.rankjson = data;
		return window._YJCM_JIESUAN.rankjson;
	} catch (error) {
		console.error("错误:", error);
	}
}
async function genRankImage(rankName) {
	let imgMap = {
		枭雄: "MatchLevelIconBig6.png",
		大将: "MatchLevelIconBig5.png",
		领军: "MatchLevelIconBig4.png",
		中郎将: "MatchLevelIconBig3.png",
		校尉: "MatchLevelIconBig2.png",
		卫士: "MatchLevelIconBig1.png",
	};
	const rankjson = await loadJson();
	console.log("rankjson", rankjson);
	if (rankjson) {
		const rank = rankjson.frames[imgMap[rankName]].frame;
		if (rank) {
			const rankImg = document.createElement("div");
			rankImg.classList.add("rank-img");
			rankImg.style.backgroundPosition = `-${rank.x}px -${rank.y}px`;
			rankImg.style.width = `${rank.w}px`;
			rankImg.style.height = `${rank.h}px`;
			return rankImg;
		}
	}
}
function createJSbg() {
	const jsbg = document.createElement("div");
	jsbg.classList.add("paiweijiesuan-con");
	document.body.appendChild(jsbg);
	return jsbg;
}
//创建升星动画 开始星星下标  变化数量  比如开始是1星星 变化2  那就是最后三个星星 播放两次动画
//士气值待做
function playShengXingAn(starNum, change, playerRankInfo = rankSystem.getPlayerRankInfo(), type = "add") {
	return new Promise(resolve => {
		change = Math.abs(change);
		if (type == "add") {
			if (starNum == playerRankInfo["当前小段位满星数量"]) {
				return resolve();
			}
		} else {
			if (starNum == 0||change==0) {
				return resolve();
			}
		}
		//枭雄 展示加几颗星星或者减几颗星星即可
		if (playerRankInfo["段位"] == "枭雄") {
			setTimeout(async () => {
				clearJSbg();
				let starAddTip = document.createElement("div");
				starAddTip.classList.add("star-add-tip");
				//创建加星星提示
				if (type == "add") {
					starAddTip.textContent = "星级+" + change;
				} else {
					starAddTip.textContent = "星级-" + change;
				}
				await createRankImg(document.querySelector(".paiweijiesuan-con"));
				document.querySelector(".paiweijiesuan-con").appendChild(starAddTip);
				resolve();
			}, 500);
			return;
		}

		let starList = document.querySelectorAll(".star-img");
		let end = starNum + change;
		if (type != "add") {
			//比如现在1星星 变化1
			end = starNum - change < 0 ? 0 : starNum - change;
			starNum = starNum - 1;
		}
		console.log("end", end);
		console.log("starNum", starNum);
		//         1                             1>0
		for (let i = starNum; type == "add" ? i < end : i >= end; type == "add" ? i++ : i--) {
			setTimeout(
				() => {
					dcdAnim.loadSpine(window._YJCM_JIESUAN.sgsszn_xingxingsd.name, "skel", function () {
						if (type !== "add") {
							starList[i].classList.remove("star-light");
							starList[i].classList.add("star-dark");
						}
						dcdAnim.playSpine(
							{
								...window._YJCM_JIESUAN.sgsszn_xingxingsd,
								action: type == "add" ? "play" : "play2",
							},
							{
								parent: starList[i],
								scale: 0.5,
								// referFollow: true,
							}
						);
						setTimeout(() => {
							if (type == "add") {
								// let starAn = dcdAnim.playSpine(window._YJCM_JIESUAN.sgsszn_xingxingsd, {
								// 	parent: starList[i],
								// 	action: "play4",
								// 	loop: true,
								//     referFollow: true,
								// });
								starList[i].classList.remove("star-dark");
								starList[i].classList.add("star-light");
								// window._YJCM_JIESUAN.starAnArr.push(starAn);
								console.log("11111", i,starNum + change - 1);
								if (i == starNum + change - 1) {
									resolve();
								}
							} else {
								console.log("22222", i,end + 1);
								// 0 1
								if (i == end ) {
									resolve();
								}
							}
						}, 800);
					});
				},
				(i - starNum) * 1000
			);
		}
	});
}
//创建星星图、段位图等 如果是没有升级段位 亮色星星就是当前星星数 如果是升级段位 亮星星0个
//枭雄单独处理
async function createRankImg(jsbg = document.querySelector(".paiweijiesuan-con"), isShengduan) {
	let prevPlayerRankInfo = rankSystem.getPlayerRankInfo();
	let duanweiImg = await genRankImage(prevPlayerRankInfo["段位"]);
	let rankName = document.createElement("div");
	rankName.classList.add("rank-name");
	rankName.textContent = prevPlayerRankInfo["段位"] + prevPlayerRankInfo["小段位"];
	//创建星星  枭雄要单独处理！！！！
	let starCNum = prevPlayerRankInfo["当前小段位满星数量"];
	if (prevPlayerRankInfo["段位"] == "枭雄") {
		rankName.textContent = prevPlayerRankInfo["段位"];
		starCNum = 1;
	}
	let starNum = prevPlayerRankInfo["星星数量"];
	console.log("星星数量", starNum);
	let starCon = document.createElement("div");
	starCon.classList.add("star-con");

	for (let i = 0; i < starCNum; i++) {
		let starImg = document.createElement("div");
		if (isShengduan) {
			starImg.classList.add("star-dark");
		} else {
			if (starNum > i) {
				starImg.classList.add("star-light");
			} else {
				starImg.classList.add("star-dark");
			}
		}

		starImg.classList.add("star-img");
		starCon.appendChild(starImg);

		if (prevPlayerRankInfo["段位"] == "枭雄") {
			starImg.classList.remove("star-dark");
			starImg.classList.add("star-light");
			//创建星星数量文字
			let starNumText = document.createElement("div");
			starNumText.classList.add("star-num");
			starNumText.textContent = "x" + starNum;
			starCon.appendChild(starNumText);
		}
	}
	jsbg.appendChild(rankName);
	jsbg.appendChild(duanweiImg);
	jsbg.appendChild(starCon);
	return;
}
//升星的时候删除所有动画和图片 重新创建新的createRankImg
function clearJSbg(jsbg = document.querySelector(".paiweijiesuan-con")) {
	// while (window._YJCM_JIESUAN.starAnArr.length > 0) {
	// 	dcdAnim.stopSpine(window._YJCM_JIESUAN.starAnArr.shift());
	// }
	Array.from(jsbg.children).forEach(item => {
		if (Array.from(item.classList).some(cls => cls.startsWith("shiqi"))) {
			return;
		}
		jsbg.removeChild(item);
	});
}
function createWait(time = 500) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, time);
	});
}
function createCloseBtn(resolve) {
	//创建close图片
	let closeImg = document.createElement("div");
	closeImg.classList.add("shiqi-close-img");
	let bjCon = document.querySelector(".paiweijiesuan-con");
	bjCon.appendChild(closeImg);
	bjCon.onclick = () => {
		bjCon.classList.add("dialog-hide");
		resolve();
	};
}
function ceateShiqiDetail(res) {
	//创建士气容器
	let shiqiDetail = document.createElement("div");
	shiqiDetail.classList.add("shiqi-detail");
	//创建士气标题
	let shiqititle = document.createElement("div");
	shiqititle.classList.add("shiqititle");
	//创建士气文字
	let shiqiText = document.createElement("div");
	shiqiText.classList.add("shiqi-text");
	shiqiText.textContent = "士气";
	//创建士气进度文字
	let shiqiNumText = document.createElement("div");
	shiqiNumText.classList.add("shiqi-num");
	shiqiNumText.textContent = res.morale.previous + "/100";
	shiqititle.appendChild(shiqiText);
	shiqititle.appendChild(shiqiNumText);
	//创建加分文字
	let shiqiAddText = document.createElement("div");
	shiqiAddText.classList.add("shiqi-add");
	shiqiAddText.textContent = "+" + res.morale.fromGame;
	shiqititle.appendChild(shiqiAddText);
	//创建士气进度条
	let shiqitiao = document.createElement("div");
	shiqitiao.classList.add("shiqitiao");
	//创建士气进度条
	let shiqiProcess = document.createElement("div");
	shiqiProcess.classList.add("shiqi-process");
	shiqiProcess.style.width = res.morale.previous + "%";
	shiqitiao.appendChild(shiqiProcess);
	shiqiDetail.appendChild(shiqititle);
	shiqiDetail.appendChild(shiqitiao);
	document.querySelector(".paiweijiesuan-con").appendChild(shiqiDetail);
	shiqiProcess.classList.add("shiqi-an");

	//创建士气加分明细框
	// let shiqiAddDetail = document.createElement("div");
	// shiqiAddDetail.classList.add("shiqi-add-detail");
	// shiqiAddDetail.textContent = "从游戏中获得" + res.morale.fromGame + "点士气";
	// shiqiDetail.appendChild(shiqiAddDetail);
	setTimeout(() => {
		//兑换士气了 先走满
		if (res.morale.usedInExchange) {
			shiqiProcess.style.width = "100%";
			setTimeout(() => {
				//更新当前士气
				shiqiNumText.textContent = res.morale.current + "/100";
				shiqiProcess.style.width = res.morale.current + "%";
			}, 1000);
		} else {
			//更新当前士气
			shiqiNumText.textContent = res.morale.current + "/100";
			shiqiProcess.style.width = res.morale.current + "%";
		}
	}, 500);
}
window._YJCM_JIESUAN = {
	createRankAn,
	rankjson: null,
	starAnArr: [],
	loadJson,
	genRankImage,
	卫士: {
		name: `../../../${EXTENSION_NAME}/resource/image/mode/gameover/weishi`,
		version: "4.0",
		loop: false,
		yjcms: 1300,
	},
	校尉: {
		name: `../../../${EXTENSION_NAME}/resource/image/mode/gameover/xiaowei`,
		version: "4.0",
		loop: false,
		yjcms: 1400,
		yjcmj: 500,
	},
	中郎将: {
		name: `../../../${EXTENSION_NAME}/resource/image/mode/gameover/zhonglangjiang`,
		version: "4.0",
		loop: false,
		yjcms: 1400,
		yjcmj: 500,
	},
	领军: {
		name: `../../../${EXTENSION_NAME}/resource/image/mode/gameover/lingjun`,
		version: "4.0",
		loop: false,
		yjcms: 1500,
		yjcmj: 500,
	},
	大将: {
		name: `../../../${EXTENSION_NAME}/resource/image/mode/gameover/dajiang`,
		version: "4.0",
		loop: false,
		yjcms: 2200,
		yjcmj: 500,
	},
	枭雄: {
		name: `../../../${EXTENSION_NAME}/resource/image/mode/gameover/xiaoxiong`,
		version: "4.0",
		loop: false,
		yjcms: 1300,
		yjcmj: 500,
	},
	// 卫士: {
	// 	//卫士
	// 	name: `../../../${EXTENSION_NAME}/resource/image/mode/gameover/mobile/ws_to_xw/sgsszn_shengduan1-2`,
	// 	loop: false,
	// },
	// //校尉
	// 校尉: {
	// 	//校尉
	// 	name: `../../../${EXTENSION_NAME}/resource/image/mode/gameover/mobile/xw_to_zlj/sgsszn_shengduan2-3`,

	// 	loop: false,
	// },
	// //中郎将
	// 中郎将: {
	// 	//zhonglang
	// 	name: `../../../${EXTENSION_NAME}/resource/image/mode/gameover/mobile/zlj_to_lj/sgsszn_shengduan3-4`,

	// 	loop: false,
	// },
	// //领军
	// 领军: {
	// 	//领军
	// 	name: `../../../${EXTENSION_NAME}/resource/image/mode/gameover/mobile/lj_to_dj/sgsszn_shengduan4-5`,
	// 	loop: false,
	// },
	// //大将
	// 大将: {
	// 	//大将
	// 	name: `../../../${EXTENSION_NAME}/resource/image/mode/gameover/mobile/dj_to_xx/sgsszn_shengduan5-6`,
	// 	loop: false,
	// },
	// //枭雄
	// js_xiaoxiong: {
	// 	//枭雄
	// 	name: `../../../${EXTENSION_NAME}/resource/image/mode/gameover/xiaoxiong`,

	// 	loop: false,
	// },
	//星星动画
	sgsszn_xingxingsd: {
		//星星动画
		name: `../../../${EXTENSION_NAME}/resource/image/mode/gameover/mobile/star_ani/sgsszn_xingxingsd`,
		loop: false,
	},
};
loadJson();
export function createRankAn(bool) {
	return new Promise(async (resolve, reject) => {
		if (bool !== true && bool !== false) {
			return;
		}

		await createWait();
		//排位22
		if (document.querySelector(".paiweijiesuan-con")) {
			document.body.removeChild(document.querySelector(".paiweijiesuan-con"));
		}
		let jsbg = createJSbg();
		let prevPlayerRankInfo = rankSystem.getPlayerRankInfo();
		let starNum = prevPlayerRankInfo["星星数量"];
		await createRankImg(jsbg);
		await createWait();

		if (bool === true) {
			let res = rankSystem.handleGameResult(bool);
			ceateShiqiDetail(res);
			console.log("res", res);
			//一个段内升级 直接改变星星样式
			if (!res.rank.changed && !res.subRank.changed) {
				await playShengXingAn(starNum, res.stars.change);
			} else {
				//升段 先播放完当前段位升满动画
				await playShengXingAn(starNum, prevPlayerRankInfo["当前小段位满星数量"] - starNum, prevPlayerRankInfo);
				// setTimeout(async () => {
				//再来处理
				clearJSbg(jsbg);
				if (res.rank.changed) {
					//升大段位 播放升大段位动画
					// dcdAnim.loadSpine(window._YJCM_JIESUAN[prevPlayerRankInfo["段位"]].name, "skel", function () {
					// 	dcdAnim.playSpine(window._YJCM_JIESUAN[prevPlayerRankInfo["段位"]], {
					// 		parent: document.querySelector(".rank-img"),
					// 		action: "play",
					// 		scale: 0.5,
					// 	});
					// });
					skinSwitch.chukuangWorkerApi.playEffect(
						{
							name: window._YJCM_JIESUAN[prevPlayerRankInfo["段位"]].name,
							version: "4.0",
							action: "shengduan",
						},
						{ scale: 0.7 }
					);
					//等待大段位动画后执行
					setTimeout(async () => {
						//重新创建段位图等
						await createRankImg(jsbg, true);
						//播放新的升星动画
						await playShengXingAn(0, res.stars.current);
						// }, 2400);
					}, window._YJCM_JIESUAN[prevPlayerRankInfo["段位"]].yjcms + 500);
				} else {
					//小段位升级
					//重新创建段位图等
					await createRankImg(jsbg, true);
					//播放新的升星动画
					await playShengXingAn(0, res.stars.current);
				}
				// }, prevPlayerRankInfo["当前小段位满星数量"] - starNum);
			}
		} else if (bool === false) {
			let res = rankSystem.handleGameResult(bool);
			ceateShiqiDetail(res);
			console.log("res", res);
			let playerRankInfo = rankSystem.getPlayerRankInfo();

			//一个段内升级 直接改变星星样式
			if (!res.rank.changed && !res.subRank.changed) {
				await playShengXingAn(starNum, res.stars.change, rankSystem.getPlayerRankInfo(), "less");
			} else {
				//降段 先播放完当前段位降0动画
				await playShengXingAn(starNum, starNum, prevPlayerRankInfo, "less");
				// setTimeout(async () => {
				//再来处理
				clearJSbg(jsbg);
				//播放新的升星动画
				if (res.rank.changed) {
					skinSwitch.chukuangWorkerApi.playEffect(
						{
							name: window._YJCM_JIESUAN[prevPlayerRankInfo["段位"]].name,
							version: "4.0",
							action: "jiangduan",
							speed: 0.5,
						},
						{ scale: 0.7 }
					);
					let dur = window._YJCM_JIESUAN[prevPlayerRankInfo["段位"]].yjcmj;
					//等待大段位动画后执行
					setTimeout(
						async () => {
							//重新创建段位图等
							await createRankImg(jsbg);
							//播放新的升星动画
							await playShengXingAn(playerRankInfo["当前小段位满星数量"], playerRankInfo["当前小段位满星数量"] - res.stars.current, rankSystem.getPlayerRankInfo(), "less");
							// }, 2400);
						},
						dur / 0.5 + 500
					);
					//降级 没有动画
				} else {
					//小段位降级
					//重新创建段位图等
					await createRankImg(jsbg);
					//播放新的升星动画
					await playShengXingAn(playerRankInfo["当前小段位满星数量"], playerRankInfo["当前小段位满星数量"] - res.stars.current, rankSystem.getPlayerRankInfo(), "less");
				}
			}
		}
		createCloseBtn(resolve);
	});
}
