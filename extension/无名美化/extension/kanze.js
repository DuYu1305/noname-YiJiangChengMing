import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function kanze() {
  window._KANZE = {
    kuanshi: {
      //素材来源 标记补充(作者@西瓜)
      name: "../../../无名美化/animation/kanze/kuanshi",
    },
  };
  if (lib.skill.rekuanshi.subSkill && lib.skill.rekuanshi.subSkill.effect) {
    // re_kanze
    Object.assign(lib.skill.rekuanshi.subSkill.effect, {
      async content(event, trigger, player) {
        trigger.rekuanshi = true;
        await trigger.player.recover();
        dcdAnim.loadSpine(window._KANZE.kuanshi.name, "skel", function () {
          dcdAnim.playSpine(window._KANZE.kuanshi, {
            scale: 0.8,
            speed: 1,
            x: [0, 0.55],
            parent: player,
          });
        });
      },
    });
  }

  Object.assign(lib.skill.kuanshi.subSkill.effect, {
    async content(event, trigger, player) {
      const target = trigger.player;
      if (player.getStorage(event.name).includes(target)) {
        player.getStorage(event.name).remove(target);
      }
      if (!player.getStorage(event.name).length) {
        player.removeSkill(event.name);
      }
      trigger.cancel();
      player.skip("phaseDraw");
      dcdAnim.loadSpine(window._KANZE.kuanshi.name, "skel", function () {
        dcdAnim.playSpine(window._KANZE.kuanshi, {
          scale: 1,
          speed: 1,
          parent: player,
        });
      });
      game.delay(1);
    },
  });
}
