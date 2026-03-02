import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function initwuguCss() {
    lib.init.css(lib.assetURL + "extension/美化补充/css", "wugu");
}
export function wugu() {
    Object.assign(lib.card.wugu, {
        updateCurrentCharacter: function(target) {
            let elements=document.querySelectorAll('.dialog>.wuguCurrentSmallCharacter');
            if(elements.length){
                // elements[0].style.backgroundImage = target.node.avatar.style.backgroundImage;
                //修改五谷丰登国战暗将拿牌
                elements[0].style.backgroundImage = target.isUnseen(0) ? target.isUnseen(1) ? 'linear-gradient(0deg, #000000, #000000)' : target.node.avatar2.style.backgroundImage : target.node.avatar.style.backgroundImage;
            };
            let elements2=document.querySelectorAll('.dialog>.wugu-footer');
            if(elements2.length){
                elements2[0].innerHTML='';
                elements2[0].insertAdjacentHTML("afterbegin", get.translation(target.name)+"正在选牌");
                // elements2[0].insertAdjacentHTML("afterbegin", "请等待无懈可击");
            };
        },
        updateWuxieCharacter: function(target) {
            let elements2=document.querySelectorAll('.dialog>.wuguWuxieBox>.wuguWuxieText');
            if(elements2.length) elements2[0].style.display = 'block';
            let elements=document.querySelectorAll('.dialog>.wuguWuxieBox');
            if(elements.length){
                var wuguWuxieSmallCharacter = ui.create.div('.wuguWuxieSmallCharacter', elements[0]);
                // wuguWuxieSmallCharacter.style.backgroundImage = target.node.avatar.style.backgroundImage;
                //修改五谷丰登国战暗将拿牌
                wuguWuxieSmallCharacter.style.backgroundImage = target.isUnseen(0) ? target.isUnseen(1) ? 'linear-gradient(0deg, #000000, #000000)' : target.node.avatar2.style.backgroundImage : target.node.avatar.style.backgroundImage;
                var wuguWuxieChahao = ui.create.div('.wuguWuxieChahao', wuguWuxieSmallCharacter);
                var num = elements[0].children.length - 1;
                function ctl(n) {
                    let top = (n - 1) % 4 * 50;
                    let left = -Math.floor((n - 1) / 4) * 50;
                    return { top, left };
                };
                var result = ctl(num);
                wuguWuxieSmallCharacter.style.top = String(result.top) + 'px';
                wuguWuxieSmallCharacter.style.left = String(result.left) + 'px';
            };
        },
        contentBefore: function () {
            "step 0";
            if (!targets.length) {
                event.finish();
                return;
            };
            if ((card.storage && card.storage.chooseDirection) || get.is.versus()) {
                player.chooseControl('顺时针', '逆时针', function (event, player) {
                    if ((get.event("isVersus") && player.next.side == player.side) || get.attitude(player, player.next) > get.attitude(player, player.previous)) return "逆时针";
                    return '顺时针';
                }).set('prompt', '选择' + get.translation(card) + '的结算方向').set("isVersus", get.is.versus());
            } else {
                event.goto(2);
            };
            "step 1";
            if (result && result.control == '顺时针') {
                var evt = event.getParent();
                var sorter = (_status.currentPhase || player);
                evt.fixedSeat = true;
                evt.targets.sortBySeat(sorter);
                evt.targets.reverse();
                if (evt.targets[evt.targets.length - 1] == sorter) {
                    evt.targets.unshift(evt.targets.pop());
                };
            };
            "step 2";
            ui.clear();
            var cards;
            if (card.storage && Array.isArray(card.storage.fixedShownCards)) {
                cards = card.storage.fixedShownCards.slice();
                var lose_list = [];
                var cards2 = [];
                cards.forEach((card) => {
                    var owner = get.owner(card);
                    if (owner) {
                        var arr = lose_list.find((i) => i[0] == owner);
                        if (arr) arr[1].push(card);
                        else lose_list.push([owner, [card]]);
                    } else cards2.add(card);
                });
                if (lose_list.length) {
                    lose_list.forEach((list) => {
                        list[0].$throw(list[1]);
                        game.log(list[0], "将", list[1], "置于了处理区");
                    });
                    game.loseAsync({
                        lose_list: lose_list,
                        visible: true,
                    }).setContent("chooseToCompareLose");
                };
                if (cards2.length) game.cardsGotoOrdering(cards2);
                game.delayex();
            } else {
                var num;
                if (event.targets) {
                    num = event.targets.length;
                } else {
                    num = game.countPlayer();
                };
                if (card.storage && typeof card.storage.extraCardsNum == "number") num += card.storage.extraCardsNum;
                cards = get.cards(num);
                game.cardsGotoOrdering(cards).relatedEvent = event.getParent();
            };
            var dialog = ui.create.newdialog('#wugu', cards, true);
            dialog.classList.remove('scroll1', 'scroll2', 'addNewRow');
            var title = ui.create.div('.wuguTitle', '五谷丰登', dialog);
            var sanjiao = ui.create.div('.wuguTitlexg', dialog);
            var wuguCurrentSmallCharacter = ui.create.div('.wuguCurrentSmallCharacter', dialog);
            // wuguCurrentSmallCharacter.style.backgroundImage = player.node.avatar.style.backgroundImage;
            //修改五谷丰登国战暗将拿牌
            wuguCurrentSmallCharacter.style.backgroundImage = player.isUnseen(0) ? player.isUnseen(1) ? 'linear-gradient(0deg, #000000, #000000)' : player.node.avatar2.style.backgroundImage : player.node.avatar.style.backgroundImage;
            var wuguWuxieBox = ui.create.div('.wuguWuxieBox', dialog);
            var wuguWuxieText = ui.create.div('.wuguWuxieText', '被无懈：', wuguWuxieBox);
            wuguWuxieText.style.display = 'none';
            const footer = document.createElement("div");
            footer.classList.add("wugu-footer");
            footer.insertAdjacentHTML("afterbegin", get.translation(player.name)+"正在选牌");
            dialog.appendChild(footer);
            footer.style.top = "120px";
            sanjiao.addEventListener('click', function() {
                if (dialog.classList.contains('open')) {
                    dialog.classList.remove('open');
                    sanjiao.style.transform = "rotate(0deg)";
                    footer.style.opacity = "1";
                    dialog.style.top = "30px";
                    let head = document.querySelector(".wuguCurrentSmallCharacter");
                    if (head) head.style.opacity = "1";
                    let box = document.querySelector(".wuguWuxieBox");
                    if (box) box.style.opacity = "1";
                } else {
                    dialog.classList.add('open');
                    sanjiao.style.transform = "rotate(180deg)";
                    footer.style.opacity = "0";
                    dialog.style.top = "50%";
                    let head = document.querySelector(".wuguCurrentSmallCharacter");
                    if (head) head.style.opacity = "0";
                    let box = document.querySelector(".wuguWuxieBox");
                    if (box) box.style.opacity = "0";
                };
            });
            dialog.setAttribute('dialog-name', "wugu");
            dialog.buttons.forEach(function (button) {
                button.setAttribute("sourceCard", "wugu");
            });
            _status.dieClose.push(dialog);
            dialog.videoId = lib.status.videoId++;
            game.addVideo('cardDialog', null, ['五谷丰登', get.cardsInfo(cards), dialog.videoId]);
            event.getParent().preResult = dialog.videoId;
            game.broadcast(function (cards, id) {
                var dialog = ui.create.newdialog('五谷丰登', cards, true);
                dialog.classList.remove('scroll1', 'scroll2', 'addNewRow');
                _status.dieClose.push(dialog);
                dialog.videoId = id;
            }, cards, dialog.videoId);
            game.log(event.card, '亮出了', cards);
        },
        content: function () {
            "step 0";
            for (var i = 0; i < ui.dialogs.length; i++) {
                if (ui.dialogs[i].videoId == event.preResult) {
                    event.dialog = ui.dialogs[i];
                    break;
                };
            };
            if (!event.dialog) {
                event.finish();
                return;
            };
            lib.card.wugu.updateCurrentCharacter(target);
            game.delay(0.75); // 延迟
            if (event.dialog.buttons.length > 1) {
                var next = target.chooseButton(true);
                next.set("ai", button => {
                    let player = _status.event.player;
                    let card = button.link;
                    let val = get.value(card, player);
                    if (get.tag(card, "recover")) {
                        val += game.countPlayer(target => {
                            return target.hp < 2 && get.attitude(player, target) > 0 && lib.filter.cardSavable(card, player, target);
                        });
                        if (player.hp <= 2 && game.checkMod(card, player, "unchanged", "cardEnabled2", player)) val *= 2;
                    };
                    return val;
                });
                next.set("dialog", event.preResult);
                next.set("closeDialog", false);
                next.set("dialogdisplay", true);
            } else {
                event.directButton = event.dialog.buttons[0];
            };
            "step 1";
            var dialog = event.dialog;
            var card;
            if (event.directButton) {
                card = event.directButton.link;
            } else {
                for (var i of dialog.buttons) {
                    if (i.link == result.links[0]) {
                        card = i.link;
                        break;
                    };
                };
                if (!card) card = event.dialog.buttons[0].link;
            };
    
            var button;
            for (var i = 0; i < dialog.buttons.length; i++) {
                if (dialog.buttons[i].link == card) {
                    button = dialog.buttons[i];
                    button.style.transition = 'transform 0.01s ease-in-out';
                    button.style.transform = 'scale(0.9)';
                    var wuguSelectedSmallCharacter = ui.create.div('.wuguSelectedSmallCharacter', button);
                    var wuguSelectedSmallCharacterName = ui.create.div('.wuguSelectedSmallCharacterName', wuguSelectedSmallCharacter);
                    // wuguSelectedSmallCharacter.style.backgroundImage = target.node.avatar.style.backgroundImage;
                    //修改五谷丰登国战暗将拿牌
                    wuguSelectedSmallCharacter.style.backgroundImage = target.isUnseen(0) ? target.isUnseen(1) ? 'linear-gradient(0deg, #000000, #000000)' : target.node.avatar2.style.backgroundImage : target.node.avatar.style.backgroundImage;
                    wuguSelectedSmallCharacterName.innerHTML = get.translation(target.name);
                    var wuguSelected = ui.create.div('.wuguSelected', button);
                    dialog.buttons.remove(button);
                    break;
                };
            };
            var capt = get.translation(target) + '选择了' + get.translation(button.link);
            if (card) {
                target.gain(card, 'visible');
                target.$gain2(card);
                game.broadcast(function (card, id, name, capt) {
                    var dialog = get.idDialog(id);
                    if (dialog) {
                        dialog.content.firstChild.innerHTML = capt;
                        for (var i = 0; i < dialog.buttons.length; i++) {
                            if (dialog.buttons[i].link == card) {
                                dialog.buttons[i].querySelector('.info').innerHTML = name;
                                dialog.buttons.splice(i--, 1);
                                break;
                            };
                        };
                    };
                }, card, dialog.videoId, function (target) {
                    if (target._tempTranslate) return target._tempTranslate;
                    var name = target.name;
                    if (lib.translate[name + '_ab']) return lib.translate[name + '_ab'];
                    return get.translation(name);
                }(target), capt);
            };
            game.addVideo('dialogCapt', null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
            game.log(target, '选择了', button.link);
            game.delay();
        },
    });
    Object.assign(lib.card.wuxie, {
        content: function () {
            var trigger = event.getParent(2)._trigger;
            if (trigger.name == "phaseJudge") {
                trigger.untrigger("currentOnly");
                trigger.cancelled = true;
            } else {
                trigger.neutralize();
                // ----修改开始----
                if (trigger.card && trigger.card.name=='wugu') {
                    lib.card.wugu.updateWuxieCharacter(trigger.target);
                }
                // ----修改结束----
                if (event.getParent().guowuxie == true) {
                    trigger.getParent().excluded.addArray(
                        game.filterPlayer(function (current) {
                            return current.isFriendOf(trigger.target);
                        })
                    );
                }
            }
            /*
            event.result={
                wuxied:true,
                directHit:evt.directHit||[],
                nowuxie:evt.nowuxie,
            };*/
            if (player.isOnline()) {
                player.send(function (player) {
                    if (ui.tempnowuxie && !player.hasWuxie()) {
                        ui.tempnowuxie.close();
                        delete ui.tempnowuxie;
                    }
                }, player);
            } else if (player == game.me) {
                if (ui.tempnowuxie && !player.hasWuxie()) {
                    ui.tempnowuxie.close();
                    delete ui.tempnowuxie;
                }
            }
        },
    });
}
