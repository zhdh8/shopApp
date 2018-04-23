const express = require('express');
const config = require('./config/index')
const fs = require('fs');
const path = require('path');

const port = 8082;

const app = express();

const router = express.Router();

router.get('/',function(req,res,next) {
	req.url = '/index.html';
	next();
});

app.use(router);

const appData = require('./data.json');
const seller = appData.seller;
const goods = appData.goods;
const ratings = appData.ratings;


// api接口
const apiRoutes = express.Router();
apiRoutes.get('/seller', function(req, res) {
    res.json({
        erron: 0,
        data: seller
    })
});

apiRoutes.get('/goods', function(req, res) {
    res.json({
        erron: 0,
        data: goods
    })
});

apiRoutes.get('/ratings', function(req, res) {
    res.json({
        erron: 0,
        data: ratings
    })
});
app.use('/api', apiRoutes);

app.use(express.static('./dist'));

app.listen(port);