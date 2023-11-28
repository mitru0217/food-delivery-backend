const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const adminRouter = require('./AdminRouter');

router.use(userRouter);
router.use('/admin', adminRouter);

// const productRouter = require('/productRouter');
// const brandRouter = require('./brandRouter');
// router.use('/shop', brandRouter);
// router.use('/shop', productRouter);

module.exports = router;
