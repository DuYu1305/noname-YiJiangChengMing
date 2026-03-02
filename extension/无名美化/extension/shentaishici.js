import { lib, game, ui, get, ai, _status } from "../../../noname.js";

//来源/参考自 标记补充(作者@西瓜)
export function shentaishici() {
    window._SHENTAISHICI = {
        shimingjishibai: {
          name: "../../../无名美化/animation/shentaishici/shimingjishibai",
        },
    };
    lib.skill.tspowei.subSkill.fail.content = function() {
        "step 0";
        game.log(player, "使命失败");
        dcdAnim.loadSpine(window._SHENTAISHICI.shimingjishibai.name, "skel", function () {
            dcdAnim.playSpine(window._SHENTAISHICI.shimingjishibai, {
                scale: 0.8,
                speed: 1,
                x: [0, 0.55],
                parent: player,
            });
        });
        player.awakenSkill("tspowei");
        if (player.hp < 1) player.recover(1 - player.hp);
        "step 1";
        var num = player.countCards("e");
        if (num > 0) player.chooseToDiscard("e", true, num);
    };
}
