const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');

const path = require('path');
const isIP = require('net').isIP;

const port = parseInt(process.env.PORT, 10) || 9001
const dev = process.env.NODE_ENV !== 'production'

var app = new Koa();
var router = new Router();

const USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const ignoreNames = ['api', 'www'];

app.use((ctx, next) => {
	// Make sure there is only one subdomain
	if(ctx.subdomains){
		if(ctx.subdomains.length == 1){
		    var subUser = ctx.subdomains[0];
		    // Make sure this matches our username regex
		    if(subUser && subUser.match(USERNAME_REGEX)){
		    	// Certain subdomains are reserved
				if(ignoreNames.indexOf(subUser) === -1){
					ctx.subUser = subUser;
				}
			}
		}else if(ctx.subdomains.length > 1){
			ctx.redirect('/');
			return;
		}
	}
	return next();
 });

// Must be used before any router is used
const nunjucks = require('nunjucks')
const env = new nunjucks.Environment(
	new nunjucks.FileSystemLoader(path.join(__dirname, 'views'))
);
env.loaders[0].noCache = true;
app.use(views(path.join(__dirname, 'views'), {
	options: {
		nunjucksEnv: env
	},
	map: {
		html: 'nunjucks'
	}
}));

require('./routes/index')(router);

app
.use(router.routes())
.use(router.allowedMethods());
app.listen(port, (err) => {
	if(err) throw err
	console.log(`> Ready on http://localhost:${port}`)
});