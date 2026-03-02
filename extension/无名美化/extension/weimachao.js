import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import { Jian } from "../utils/utils.js";

export function weimachao() {
  window._WEIMACHAO = {
    name: "无名美化",
    url: lib.assetURL + "extension/无名美化",
    jineng: {
      name: "../../../无名美化/animation/weimachao/weimachao_jineng",
      speed: 0.8,
      scale: 0.8,
    },
    jindu: {
      name: "../../../无名美化/animation/weizhangliao/lianzhao_jindu",
    },
  };
  Object.assign(lib.skill.dcjizhan, {
    init(player, skill) {
      player.addSkill(skill + "_mark");

      ui.weimachao = new Jian(player, window._WEIMACHAO, "weimachao");
    },
    filter(event, player) {
      const evt = lib.skill.dcjianying.getLastUsed(player, event);
      if (!evt || !evt.card || evt.dcjizhan) {
        return false;
      }
      if (get.type(evt.card) == "equip" && get.color(event.card) != "black") {
        ui.weimachao.lessPower();
      }
      if (get.color(event.card) != "black") {
        return false;
      }

      if (get.type(evt.card) == "equip") {
        if (!player.storage[`temp_ban_dcjizhan`]) {
          ui.weimachao.addPower();
        }
      }
      //这张是黑色牌 且上一张是装备牌 发动技能
      return get.type(evt.card) == "equip";
    },
    async cost(event, trigger, player) {
      const num =
        player.getHistory("useSkill", (evt) => evt.skill == event.skill)
          .length + 1;

      const result = await player
        .chooseButtonTarget({
          createDialog: [
            get.prompt2(event.skill),
            [
              [
                ["discard", `弃置其他角色共计至多${num}张牌`],
                [
                  "damage",
                  `对一名其他角色造成${num}点伤害，然后此技能本回合失效`,
                ],
              ],
              "textbutton",
            ],
          ],
          filterButton(button) {
            const player = get.player();
            if (button.link == "discard") {
              return game.hasPlayer((target) =>
                target.countDiscardableCards(player, "he")
              );
            }
            return true;
          },
          filterTarget(card, player, target) {
            const selected = ui.selected.buttons;
            if (!selected.length || target == player) {
              return false;
            }
            if (selected[0].link == "discard") {
              return false;
            }
            return true;
          },
          selectTarget() {
            const selected = ui.selected.buttons;
            if (!selected.length) {
              return false;
            }
            if (selected[0].link == "discard") {
              return -1;
            }
            return 1;
          },
          num: num,
          ai1(button) {
            const player = get.player();
            if (button.link == "discard") {
              const list = game
                .filterPlayer((target) =>
                  target.countDiscardableCards(player, "he")
                )
                .map((target) => {
                  const num = get.effect(
                    target,
                    { name: "guohe_copy2" },
                    player,
                    player
                  );
                  return num ? num : 0;
                })
                .sort((a, b) => b - a);
              return list
                .slice(0, Math.min(get.event().num, list.length))
                .reduce((eff, num) => eff + num, 0);
            }
            return Math.max(
              ...game
                .filterPlayer()
                .map(
                  (target) =>
                    get.damageEffect(target, player, player) * get.event().num
                )
            );
          },
          ai2(target) {
            const selected = ui.selected.buttons;
            const player = get.player();
            if (selected[0].link == "discard") {
              return get.effect(
                target,
                { name: "guohe_copy2" },
                player,
                player
              );
            }
            return get.damageEffect(target, player, player) * get.event().num;
          },
        })
        .forResult();
      if (result?.links?.length) {
        event.result = {
          bool: true,
          targets: result.targets ?? [],
          cost_data: result.links[0],
        };
        if (result.links[0] != "discard") {
        }
        dcdAnim.loadSpine(window._WEIMACHAO.jineng.name, "skel", function () {
          dcdAnim.playSpine(window._WEIMACHAO.jineng, {
            x: [0, 0.5],
            y: [0, 0.55],
          });
        });
      }
      ui.weimachao.lessPower();
    },
  });
  Object.assign(lib.skill.dcjizhan.subSkill.mark, {
    async content(event, trigger, player) {
      if (event.triggername == "useCard1") {
        if (get.type(trigger.card) == "equip") {
          if (!player.storage[`temp_ban_dcjizhan`]) {
            ui.weimachao.addPower();
          }
          player.addTip(event.name, "极斩 可连击");
        } else {
          player.removeTip(event.name);
        }
      } else if (trigger.dcjizhan) {
        player.removeTip(event.name);
      }
    },
  });
}
