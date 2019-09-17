module.exports = (router) => {
	router.get('/:hash', (ctx, next) => {
		if(ctx.subUser){

		}else{
			return next();
		}
	});
	router.get('/', (ctx, next) => {
		if(!ctx.subUser){
			return ctx.render('front');
		}
	});
	router.get('/login', (ctx, next) => {
		if(!ctx.subUser){
			return ctx.render('login');
		}
	});
};