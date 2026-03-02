import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { audioPath, getMax, playDtSound, EXTENSION_NAME, initClickBtn, getUserName, isMobile, moveAn, scaleAn, addBtnFilter, initPBAnimation, createBackBtn, spinePath, getBGAnInfo, imgPath, getCurrentSeason, daysUntilEndOfMonth } from "../utils/index.js";
import gameModeManager, { GameModeType } from "../utils/GameModeManager.js";
import scoreSystem from "../utils/scoreSystem.js";
export async function usePaiwei8Page(pixiApp, xloader, ratiow, ratioh, ratios, oppeen, propsModeClic) {
	return new Promise((resolve, reject) => {
		let backPageName = "uihome";
		function openMode(name) {
			switch (name) {
				case "shenfentianti":
					//自由选择身份和座位 关
					game.saveConfig("change_identity", false, "identity");
					//关闭自由选将
					game.saveConfig("free_choose", false, "identity");
					//关闭换将卡
					game.saveConfig("change_choice", false, "identity");
					//手气卡两次
					game.saveConfig("change_card", "twice", "identity");
					//自动标记身份
					game.saveConfig("auto_mark_identity", false, "identity");
					game.saveConfig("identity_mode", "normal", "identity");
					game.saveConfig("player_number", 8, "identity");
					gameModeManager.setCurrentMode(GameModeType.RANKED, "identity");
					propsModeClic("identity");
					break;
				case "shenfenpipei":
					//自由选择身份和座位 关
					game.saveConfig("change_identity", false, "identity");
					//关闭自由选将
					game.saveConfig("free_choose", false, "identity");
					//关闭换将卡
					game.saveConfig("change_choice", false, "identity");
					//手气卡两次
					game.saveConfig("change_card", "twice", "identity");
					//自动标记身份
					game.saveConfig("auto_mark_identity", false, "identity");
					game.saveConfig("identity_mode", "normal", "identity");
					game.saveConfig("player_number", 5, "identity");
					gameModeManager.setCurrentMode(GameModeType.RANKED, "identity5");
					propsModeClic("identity");
					break;
				case "guozhantianti":
					//自由选择身份和座位 关
					game.saveConfig("change_identity", false, "guozhan");
					//关闭自由选将
					game.saveConfig("free_choose", false, "guozhan");
					//关闭换将卡
					game.saveConfig("change_choice", false, "guozhan");
					//手气卡两次
					game.saveConfig("change_card", "twice", "guozhan");
					//自动标记身份
					game.saveConfig("free_choose", false, "guozhan");
					game.saveConfig("guozhan_mode", "normal", "guozhan");
					game.saveConfig("player_number", 8, "guozhan");
					gameModeManager.setCurrentMode(GameModeType.RANKED, "guozhan");
					propsModeClic("guozhan");
					break;
				default:
					break;
			}
		}
		let paiwei8Con = new PIXI.Container();

		paiwei8Con.width = pixiApp.value.screen.width;
		paiwei8Con.height = pixiApp.value.screen.height;
		let { backCon, text } = createBackBtn(
			"身份匹配",
			pixiApp,
			xloader,
			ratiow,
			ratioh,
			ratios,
			() => {
				if (PIXI.sound.exists("outgame3")) {
					PIXI.sound.stop("outgame3");
				}

				if (backPageName == "uihome") {
					playDtSound();
				}
				oppeen(backPageName);
			},
			propsModeClic
		);
		let paiwei8Load = new PIXI.Loader();
		let baseUi = xloader.value.resources.baseUi.textures;
		paiwei8Load.add("shenfenpipei", `${imgPath}mode/paiwei/shenfenpipei.skel`);
		paiwei8Load.add("shenfentianti", `${imgPath}mode/paiwei/shenfentianti.skel`);
		paiwei8Load.add("guozhantianti", `${imgPath}mode/paiwei/guozhantianti.skel`);
		paiwei8Load.add("newMatch", `${imgPath}mode/paiwei/newMatch.json`);
		paiwei8Load.add("kaishipipei_sg", `${imgPath}mode/paiwei/kaishipipei_sg.skel`);

		let chatUi = xloader.value.resources.chatUi.textures;

		let currentMode = "shenfentianti";
		function setTitle(str) {
			text.text = str;
		}
		paiwei8Load.load(() => {
			let newMatch = paiwei8Load.resources.newMatch.textures;

			//骨骼
			// 国战天梯  play入场  play2待机  guozhantianti
			// 身份匹配  play入场  play2待机  shenfenpipei
			// 身份天梯  play入场  play2待机  shenfentianti
			let shenfenpipeiSkel = new PIXI.spine.Spine(paiwei8Load.resources.shenfenpipei.spineData);
			let shenfentiantiSkel = new PIXI.spine.Spine(paiwei8Load.resources.shenfentianti.spineData);
			let guozhantiantiSkel = new PIXI.spine.Spine(paiwei8Load.resources.guozhantianti.spineData);
			let skelArr = [
				{
					name: "shenfenpipei",
					skel: shenfenpipeiSkel,
				},
				{
					name: "shenfentianti",
					skel: shenfentiantiSkel,
				},
				{
					name: "guozhantianti",
					skel: guozhantiantiSkel,
				},
			];

			// 初始化所有骨骼动画的尺寸、位置和事件监听
			function initSkelProperties(skel) {
				skel.width = pixiApp.value.screen.width;
				skel.height = pixiApp.value.screen.height;
				skel.x = pixiApp.value.screen.width / 2;
				skel.y = pixiApp.value.screen.height / 2;
				skel.scale.set(isMobile ? 0.7 : 1.2);
				skel.state.addListener({
					complete(track, event) {
						skel.state.setAnimation(0, "play2", true);
					},
				});
			}

			// 为所有骨骼动画初始化属性
			initSkelProperties(shenfenpipeiSkel);
			initSkelProperties(shenfentiantiSkel);
			initSkelProperties(guozhantiantiSkel);

			// 修复setSkelVisible函数，确保一次只显示一个骨骼动画
			function setSkelVisible(name) {
				// 先隐藏所有骨骼动画
				skelArr.forEach(item => {
					item.skel.visible = false;
				});

				// 显示指定的骨骼动画
				let showSkel = skelArr.find(item => item.name == name);
				if (showSkel && showSkel.skel) {
					showSkel.skel.visible = true;
					// 播放入场动画
					showSkel.skel.state.clearTracks();
					showSkel.skel.state.setAnimation(0, "play", false);
				}
			}
			setSkelVisible(currentMode);

			paiwei8Con.addChild(shenfentiantiSkel);
			paiwei8Con.addChild(shenfenpipeiSkel);
			paiwei8Con.addChild(guozhantiantiSkel);
			//禁将等按钮
			//限免武将周六版 newMatchBSATLimitTimeGeneralBtn_normal.png newMatchBSATLimitTimeGeneralBtn_over.png
			//限免武将 newMatchLimitTimeGeneralBtn_normal.png newMatchLimitTimeGeneralBtn_over.png
			//卡牌图鉴 newMatchCardBtn_normal.png  newMatchCardBtn_over.png
			//历程 newMatchCourseBtn_normal.png newMatchCourseBtn_over.png
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
			paiwei8Con.addChild(leftBtnCon);

			//宝箱 newMatchAwardBg.png
			function createAward() {
				let leftBoxCon = new PIXI.Container();
				let leftBox = new PIXI.Sprite(newMatch["newMatchAwardBg.png"]);
				let boxdwTipText = new PIXI.Text("身份天梯达到2000分", {
					fontFamily: "font",
					fontSize: 13,
					fill: 0xffffff,
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
				paiwei8Con.addChild(leftBoxCon);
			}
			createAward();
			//赛季剩余多少天
			function createDateTip() {
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
				paiwei8Con.addChild(timeCon);
			}
			createDateTip();
			//好友排行文字 newMatchFriendRankText.png

			//天梯鼓 newMatchPeakIcon1.png
			//身份天体面具 newMatchPeakIcon2.png
			//身份匹配面具 newMatchPeakIcon3.png
			//身份排行背景 newMatchRightFlagBg.png
			//天梯积分文字 newMatchScoreFont.png
			//匹配积分文字 newMatchScoreFont1.png
			//我的排名文字 newMatchSelfRankText.png
			let mianju = null;
			function setMianjuTextture() {
				if (currentMode == "shenfentianti") {
					mianju.texture = newMatch["newMatchPeakIcon2.png"];
				} else if (currentMode == "shenfenpipei") {
					mianju.texture = newMatch["newMatchPeakIcon3.png"];
				} else {
					mianju.texture = newMatch["newMatchPeakIcon1.png"];
				}
			}
			let tiantijifen = null;
			function createPaiHang() {
				let paiHangCon = new PIXI.Container();
				let paiHangBg = new PIXI.Sprite(newMatch["newMatchRightFlagBg.png"]);
				paiHangCon.width = paiHangBg.width;
				paiHangCon.height = paiHangBg.height;
				paiHangCon.addChild(paiHangBg);
				paiHangCon.x = pixiApp.value.screen.width - paiHangBg.width - 40;
				paiHangCon.y = 0;
				mianju = new PIXI.Sprite(newMatch["newMatchPeakIcon1.png"]);
				mianju.scale.set(0.7);
				setMianjuTextture();
				mianju.x = paiHangBg.width * 0.5 - mianju.width * 0.5;
				mianju.y = 10;
				let tiantijifenTitle = new PIXI.Sprite(newMatch["newMatchScoreFont.png"]);
				tiantijifenTitle.scale.set(0.8);
				tiantijifenTitle.x = paiHangBg.width * 0.5 - tiantijifenTitle.width * 0.5;
				tiantijifenTitle.y = mianju.y + mianju.height - 15;
				tiantijifen = new PIXI.Text("1200", {
					fontSize: 20,
					fill: 0xffffff,
				});
				tiantijifen.x = paiHangBg.width * 0.5 - tiantijifen.width * 0.5;
				tiantijifen.y = tiantijifenTitle.y + tiantijifenTitle.height + 2;

				let touxiangSprite = new PIXI.Sprite(xloader.value.resources.touxiang.texture);
				let paimingSprite = new PIXI.Sprite(newMatch["newMatchRankFlag1.png"]);
				paimingSprite.scale.set(0.5);
				touxiangSprite.width = Math.max(ratios.value * 30, 30);
				touxiangSprite.height = Math.max(ratios.value * 30, 30);
				touxiangSprite.scale.set(Math.max(ratios.value * 0.6, 0.6));
				touxiangSprite.x = (paiHangBg.width - touxiangSprite.width) * 0.5;
				paimingSprite.x = touxiangSprite.x - paimingSprite.width * 0.3;
				touxiangSprite.y = tiantijifen.y + tiantijifen.height + 10;
				paimingSprite.y = touxiangSprite.y - paimingSprite.height * 0.3;

				let username = new PIXI.Text(getUserName(), {
					fontSize: 14,
					fill: "#D27423",
				});
				username.x = (paiHangBg.width - username.width) * 0.5;
				username.y = touxiangSprite.y + touxiangSprite.height + 10;
				paiHangCon.addChild(touxiangSprite, paimingSprite, username, mianju, tiantijifenTitle, tiantijifen);
				paiwei8Con.addChild(paiHangCon);
			}
			createPaiHang();
			let modeMap = {
				shenfentianti: "身份天梯",
				shenfenpipei: "军五天梯",
				guozhantianti: "国战天梯",
			};
			function setJiFen() {
				let modeData = scoreSystem.getModeData(modeMap[currentMode]);
				tiantijifen.text = modeData["当前积分"];
			}
			// 添加模式切换按钮
			//左侧排位巅峰切换竖线背景   newMatchTabLine1.png
			function createModeSwitchButtons() {
				let changeDfConBg = new PIXI.Sprite(newMatch["newMatchTabLine1.png"]);
				changeDfConBg.scale.set(0.8);
				changeDfConBg.x = 40;
				changeDfConBg.y = 15;
				paiwei8Con.addChild(changeDfConBg);

				const modeButtons = [
					{ name: "shenfentianti", label: "身份天梯" },
					{ name: "shenfenpipei", label: "五人军争" },
					{ name: "guozhantianti", label: "国战天梯" },
				];
				let normalTxtture = newMatch["newMatchTabNormal1.png"];
				let noverTxtture = newMatch["newMatchTabNormal2.png"];

				let selectTxtture = newMatch["newMatchTabSelect1.png"];
				let selectNoverTxtture = newMatch["newMatchTabSelect2.png"];
				function setSelect() {
					modeButtons.forEach(item => {
						if (currentMode == item.name) {
							setTitle(item.label);
						}
						item.sprite.texture = currentMode == item.name ? selectTxtture : normalTxtture;
						item.text.style.fill = currentMode == item.name ? 0xffffff : 0xd27423;
					});
				}
				modeButtons.forEach((item, index) => {
					let dianfengBtnCon = new PIXI.Container();
					let dianfengBtnBg = new PIXI.Sprite(normalTxtture);
					let dianfeng1Text = new PIXI.Text(item.label, {
						fontSize: 16,
						fill: 0xd27423,
					});
					dianfengBtnBg.scale.set(0.8);
					dianfengBtnCon.addChild(dianfengBtnBg, dianfeng1Text);
					dianfengBtnCon.x = changeDfConBg.x - 14;

					dianfengBtnBg.x = 0;
					dianfengBtnBg.y = 0;
					dianfeng1Text.x = dianfengBtnBg.width * 0.5 - dianfeng1Text.width * 0.7;
					dianfeng1Text.y = dianfengBtnBg.height * 0.5 - dianfeng1Text.height * 0.5;
					if (index == 0) {
						dianfengBtnCon.y = changeDfConBg.y + changeDfConBg.height * 0.12;
					} else if (index == 1) {
						dianfengBtnCon.y = changeDfConBg.y + changeDfConBg.height * 0.4;
					} else {
						dianfengBtnCon.y = changeDfConBg.y + changeDfConBg.height * 0.7;
					}
					dianfengBtnCon.interactive = true;
					dianfengBtnCon.cursor = "pointer";
					addBtnFilter(dianfengBtnCon);
					dianfengBtnCon.on("mouseout", () => {
						dianfengBtnBg.texture = currentMode == item.name ? selectTxtture : normalTxtture;
					});
					dianfengBtnCon.on("mouseover", () => {
						dianfengBtnBg.texture = currentMode == item.name ? selectNoverTxtture : noverTxtture;
					});
					dianfengBtnCon.on("pointerdown", () => {
						currentMode = item.name;
						setSkelVisible(currentMode);
						setMianjuTextture();
						setSelect();
						setJiFen();
					});
					item.sprite = dianfengBtnBg;
					item.text = dianfeng1Text;
					paiwei8Con.addChild(dianfengBtnCon);
				});

				setSelect();
				setJiFen();
			}

			// 创建模式切换按钮
			createModeSwitchButtons();

			//创建开始匹配按钮
			function createstartMatchBtn() {
				let startMatchBtn = new PIXI.Sprite(baseUi["newStyleBaseUIBtn_180_54_normal.png"]);
				startMatchBtn.anchor.set(0.5);
				startMatchBtn.scale.set(0.8);
				startMatchBtn.x = pixiApp.value.screen.width - 40 - startMatchBtn.width * 0.5;
				startMatchBtn.y = pixiApp.value.screen.height * 0.9;
				initClickBtn(startMatchBtn, baseUi["newStyleBaseUIBtn_180_54_normal.png"], baseUi["newStyleBaseUIBtn_180_54_over.png"], null, () => {
					openMode(currentMode);
				});
				addBtnFilter(startMatchBtn);
				let startMatchBtnAn = new PIXI.spine.Spine(paiwei8Load.resources.kaishipipei_sg.spineData);
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
				paiwei8Con.addChild(startMatchBtn);
				paiwei8Con.addChild(startMatchText);
				startMatchBtnAn.scale.set(0.66, 0.8);
				paiwei8Con.addChild(startMatchBtnAn);
			}
			createstartMatchBtn();

			paiwei8Con.on("added", async () => {
				backPageName = sessionStorage.getItem("yjcm_back_page") || "uihome";
				console.log("backName", backPageName);
				sessionStorage.removeItem("yjcm_back_page");
				// setTimeout(() => {
				setSkelVisible(currentMode); // 使用修复后的函数播放初始动画
				// }, 100);
				if (PIXI.sound.exists("outgame3")) {
					PIXI.sound.play("outgame3", { loop: true });
				}
			});

			paiwei8Con.addChild(backCon);
			resolve({
				paiwei8Con,
			});
		});
	});
}
