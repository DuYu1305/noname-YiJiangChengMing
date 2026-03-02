import { lib, game, ui, get, ai, _status } from "../../../noname.js";

//来源/参考自 标记补充(作者@西瓜)
export function wangling() {
    window._WANGLING = {
        mibeishibai: {
          name: "../../../无名美化/animation/wangling/mibeishibai",
        },
    };
    lib.skill.mibei.subSkill.fail.content = function() {
        game.log(player, "使命失败");
        dcdAnim.loadSpine(window._WANGLING.mibeishibai.name, "skel", function () {
            dcdAnim.playSpine(window._WANGLING.mibeishibai, {
                scale: 0.8,
                speed: 1,
                x: [0, 0.55],
                parent: player,
            });
        });
        player.awakenSkill("mibei");
        player.loseMaxHp();
    };
}
