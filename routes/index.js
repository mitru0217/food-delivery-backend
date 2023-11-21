const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
// const productRouter = require('/productRouter');
// const brandRouter = require('./brandRouter');

router.use(userRouter);
// router.use('/shop', brandRouter);
// router.use('/shop', productRouter);

module.exports = router;
