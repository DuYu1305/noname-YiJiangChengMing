import { lib, game, ui, get, ai, _status } from "../../../noname.js";

//来源/参考自 标记补充(作者@西瓜)
export function sbsunshangxiang() {
    window._SBSUNSHANGXIANG = {
        jieyinshibai: {
          name: "../../../无名美化/animation/sbsunshangxiang/jieyinshibai",
        },
    };
    lib.skill.sbjieyin.subSkill.fail.content = function() {
        player.logSkill("sbjieyin_fail");
        player.awakenSkill("sbjieyin");
        game.log(player, "使命失败");
        dcdAnim.loadSpine(window._SBSUNSHANGXIANG.jieyinshibai.name, "skel", function () {
            dcdAnim.playSpine(window._SBSUNSHANGXIANG.jieyinshibai, {
                scale: 0.8,
                speed: 1,
                x: [0, 0.55],
                parent: player,
            });
        });
        player.changeGroup("wu");
        player.recover();
        player.gain(player.getExpansions("sbliangzhu"), "gain2");
        player.loseMaxHp();
    };
}
