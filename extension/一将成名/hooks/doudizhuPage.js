import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { getMax, EXTENSION_NAME, initClickBtn, getUserName, isMobile, moveAn, scaleAn, addBtnFilter, initPBAnimation, createBackBtn, spinePath, getBGAnInfo, imgPath } from "../utils/index.js";
import doudizhuStats from "../utils/DoudizhuStats.js";

export async function useDoudizhuPage(pixiApp, xloader, ratiow, ratioh, ratios, oppeen, propsModeClic) {
	return new Promise((resolve, reject) => {
		function openMode(name) {
			switch (name) {
				case "doudizhu":
					//欢乐
					game.saveConfig("doudizhu_mode", "huanle", "doudizhu");
					propsModeClic("doudizhu");
					break;
				default:
					break;
			}
		}
		let vipUi = xloader.value.resources.vipUi.textures;
		let chatUi = xloader.value.resources.chatUi.textures;

		// 初始化斗地主统计
		const ddzStatus = doudizhuStats.getStats();
		let lianshengNum = ddzStatus.weeklyMaxStreak;
		let currentStreak = ddzStatus.currentStreak;
		const rankSprite = new PIXI.Sprite(vipUi["OfficialRankIcon10.png"]);

		let doudizhuCon = new PIXI.Container();
		doudizhuCon.width = pixiApp.value.screen.width;
		doudizhuCon.height = pixiApp.value.screen.height;
		let ddzLoad = new PIXI.Loader();
		let { peSrc, bjSrc, ...posInfo } = getBGAnInfo("doudizhu");
		console.log("peSrc", peSrc, bjSrc);
		//张飞背景
		ddzLoad.add("ddzzf", peSrc);
		ddzLoad.add("ddzbg", bjSrc);
		ddzLoad.add("kaishipipei", `${spinePath}mode/doudizhu/zhouliu_kaishipipei.skel`);
		ddzLoad.add("doudizhubaseui", `${imgPath}mode/doudizhu/newFightLordMatch.json`);

		ddzLoad.add("huanledou", `${imgPath}mode/doudizhu/710123.png`);
		ddzLoad.add("jinpiao", `${imgPath}mode/doudizhu/710228.png`);
		ddzLoad.load(() => {
			let zhangfei = new PIXI.spine.Spine(ddzLoad.resources.ddzzf.spineData);
			let beijing = new PIXI.spine.Spine(ddzLoad.resources.ddzbg.spineData);
			let kaishibtn = new PIXI.spine.Spine(ddzLoad.resources.kaishipipei.spineData);
			let ddzbaseUI = ddzLoad.resources.doudizhubaseui.textures;
			initPBAnimation(pixiApp, ratios, zhangfei, beijing, posInfo);
			doudizhuCon.addChild(beijing);
			doudizhuCon.addChild(zhangfei);
			doudizhuCon.addChild(kaishibtn);
			let {backCon} = createBackBtn("斗地主", pixiApp, xloader, ratiow, ratioh, ratios, oppeen, propsModeClic);
			doudizhuCon.addChild(backCon);

			kaishibtn.width = getMax(400, ratios);
			kaishibtn.height = getMax(400, ratios);
			kaishibtn.x = pixiApp.value.screen.width - kaishibtn.width / 3;
			kaishibtn.y = pixiApp.value.screen.height - kaishibtn.height / 3;
			kaishibtn.state.setAnimation(0, "play2", true);

			kaishibtn.interactive = true;
			kaishibtn.cursor = "pointer";
			kaishibtn.on("pointerdown", () => {
				openMode("doudizhu");
				kaishibtn.state.setAnimation(0, "play3");
			});

			let baseUi = xloader.value.resources.baseUi.textures;

			let moneyArr = [
				{
					name: "jinpiao",
					num: 9999,
				},
				{
					name: "huanledou",
					num: 9999,
				},
			];
			let infoY = 0;
			moneyArr.forEach((item, index) => {
				let con = new PIXI.Container();
				let img = new PIXI.Sprite(ddzLoad.resources[item.name].texture);
				let height = 25;
				img.width = getMax(height, ratios);
				img.height = getMax(height, ratios);
				let moneyBg = new PIXI.Sprite(baseUi["newStyleBaseUICurrencyBg.png"]);
				moneyBg.width = getMax(100, ratios);
				moneyBg.height = getMax(height, ratios);
				con.addChild(moneyBg, img);
				con.x = pixiApp.value.screen.width - 15 * (index + 1) - moneyBg.width * (index + 1) - 15;
				con.y = 8;
				if (index === 1) {
					let addBtn = new PIXI.Sprite(baseUi["moreTaskConditionAddBtn_normal.png"]);
					addBtn.width = getMax(height, ratios);
					addBtn.height = getMax(height, ratios);
					con.addChild(addBtn);
					addBtn.x = moneyBg.width - addBtn.width / 2;

					infoY = img.y + img.height;

					initClickBtn(addBtn, null, null, "Label");
				}
				let num = new PIXI.Text(item.num, {
					fontSize: getMax(18, ratios),
					fontFamily: "xingkai",
					fill: 0xffffff,
				});
				num.x = moneyBg.width / 2 - num.width / 2;
				num.y = moneyBg.height / 2 - num.height / 2;
				con.addChild(num);
				doudizhuCon.addChild(con);
			});

			//限免武将（最亮） newFightLordMatch_btn12.png  高亮： newFightLordMatch_btn13.png
			//排行榜：newFightLordMatch_btn2.png 高亮：newFightLordMatch_btn3.png
			//禁将newFightLordMatch_btn4.png    高亮newFightLordMatch_btn5.png
			//限免武将 newFightLordMatch_btn8.png   newFightLordMatch_btn9.png
			//光辉事迹 newFightLordMatch_btn6.png   newFightLordMatch_btn7.png
			let phBtnList = [
				{
					name: "newFightLordMatch_btn6.png",
					highName: "newFightLordMatch_btn7.png",
				},
				{
					name: "newFightLordMatch_btn8.png",
					highName: "newFightLordMatch_btn9.png",
				},
				{
					name: "newFightLordMatch_btn4.png",
					highName: "newFightLordMatch_btn5.png",
				},
				{
					name: "newFightLordMatch_btn2.png",
					highName: "newFightLordMatch_btn3.png",
				},
			];
			let lsY = 0;
			phBtnList.reduce(
				(pre, cur,index) => {
					let btn = new PIXI.Sprite(ddzbaseUI[cur.name]);
					btn.scale.set(getMax(0.8, ratios));
					let x = pre.x - btn.width - 30;
					btn.x = x;
					btn.y = infoY + 20;
					lsY = btn.y + btn.height;
					initClickBtn(btn, ddzbaseUI[cur.name], ddzbaseUI[cur.highName], "Label",()=>{
						if(index==2){
							if(game.openBpDialog)game.openBpDialog(true)
						}
					});
					doudizhuCon.addChild(btn);
					return {
						x,
					};
				},
				{ x: pixiApp.value.screen.width }
			);
			let lianshengCon = new PIXI.Container();
			//最高连胜标题 newFightLordMatch_1.png
			let lsTitle = new PIXI.Sprite(ddzbaseUI["newFightLordMatch_1.png"]);
			//最高连胜数字背景 newFightLordMatch_0.png
			let lsBg = new PIXI.Sprite(ddzbaseUI["newFightLordMatch_0.png"]);
			//最高连胜姓名背景 newFightLordMatch_2.png
			let lsNameBj = new PIXI.Sprite(ddzbaseUI["newFightLordMatch_2.png"]);
			let lsUserName = new PIXI.Text(getUserName(), {
				fontSize: getMax(18, ratios),
				fontFamily: "xingkai",
				fill: 0xffffff,
			});
			lsNameBj.height = lsUserName.height;
			// let lsNum = new PIXI.Sprite(ddzbaseUI["newFightLordMatch_num9.png"]);
			lianshengCon.width = lsTitle.width;
			lianshengCon.x = pixiApp.value.screen.width - lsTitle.width - 30;
			lianshengCon.y = lsY + 10;

			lsBg.x = lsTitle.width / 2 - lsBg.width / 2;

			lsBg.y = lsTitle.height - 12;
			// lsNum.x = lsTitle.width / 2 - lsNum.width / 2;
			// lsNum.y = lsBg.y + lsBg.height / 2 - lsNum.height / 2;

			lsNameBj.y = lsBg.y + lsBg.height - 20;
			lsNameBj.x = lsTitle.width / 2 - lsNameBj.width / 2;
			lsUserName.y = lsNameBj.y;
			lsUserName.x = lsTitle.width / 2 - lsUserName.width / 2;

			rankSprite.x = lsNameBj.x;
			rankSprite.y = lsNameBj.y;
			rankSprite.scale.set(0.3);
			function createTextImg(num) {
				let lsNumCon = new PIXI.Container();
				let lsNumArr = num.toString().split("");
				lsNumArr.forEach((item, index) => {
					//连胜数字 0-9 newFightLordMatch_num9.png
					let lsNum = new PIXI.Sprite(ddzbaseUI[`newFightLordMatch_num${item}.png`]);
					lsNum.x = index * lsNum.width;
					lsNumCon.addChild(lsNum);
				});
				return lsNumCon;
			}
			let lsNumCon = createTextImg(lianshengNum);
			lsNumCon.x = lsTitle.width / 2 - lsNumCon.width / 2;
			lsNumCon.y = lsBg.y + lsBg.height / 2 - lsNumCon.height / 2;
			lianshengCon.addChild(lsTitle, lsBg, lsNameBj, lsUserName, rankSprite, lsNumCon);
			lianshengCon.scale.set(getMax(0.85, ratios));
			doudizhuCon.addChild(lianshengCon);

			//金票商城：newFightLordMatch_btn1.png
			//消息 chatUi：newChat_btn_yjcm_normal.png·
			let chatBtn = new PIXI.Sprite(chatUi["newChat_btn_yjcm_normal.png"]);
			chatBtn.scale.set(getMax(0.8, ratios));
			chatBtn.x = chatBtn.width / 2;
			chatBtn.y = pixiApp.value.screen.height - chatBtn.height * 1.7;
			initClickBtn(chatBtn, null, null, "Label");
			doudizhuCon.addChild(chatBtn);

			let shopBtn = new PIXI.Sprite(ddzbaseUI["newFightLordMatch_btn0.png"]);
			shopBtn.scale.set(getMax(0.7, ratios));
			shopBtn.x = chatBtn.x + chatBtn.width * 1.5;
			shopBtn.y = chatBtn.y - shopBtn.height * 0.25;
			initClickBtn(shopBtn, ddzbaseUI["newFightLordMatch_btn0.png"], ddzbaseUI["newFightLordMatch_btn1.png"], "Label");
			doudizhuCon.addChild(shopBtn);

			//当前连胜文字 newFightLordMatch_box_11.png
			//当前连胜文字背景 newFightLordMatch_box_8.png
			//整体背景：newFightLordMatch_box_14.png
			let boxCon = new PIXI.Container();
			let boxBg = new PIXI.Sprite(ddzbaseUI["newFightLordMatch_box_14.png"]);
			boxCon.x = pixiApp.value.screen.width / 2 - boxBg.width / 2;
			boxCon.y = pixiApp.value.screen.height - boxBg.height * 1.3;
			boxCon.addChild(boxBg);

			let boxConTitle = new PIXI.Text("每周一0:00重置", {
				fontSize: getMax(16, ratios),
				// fontFamily: "xingkai",
				fill: "rgba(228, 145, 1, 0.9)"
			});
			boxConTitle.x = boxBg.width / 2 - boxConTitle.width / 2;
			boxCon.addChild(boxConTitle);
			let boxLsCon = new PIXI.Container();
			let boxlsTextBg = new PIXI.Sprite(ddzbaseUI["newFightLordMatch_box_8.png"]);
			let boxlsTitle = new PIXI.Sprite(ddzbaseUI["newFightLordMatch_box_11.png"]);
			boxLsCon.x = boxBg.width * 0.1;
			boxLsCon.y = boxCon.height * 0.16;
			boxLsCon.width = boxlsTextBg.width;
			boxLsCon.height = boxlsTextBg.height;
			boxlsTitle.x = boxlsTextBg.width / 2 - boxlsTitle.width / 2;
			boxlsTitle.y = boxlsTextBg.height * 0.73;
			let boxNumCon = createTextImg(currentStreak);
			boxNumCon.x = boxlsTextBg.width / 2 - boxNumCon.width / 2;
			boxNumCon.y = boxlsTextBg.height / 2 - boxNumCon.height / 2;
			boxLsCon.addChild(boxlsTextBg, boxlsTitle, boxNumCon);
			boxCon.addChild(boxLsCon);

			let boxMainCon = new PIXI.Container();
			//四个箱子 从左到右青铜 白银 黄金 钻石
			//铜箱子 newFightLordMatch_box_0.png   开：newFightLordMatch_boxlq_0.png
			//银箱子 newFightLordMatch_box_1.png  开：newFightLordMatch_boxlq_1.png
			//金箱子：newFightLordMatch_box_2.png  开：newFightLordMatch_boxlq_2.png
			//钻石箱子：newFightLordMatch_box_3.png 开：newFightLordMatch_boxlq_3.png
			//完成线段：newFightLordMatch_box_12.png
			//未完成线段：newFightLordMatch_box_13.png
			//箱子标题 背景 newFightLordMatch_box_10.png
			//创建四个箱子
			for (let i = 0; i < 4; i++) {
				let boxItemCon = new PIXI.Container();
				//创建底图
				let box = new PIXI.Sprite(ddzbaseUI[`newFightLordMatch_box_${i}.png`]);

				box.x = box.width * i + i * 0.6 * box.width;

				//创建线段
				if (i < 3) {
					//创建线段
					let lineName = lianshengNum >= (i + 1) * 2 + 3 ? "newFightLordMatch_box_12.png" : "newFightLordMatch_box_13.png";
					let line = new PIXI.Sprite(ddzbaseUI[lineName]);
					line.width = box.width;
					line.x = box.x + box.width - box.width * 0.15;
					line.y = box.height / 2 - line.height / 2;
					boxMainCon.addChild(line);
				}
				//创建文字
				let textCon = new PIXI.Container();
				//3连胜 5连胜 7连胜 9连胜
				//创建3 5 7 9 连胜文字 *2+3
				let text = new PIXI.Text(`${i * 2 + 3}连胜`, {
					fontSize: getMax(14, ratios),
					//白色
					fill: "rgb(255, 255, 255)",
				});
				//创建文字背景
				let textBg = new PIXI.Sprite(ddzbaseUI["newFightLordMatch_box_10.png"]);
				textBg.width = text.width * 1.2;
				textBg.height = text.height * 1.2;
				textCon.width = textBg.width;
				textCon.height = textBg.height;
				text.x = textBg.width / 2 - text.width / 2;
				text.y = textBg.height / 2 - text.height / 2;
				textCon.addChild(textBg, text);
				// box.width * i + i*0.6*box.width;
				textCon.x = box.x + box.width / 2 - textCon.width / 2;
				textCon.y = box.height * 1.1;
				boxItemCon.addChild(box, textCon);
				initClickBtn(box, null, null, "Label");
				//创建遮罩图
				if (lianshengNum >= i * 2 + 3) {
					let popbox = new PIXI.Sprite(ddzbaseUI[`newFightLordMatch_boxlq_${i}.png`]);
					boxItemCon.addChild(popbox);
					popbox.x = box.x;
					popbox.y = box.y;
				} else {
					// initClickBtn(box,null,null,"Label");
				}
				boxMainCon.addChild(boxItemCon);
			}

			boxMainCon.x = boxLsCon.x + boxLsCon.width + 25;
			boxMainCon.y = boxLsCon.y + boxLsCon.height * 0.5 - boxMainCon.height * 0.5;

			boxCon.addChild(boxMainCon);
			doudizhuCon.addChild(boxCon);

			resolve({
				doudizhuCon,
			});
		});
	});
}
