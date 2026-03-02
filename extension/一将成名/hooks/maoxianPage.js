import { debouncePlay, isMobile, moveAn, scaleAn, addBtnFilter, createBackBtn } from "../utils/index.js";
import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function useMaoxianPage(pixiApp, xloader, ratiow, ratioh, ratios, oppeen, propsModeClic) {
	let hasTaixu = lib.config.all.mode.includes("taixuhuanjing");

	//unlockConditionsBg.png unlockConditionsLock.png
	let imgArr = [
		{ name: "maoxianDdz", text: "欢乐斗地主" },
		{ name: "maoxianDdzxx", text: "休闲斗地主" },
		{ name: "maoxianDdzbl", text: "兵临城下" },
		{ name: "maoxianDdzzd", text: "智斗" },
		{ name: "maoxianDdztx", text: "太虚幻境" },
	];
	function openMode(name) {
		switch (name) {
			case "maoxianDdz":
				oppeen("doudizhu");
				break;
			case "maoxianDdzxx":
				//休闲
				game.saveConfig("doudizhu_mode", "normal", "doudizhu");
				propsModeClic("doudizhu");
				break;
			case "maoxianDdzbl":
				game.saveConfig("doudizhu_mode", "binglin", "doudizhu");
				propsModeClic("doudizhu");
				break;

			case "maoxianDdzzd":
				game.saveConfig("doudizhu_mode", "online", "doudizhu");
				propsModeClic("doudizhu");
				break;
			case "maoxianDdztx":
				if (hasTaixu) {
					propsModeClic("taixuhuanjing");
				}
				break;
			default:
				break;
		}
	}
	let maoxianCon = new PIXI.Container();
	maoxianCon.width = pixiApp.value.screen.width;
	maoxianCon.height = pixiApp.value.screen.height;
	let bg = new PIXI.Sprite(xloader.value.resources.maoxianbg.texture);
	// let maoxianDdztext = new PIXI.Sprite(xloader.value.resources.maoxianDdztext.texture);

	let unlockCon = xloader.value.resources.unlockCon.textures;
	let unlockConBgSprit = new PIXI.Sprite(unlockCon["unlockConditionsBg.png"]);

	let unlockConLock = new PIXI.Sprite(unlockCon["unlockConditionsLock.png"]);

	let maoxianDdztextbottom = new PIXI.Sprite(xloader.value.resources.maoxianDdztextbottom.texture);

	bg.width = pixiApp.value.screen.width;
	bg.height = pixiApp.value.screen.height;
	maoxianCon.addChild(bg);

	let {backCon} = createBackBtn("冒险场", pixiApp, xloader, ratiow, ratioh, ratios, oppeen, propsModeClic);
	maoxianCon.addChild(backCon);
	imgArr.forEach((item, index) => {
		let img = new PIXI.Sprite(xloader.value.resources[item.name].texture);
		item.img = img;

		img.buttonMode = true;
		img.interactive = true;
		if (index === 0) {
			img.width = pixiApp.value.screen.width * 0.2;
			img.height = pixiApp.value.screen.height * 0.62;
		} else {
			img.width = pixiApp.value.screen.width * 0.23;
			img.height = pixiApp.value.screen.height * 0.293;
		}
		//斗地主
		if (index === 0) {
			img.x = pixiApp.value.screen.width * 0.15;
			img.y = pixiApp.value.screen.height * 0.18;
		} else {
			if (index == 1 || index == 3) {
				img.y = pixiApp.value.screen.height * 0.18;
			} else {
				img.y = imgArr[1].img.y + imgArr[1].img.height + pixiApp.value.screen.height * 0.04;
			}
		}
		if (index === 1 || index === 2) {
			img.x = imgArr[0].img.x + imgArr[0].img.width + pixiApp.value.screen.width * 0.02;
		}
		if (index === 3 || index === 4) {
			img.x = imgArr[1].img.x + imgArr[1].img.width + pixiApp.value.screen.width * 0.02;
		}
		img.on("pointerdown", () => {
			if(index!==0){
				addBtnFilter(img);
			}
			openMode(item.name);
		});
		img.on("mouseover", () => {
			debouncePlay();
		});
		maoxianCon.addChild(img);
	});

	let textArr = [];
	let tiptext;
	imgArr.forEach((item, index) => {
		let img = item.img;
		let text = new PIXI.Text(item.text, {
			//字体楷体
			fontFamily: "xingkai",
			fontSize: 28,
			fill: 0xffffff, // 文字填充为白色
			stroke: 0x8b4513, // 描边颜色（深棕色，与背景和文字都有对比）
			strokeThickness: 3, // 描边粗细
			// dropShadow: true, // 开启阴影
			// dropShadowColor: "rgba(0, 0, 0, 0.5)", // 阴影颜色（半透明黑色）
			// dropShadowBlur: 5, // 阴影模糊度
			// dropShadowOffsetX: 10, // 阴影水平偏移
			// dropShadowOffsetY: 5, // 阴影垂直偏移
		});
		text.x = img.x + img.width * 0.5 - text.width * 0.5;
		text.y = img.y + img.height * 0.7 - text.height * 0.5;

		if (index === 0) {
			maoxianDdztextbottom.x = img.x + img.width * 0.5 - maoxianDdztextbottom.width * 0.5;
			maoxianDdztextbottom.y = text.y + text.height;
			maoxianCon.addChild(maoxianDdztextbottom);
		}

		if (item.name === "maoxianDdztx") {
			if (!hasTaixu) {
				tiptext = new PIXI.Text("·请安装太虚幻境扩展", {
					fontFamily: "xingkai",
					fontSize: 18,
					fill: "red", 
				});
				tiptext.x = img.x + img.width * 0.5 - tiptext.width * 0.5;
				tiptext.y = img.y + img.height * 0.2;
				unlockConBgSprit.width = img.width;
				unlockConBgSprit.width = img.width;
				unlockConBgSprit.height = img.height;
				unlockConBgSprit.x = img.x;
				unlockConBgSprit.y = img.y;
				unlockConLock.x = text.x + text.width + 10;
				unlockConLock.y = text.y;
				maoxianCon.addChild(unlockConBgSprit);
				maoxianCon.addChild(unlockConLock);
				maoxianCon.addChild(tiptext);
			}
		}
		maoxianCon.addChild(text);
		textArr.push(text);
	});

	maoxianCon.on("added", () => {
		imgArr.forEach(item => {
			moveAn(item.img, item.img.x, 0);
		});
		// moveAn(maoxianDdztext);
		moveAn(maoxianDdztextbottom);
		moveAn(unlockConBgSprit);
		moveAn(unlockConLock);
		if (tiptext) {
			moveAn(tiptext);
		}

		textArr.forEach(item => {
			moveAn(item);
		});
	});
	return {
		maoxianCon,
	};
}
