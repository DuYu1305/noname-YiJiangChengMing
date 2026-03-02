import { debouncePlay, isMobile, moveAn, getMax, scaleAn, addBtnFilter, createBackBtn, imgPath } from "../utils/index.js";
import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function useZizouPage(pixiApp, xloader, ratiow, ratioh, ratios, oppeen, propsModeClic) {
	return new Promise(resolve => {
		let zloader = new PIXI.Loader();
		let imgArr = [
			{ name: "boss", text: "挑战", path: "99" },
			{ name: "single", text: "单挑", path: "98" },
			{ name: "connect", text: "联机", path: "72" },
			// { name: "chess", text: "战旗", path: "72" },
			// { name: "tafang", text: "塔防", path: "32" },
			{ name: "identity", text: "军五休闲", path: "32" },
			{ name: "brawl", text: "乱斗", path: "39" },
			{ name: "stone", text: "炉石", path: "81" },
		];
		imgArr.forEach(item => {
			zloader.add(item.name, `${imgPath}mode/zizouqi/mode_${item.path}.png`);
		});
		zloader.add("zizoubg", `${imgPath}mode/zizouqi/tavernChessHallBg.png`);
		zloader.load(() => {
			let zizouCon = new PIXI.Container();
			zizouCon.width = pixiApp.value.screen.width;
			zizouCon.height = pixiApp.value.screen.height;
			let bg = new PIXI.Sprite(zloader.resources.zizoubg.texture);

			bg.width = pixiApp.value.screen.width;
			bg.height = pixiApp.value.screen.height;
			zizouCon.addChild(bg);

			let { backCon } = createBackBtn("自走棋", pixiApp, xloader, ratiow, ratioh, ratios, oppeen, propsModeClic);
			zizouCon.addChild(backCon);
			let moveCon = new PIXI.Container();
			moveCon.width = pixiApp.value.screen.width;
			moveCon.height = pixiApp.value.screen.height;
			let itemWidth = 0.25,
				colNum = 0.05;
			let leftNum = (1 - itemWidth * 3 - colNum * 2) / 2;

			let itemHeight = 0.3,
				rowNum = colNum;
			let topNum = (1 - itemHeight * 2 - rowNum) / 2;
			function getparseWNum(num) {
				return num * pixiApp.value.screen.width;
			}
			function getparseHNum(num) {
				return num * pixiApp.value.screen.height;
			}
			imgArr.forEach((item, index) => {
				let itemCon = new PIXI.Container();
				let img = new PIXI.Sprite(zloader.resources[item.name].texture);
				item.img = img;
				img.buttonMode = true;
				img.interactive = true;
				img.width = getparseWNum(itemWidth);
				img.height = getparseHNum(itemHeight);
				itemCon.width = img.width;
				itemCon.height = img.height;
				itemCon.x = getparseWNum(leftNum) + img.width * (index % 3) + getparseWNum(colNum) * (index % 3);

				let text = new PIXI.Text(item.text, {
					//字体楷体
					fontFamily: "xingkai",
					fontSize: getMax(28, ratios),
					fill: 0xffffff, // 文字填充为白色
					stroke: 0x8b4513, // 描边颜色（深棕色，与背景和文字都有对比）
					strokeThickness: 3, // 描边粗细
				});
				text.x = img.width * 0.5 - text.width * 0.5;
				text.y = img.height * 0.5 - text.height * 0.5;
				itemCon.addChild(img, text);
				if (index < 3) {
					itemCon.y = getparseHNum(topNum);
				} else {
					itemCon.y = getparseHNum(topNum) + img.height + getparseHNum(rowNum);
				}
				img.on("pointerdown", () => {
					if (index !== 0) {
						addBtnFilter(img);
					}
					if (item.name == "identity") {
						game.saveConfig("change_identity", true, "identity");
						game.saveConfig("free_choose", true, "identity");
						game.saveConfig("change_choice", true, "identity");
						game.saveConfig("change_card", "unlimited", "identity");
						game.saveConfig("identity_mode", "normal", "identity");
						game.saveConfig("player_number", 5, "identity");
					}
					propsModeClic(item.name);
				});
				img.on("mouseover", () => {
					debouncePlay();
				});
				moveCon.addChild(itemCon);
			});
			zizouCon.addChild(moveCon);
			zizouCon.on("added", () => {
				moveAn(moveCon, 0, pixiApp.value.screen.width * 0.5);
			});
			resolve({
				zizouCon,
			});
		});
	});
}
