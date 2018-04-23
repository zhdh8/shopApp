<template>
	<div class="goods">
		<!-- 左侧菜单 -->
		<div class="menu-wrapper" ref="muneWrapper">
			<ul>
				<li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
					<span class="text border-1px">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<!-- 右侧food栏 -->
		<div class="foods-wrapper" ref="foodWrapper">
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
							<div class="icon">
								<img :src="food.icon" width="57" height="57" alt="">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span><span v-if="food.rating">好评率{{food.rating}}%</span><span v-else>好评率0%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span>
									<span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
								</div>
								<!-- 加减购物车按钮组件 -->
								<div class="cartcontrol-wrapper">
									<cartcontrol @ballAdd="ballAdd" :food="food"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<!-- 底部购物车组件 -->
		<shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
		<!-- 商品详情页组件 -->
		<food :food="foodSelected" ref="food"></food>
	</div>
	
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	import Shopcart from '../shopcart/Shopcart'
	import Cartcontrol from '../cartcontrol/Cartcontrol'
	import Food from '../food/Food'

	const ERR_OK = 0;

	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data () {
			return {
				goods: [],
				listHeight: [],
				scrollY: 0,
				foodSelected: {}
			};
		},
		created () {
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if(response.errno === ERR_OK) {
					this.goods = response.data;
					this.$nextTick(() => {
						this._initScroll();
						this._calculateHeight();
					});
				}
			});
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
		},
		computed: {
			currentIndex() {
				for(let i = 0; i < this.listHeight.length; i++){
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i+1];
					if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
						return i;
					}
				}
				return 0;
			},
			selectFoods() {
				let foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if(food.count) {
							foods.push(food);
						}
					});
				});
				return foods;
			}
		},
		methods: {
			_initScroll() {
				this.menuScroll = new BScroll(this.$refs.muneWrapper,{
					click: true
				});
				this.foodsScroll = new BScroll(this.$refs.foodWrapper,{
					probeType: 3,
					click: true
				});

				this.foodsScroll.on('scroll',(pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			_calculateHeight() {
				let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0;i < foodList.length; i++) {
					let item = foodList[i];
					height += item.clientHeight;
					this.listHeight.push(height);	
				}
			},
			selectMenu(index,event) {
				if(!event._constructed){
					return;
				}
				let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
				let el = foodList[index];
				this.foodsScroll.scrollToElement(el,300);
			},
			selectFood(food,event) {
				if(!event._constructed){
					return;
				}
				// console.log(222);
				this.foodSelected = food;
				// 调用food组件方法
				this.$refs.food.show();
			},
			_drop(target) {
				this.$refs.shopcart.drop(target);
			},
			// 子组件传来的事件
			ballAdd(target) {
				this._drop(target);
			}
		},
		components: {
			Shopcart,
			Cartcontrol,
			Food
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">

 	@import "../../common/stylus/mixin"
 	
	.goods
		display: flex
		position: absolute
		width: 100%
		top: 174px
		bottom: 46px
		overflow: hidden
		.menu-wrapper
			flex: 0 0 80px
			width: 80px
			background: #f3f5f7
			.menu-item
				display: table
				width: 56px
				height: 54px
				line-height: 14px
				padding: 0 12px
				&.current
					position: relative
					margin-top: -1px
					z-index: 10
					background: #fff
					font-weight: 700
					.text
						border-none()
				.text
					display: table-cell
					width: 56px
					vertical-align: middle
					border-1px(rgba(7,17,27,0.1))
					font-size: 12px
					.icon
						display: inline-block
						vertical-align: top
						width: 12px
						height: 12px
						margin-right: 2px
						background-size: 12px 12px
						background-repeat: no-repeat
						&.decrease
							bg-image('decrease_3')
						&.discount
							bg-image('discount_3')
						&.guarantee
							bg-image('guarantee_3')
						&.invoice
							bg-image('invoice_3')
						&.special
							bg-image('special_3')
						
					
		.foods-wrapper
			flex: 1
			.title
				padding-left: 14px
				height: 26px
				line-height: 26px
				border-left: 2px solid #d9dde1
				font-size: 12px
				color: rgb(14,153,159)
				background: #f3f5f7
			.food-item
				display: flex
				margin: 18px
				padding-bottom: 18px
				border-1px(rgba(7,17,27,0.1))
				&:last-child
					border-none()
					margin-bottom: 0
				.icon
					flex: 0 0 57px;
					margin-right: 10px
				.content
					flex: 1
					.name
						margin: 2px 0 8px 0
						height: 14px
						line-height: 14px
						font-size: 14px
						color: rgb(7,17,27)
					.desc
						margin-bottom: 8px
						line-height: 12px
						font-size: 10px
						color: rgb(147,153,159)
					.extra
						line-height: 10px
						font-size: 10px
						color: rgb(147,153,159)
						.count
							margin-right: 12px
					.price
						font-weight: 700
						line-height: 24px
						.now
							margin-right: 8px
							font-size: 14px
							color: rgb(240,20,20)
						.old
							text-decoration: line-through
							font-size: 10px
							color: rgb(147,153,159)
					.cartcontrol-wrapper
						position: absolute
						bottom: 12px
						right: 0
						
							
							
						
						
						

</style>
