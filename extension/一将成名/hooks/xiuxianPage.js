import { debouncePlay, isMobile, moveAn, scaleAn, addBtnFilter, createBackBtn } from "../utils/index.js";
import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import gameModeManager, { GameModeType } from "../utils/GameModeManager.js";

export function useXiuxianPage(pixiApp, xloader, ratiow, ratioh, ratios, oppeen, propsModeClic) {
	//newStyleBaseUITopNameBackBtn.png   返回
	//newStyleBaseUITopNameBg.png 返回背景
	function openMode(name) {
		switch (name) {
			case "huolexx":
				game.saveConfig("two_assign", true, "versus");
				game.saveConfig("free_choose", true, "versus");
				game.saveConfig("change_identity", true, "versus");
				game.saveConfig("change_choice", true, "versus");
				game.saveConfig("versus_mode", "two", "versus");
				// 存储当前模式
				gameModeManager.setCurrentMode(GameModeType.CASUAL, "versus");
				propsModeClic("versus");
				break;
			case "shenfenxx":
				game.saveConfig("change_identity", true, "identity");
				game.saveConfig("free_choose", true, "identity");
				game.saveConfig("change_choice", true, "identity");
				game.saveConfig("change_card", "unlimited", "identity");
				game.saveConfig("identity_mode", "normal", "identity");
				game.saveConfig("player_number", 8, "identity");
				gameModeManager.setCurrentMode(GameModeType.CASUAL, "identity");
				propsModeClic("identity");
				break;
			case "guozhanxx":
				//自由选择身份和座位 关
				game.saveConfig("change_identity", true, "guozhan");
				//关闭自由选将
				game.saveConfig("free_choose", true, "guozhan");
				//关闭换将卡
				game.saveConfig("change_choice", true, "guozhan");
				//手气卡两次
				game.saveConfig("change_card", "unlimited", "guozhan");

				game.saveConfig("guozhan_mode", "normal", "guozhan");
				game.saveConfig("player_number", 8, "guozhan");
				gameModeManager.setCurrentMode(GameModeType.CASUAL, "guozhan");
				propsModeClic("guozhan");
				break;
			default:
				break;
		}
	}
	
	let huodongCon = new PIXI.Container();
	let baseUi = xloader.value.resources.baseUi.textures;
	huodongCon.width = pixiApp.value.screen.width;
	huodongCon.height = pixiApp.value.screen.height;
	let bg = new PIXI.Sprite(xloader.value.resources.xiuxianbg.texture);
	bg.width = pixiApp.value.screen.width;
	bg.height = pixiApp.value.screen.height;
	huodongCon.addChild(bg);

	let { backCon } = createBackBtn("开房间", pixiApp, xloader, ratiow, ratioh, ratios, oppeen, propsModeClic);
	huodongCon.addChild(backCon);
	let imgArr = [{ name: "huolexx" }, { name: "shenfenxx" }, { name: "guozhanxx" }];
	imgArr.forEach((item, index) => {
		let img = new PIXI.Sprite(xloader.value.resources[item.name].texture);
		item.img = img;
		img.width = pixiApp.value.screen.width * 0.2;
		img.height = pixiApp.value.screen.height * (isMobile ? 0.8 : 0.75);
		img.anchor.set(0, 0.5);
		img.buttonMode = true;
		img.interactive = true;
		let mode = "";
		if (index === 0) {
			img.x = pixiApp.value.screen.width * 0.13;
		}
		if (index === 1) {
			img.x = pixiApp.value.screen.width * 0.4;
		}
		if (index === 2) {
			img.x = pixiApp.value.screen.width * 0.66;
		}
		img.on("pointerdown", () => {
			addBtnFilter(img);
			// scaleAn(img);
			//欢乐休闲
			openMode(item.name);
		});
		img.on("mouseover", () => {
			debouncePlay();
		});
		img.y = pixiApp.value.screen.height / 2;
		huodongCon.addChild(img);
	});
	huodongCon.on("added", () => {
		imgArr.forEach(item => {
			moveAn(item.img, item.img.x, 0);
		});
	});

	// pixiApp.value.stage.addChild(huodongCon);
	return {
		huodongCon,
	};
}
