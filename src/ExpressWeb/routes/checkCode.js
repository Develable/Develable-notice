const express = require('express');
const router = express.Router();

const Discord = require('discord.js');
const dscl = new Discord.Client();

const store = require('store');

const settings = require('./../../settings.json');

const md5 = require('md5');

router.post('/', async (req, res) => {
    console.log(store.get('submitCode'));
    if (req.body.submitCode == store.get('submitCode')) {
        store.remove('submitCode');
        dscl.login(settings.botToken).then(() => {
            dscl.fetchUser(req.body.usrid).then((usr) => {
                store.set('userTag', usr.tag);
                store.set('userPIURL', usr.avatarURL);
                dscl.destroy();
                res.send('<meta http-equiv="refresh" content="0;url=/send" />');
            });
        });
    } else {
        res.send(`<script>alert('잘못된 코드입니다! Cookie : ${store.get('submitCode')}, Body : ${req.body.submitCode}');</script><meta http-equiv="refresh" content="0;url=/login" />`);
    }
    return;
});

module.exports = router;