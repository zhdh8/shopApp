<template>
	<div class="cartcontrol">
        <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
        </div>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)">
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue'

	export default {
		props: {
			food: {
				type: Object
			}
		},
		methods: {
			addCart(event) {
				if(!event._constructed){
					return;
				}
				if(!this.food.count) {
					Vue.set(this.food,'count',1);
				}else {
					this.food.count++;
				}

				this.$emit('ballAdd',event);
			},
			decreaseCart(event) {
				if(!event._constructed){
					return;
				}
				if(this.food.count) {
					this.food.count--;
				}
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">

	.cartcontrol
		font-size: 0
		.cart-decrease,.cart-add
			display: inline-block
			padding: 6px
			font-size: 24px
			line-height: 24px
			color: rgb(0,160,220)
		.cart-count
			display: inline-block
			vertical-align: top
			width: 12px
			font-size: 10px
			line-height: 24px
			text-align: center
			color: rgb(147,153,159)

			
</style>
