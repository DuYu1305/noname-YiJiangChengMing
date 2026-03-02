import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function puyuan() {
  window._ThunderShenGong = {
    shengong_chenggong: {
      name: "../../../无名美化/animation/puyuan/shengong_chenggong",
    },
    shengong_shibai: {
      name: "../../../无名美化/animation/puyuan/shengong_shibai",
    },
    shengong_wanmei: {
      name: "../../../无名美化/animation/puyuan/shengong_wanmei",
    },
    shengong_ying: {
      name: "../../../无名美化/animation/puyuan/shengong_ying",
    },
  };
  Object.assign(lib.skill.olshengong, {
    datie: function (
      type,
      player,
      count,
      dialog,
      img,
      tiehua,
      changeNum,
      changeT,
      tiechui,
      total
    ) {
      var card = get.cards()[0];
      if (!_status.shengongCards) _status.shengongCards = [];
      _status.shengongCards.push(card);
      var changeD = type == "help" ? "助力点数：" : "妨害点数：";
      var xishu1 = type == "help" ? 0 : 284;
      var xishu2 = type == "help" ? 124 : 441;
      var xishu3 = count > 3 ? count - 4 : count;
      var xishu4 = count > 3 ? 1 : 0;
      var info = [
        card.suit || "",
        card.number || "",
        card.name || "",
        card.nature || "",
      ];
      var currentCard = [ui.create.card(dialog, "noclick", true).init(info)];
      currentCard[0].id = type + "Cards" + count;
      currentCard[0].classList.add("th-currentcard");

      if (count < 3) {
        for (var i = 0; i <= count; i++) {
          var changeCard = document.getElementById(type + "Cards" + i);
          var num = 169 - count * 40 + 79 * i + xishu1;
          changeCard.style.left = num + "px";
          changeCard.style.display = "inline-block";
        }
      } else {
        for (var i = 0; i <= count; i++) {
          var changeCard = document.getElementById(type + "Cards" + i);
          var num = 89 + (158 / count) * i + xishu1;
          changeCard.style.left = num + "px";
          changeCard.style.display = "inline-block";
        }
      }

      changeNum += card.number;
      var str = changeNum > 9 ? "" : " ";
      changeT.textContent = changeD + str + changeNum;

      game.thunderCreateHead(
        player,
        dialog,
        36,
        xishu2 + xishu3 * 45,
        308 + xishu4 * 40,
        "ol"
      );

      if (count != 0 || type != "help") {
        var tiechuiAni = type == "help" ? "tiechui1" : "tiechui2";
        //tiechui.id = 'tiechui' + total;
        tiechui.style.display = "block";
        tiechui.style.animation = "th-" + tiechuiAni + " 0.4s";
        img.setAttribute(
          "src",
          lib.assetURL +
          "extension/无名美化/image/shengong/shengong_" +
          type +
          "2.png"
        );
        game.playAudio(
          "..",
          "extension",
          "无名美化",
          "audio",
          "shengong",
          "shengong_datie"
        );
        tiechui.addEventListener("animationend", function () {
          tiehua.style.display = "block";
          setTimeout(function () {
            img.setAttribute(
              "src",
              lib.assetURL +
              "extension/无名美化/image/shengong/shengong_" +
              type +
              "1.png"
            );
            tiehua.style.display = "none";
          }, 100);
          tiechui.style.display = "none";
        });
      }

      return changeNum;
    },
    content: function () {
      "step 0";
      game.pause(player);
      var helpNum = 0,
        hamperNum = 0,
        count1 = 1,
        count2 = 0,
        total = 1;
      event.datietai = ui.create.div(".th-sgdatietai", document.body);
      var shoushaJDT = document.getElementById("jindutiao");
      if (shoushaJDT) {
        shoushaJDT.style.cssText += "transition:none;";
        shoushaJDT.hide();
      }
      var str =
        (lib.translate[player.name] || get.rawName(player)) +
        "弃置【" +
        get.translation(cards[0].name) +
        '】发动铸造，请选择<span style="color:#795022">助力</span>或<span style="color:#51789F">妨害</span>之';
      var titleT = ui.create.div(".th-dazaotaitopic", event.datietai);
      titleT.innerHTML = str;

      var helpT = ui.create.div(".th-shengongtext", event.datietai);
      helpT.innerHTML = "助力点数： 0";

      var hamperT = ui.create.div(".th-shengongtext.harm", event.datietai);
      hamperT.innerHTML = "妨害点数： 0";

      var tiechui1 = ui.create.div(".th-tiechui", event.datietai);

      var tiechui2 = ui.create.div(".th-tiechui.right", event.datietai);

      var tiezhan1 = ui.create.div(".th-tiezhan", event.datietai);
      tiezhan1.addEventListener(
        lib.config.touchscreen ? "touchend" : "click",
        function () {
          if (!event.Chosen && player != game.me && game.me.isIn()) {
            helpNum = lib.skill.olshengong.datie(
              "help",
              game.me,
              count1,
              event.datietai,
              tiezhan1,
              tiehua1,
              helpNum,
              helpT,
              tiechui1,
              total
            );
            game.log(game.me, "助力了锻造");
            if (player != game.me && player.ai.shown < 0.6) game.me.addExpose(0.6);
            event.Chosen = true;
            count1++;
            total++;
          }
        }
      );
      var tiezhan2 = ui.create.div(".th-tiezhan.right", event.datietai);
      tiezhan2.addEventListener(
        lib.config.touchscreen ? "touchend" : "click",
        function () {
          if (!event.Chosen && player != game.me && game.me.isIn()) {
            hamperNum = lib.skill.olshengong.datie(
              "hamper",
              game.me,
              count2,
              event.datietai,
              tiezhan2,
              tiehua2,
              hamperNum,
              hamperT,
              tiechui2,
              total
            );
            game.log(game.me, "妨害了锻造");
            if (player != game.me && player.ai.shown < 0.6) game.me.addExpose(0.6);
            event.Chosen = true;
            count2++;
            total++;
          }
        }
      );

      var sgTime = ui.create.div(".th-shengongtime", event.datietai);
      ui.create.div(".th-sgtimeborder", sgTime);
      ui.create.div(".th-sgtimecover", sgTime);

      var tiehua1 = ui.create.div(".th-tiehua", event.datietai);
      var tiehua2 = ui.create.div(".th-tiehua", event.datietai);
      tiehua2.style.left = "394px";

      helpNum = lib.skill.olshengong.datie(
        "help",
        player,
        0,
        event.datietai,
        tiezhan1,
        tiehua1,
        0,
        helpT,
        tiechui1,
        0
      );
      for (let a = 0; a < game.players.length; a++) {
        if (game.players[a] == player || game.players[a] == game.me) continue;
        var delay = Math.floor(Math.random() * 7 + 2) * 500;
        if (get.attitude(game.players[a], player) > 0) {
          setTimeout(function () {
            helpNum = lib.skill.olshengong.datie(
              "help",
              game.players[a],
              count1,
              event.datietai,
              tiezhan1,
              tiehua1,
              helpNum,
              helpT,
              tiechui1,
              total
            );
            count1++;
            total++;
            game.log(game.players[a], "助力了锻造");
            game.players[a].addExpose(0.6);
          }, delay);
        } else if (get.attitude(game.players[a], player) < 0) {
          setTimeout(function () {
            hamperNum = lib.skill.olshengong.datie(
              "hamper",
              game.players[a],
              count2,
              event.datietai,
              tiezhan2,
              tiehua2,
              hamperNum,
              hamperT,
              tiechui2,
              total
            );
            count2++;
            total++;
            game.log(game.players[a], "妨害了锻造");
            game.players[a].addExpose(0.6);
          }, delay);
        } else {
          var ran = Math.random();
          if (ran > 0.9) {
            setTimeout(function () {
              hamperNum = lib.skill.olshengong.datie(
                "hamper",
                game.players[a],
                count2,
                event.datietai,
                tiezhan2,
                tiehua2,
                hamperNum,
                hamperT,
                tiechui2,
                total
              );
              count2++;
              total++;
              game.log(game.players[a], "妨害了锻造");
              game.players[a].addExpose(0.6);
            }, delay);
          } else if (ran < 0.11) {
            setTimeout(function () {
              helpNum = lib.skill.olshengong.datie(
                "help",
                game.players[a],
                count1,
                event.datietai,
                tiezhan1,
                tiehua1,
                helpNum,
                helpT,
                tiechui1,
                total
              );
              count1++;
              total++;
              game.log(game.players[a], "助力了锻造");
              game.players[a].addExpose(0.6);
            }, delay);
          }
        }
      }
      setTimeout(function () {
        let wid = document.body.offsetWidth * 0.5,
          hei = document.body.offsetHeight * 0.5 + 50;
        var win = helpNum >= hamperNum ? -155 : 136;
        dcdAnim.loadSpine(
          window._ThunderShenGong.shengong_ying.name,
          "skel",
          function () {
            dcdAnim.playSpine(
              {
                name: window._ThunderShenGong.shengong_ying.name,
                speed: 1.3,
              },
              { x: [wid + win, 0], y: hei,speed: 1.3, }
            );
          }
        );
        game.playAudio(
          "..",
          "extension",
          "无名美化",
          "audio",
          "shengong",
          "shengong_datie"
        );
        event.result = {
          bool: true,
          helpNum: helpNum,
          hamperNum: hamperNum,
        };
        if (shoushaJDT) shoushaJDT.show();
        game.resume(player);
      }, 7000);
      "step 1";
      game.delay(5);
      if (_status.shengongCards) {
        game.cardsGotoOrdering(_status.shengongCards);
        delete _status.shengongCards;
      }
      "step 2";
      event.datietai.remove();
      game.pause(player);
      var str = "shengong_shibai";
      var result = event.result;
      if (result.hamperNum == 0) str = "shengong_wanmei";
      else if (result.helpNum >= result.hamperNum) str = "shengong_chenggong";
      game.playAudio("..", "extension", "无名美化", "audio", "shengong", str);
      dcdAnim.loadSpine(window._ThunderShenGong[str].name, "skel", function () {
        dcdAnim.playSpine(window._ThunderShenGong[str]);
      });
      setTimeout(function () {
        game.resume(player);
      }, 3000);
      "step 3";
      event.duanzao_result = 0
      var str = "【神工】锻造失败："
      var result = event.result
      if (result.hamperNum == 0) {
        event.duanzao_result = 2;
        str = "【神工】锻造大成功：";
      } else if (result.helpNum >= result.hamperNum) {
        event.duanzao_result = 1;
        str = "【神工】锻造成功：";
      }
      var subtype = get.subtype(cards[0]);
      if (subtype != "equip1" && subtype != "equip2") subtype = "others";
      player.addTempSkill("olshengong_" + subtype, "phaseUseAfter");
      var card_map = {
        equip1: [
          ["diamond", 13, "bintieshuangji"],
          ["diamond", 1, "wuxinghelingshan"],
          ["spade", 13, "wutiesuolian"],
          ["diamond", 12, "wushuangfangtianji"],
          ["spade", 6, "chixueqingfeng"],
          ["spade", 5, "guilongzhanyuedao"],
        ],
        equip2: [
          ["club", 1, "huxinjing"],
          ["club", 2, "heiguangkai"],
          ["spade", 2, "linglongshimandai"],
          ["club", 1, "hongmianbaihuapao"],
          ["spade", 2, "qimenbagua"],
          ["spade", 9, "guofengyupao"],
        ],
        others: [
          ["diamond", 1, "zhaogujing"],
          ["spade", 5, "sanlve"],
          ["club", 12, "tianjitu"],
          ["spade", 2, "taigongyinfu"],
          ["diamond", 1, "shufazijinguan"],
          ["club", 4, "xuwangzhimian"],
        ],
      };
      if (!_status.olshengong_map) _status.olshengong_map = {};
      if (!_status.olshengong_maken) _status.olshengong_maken = {};
      var list = card_map[subtype];
      for (var i = 0; i < list.length; i++) {
        var name = list[i][2];
        if (!lib.card[name] || _status.olshengong_map[name]) {
          list.splice(i--, 1);
        }
      }
      if (!list.length) event.finish();
      else
        player
          .chooseButton(
            [str, [list.randomGets(event.duanzao_result + 1), "vcard"]],
            true
          )
          .set("ai", function (button) {
            return get.value({ name: button.link[2] }, player, "raw");
          });
      "step 4";
      var name = result.links[0][2];
      var card;
      if (_status.olshengong_maken[name])
        card = _status.olshengong_maken[name];
      else {
        card = game.createCard2(name, result.links[0][0], result.links[0][1]);
        _status.olshengong_maken[name] = card;
      }
      event.card = card;
      player.addSkill("olshengong_destroy");
      player.markAuto("olshengong_destroy", [card]);
      var subtype = get.subtype(card);
      if (
        !game.hasPlayer(function (current) {
          return !current.isDisabled(subtype);
        })
      ) {
        event.finish();
        return;
      }
      player.chooseTarget(
          true,
          "将" + get.translation(card) + "置于一名角色的装备区内",
          function (card, player, target) {
            return !target.isDisabled(_status.event.subtype);
          }
        )
        .set("subtype", subtype)
        .set("ai", function (target) {
          var card = _status.event.getParent().card,
            player = _status.event.player;
          return get.effect(target, card, player, player);
        });
      "step 5";
      if (result.bool) {
        _status.olshengong_map[card.name] = true;
        var target = result.targets[0];
        player.line(target, "green");
        target.$gain2(card);
        game.delayx();
        target.equip(card);
      }
    },
  });
  Object.assign(lib.skill.olshengong.subSkill, {
    "equip1": {},
    "equip2": {},
    "equip3": {},
    "equip4": {},
    "equip5": {},
    "equip6": {},
    "others": {},
  })
}
