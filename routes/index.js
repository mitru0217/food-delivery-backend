const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const adminRouter = require('./AdminRouter');
const categoryRouter = require('./CategoryRouter');

router.use('/user', userRouter);

router.use('/admin', adminRouter);

router.use('/category', categoryRouter);

module.exports = router;

// const productRouter = require('/productRouter');
// const brandRouter = require('./brandRouter');
// router.use('/shop', brandRouter);
// router.use('/shop', productRouter);
