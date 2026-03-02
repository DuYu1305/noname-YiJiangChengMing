import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { getMax, EXTENSION_NAME, playDtSound, getCurrentSeason, audioPath, initClickBtn, getUserName, isMobile, moveAn, scaleAn, addBtnFilter, initPBAnimation, createBackBtn, spinePath, getBGAnInfo, imgPath, daysUntilEndOfMonth } from "../utils/index.js";
import gameModeManager, { GameModeType } from "../utils/GameModeManager.js";

import rankSystem from "../utils/rankSystem.js";
export async function usePaiwei22Page(pixiApp, xloader, ratiow, ratioh, ratios, oppeen, propsModeClic) {
	return new Promise(async (resolve, reject) => {
		function openMode(name) {
			if (name == "team") {
				//代替队友选将
				game.saveConfig("two_assign", true, "versus");
			} else {
				game.saveConfig("two_assign", false, "versus");
			}
			//自由选将
			game.saveConfig("free_choose", false, "versus");
			//自由选择座位  change_choice
			game.saveConfig("change_identity", false, "versus");
			game.saveConfig("change_choice", false, "versus");
			game.saveConfig("versus_mode", "two", "versus");
			gameModeManager.setCurrentMode(GameModeType.RANKED, "versus");
			propsModeClic("versus");
		}
		let baseUi = xloader.value.resources.baseUi.textures;

		let paiwei22Con = new PIXI.Container();
		paiwei22Con.width = pixiApp.value.screen.width;
		paiwei22Con.height = pixiApp.value.screen.height;
		let { backCon, text: textSprite } = createBackBtn(
			"排位",
			pixiApp,
			xloader,
			ratiow,
			ratioh,
			ratios,
			() => {
				if (PIXI.sound.exists("outgame7")) {
					PIXI.sound.stop("outgame7");
				}
				playDtSound();

				oppeen();
			},
			propsModeClic
		);

		let paiwei22Load = new PIXI.Loader();
		paiwei22Load.add("beijingAn", `${imgPath}mode/paiwei/jingji_huanle.skel`);
		paiwei22Load.add("beijing", `${imgPath}mode/paiwei/huanleBg.png`);
		paiwei22Load.add("newMatch", `${imgPath}mode/paiwei/newMatch.json`);
		paiwei22Load.add("rankUi", `${imgPath}mode/paiwei/rank.json`);
		paiwei22Load.add("rankRuleUi", `${imgPath}mode/paiwei/rankRule.json`);
		paiwei22Load.add("jingjidating_qizi", `${imgPath}mode/paiwei/jingjidating_qizi.skel`);
		paiwei22Load.add("kaishipipei_sg", `${imgPath}mode/paiwei/kaishipipei_sg.skel`);
		let chatUi = xloader.value.resources.chatUi.textures;
		paiwei22Load.load(() => {
			//入场骨骼   jingji_huanle  背景 huanleBg.png
			// 排位 入场 ruchang1 daiji1
			//巅峰 入场 ruchang2  daiji2
			//巅峰切换排位  dianfeng_paiwei
			//排位切换巅峰  paiwei_dianfeng
			let bg = new PIXI.Sprite(paiwei22Load.resources.beijing.texture);
			let rankUi = paiwei22Load.resources.rankUi.textures;
			let rankRuleUi = paiwei22Load.resources.rankRuleUi.textures;

			bg.width = pixiApp.value.screen.width;
			bg.height = pixiApp.value.screen.height;
			paiwei22Con.addChild(bg);
			//动画
			let beijingAn = new PIXI.spine.Spine(paiwei22Load.resources.beijingAn.spineData);
			beijingAn.width = pixiApp.value.screen.width;
			beijingAn.height = pixiApp.value.screen.height;
			beijingAn.x = pixiApp.value.screen.width / 2;
			beijingAn.y = pixiApp.value.screen.height / 2;
			let anScale = isMobile ? 0.8 : 1;
			beijingAn.scale.set(getMax(anScale, ratios));

			paiwei22Con.addChild(beijingAn);

			//newMatch
			let newMatch = paiwei22Load.resources.newMatch.textures;

			//限免武将周六版 newMatchBSATLimitTimeGeneralBtn_normal.png newMatchBSATLimitTimeGeneralBtn_over.png
			//禁将 newMatchBanGeneralBtn_normal.png newMatchBanGeneralBtn_over.png
			//限免武将 newMatchLimitTimeGeneralBtn_normal.png newMatchLimitTimeGeneralBtn_over.png
			//历程 newMatchCourseBtn_normal.png newMatchCourseBtn_over.png
			//卡牌图鉴 newMatchCardBtn_normal.png  newMatchCardBtn_over.png
			let leftBtnArr = [
				{
					img: "newChat_btn_yjcm_normal.png",
					imgOver: "newChat_btn_yjcm_over.png",
				},
				{
					img: "newMatchBanGeneralBtn_normal.png",
					imgOver: "newMatchBanGeneralBtn_over.png",
				},
				{
					img: "newMatchLimitTimeGeneralBtn_normal.png",
					imgOver: "newMatchLimitTimeGeneralBtn_over.png",
				},
				{
					img: "newMatchCourseBtn_normal.png",
					imgOver: "newMatchCourseBtn_over.png",
				},
				{
					img: "newMatchCardBtn_normal.png",
					imgOver: "newMatchCardBtn_over.png",
				},
			];
			const leftBtnCon = new PIXI.Container();
			leftBtnArr.reduce(
				(pre, cur, index) => {
					let btn = null;
					if (index === 0) {
						btn = new PIXI.Sprite(chatUi[cur.img]);
						initClickBtn(btn, chatUi[cur.img], chatUi[cur.imgOver]);
						btn.y = pixiApp.value.screen.height * 0.855;
					} else {
						btn = new PIXI.Sprite(newMatch[cur.img]);
						if (index === 1) {
							initClickBtn(btn, newMatch[cur.img], newMatch[cur.imgOver],null,()=>{
								if(game.openBpDialog)game.openBpDialog(true)
							});
						}else{
							initClickBtn(btn, newMatch[cur.img], newMatch[cur.imgOver]);
						}
						btn.y = pixiApp.value.screen.height * 0.85;
					}
					btn.scale.set(getMax(0.8, ratios));
					btn.x = pre.x + 20;
					leftBtnCon.addChild(btn);
					addBtnFilter(btn);
					return { x: btn.x + btn.width, y: btn.y };
				},
				{ x: 20 }
			);
			paiwei22Con.addChild(leftBtnCon);
			//宝箱 newMatchAwardBg.png
			let leftBoxCon = new PIXI.Container();
			let leftBox = new PIXI.Sprite(newMatch["newMatchAwardBg.png"]);
			let boxdwTipText = new PIXI.Text("2v2排位段位枭雄", {
				fontFamily: "font",
				fontSize: 14,
				fill: 0xffffff,
				wordWrap: true,
				wordWrapWidth: 40, // 换行宽度（像素）
			});
			leftBox.scale.set(0.8);
			boxdwTipText.x = leftBox.width * 0.35;
			boxdwTipText.y = leftBox.height * 0.5 - boxdwTipText.height * 0.5;
			leftBoxCon.addChild(leftBox);
			leftBoxCon.addChild(boxdwTipText);

			leftBoxCon.x = 40;
			leftBoxCon.y = pixiApp.value.screen.height * 0.85 - leftBtnCon.height - 10;
			initClickBtn(leftBox);
			addBtnFilter(leftBox);
			paiwei22Con.addChild(leftBoxCon);
			//创建队伍按钮背景 newStyleBaseUIBtn2_180_54_normal.png newStyleBaseUIBtn2_180_54_over.png
			//开始匹配按钮 newStyleBaseUIBtn_180_54_normal.png newStyleBaseUIBtn_180_54_over.png

			let startMatchBtn = new PIXI.Sprite(baseUi["newStyleBaseUIBtn_180_54_normal.png"]);
			startMatchBtn.anchor.set(0.5);
			startMatchBtn.scale.set(0.8);
			startMatchBtn.x = pixiApp.value.screen.width - 40 - startMatchBtn.width * 0.5;
			startMatchBtn.y = pixiApp.value.screen.height * 0.9;
			initClickBtn(startMatchBtn, baseUi["newStyleBaseUIBtn_180_54_normal.png"], baseUi["newStyleBaseUIBtn_180_54_over.png"], null, () => {
				openMode("match");
			});
			addBtnFilter(startMatchBtn);
			let startMatchBtnAn = new PIXI.spine.Spine(paiwei22Load.resources.kaishipipei_sg.spineData);
			startMatchBtnAn.width = startMatchBtn.width;
			startMatchBtnAn.height = startMatchBtn.height;
			startMatchBtnAn.x = startMatchBtn.x;
			startMatchBtnAn.y = startMatchBtn.y;
			startMatchBtnAn.state.setAnimation(0, "play", true);
			let startMatchText = new PIXI.Text("开始匹配", {
				fontSize: 18,
				fill: "#5C3B24",
			});
			startMatchText.anchor.set(0.5);

			startMatchText.x = startMatchBtn.x;
			startMatchText.y = startMatchBtn.y;

			let createTeamBtn = new PIXI.Sprite(baseUi["newStyleBaseUIBtn2_180_54_normal.png"]);
			createTeamBtn.anchor.set(0.5);
			createTeamBtn.scale.set(0.8);
			createTeamBtn.x = startMatchBtn.x - createTeamBtn.width - 10;
			createTeamBtn.y = pixiApp.value.screen.height * 0.9;
			initClickBtn(createTeamBtn, baseUi["newStyleBaseUIBtn2_180_54_normal.png"], baseUi["newStyleBaseUIBtn2_180_54_over.png"], null, () => {
				openMode("team");
			});
			addBtnFilter(createTeamBtn);
			let createTeamText = new PIXI.Text("创建队伍", {
				fontSize: 18,
				fill: "#EAAD60",
			});
			createTeamText.anchor.set(0.5);
			createTeamText.x = createTeamBtn.x;
			createTeamText.y = createTeamBtn.y;
			paiwei22Con.addChild(createTeamBtn);
			paiwei22Con.addChild(createTeamText);
			paiwei22Con.addChild(startMatchBtn);
			paiwei22Con.addChild(startMatchText);
			startMatchBtnAn.scale.set(0.66, 0.8);
			paiwei22Con.addChild(startMatchBtnAn);

			//排位段位右下角的播放按钮 newMatchEffectBtn_normal.png newMatchEffectBtn_over.png
			//好友排行文字 newMatchFriendRankText.png
			//排行数字第一：  newMatchRankFlag1.png
			//将池 newMatchGeneralBtn_normal.png newMatchGeneralBtn_over.png
			//排行下面的查看详情按钮 newMatchLookBtn_normal.png newMatchLookBtn_over.png
			//排行背景 newMatchPeakBg.png
			let paihangCon = new PIXI.Container();
			let paihangBg = new PIXI.Sprite(newMatch["newMatchPeakBg.png"]);
			paihangBg.scale.set(0.8);
			paihangCon.width = paihangBg.width;
			let paihangTitle = new PIXI.Sprite(newMatch["newMatchFriendRankText.png"]);
			paihangTitle.x = (paihangBg.width - paihangTitle.width) * 0.5;

			let touxiangSprite = new PIXI.Sprite(xloader.value.resources.touxiang.texture);
			let paimingSprite = new PIXI.Sprite(newMatch["newMatchRankFlag1.png"]);
			paimingSprite.scale.set(0.5);
			touxiangSprite.width = Math.max(ratios.value * 30, 30);
			touxiangSprite.height = Math.max(ratios.value * 30, 30);
			touxiangSprite.scale.set(Math.max(ratios.value * 0.6, 0.6));
			touxiangSprite.x = (paihangBg.width - touxiangSprite.width) * 0.5;
			paimingSprite.x = touxiangSprite.x - paimingSprite.width * 0.3;
			touxiangSprite.y = paihangTitle.y + paihangTitle.height + 10;
			paimingSprite.y = touxiangSprite.y - paimingSprite.height * 0.3;

			let username = new PIXI.Text(getUserName(), {
				fontSize: 14,
				fill: "#D27423",
			});
			username.x = (paihangBg.width - username.width) * 0.5;
			username.y = touxiangSprite.y + touxiangSprite.height + 10;
			paihangCon.addChild(paihangBg, paihangTitle, touxiangSprite, paimingSprite, username);
			paihangCon.x = pixiApp.value.screen.width - paihangBg.width - 40;

			paiwei22Con.addChild(paihangCon);
			//左侧排位巅峰切换竖线背景 newMatchTabLine.png
			//左侧排位巅峰标题背景（选中） newMatchTabSelect1.png 鼠标滑过亮 newMatchTabSelect2.png
			//左侧排位巅峰标题背景（未选中） newMatchTabNormal1.png 鼠标滑过亮 newMatchTabNormal2.png
			//锁 newMatchTabLock.png
			let changeDfConBg = new PIXI.Sprite(newMatch["newMatchTabLine.png"]);
			changeDfConBg.scale.set(0.8);
			changeDfConBg.x = 40;
			changeDfConBg.y = 15;
			let currentMode = "2v2排位";
			let dianfengBtnArr = [
				{
					text: "2v2巅峰",
				},
				{
					text: "2v2排位",
				},
			];
			dianfengBtnArr.forEach((item, index) => {
				let dianfengBtnCon = new PIXI.Container();
				let nomarl = currentMode == item.text ? "newMatchTabSelect1.png" : "newMatchTabNormal1.png";
				let over = currentMode == item.text ? "newMatchTabSelect2.png" : "newMatchTabNormal2.png";
				let dianfengBtnBg = new PIXI.Sprite(newMatch[nomarl]);

				let dianfeng1Text = new PIXI.Text(item.text, {
					fontSize: 16,
					fill: currentMode == item.text ? "#ffffff" : "#D27423",
				});
				initClickBtn(dianfengBtnBg, newMatch[nomarl], newMatch[over], null, () => {
					// currentMode = item.text;
				});
				dianfengBtnBg.scale.set(0.8);
				dianfengBtnCon.addChild(dianfengBtnBg, dianfeng1Text);
				dianfengBtnCon.x = changeDfConBg.x - 14;

				dianfengBtnBg.x = 0;
				dianfengBtnBg.y = 0;
				dianfeng1Text.x = dianfengBtnBg.width * 0.5 - dianfeng1Text.width * 0.7;
				dianfeng1Text.y = dianfengBtnBg.height * 0.5 - dianfeng1Text.height * 0.5;
				if (item.text == "2v2巅峰") {
					dianfengBtnCon.y = changeDfConBg.y + changeDfConBg.height * 0.18;
					let lockImg = new PIXI.Sprite(newMatch["newMatchTabLock.png"]);
					lockImg.x = dianfengBtnBg.width * 0.7;
					lockImg.y = dianfengBtnBg.height * 0.5 - lockImg.height * 0.5;
					dianfengBtnCon.addChild(lockImg);
				} else {
					dianfengBtnCon.y = changeDfConBg.y + changeDfConBg.height * 0.5;
				}
				paiwei22Con.addChild(dianfengBtnCon);
			});

			paiwei22Con.addChild(changeDfConBg);

			//左侧排位切换暗 newMatchTianTiLivePoint1.png 亮 newMatchTianTiLivePoint2.png
			//右箭头 newMatchTianTiLiveArrowRight.png
			//左键头 newMatchTianTiLiveArrowLeft.png

			//身份国战天梯切换按钮 newMatchTabOhtherBtn_normal.png  newMatchTabOhtherBtn_over.png
			let changeModeSprite = new PIXI.Sprite(newMatch["newMatchTabOhtherBtn_normal.png"]);
			changeModeSprite.scale.set(0.9);
			changeModeSprite.x = 40;
			changeModeSprite.y = pixiApp.value.screen.height * 0.57;
			initClickBtn(changeModeSprite, newMatch["newMatchTabOhtherBtn_normal.png"], newMatch["newMatchTabOhtherBtn_over.png"], null, () => {
				if (PIXI.sound.exists("outgame7")) {
					PIXI.sound.stop("outgame7");
				}
				sessionStorage.setItem("yjcm_back_page", "paiwei");
				oppeen("jingdian");
			});
			addBtnFilter(changeModeSprite);
			paiwei22Con.addChild(changeModeSprite);

			//星星 暗 newMatchScore3.png  亮 newMatchScore4.png
			//rank
			//卫士 MatchLevelIconBig1.png 文字 ModeRankHallIcon1.png   3颗
			//校尉 MatchLevelIconBig2.png   文字  ModeRankHallIcon2.png 4颗
			//中郎将 MatchLevelIconBig3.png	文字  ModeRankHallIcon3.png 5颗
			//领军 MatchLevelIconBig4.png	文字 ModeRankHallIcon4.png 6颗
			//大将 MatchLevelIconBig5.png  文字	ModeRankHallIcon5.png 6颗
			//枭雄 MatchLevelIconBig6.png  文字 ModeRankHallIcon6.png
			//小段位文字
			//一  ModeRankHallStep1.png
			//二  ModeRankHallStep2.png
			//三  ModeRankHallStep3.png
			//四  ModeRankHallStep4.png
			//五  ModeRankHallStep5.png
			//段位文字背景  AthleticsRankRule_nameBg.png
			//赛季剩余时间背景 newMatchLeftTimeBg.png
			let timeCon = new PIXI.Container();
			let leftTimeBg = new PIXI.Sprite(newMatch["newMatchLeftTimeBg.png"]);
			timeCon.width = leftTimeBg.width;
			timeCon.height = leftTimeBg.height;
			let timeText = new PIXI.Text(`${getCurrentSeason()}赛季剩余：${daysUntilEndOfMonth()}天`, {
				fontSize: 14,
				fill: "#ffffff",
			});
			leftTimeBg.x = timeCon.width * 0.5 - leftTimeBg.width * 0.5;
			leftTimeBg.y = timeCon.height * 0.5 - leftTimeBg.height * 0.5;
			timeText.x = timeCon.width * 0.5 - timeText.width * 0.5;
			timeText.y = timeCon.height * 0.5 - timeText.height * 0.3;
			timeCon.x = pixiApp.value.screen.width * 0.5 - timeCon.width * 0.5;
			timeCon.y = 30;
			timeCon.addChild(leftTimeBg, timeText);
			//棋子
			let qizhi = new PIXI.spine.Spine(paiwei22Load.resources.jingjidating_qizi.spineData);
			qizhi.x = pixiApp.value.screen.width / 2;
			let y = isMobile ? pixiApp.value.screen.height / 2 + 20 : pixiApp.value.screen.height / 2 - 60;
			qizhi.y = y;
			let qizhiScale = isMobile ? 0.8 : 0.9;
			qizhi.scale.set(getMax(qizhiScale, ratios));
			qizhi.state.setAnimation(0, "play", false);
			paiwei22Con.addChild(qizhi);
			//创建段位图
			let rankCon = new PIXI.Container();
			let rankInfo = rankSystem.getPlayerRankInfo();
			let currentDuanWei = rankInfo["段位"];
			let currentSmallDuanWei = rankInfo["小段位"];
			let fullStars = rankInfo["当前小段位满星数量"];
			let currentStars = rankInfo["星星数量"];
			let rankImgArr = [
				{
					name: "卫士",
					img: "MatchLevelIconBig1.png",
					text: "ModeRankHallIcon1.png",
				},
				{
					name: "校尉",
					img: "MatchLevelIconBig2.png",
					text: "ModeRankHallIcon2.png",
				},
				{
					name: "中郎将",
					img: "MatchLevelIconBig3.png",
					text: "ModeRankHallIcon3.png",
				},
				{
					name: "领军",
					img: "MatchLevelIconBig4.png",
					text: "ModeRankHallIcon4.png",
				},
				{
					name: "大将",
					img: "MatchLevelIconBig5.png",
					text: "ModeRankHallIcon5.png",
				},
				{
					name: "枭雄",
					img: "MatchLevelIconBig6.png",
					text: "ModeRankHallIcon6.png",
				},
			];

			//创建当前段位图
			let currentRankImg = rankImgArr.find(item => item.name == currentDuanWei);
			let rankImg = new PIXI.Sprite(rankUi[currentRankImg.img]);
			let rankImgScale = isMobile ? 0.6 : 0.9;
			rankImg.scale.set(rankImgScale);
			rankImg.x = pixiApp.value.screen.width * 0.5 - rankImg.width * 0.5;
			rankImg.y = pixiApp.value.screen.height * 0.04;

			let rankTextCon = new PIXI.Container();

			//创建当前段位文字图片 小段位图+段位文字图
			let rankTextImg = new PIXI.Sprite(rankUi[currentRankImg.text]);
			let rankTextBg = new PIXI.Sprite(newMatch["newMatchDanNameBg.png"]);
			rankTextBg.height = rankTextImg.height * 1.2;
			rankTextCon.width = rankTextBg.width;
			rankTextCon.addChild(rankTextBg);
			let textWidth = rankTextImg.width;
			let smallduanweiImg;
			//枭雄不需要拼接小段位
			if (currentDuanWei !== "枭雄") {
				smallduanweiImg = new PIXI.Sprite(rankUi[`ModeRankHallStep${currentSmallDuanWei}.png`]);
				smallduanweiImg.scale.set(getMax(0.9, ratios));
				smallduanweiImg.x = rankTextImg.width;
				smallduanweiImg.y = rankTextBg.height * 0.5 - smallduanweiImg.height * 0.5;
				rankTextCon.addChild(smallduanweiImg);
				textWidth = rankTextImg.width + smallduanweiImg.width;
			}
			rankTextImg.scale.set(getMax(0.9, ratios));
			rankTextImg.y = rankTextBg.height * 0.5 - rankTextImg.height * 0.5;
			rankTextImg.x = (rankTextCon.width - textWidth) * 0.5;

			if (smallduanweiImg) {
				smallduanweiImg.x = rankTextImg.x + rankTextImg.width;
			}
			rankTextCon.addChild(rankTextImg);
			rankTextCon.scale.set(getMax(0.8, ratios));
			rankTextCon.x = rankImg.x + rankImg.width * 0.5 - rankTextCon.width * 0.5;
			rankTextCon.y = rankImg.y + rankImg.height - 20;

			let starsCon = new PIXI.Container();
			//创建星星 枭雄不需要展示多个星星 展示星星*
			if (currentDuanWei == "枭雄") {
				let starImg = new PIXI.Sprite(newMatch["newMatchScore4.png"]);
				starImg.scale.set(getMax(0.7, ratios));
				let starNumText = new PIXI.Text(`×${currentStars}`, {
					fontFamily: "MatchFont",
					fontSize: 24,
					fill: 0xffffff,
				});
				console.log("starImg.width", starNumText.width);
				starNumText.x = starImg.width;
				starNumText.y = starImg.height * 0.5 - starNumText.height * 0.5;
				starsCon.addChild(starImg);
				starsCon.addChild(starNumText);
			} else {
				for (let i = 0; i < fullStars; i++) {
					let starImg;
					if (i < currentStars) {
						//创建亮色星星
						starImg = new PIXI.Sprite(newMatch["newMatchScore4.png"]);
					} else {
						starImg = new PIXI.Sprite(newMatch["newMatchScore3.png"]);
					}
					starImg.scale.set(getMax(0.7, ratios));
					starImg.x = i * starImg.width;
					starsCon.addChild(starImg);
				}
			}
			starsCon.x = pixiApp.value.screen.width * 0.5 - starsCon.width * 0.5;
			starsCon.y = rankTextCon.y + starsCon.height;
			rankCon.addChild(rankTextCon);
			rankCon.addChild(starsCon);

			rankCon.addChild(rankImg);
			console.log("rankInfo", rankInfo);
			paiwei22Con.addChild(rankCon);
			paiwei22Con.addChild(timeCon);
			paiwei22Con.addChild(backCon);
			beijingAn.state.addListener({
				complete(track, event) {
					beijingAn.state.setAnimation(0, "daiji1", true);
				},
			});
			paiwei22Con.on("added", async () => {
				let t = setTimeout(() => {
					clearTimeout(t);
					t = null;
					beijingAn.state.clearTracks();
					qizhi.state.clearTracks();
					beijingAn.state.setAnimation(0, "ruchang1", false);
					qizhi.state.setAnimation(0, "play", false);
				}, 100);

				if (PIXI.sound.exists("outgame7")) {
					PIXI.sound.play("outgame7", { loop: true });
				}
			});
			resolve({
				paiwei22Con,
			});
		});
	});
}
