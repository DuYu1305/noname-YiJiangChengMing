import { lib, game, ui, get, ai, _status } from "../../../noname.js";

//代码素材来自柴油鹿鹿
export function mouzhuge() {
  window._MOUZHUGE = {
    huojishibai: {
      name: "../../../无名美化/animation/mouzhuge/huojishibai",
    }, //火计失败
  };
  //来源/参考自 Sakura美化(作者@柴油鹿鹿)   搬运请标注来源
  lib.skill.sbhuoji.subSkill.fail.content = function () {
    game.delay(0, 1000);
    dcdAnim.loadSpine(window._MOUZHUGE.huojishibai.name, "skel", function () {
      dcdAnim.playSpine(window._MOUZHUGE.huojishibai, {
        scale: 0.8,
        speed: 1,
        x: [0, 0.55],
        parent: player,
      });
    });
    player.awakenSkill("sbhuoji");
    game.log(player, "使命失败");
  };
}
