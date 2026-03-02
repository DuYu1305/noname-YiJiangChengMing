import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function zhangqiying() {
  window._ZHANGQIYING = {
    arr_0_gaipan: {
      name: "../../../无名美化/animation/zhangqiying/animation/arr_0_gaipan",
    },
    arr_1_gaipan: {
      name: "../../../无名美化/animation/zhangqiying/animation/arr_1_gaipan",
    },
    arr_2_gaipan: {
      name: "../../../无名美化/animation/zhangqiying/animation/arr_2_gaipan",
    },
    arr_3_gaipan: {
      name: "../../../无名美化/animation/zhangqiying/animation/arr_3_gaipan",
    },
  };

  // 🔥 覆盖原来的子技能
  if (lib.skill.zhenyi && lib.skill.zhenyi.subSkill) {
    Object.assign(lib.skill.zhenyi.subSkill.spade, {
      async content(event, trigger, player) {
        player.clearMark("xinfu_falu_spade");
        player.popup(event.cost_data);
        const control = event.cost_data.startsWith("黑桃") ? "spade" : "heart";
        game.log(player, "将判定结果改为了", `#y${get.translation(control)}5`);

        const index = ["spade", "heart", "diamond", "club"].indexOf(control);
		console.log("index",index,control);
        dcdAnim.loadSpine(
          window._ZHANGQIYING["arr_" + index + "_gaipan"].name,
          "skel",
          () => {
            dcdAnim.playSpine(window._ZHANGQIYING["arr_" + index + "_gaipan"], {
              speed: 0.8,
              scale: 0.8,
              x: [0, 0.5],
            });
          }
        );
        game.playAudio(
          "../extension/无名美化/animation/zhangqiying/audio/ziweigaipan.mp3"
        );
        game.delay(2.5);
        trigger.fixedResult = {
          suit: control,
          color: get.color({ suit: control }),
          number: 5,
        };
      },
    });
  }
}
