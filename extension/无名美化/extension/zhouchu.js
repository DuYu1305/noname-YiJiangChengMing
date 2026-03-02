import { lib, game, ui, get, ai, _status } from "../../../noname.js";

//来源/参考自 标记补充(作者@西瓜)
export function zhouchu() {
    window._ZHOUCHU = {
        chuhaishibai: {
          name: "../../../无名美化/animation/zhouchu/chuhaishibai",
        },
    };
    lib.skill.rechuhai.subSkill.fail.content = function () {
        player.awakenSkill("rechuhai");
		game.log(player, "使命失败");
        dcdAnim.loadSpine(window._ZHOUCHU.chuhaishibai.name, "skel", function () {
            dcdAnim.playSpine(window._ZHOUCHU.chuhaishibai, {
                scale: 0.8,
                speed: 1,
                x: [0, 0.55],
                parent: player,
            });
        });
    };
}
