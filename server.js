var koa = require('koa'),
    bodyParser = require('koa-body-parser'),
    config = require('./libs/config'),
    routes = require('./routes/index'),
    app = koa()

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
};

var setResponseOptions = function(req, res, next) {
	var responseOptions = {};
	responseOptions.callback = req.query.callback || '';
	responseOptions.format = req.query.format || null;
	res.responseOptions = responseOptions;
	next();
}

// X-Response-Time
app.use(function *(next){
  var start = new Date
  yield next
  var ms = new Date - start
  this.set('X-Response-Time', ms + 'ms')
})

// Logger
app.use(function *(next){
  var start = new Date
  yield next
  var ms = new Date - start
  console
  .log
  ( '%s - %s %s - %s - %s ms'
  , start.toUTCString()
  , this.method
  , this.url
  , this.status
  , ms
  )
})

// Body
app.use(bodyParser())

// Error Handling
app.use(function *(next){
  try {
    yield next
  } catch(e) {
    console.error(e.stack || e)
    this.status = e.status || 500
    this.body = {error: true, msg: e.toString()}
    this.app.emit('Error: ', e, this)
  }
})

app.use(routes().routes())

app.listen(config.app.port, config.app.host, function() {
  console.log('Listening on http://%s:%s', config.app.host, config.app.port)
})
