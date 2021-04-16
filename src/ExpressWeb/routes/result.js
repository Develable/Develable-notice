const express = require('express');
const router = express.Router();

const store = require('store');

router.get('/', async (req, res) => {
    switch(store.get('sendResult')) {
        case 'okay':
            res.send('<script>alert("공지가 성공적으로 전송되었습니다!");</script><meta http-equiv="refresh" content="0;url=/send" />');
            break;
        case 'fail':
            res.send('<script>alert("공지 전송에 실패하였습니다!");</script><meta http-equiv="refresh" content="0;url=/send" />');
            break;
        default:
            res.redirect('/login');
            break;
    }
});

module.exports = router;
