import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function initgainPlayerCardCss() {
    lib.init.css(lib.assetURL + "extension/美化补充/css", "gainPlayerCard");
}
export function gainPlayerCard() {
    lib.element.content.gainPlayerCard = function() {
        "step 0";
        if (event.directresult) {
            event.result = {
                buttons: [],
                cards: event.directresult.slice(0),
                links: event.directresult.slice(0),
                targets: [],
                confirm: 'ok',
                bool: true
            };
            event.cards = event.directresult.slice(0);
            event.goto(2);
            return;
        };
        if (!event.dialog) {
            event.dialog = ui.create.dialog('hidden');
            //noupdate是为了不让游戏的样式刷新它，有noupdate的框可以自己随意设定
            event.dialog.classList.add('noupdate')
            event.dialog.id = 'gainPlayerCardDialog';
        };
        var gainPlayerCardTitle = ui.create.div('.gainPlayerCardTitle');
        var footer = ui.create.div('.gainPlayerCardfooterxg');
        if (event.prompt) footer.innerHTML = event.prompt;
        else footer.innerHTML = "请在窗口中点击选择你要获得<span style='color: #66FF66'>"+get.translation(target.name)+'</span>的牌';
        if (event.title) {
            gainPlayerCardTitle.innerHTML = event.title;
        } else {
            let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g")
            var num = 1;
            while (true) {
                if (reg.test(get.translation(this.getParent(num).name))) {
                    gainPlayerCardTitle.innerHTML = get.translation(this.getParent(num).name);
                    num = 1;
                    break;
                } else {
                    num++;
                };
                if (!this.getParent(num)) {
                    gainPlayerCardTitle.innerHTML = '拿牌';
                    break;
                };
                if (num > 10) break;
            };
        };
        event.dialog.appendChild(gainPlayerCardTitle);
        event.dialog.appendChild(footer);
        var select = get.select(event.selectButton);
        var directh = !lib.config.unauto_choose && !event.isOnline() && select[0] == select[1] && (!event.complexSelect || select[1] === 1);
        event.join_h = function() {
            var hs = target.getGainableCards(player, 'h');
            var hArea = ui.create.div('.hArea', event.dialog);
            //处理鼠标滚轮事件
            hArea.addEventListener('wheel',function(event){
                event.preventDefault();
                const hArea = document.querySelector('.hArea');
                const delta = event.deltaY || event.detail  || event.wheelDelta;
                hArea.scrollLeft += delta;
            });	
            var hTitle = ui.create.div('.hTitle', event.dialog);
            hTitle.innerHTML = '手牌区';
            if (event.position && event.position.includes('h')) {
                if (hs.length) {
                    hs.randomSort();
                    if (event.visible || target.isUnderControl(true) || player.hasSkillTag('viewHandcard', null, target, true)) {
                        event.dialog.newadd(hs, '', '', hArea);
                        directh = false;
                    } else {
                        event.dialog.newadd([hs, 'blank'], '', '', hArea);
                    };
                };
            };
        };
        event.join_e = function() {
            var es = target.getGainableCards(player, 'e');
            var eArea = ui.create.div('.eArea', event.dialog);
            var eTitle = ui.create.div('.eTitle', event.dialog);
            eTitle.innerHTML = '装备区';
            var cardList = [];
            for (var x = 1; x < 6; x++) {
                var cards = es.filter(function(card){
                    var types = get.subtypes(card);
                    if (types.length) return types[0] == 'equip' + x;
                    return false;
                });
                for (var card of cards) {
                    es.remove(card);
                };
                cardList.push(cards);
            };
            if (es.length) cardList[cardList.length - 1] = [...cardList[cardList.length - 1], ...es];
            var equipList = ['武器牌', '防具牌', '+1马', '-1马', '宝物牌'];
            for (var x = 1; x < 6; x++) {
                var eAreaCard;
                eAreaCard = ui.create.div('.eAreaCard', eArea);
                eAreaCard.innerHTML = equipList[x - 1];
                eAreaCard.setAttribute('id', 'equip' + x);
                if (event.position && event.position.includes('e')) {
                    var cards = cardList[x - 1];
                    if (cards.length) {
                        event.dialog.newadd(cards, '', '', eAreaCard);
                    };
                };
            };
            if (es.length) directh = false;
        };
        event.join_j = function() {
            var js = target.getGainableCards(player, 'j');
            var jArea = ui.create.div('.jArea', event.dialog);
            var jTitle = ui.create.div('.jTitle', event.dialog);
            jTitle.innerHTML = '延时锦囊牌';
            for (var x = 0; x < 3; x++) {
                var jAreaCard = ui.create.div('.jAreaCard', jArea);
                jAreaCard.setAttribute('id', 'judgeCard' + x);
                jAreaCard.innerHTML = '单张牌' + '<br>' + '延时锦囊';
                if (event.position && event.position.includes('j')) {
                    if (js.length && js[x]) event.dialog.newadd([js[x]], '', '', jAreaCard);
                };
            };
            if (js.length) directh = false;
        };
        let pst = '';
        if (event.position.indexOf('h') != -1) {
            event.join_h();
            pst += 'h';
        };
        if (event.position.indexOf('e') != -1) {
            event.join_e();
            pst += 'e';
        };
        if (event.position.indexOf('j') != -1) {
            event.join_j();
            pst += 'j';
        };

        if (pst != 'hej') event.dialog.dataset.pst = pst;

        if (event.dialog.buttons.length == 0) {
            event.dialog.close();
            event.finish();
            return;
        };
        var cs = target.getCards(event.position);
        var directFilter = event.forced && typeof event.filterOk != "function" && typeof event.selectButton != "function" && event.filterButton == lib.filter.all;
        if (directFilter && select[0] >= cs.length) {
            event.result = {
                bool: true,
                buttons: event.dialog.buttons,
                links: cs,
            };
        } else if (directFilter && directh) {
            event.result = {
                bool: true,
                buttons: event.dialog.buttons.randomGets(select[0]),
                links: [],
            };
            for (var i = 0; i < event.result.buttons.length; i++) {
                event.result.links[i] = event.result.buttons[i].link;
            };
        } else {
            if (event.isMine()||!event.isMine) {
                // if (!event.forced) {
                //     var str = '是否发动【' + get.translation(event.parent.name) + '】获得' + get.translation(target);
                //     var range = get.select(event.selectButton);
                //     if (range[0] == range[1]) str += get.cnNumber(range[0]);
                //     else if (range[1] == Infinity) str += '至少' + get.cnNumber(range[0]);
                //     else str += get.cnNumber(range[0]) + '至' + get.cnNumber(range[1]);
                //     str += '张牌';
                //     game.me.chooseBool(str);
                // } else {
                //     var range = get.select(event.selectButton);
                //     if (range[0] == range[1] && range[0] == 1) event.auto = true;
                //     else event.newconfirm1 = true;
                    event.dialog.open();
                    game.check();
                    game.pause();
                // };
                ui.arena.classList.add("gain-player-card");
            } else if (event.isOnline()) {
                event.send();
            } else {
                event.result = 'ai';
            };
        };
        "step 1";
        if (event.result == 'ai') {
            game.check();
            if ((ai.basic.chooseButton(event.ai) || forced) && (!event.filterOk || event.filterOk())) ui.click.ok();
            else ui.click.cancel();
        } /*else if (result && result.bool) {
            event.forced = true;
            var range = get.select(event.selectButton);
            if (range[0] == range[1] && range[0] == 1) event.auto = true;
            else event.newconfirm1 = true;
            event.dialog.open();
            game.check();
            game.pause();
        } else if (result && result.bool == false) {
            event.finish();
            return;
        };*/
        "step 2";
        event.dialog.close();
        "step 3";
        event.resume();
        setTimeout(function () {
			ui.arena.classList.remove("gain-player-card");
		}, 500);
        if (game.online || !event.result.bool) {
            event.finish();
        };
        "step 4";
        if (event.logSkill && event.result.bool && !game.online) {
            if (typeof event.logSkill == 'string') {
                player.logSkill(event.logSkill);
            } else if (Array.isArray(event.logSkill)) {
                player.logSkill.apply(player, event.logSkill);
            };
        };
        var cards = [];
        for (var i = 0; i < event.result.links.length; i++) {
            cards.push(event.result.links[i]);
        };
        event.result.cards = event.result.links.slice(0);
        event.cards = cards;
        event.trigger("rewriteGainResult");
        "step 5";
        if (event.boolline) {
            player.line(target, 'green');
        };
        if (!event.chooseonly) {
            if (event.delay !== false) {
                var next = player.gain(event.cards, target, event.visibleMove ? 'give' : 'giveAuto', 'bySelf');
                next.gaintag.addArray(event.gaintag);
                event.done = next;
            } else {
                var next = player.gain(event.cards, target, 'bySelf');
                next.gaintag.addArray(event.gaintag);
                event.done = next;
                target[event.visibleMove ? '$give' : '$giveAuto'](cards, player);
                if (event.visibleMove) next.visible = true;
            };
        } else {
            target[event.visibleMove ? '$give' : '$giveAuto'](cards, player);
        };
    };

    /*
    lib.element.content.gainPlayerCard = function() {
        "step 0";
        if (event.directresult) {
            event.result = {
                buttons: [],
                cards: event.directresult.slice(0),
                links: event.directresult.slice(0),
                targets: [],
                confirm: 'ok',
                bool: true
            };
            event.cards = event.directresult.slice(0);
            event.goto(2);
            return;
        };
        if (!event.dialog) {
            event.dialog = ui.create.dialog('hidden');
            //noupdate是为了不让游戏的样式刷新它，有noupdate的框可以自己随意设定
            event.dialog.classList.add('noupdate')
            event.dialog.id = 'gainPlayerCardDialog';
        };
        var gainPlayerCardTitle = ui.create.div('.gainPlayerCardTitle');
        var footer = ui.create.div('.gainPlayerCardfooterxg');
        footer.innerHTML = "请在窗口中点击选择你要获得<span style='color: #66FF66'>"+get.translation(target.name)+'</span>的牌';
        let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g")
        var num = 1;
        while (true) {
            if (reg.test(get.translation(this.getParent(num).name))) {
                gainPlayerCardTitle.innerHTML = get.translation(this.getParent(num).name) + '▾';
                num = 1;
                break;
            } else {
                num++;
            };
            if (!this.getParent(num)) {
                gainPlayerCardTitle.innerHTML = '拿牌';
                break;
            };
            if (num > 10) break;
        };
        event.dialog.appendChild(gainPlayerCardTitle);
        event.dialog.appendChild(footer);
        var select = get.select(event.selectButton);
        var directh = !lib.config.unauto_choose && !event.isOnline() && select[0] == select[1] && (!event.complexSelect || select[1] === 1);
        event.join_h = function() {
            var hs = target.getGainableCards(player, 'h');
            var hArea = ui.create.div('.hArea', event.dialog);
            //处理鼠标滚轮事件
            hArea.addEventListener('wheel',function(event){
                event.preventDefault();
                const hArea = document.querySelector('.hArea');
                const delta = event.deltaY || event.detail  || event.wheelDelta;
                hArea.scrollLeft += delta;
            });	
            var hTitle = ui.create.div('.hTitle', event.dialog);
            hTitle.innerHTML = '手牌区';
            if (event.position && event.position.includes('h')) {
                if (hs.length) {
                    hs.randomSort();
                    if (event.visible || target.isUnderControl(true) || player.hasSkillTag('viewHandcard', null, target, true)) {
                        event.dialog.newadd(hs, '', '', hArea);
                        directh = false;
                    } else {
                        event.dialog.newadd([hs, 'blank'], '', '', hArea);
                    };
                };
            };
        };
        event.join_e = function() {
            var es = target.getGainableCards(player, 'e');
            var eArea = ui.create.div('.eArea', event.dialog);
            var eTitle = ui.create.div('.eTitle', event.dialog);
            eTitle.innerHTML = '装备区';
            var equipList = ['武器牌', '防具牌', '+1马', '-1马', '宝物牌'];
            for (var x = 1; x < 6; x++) {
                var eAreaCard;
                eAreaCard = ui.create.div('.eAreaCard', eArea);
                eAreaCard.innerHTML = equipList[x - 1];
                eAreaCard.setAttribute('id', 'equip' + x);
                if (event.position && event.position.includes('e')) {
                    if (target.getEquip(x) != null && es.length && es.includes(target.getEquip(x))) {
                        event.dialog.newadd([target.getEquip(x)], '', '', eAreaCard);
                    };
                    if (x == 3 && target.getEquip(6) != null && es.length && es.includes(target.getEquip(6))) {
                        event.dialog.newadd([target.getEquip(6)], '', '', eAreaCard);
                    };
                };
            };
            if (es.length) directh = false;
        };
        event.join_j = function() {
            var js = target.getGainableCards(player, 'j');
            var jArea = ui.create.div('.jArea', event.dialog);
            var jTitle = ui.create.div('.jTitle', event.dialog);
            jTitle.innerHTML = '延时锦囊牌';
            for (var x = 0; x < 3; x++) {
                var jAreaCard = ui.create.div('.jAreaCard', jArea);
                jAreaCard.setAttribute('id', 'judgeCard' + x);
                jAreaCard.innerHTML = '单张牌' + '<br>' + '延时锦囊';
                if (event.position && event.position.includes('j')) {
                    if (js.length && js[x]) event.dialog.newadd([js[x]], '', '', jAreaCard);
                };
            };
            if (js.length) directh = false;
        };
        let pst = '';
        if (event.position.indexOf('h') != -1) {
            event.join_h();
            pst += 'h';
        };
        if (event.position.indexOf('e') != -1) {
            event.join_e();
            pst += 'e';
        };
        if (event.position.indexOf('j') != -1) {
            event.join_j();
            pst += 'j';
        };

        if (pst != 'hej') event.dialog.dataset.pst = pst;

        if (event.dialog.buttons.length == 0) {
            event.dialog.close();
            event.finish();
            return;
        };
        var cs = target.getCards(event.position);
        var directFilter = event.forced && typeof event.filterOk != "function" && typeof event.selectButton != "function" && event.filterButton == lib.filter.all;
        if (directFilter && select[0] >= cs.length) {
            event.result = {
                bool: true,
                buttons: event.dialog.buttons,
                links: cs,
            };
        } else if (directFilter && directh) {
            event.result = {
                bool: true,
                buttons: event.dialog.buttons.randomGets(select[0]),
                links: [],
            };
            for (var i = 0; i < event.result.buttons.length; i++) {
                event.result.links[i] = event.result.buttons[i].link;
            };
        } else {
            if (event.isMine()||!event.isMine) {
                if (!event.forced) {
                    var str = '是否发动【' + get.translation(event.parent.name) + '】获得' + get.translation(target);
                    var range = get.select(event.selectButton);
                    if (range[0] == range[1]) str += get.cnNumber(range[0]);
                    else if (range[1] == Infinity) str += '至少' + get.cnNumber(range[0]);
                    else str += get.cnNumber(range[0]) + '至' + get.cnNumber(range[1]);
                    str += '张牌';
                    game.me.chooseBool(str);
                } else {
                    var range = get.select(event.selectButton);
                    if (range[0] == range[1] && range[0] == 1) event.auto = true;
                    else event.newconfirm1 = true;
                    event.dialog.open();
                    game.check();
                    game.pause();
                };
                ui.arena.classList.add("gain-player-card");
            } else if (event.isOnline()) {
                event.send();
            } else {
                event.result = 'ai';
            };
        };
        "step 1";
        if (event.result == 'ai') {
            game.check();
            if ((ai.basic.chooseButton(event.ai) || forced) && (!event.filterOk || event.filterOk())) ui.click.ok();
            else ui.click.cancel();
        } else if (result && result.bool) {
            event.forced = true;
            var range = get.select(event.selectButton);
            if (range[0] == range[1] && range[0] == 1) event.auto = true;
            else event.newconfirm1 = true;
            event.dialog.open();
            game.check();
            game.pause();
        } else if (result && result.bool == false) {
            event.finish();
            return;
        };
        "step 2";
        event.dialog.close();
        "step 3";
        event.resume();
        setTimeout(function () {
			ui.arena.classList.remove("gain-player-card");
		}, 500);
        if (game.online || !event.result.bool) {
            event.finish();
        };
        "step 4";
        if (event.logSkill && event.result.bool && !game.online) {
            if (typeof event.logSkill == 'string') {
                player.logSkill(event.logSkill);
            } else if (Array.isArray(event.logSkill)) {
                player.logSkill.apply(player, event.logSkill);
            };
        };
        var cards = [];
        for (var i = 0; i < event.result.links.length; i++) {
            cards.push(event.result.links[i]);
        };
        event.result.cards = event.result.links.slice(0);
        event.cards = cards;
        event.trigger("rewriteGainResult");
        "step 5";
        if (event.boolline) {
            player.line(target, 'green');
        };
        if (!event.chooseonly) {
            if (event.delay !== false) {
                var next = player.gain(event.cards, target, event.visibleMove ? 'give' : 'giveAuto', 'bySelf');
                event.done = next;
            } else {
                var next = player.gain(event.cards, target, 'bySelf');
                event.done = next;
                target[event.visibleMove ? '$give' : '$giveAuto'](cards, player);
                if (event.visibleMove) next.visible = true;
            };
        } else {
            target[event.visibleMove ? '$give' : '$giveAuto'](cards, player);
        };
    };
    */
}
