import Vue from 'vue'
import Router from 'uni-simple-router';
import modules from './moduls'
Vue.use(Router);
const router = new Router({
	encodeURI:false,
	routes: [...modules]
});

// router.beforeEach((to, from, next) => {
// 	console.log(to);
// 	console.log(from)
// 	next()
// })
// router.afterEach((to, from) => {
// 	console.log(to);
// 	console.log(from)
// })
// console.log(router)

export default router
