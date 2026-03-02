import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function mouguanyu() {
  window._MOUGUANYU = {
    SS_gyskill: {
      name: "../../../无名美化/animation/mouguanyu/SS_gyskill",
    }, //关羽武圣
  };
  //来源/参考自 Sakura美化(作者@柴油鹿鹿)   搬运请标注来源
  Object.assign(lib.skill.sbwusheng, {
    async content (event, trigger, player) {
      var result = await player.chooseTarget(
          get.prompt("sbwusheng"),
          "选择一名非主公的其他角色，本阶段对其使用【杀】无距离和次数限制，使用【杀】指定其为目标后摸" +
            (get.mode() === "identity" ? "两" : "一") +
            "张牌，对其使用三张【杀】后不能对其使用【杀】",
          (card, player, target) => {
            return target != player && !target.isZhu2();
          }
        )
        .set("ai", (target) => {
          var player = _status.event.player;
          return get.effect(target, { name: "sha" }, player, player);
        }).forResult();
      if (result.bool) {
        game.delay(0,1000)
        dcdAnim.loadSpine(window._MOUGUANYU.SS_gyskill.name, "skel", function () {
          game.playAudio("../extension/无名美化/audio/wusheng/wushengTX.mp3");
          dcdAnim.playSpine(window._MOUGUANYU.SS_gyskill, {
            speed: 1,
            scale: 0.75,
            x: [0, 0.5],
            y: [0, 0.5],
          });
        });
        var target = result.targets[0];
        player.logSkill("sbwusheng", target);
        if (get.mode() !== "identity" || player.identity !== "nei")
          player.addExpose(0.25);
        player.addTempSkill("sbwusheng_effect", { player: "phaseUseAfter" });
        player.storage.sbwusheng_effect[target.playerid] = 0;
      }
    },
  });
}
