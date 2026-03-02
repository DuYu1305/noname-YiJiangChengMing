
    import {lib,game,ui,get,ai,_status} from '../../../../noname.js'
    import {characterData} from '../../character/characterData.js'

    lib.init.css(lib.assetURL + 'extension/点绛唇/extension/OpenCardsDialog', 'openCardsDialog');
    
    game.openCardsDialog = function(player) {
        const handsDialog = ui.create.div(document.body, '.handsDialog', function(event) {
            if(event.target===handsDialog)handsDialog.delete();
        });
        const cardsBg = ui.create.div('.cardsDialog', handsDialog);
        const scrollContainer = ui.create.div('.cardsScrollContainer', cardsBg);
        const cards = player.getCards('h');
        cards.forEach(function(item) {
            const card = game.createCard(
                get.name(item, false),
                get.suit(item, false),
                get.number(item, false),
                get.nature(item, false)
            );
            card.style.flex='0 0 auto';
            scrollContainer.appendChild(card);
        });
        const name = get.slimName(player.name1);
        const head = ui.create.div('.handHead', cardsBg);
        ui.create.div('.text',name + '的手牌',head);
        const image = ui.create.div('.charImage', cardsBg);
        if (characterData[player.name1]) {
            image.setBackgroundImage('extension/点绛唇/image/character/lihui/' + player.name1 + '.jpg');
            image.style.webkitMask='none';
            image.style.backgroundRepeat='none';
        } else {
            game.getFileList('image/lihui', function(folders, files) {
                if (files.includes(player.name1 + '.jpg')) {
                    image.setBackgroundImage('image/lihui/' + player.name1 + '.jpg');
                    image.style.webkitMask='none';
                    image.style.backgroundRepeat='none';
                } else {
                    image.setBackground(player.name1, 'character');
                }
            }, function() {
                image.setBackground(player.name1, 'character');
            });
        }
    };