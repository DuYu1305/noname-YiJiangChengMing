import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function initWuLingXiss() {
  lib.init.css(lib.assetURL + "extension/无名美化/css", "wuling");
}
export function shenhuatuo() {
  window._SHENHUATUO = {
    assetUrl: lib.assetURL +"extension/无名美化/image/wuling/",
    wqxtx: {
      // loop: true,
      name: "../../../无名美化/animation/shenhuatuo/SS_skillwqx",
    },
    nameMap: {
      虎: "hu",
      鹿: "lu",
      熊: "xiong",
      猿: "yuan",
      鹤: "he",
    },
  };
  //来源/参考自 Sakura美化(作者@柴油鹿鹿)   搬运请标注来源
  Object.assign(lib.skill.wuling, {
    content: function () {
      "step 0";
      target.addAdditionalSkill(`wuling_${player.playerid}`, "wuling_wuqinxi");
      var next = player.chooseToMove(
        `五灵：调整向${get.translation(target)}传授的“五禽戏”顺序`
      );
      next.set("list", [
        [
          "",
          [
            lib.skill.wuling.wuqinxi,
            (item, type, position, noclick, node) => {
             
              // node = ui.create.buttonPresets.vcard(
              //   item,
              //   type,
              //   position,
              //   noclick
              // );
              node = ui.create.div(".card.button", position);
              node.style.cssText += `background-image: url("${window._SHENHUATUO.assetUrl}card_${
                 window._SHENHUATUO.nameMap[item]
              }.webp");background-size:cover;`;
              node.link = item;
              if (!noclick) {
                lib.setIntro(node);
              }
              node._customintro = [
                (node) => `五禽戏：${node.link}`,
                (node) =>
                  lib.skill.wuling.wuqinxiMap[
                    lib.skill.wuling.wuqinxi.indexOf(node.link)
                  ].slice(2),
              ];
              return node;
            },
          ],
        ],
      ]);
      next.set("processAI", () => {
        const event = get.event().getParent(),
          player = event.player,
          target = event.target;
        const spirits = [];
        let nextPlayer = player;
        do {
          nextPlayer = nextPlayer.getNext();
          if (get.attitude(player, nextPlayer) < 0) {
            spirits.add("熊");
            break;
          }
        } while (nextPlayer != target);
        if (!spirits.length) spirits.add("猿");
        if (
          get.recoverEffect(target, player, player) > 0 ||
          target.hasCard((card) => {
            return (
              get.effect(
                target,
                {
                  name: card.viewAs || card.name,
                  cards: [card],
                },
                target,
                target
              ) < -1
            );
          }, "j")
        )
          spirits.add("鹿");
        const others = lib.skill.wuling.wuqinxi.slice().removeArray(spirits);
        do {
          others.randomSort();
        } while (others.length > 1 && others[0] == "鹿");
        return [spirits.concat(others).map((i) => [i])];
      });
      ("step 1");
      console.log("result",result)
      var sortedWuqinxi = result.moved[0];
      game.log(target, "习得的五禽戏顺序为", "#g" + sortedWuqinxi.join("、"));
      console.log("习得的五禽戏顺序为", sortedWuqinxi);
      dcdAnim.loadSpine(window._SHENHUATUO.wqxtx.name, "skel", function () {
        game.playAudio("../extension/无名美化/audio/shenhuatuo/wqxtx.mp3");
        dcdAnim.playSpine(window._SHENHUATUO.wqxtx, {
          scale: lib.device ? 0.77 : 1,
          speed: 1,
          x: [0, 0.5],
          y: [0, 0.5],
        });
      });
      //想想五个特效怎么加 todo ......
      sortedWuqinxi.unshift(sortedWuqinxi[0]);
      target.storage.wuling_wuqinxi = sortedWuqinxi;
      lib.skill.wuling.updateMark(target);

      sortedWuqinxi.forEach((name, index) => {
        let t = setTimeout(function () {
          let div = ui.create.div(".wuqinxi-common", document.body);
          div.style.cssText += `background-image: url("${
            window._SHENHUATUO.assetUrl + window._SHENHUATUO.nameMap[name]
          }.png");left:${15 + 14 * index}%;`;
          //有问题的自己调15 14两个数字，一个是初始位置距离左边多少距离  一个是每个小人距离多少位置
          let nameDiv = ui.create.div(".wqxhu-name", div);
          nameDiv.classList.add("wuqinxi-name");
          nameDiv.style.cssText += `background-image: url("${window._SHENHUATUO.assetUrl}name_${window._SHENHUATUO.nameMap[name]}.png");`;
          let t1 = setTimeout(function () {
            div.delete();
            clearTimeout(t);
            clearTimeout(t1);
          }, 2400 - index * 370);
        }, 1070 + index * 370);
      });
      game.delay(0, 4080);
    },
  });
}
