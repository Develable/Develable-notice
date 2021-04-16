const express = require('express');
const router = express.Router();

const Discord = require('discord.js');
const dscl = new Discord.Client();

const store = require('store');

const settings = require('./../../settings.json');

router.post('/', async (req, res) => {
    res.cookie(`submitCode`, '', {maxAge: Date.now()});
    let submitCode = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < 5; i++ ) submitCode += possible.charAt(Math.floor(Math.random() * possible.length));
    
    store.set('submitCode', submitCode);

    dscl.login(settings.botToken).then(() => {
        dscl.fetchUser(req.body.DiscordID).then((usr) => {
            if (usr == undefined) res.send('<script>alert("사용자를 찾을 수 없습니다!");</script>'); 
            usr.createDM().then((DMChannel) => {
                DMChannel.send(submitCode);
                dscl.destroy();
            });
        });
    });

    res.send('<script>alert("코드가 전송되었습니다! 디스코드 봇이 보낸 DM을 확인하세요!")</script>');

    return;
});

module.exports = router;
