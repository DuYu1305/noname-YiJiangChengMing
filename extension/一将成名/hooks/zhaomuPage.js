import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { getMax, initClickBtn, getUserName, isMobile, moveAn, scaleAn, addBtnFilter, delayFn, initPBAnimation, createBackBtn, spinePath, getBGAnInfo, imgPath } from "../utils/index.js";
import { multiDraw, getNextHighQualityDraws, getZhaomuhz, clearDrawData } from "../utils/zhaomu.js";
import {wjshuaidian} from "../config/zhaomuJc.js"
import { BackpackManager } from "../utils/BackpackManager.js";
export async function useZhaomuPage(pixiApp, xloader, ratiow, ratioh, ratios, oppeen, zhaomuWjList, showZhaomuJc) {
	return new Promise((resolve, reject) => {
		let vipUi = xloader.value.resources.vipUi.textures;
		let chatUi = xloader.value.resources.chatUi.textures;

		let baseUi = xloader.value.resources.baseUi.textures;

		let zhaomuCon = new PIXI.Container();
		zhaomuCon.width = pixiApp.value.screen.width;
		zhaomuCon.height = pixiApp.value.screen.height;
		let zhaomuLoad = new PIXI.Loader();
		let pakageNumSprite = {};
		let zmbj = null;
		let topCon = new PIXI.Container();
		let sssAn = null;
		let zhaomuMode = 1;
		let handlerBtnMap = {
			drawBtn: null,
			招募一次: null,
			确定: null,
			confirmBtn: null,
			招募十次: null,
			multiDrawBtn: null,
			继续招募: null,
			continueDrawBtn: null,
			shopBtn: null,
			giftBtn: null,
			tipText: null,
			tipCon: null,
			leftClearBtn: null,
		};
		let moneyArr = [
			{
				name: "tongyuan",
				showAddBtn: true,
			},
			{
				name: "bangyuan",
			},
			{
				name: "zhaomuling",
				showAddBtn: true,
			},
			{
				name: "jiangfu",
			},
			{
				name: "pojieshi",
			},
		];
		let zhaomuhuode = null;
		zhaomuLoad.add("zmbj", `${spinePath}zhaomu/jiangxingzhaomu.skel`);
		zhaomuLoad.add("sssAn", `${spinePath}zhaomu/jiangxing_kapai.skel`);
		zhaomuLoad.add("zhaomuhuode", `${spinePath}zhaomu/zhaomu_huode.skel`);
		zhaomuLoad.add("gameRecruitUi", `${imgPath}zhaomu/gameRecruit.json`);
		zhaomuLoad.add("zhaomuling", `${imgPath}zhaomu/200007.png`);
		zhaomuLoad.add("jiangfu", `${imgPath}zhaomu/790004.png`);
		zhaomuLoad.add("pojieshi", `${imgPath}zhaomu/790005.png`);
		zhaomuLoad.add("bgimg", `${imgPath}zhaomu/RecruitStarShopBg.png`);

		zhaomuLoad.load(() => {
			let { backCon } = createBackBtn(
				"将星招募",
				pixiApp,
				xloader,
				ratiow,
				ratioh,
				ratios,
				() => {
					oppeen();
				},
				null,
				() => {
					console.log("帮助");
					showZhaomuJc.value = true;
				}
			);
			let gameRecruitUi = zhaomuLoad.resources.gameRecruitUi.textures;

			function addTopUi() {
				let infoY = 0;
				moneyArr.forEach((item, index) => {
					let con = new PIXI.Container();
					let img;
					if (item.name == "tongyuan" || item.name == "bangyuan") {
						img = new PIXI.Sprite(xloader.value.resources[item.name].texture);
					} else {
						img = new PIXI.Sprite(zhaomuLoad.resources[item.name].texture);
					}
					let height = 25;
					img.width = getMax(height, ratios);
					img.height = getMax(height, ratios);
					let moneyBg = new PIXI.Sprite(baseUi["newStyleBaseUICurrencyBg.png"]);
					moneyBg.width = getMax(100, ratios);
					moneyBg.height = getMax(height, ratios);
					con.addChild(moneyBg, img);
					con.x = pixiApp.value.screen.width - 15 * (index + 1) - moneyBg.width * (index + 1) - 15;
					con.y = 8;

					let num = new PIXI.Text(BackpackManager.getItemNum(item.name), {
						fontSize: getMax(18, ratios),
						fontFamily: "xingkai",
						fill: 0xffffff,
					});
					item.textSprite = num;
					if (item.showAddBtn) {
						let addBtn = new PIXI.Sprite(baseUi["moreTaskConditionAddBtn_normal.png"]);
						addBtn.width = getMax(height, ratios);
						addBtn.height = getMax(height, ratios);
						con.addChild(addBtn);
						addBtn.x = moneyBg.width - addBtn.width / 2;

						infoY = img.y + img.height;

						initClickBtn(addBtn, null, null, "Label", () => {
							BackpackManager.changeItemNum(item.name, 100);
							num.text = BackpackManager.getItemNum(item.name);
						});
					}
					num.x = moneyBg.width / 2 - num.width / 2;
					num.y = moneyBg.height / 2 - num.height / 2;
					pakageNumSprite[item.name] = num;
					con.addChild(num);
					topCon.addChild(con);
				});
				zhaomuCon.addChild(topCon);
			}
			function setzmBj() {
				let bgimg = new PIXI.Sprite(zhaomuLoad.resources.bgimg.texture);
				bgimg.width = pixiApp.value.screen.width;
				bgimg.height = pixiApp.value.screen.height;
				zhaomuCon.addChild(bgimg);
				zhaomuhuode = new PIXI.spine.Spine(zhaomuLoad.resources.zhaomuhuode.spineData);
				zhaomuhuode.x = pixiApp.value.screen.width / 2;
				zhaomuhuode.y = pixiApp.value.screen.height / 2;
				// zhaomuhuode.width = 300;
				// zhaomuhuode.height = 100
				zhaomuhuode.visible = false;
				zhaomuhuode.scale.set(ratios.value);
				zmbj = new PIXI.spine.Spine(zhaomuLoad.resources.zmbj.spineData);
				sssAn = new PIXI.spine.Spine(zhaomuLoad.resources.sssAn.spineData);
				sssAn.width = pixiApp.value.screen.width;
				sssAn.height = pixiApp.value.screen.height;
				sssAn.x = pixiApp.value.screen.width / 2;
				sssAn.y = pixiApp.value.screen.height / 2;
				sssAn.scale.set(1.35 * ratios.value);
				sssAn.visible = false;
				zmbj.width = pixiApp.value.screen.width;
				zmbj.height = pixiApp.value.screen.height;
				zmbj.x = pixiApp.value.screen.width / 2;
				zmbj.y = pixiApp.value.screen.height / 2;
				zmbj.scale.set(1.3 * ratios.value);
				zhaomuCon.addChild(zmbj, sssAn, zhaomuhuode);
				// zmbj.state.setAnimation(0, "ruchang", false);
			}
			//招募开始隐藏招募按钮 返回按钮 顶部信息
			//招募结束展示确认和继续按钮 隐藏sss动画和获得动画
			function hideSprit(flag) {
				handlerBtnMap["招募一次"].visible = flag;
				handlerBtnMap["招募十次"].visible = flag;
				handlerBtnMap.drawBtn.visible = flag;
				handlerBtnMap.multiDrawBtn.visible = flag;
				handlerBtnMap.shopBtn.visible = flag;
				handlerBtnMap.giftBtn.visible = flag;
				handlerBtnMap.tipCon.visible = flag;
				handlerBtnMap.leftClearBtn.visible = flag;
				backCon.visible = flag;
				topCon.visible = flag;
				zhaomuhuode.visible = false;
				sssAn.visible = false;
				zhaomuWjList.value = [];
				// console.log("zhaomuWjList", zhaomuWjList.value);
				if (flag) {
					zmbj.state.setAnimation(0, "daiji", false);
					handlerBtnMap.tipText.text = getNextHighQualityDraws();
				}
			}
			//招募结束展示确认和继续按钮
			function showConfirmSprit(flag) {
				handlerBtnMap["确定"].visible = flag;
				handlerBtnMap["继续招募"].visible = flag;
				handlerBtnMap["继续招募"].text = zhaomuMode == 1 ? "招募1次" : "招募10次";
				handlerBtnMap.confirmBtn.visible = flag;
				handlerBtnMap.continueDrawBtn.visible = flag;
			}
			async function playAddShuaidianAn(wjList = []) {
				//
				for (let index = 0; index < wjList.length; index++) {
					let item = wjList[index];
					if (!item.own) {
						let shuaidian = wjshuaidian[item.level];
						let con = new PIXI.Container();
						let shuadianBj = new PIXI.Sprite(vipUi["OfficialRankAddBg.png"]);
						con.width = shuadianBj.width;
						con.height = shuadianBj.height;
						con.addChild(shuadianBj);
						let text = new PIXI.Text(shuaidian, {
							fill: "#BAFB2C",
							fontSize: getMax(22, ratios),
						});
						text.x = shuadianBj.width * 0.65;
						text.y = shuadianBj.height / 2 - text.height / 2;
						con.addChild(text);
						let gjSprite = new PIXI.Sprite(vipUi["OfficialRankIcon10.png"]);
						gjSprite.scale.set(0.5);
						gjSprite.x = gjSprite.width;
						gjSprite.y = shuadianBj.height / 2 - gjSprite.height / 2;
						con.addChild(gjSprite);

						con.x = pixiApp.value.screen.width / 2 - shuadianBj.width / 2;
						con.y = pixiApp.value.screen.height * 0.3;
						zhaomuCon.addChild(con);
						gsap.fromTo(
							con,
							// 起始状态
							{
								y: con.y, // 从屏幕中间X位置开始
							},
							// 结束状态
							{
								y: shuadianBj.height + 20, // 移动到左侧目标X位置
								duration: 0.3, // 动画持续1秒
								ease: "power2.out", // 缓动效果
							}
						);
						await delayFn(300);
						let t = setTimeout(() => {
							clearTimeout(t);
							zhaomuCon.removeChild(con);
							con.destroy();
						}, 300);
					}
				}
			}
			function updateText() {
				// console.log("更新招募次数");
				pakageNumSprite["zhaomuling"].text = BackpackManager.getItemNum("zhaomuling");
				pakageNumSprite["pojieshi"].text = BackpackManager.getItemNum("pojieshi");
				pakageNumSprite["jiangfu"].text = BackpackManager.getItemNum("jiangfu");
			}
			function handleResult() {
				let result = multiDraw(zhaomuMode);
				let canBuyRes = BackpackManager.useItem("zhaomuling", zhaomuMode);
				if (!canBuyRes.success) {
					alert(canBuyRes.msg);
					return;
				}

				PIXI.sound.play(`zhaomu`, { loop: false });

				let num = zhaomuMode;
				hideSprit(false);
				showConfirmSprit(false);
				let highestLevel = result.highestLevel;
				updateText();
				let wjList = result.result;
				playAddShuaidianAn(wjList);
				// if (num == 10) {
				//   //十连
				// } else {
				// }
				let color = "lanse";
				switch (highestLevel) {
					case "sssa":
						color = "hong";
						break;
					case "sssb":
						color = "chengse";
						break;
					case "ssa":
						color = "zise";
						break;
					case "ssb":
						color = "zise";
						break;
					case "s":
						color = "lanse";
						break;
						break;
					default:
						break;
				}
				let anname = `zhaomu${num}_${color}`;

				zmbj.state.setAnimation(0, anname, false);
				if (highestLevel == "sssa" || highestLevel == "sssb") {
					let t = setTimeout(() => {
						clearTimeout(t);
						sssAn.visible = true;
						sssAn.state.setAnimation(0, "kapai", false);
						PIXI.sound.play(`finishRed`, { loop: false });

					}, 1600);
					showWjList(wjList, 4100, true);
				} else {
					showWjList(wjList, 1600);
				}
				console.log(result);
			}
			function showWjList(wjList, dtime, flag = false) {
				let t = setTimeout(() => {
					clearTimeout(t);
					if (flag) {
						sssAn.visible = false;
					}
					zhaomuhuode.visible = true;
					showConfirmSprit(true);
					zhaomuWjList.value = wjList;
					zhaomuhuode.state.setAnimation(0, "play", false);
				}, dtime);
			}
			function createConfirmBtn(leftBtn, rightBtn, leftText, rightText, leftClick, rightCLick, flag) {
				handlerBtnMap[rightBtn] = new PIXI.Sprite(baseUi["newStyleBaseUIBtn_180_54_normal.png"]);
				handlerBtnMap[rightBtn].anchor.set(0.5);
				handlerBtnMap[rightBtn].scale.set(0.8);
				handlerBtnMap[rightBtn].x = pixiApp.value.screen.width * 0.5 + handlerBtnMap[rightBtn].width * 0.9;

				handlerBtnMap[rightBtn].y = pixiApp.value.screen.height * 0.9;
				initClickBtn(handlerBtnMap[rightBtn], baseUi["newStyleBaseUIBtn_180_54_normal.png"], baseUi["newStyleBaseUIBtn_180_54_over.png"], null, () => {
					rightCLick();
				});
				addBtnFilter(handlerBtnMap[rightBtn]);
				handlerBtnMap[rightText] = new PIXI.Text(rightText, {
					fontSize: 18,
					fill: "#5C3B24",
				});
				handlerBtnMap[rightText].anchor.set(0.5);

				handlerBtnMap[rightText].x = handlerBtnMap[rightBtn].x;
				handlerBtnMap[rightText].y = handlerBtnMap[rightBtn].y;

				handlerBtnMap[leftBtn] = new PIXI.Sprite(baseUi["newStyleBaseUIBtn2_180_54_normal.png"]);
				handlerBtnMap[leftBtn].anchor.set(0.5);
				handlerBtnMap[leftBtn].scale.set(0.8);
				handlerBtnMap[leftBtn].x = pixiApp.value.screen.width * 0.5 - handlerBtnMap[leftBtn].width * 0.9;
				handlerBtnMap[leftBtn].y = pixiApp.value.screen.height * 0.9;
				initClickBtn(handlerBtnMap[leftBtn], baseUi["newStyleBaseUIBtn2_180_54_normal.png"], baseUi["newStyleBaseUIBtn2_180_54_over.png"], null, () => {
					leftClick();
				});
				addBtnFilter(handlerBtnMap[leftBtn]);
				handlerBtnMap[leftText] = new PIXI.Text(leftText, {
					fontSize: 18,
					fill: "#EAAD60",
				});
				handlerBtnMap[leftText].anchor.set(0.5);
				handlerBtnMap[leftText].x = handlerBtnMap[leftBtn].x;
				handlerBtnMap[leftText].y = handlerBtnMap[leftBtn].y;
				handlerBtnMap[leftBtn].visible = flag;
				handlerBtnMap[leftText].visible = flag;
				handlerBtnMap[rightBtn].visible = flag;
				handlerBtnMap[rightText].visible = flag;
				zhaomuCon.addChild(handlerBtnMap[leftBtn]);
				zhaomuCon.addChild(handlerBtnMap[leftText]);
				zhaomuCon.addChild(handlerBtnMap[rightBtn]);
				zhaomuCon.addChild(handlerBtnMap[rightText]);
			}
			function clearZhaomuInfo() {
				let res = confirm("点击确定将清空招募武将记录！");
				if (res) {
					clearDrawData();
					BackpackManager.clearItem("pojieshi");
					BackpackManager.clearItem("jiangfu");
					updateText();
				}
			}
			function createRightBtn() {
				let rightBtnArr = [
					{
						img: "GameRecruitBtnShop_normal.png",
						imgOver: "GameRecruitBtnShop_over.png",
						onClick: () => {
							alert(getZhaomuhz());
						},
					},
					{
						img: "GameRecruitBtnGift_normal.png",
						imgOver: "GameRecruitBtnGift_over.png",
						onClick: () => {
							BackpackManager.changeItemNum("zhaomuling", 100);
							moneyArr[2].textSprite.text = BackpackManager.getItemNum("zhaomuling");
						},
					},
				];
				rightBtnArr.forEach((item, index) => {
					let name = index == 0 ? "shopBtn" : "giftBtn";
					handlerBtnMap[name] = new PIXI.Sprite(gameRecruitUi[item.img]);
					handlerBtnMap[name].scale.set(0.8 * ratios.value);
					if (index == 0) {
						handlerBtnMap[name].x = pixiApp.value.screen.width - handlerBtnMap[name].width - 12 * ratios.value;
					} else {
						handlerBtnMap[name].x = pixiApp.value.screen.width - handlerBtnMap[name].width;
					}
					handlerBtnMap[name].y = pixiApp.value.screen.height * 0.9 - handlerBtnMap[name].height * (index + 1);
					initClickBtn(handlerBtnMap[name], gameRecruitUi[item.img], gameRecruitUi[item.imgOver], null, () => {
						if (item.onClick) {
							item.onClick();
						}
					});
					zhaomuCon.addChild(handlerBtnMap[name]);
				});
			}
			function createLeftBtn() {
				let name = "leftClearBtn";
				handlerBtnMap[name] = new PIXI.Container();
				let img = new PIXI.Sprite(gameRecruitUi["GameRecruitOther.png"]);
				img.x = 20;
				img.y = pixiApp.value.screen.height * 0.9 - img.height;
				initClickBtn(img, gameRecruitUi["GameRecruitOther.png"], null, null, () => {
					// clearZhaomuInfo();
				});
				let btn = new PIXI.Sprite(gameRecruitUi["GameRecruitBtnShow_normal.png"]);
				btn.x = img.x + img.width + 5;
				btn.y = img.y + img.height * 0.5 - btn.height * 0.5;
				initClickBtn(btn, gameRecruitUi["GameRecruitBtnShow_normal.png"], gameRecruitUi["GameRecruitBtnShow_over.png"], null, () => {
					clearZhaomuInfo();
				});
				handlerBtnMap[name].addChild(img, btn);
				zhaomuCon.addChild(handlerBtnMap[name]);
			}

			setzmBj();
			//通元绑元招募令...
			addTopUi();
			createLeftBtn();
			createConfirmBtn(
				"drawBtn",
				"multiDrawBtn",
				"招募一次",
				"招募十次",
				() => {
					zhaomuMode = 1;
					handleResult();
				},
				() => {
					zhaomuMode = 10;
					handleResult();
				},
				true
			);

			createConfirmBtn(
				"confirmBtn",
				"continueDrawBtn",
				"确定",
				"继续招募",
				() => {
					//确定
					showConfirmSprit(false);
					hideSprit(true);
				},
				() => {
					handleResult();
				},
				false
			);
			zhaomuCon.addChild(backCon);
			createRightBtn();
			handlerBtnMap.tipCon = new PIXI.Container();
			handlerBtnMap.tipCon.x = pixiApp.value.screen.width * 0.5;
			handlerBtnMap.tipCon.y = pixiApp.value.screen.height * 0.7;
			let tipImg = new PIXI.Sprite(gameRecruitUi["GameRecruitTipStar.png"]);
			handlerBtnMap.tipCon.width = tipImg.width;
			handlerBtnMap.tipCon.height = tipImg.height;
			tipImg.anchor.set(0.5);
			handlerBtnMap.tipText = new PIXI.Text(getNextHighQualityDraws(), {
				fill: "#FFD28C",
				fontSize: 24,
			});
			handlerBtnMap.tipText.anchor.set(0.5);
			handlerBtnMap.tipText.y = -handlerBtnMap.tipText.height * 0.5;
			handlerBtnMap.tipCon.addChild(tipImg, handlerBtnMap.tipText);
			zhaomuCon.addChild(handlerBtnMap.tipCon);
			zhaomuCon.on("added", () => {
				moneyArr.forEach((item, index) => {
					item.textSprite.text = BackpackManager.getItemNum(item.name);
				});
				zmbj.visible = false;
				zmbj.visible = true;
				// zmbj.state.clearTracks();
				zmbj.state.setAnimation(0, "ruchang", false);
			});
			resolve({
				zhaomuCon,
			});
		});
	});
}
