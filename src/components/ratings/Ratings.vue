<template>
  <div class="ratingss" ref="ratingsWrapper">
  	<div class="ratings-content">
  		<!-- 商家评分概述 -->
  		<div class="overview">
  			<div class="overview-left">
  				<h1 class="score">{{seller.score}}</h1>
  				<div class="title">综合评分</div>
  				<div class="rank">高于周边商家{{seller.rankRate}}%</div>
  			</div>
  			<div class="overview-right">
  				<div class="score-wrapper">
  					<span class="title">服务态度</span>
  					<star :size="36" :score="seller.serviceScore"></star>
  					<span class="score">{{seller.serviceScore}}</span>
  				</div>
  				<div class="score-wrapper">
  					<span class="title">商品评分</span>
  					<star :size="36" :score="seller.foodScore"></star>
  					<span class="score">{{seller.foodScore}}</span>
  				</div>
  				<div class="delivery-wrapper">
  					<span class="title">送达时间</span>
  					<span class="delivery">{{seller.deliveryTime}}分钟</span>
  				</div>
  			</div>
  		</div>
  		<!-- 分割区组件 -->
  		<split></split>
  		<!-- 评价头部选择 组件 -->
  		<ratingselect :ratings="ratings" :select-type="selectType" :only-content="onlyContent" @ratingType="ratingType" @contentToggle="contentToggle"></ratingselect>
  		<!-- 评价列表 -->
  		<div class="rating-wrapper">
  			<ul>
  				<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings" class="rating-item border-1px">
  					<div class="avatar">
  						<img :src="rating.avatar" alt="" width="28">
  					</div>
  					<div class="content">
  						<h2 class="name">{{rating.username}}</h2>
  						<div class="star-wrapper">
  							<star :size="24" :score="rating.score"></star>
  							<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
  						</div>
  						<p class="text">{{rating.text}}</p>
  						<div class="recommend" v-show="rating.recommend && rating.recommend.length">
  							<span class="icon-thumb_up"></span>
  							<span class="item" v-for="item in rating.recommend">{{item}}</span>
  						</div>
  						<div class="time">{{rating.rateTime | formatDate}}</div>
  					</div>
  				</li>
  			</ul>
  		</div>
  	</div>
  </div>
</template>

<script>
	import Star from '../star/Star'
	import Split from '../split/Split'
	import Ratingselect from '../ratingselect/Ratingselect'
	import BScroll from 'better-scroll'
	import {formatDate} from '../../common/js/formatDate'

	const ALL = 2;
	const ERR_OK = 0;

	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				ratings: [],
				selectType: ALL,
				onlyContent: true
			}
		},
		created() {
			this.$http.get('/api/ratings').then((response) => {
				response = response.body;
				if(response.errno === ERR_OK){
					this.ratings = response.data;
					// console.log(this.ratings);
					this.$nextTick(() => {
						if(!this.scroll) {
							this.scroll = new BScroll(this.$refs.ratingsWrapper, {
								click: true
							});
						}else {
							this.scroll.refresh();
						}
						
					});
				}
			})
		},
		methods: {
			needShow(type, text) {
				if(this.onlyContent && !text) {
					return false;
				}
				if(this.selectType === ALL) {
					return true;
				}else {
					return this.selectType === type;
				}
			},
			// 子组件改变数据， 子组件派发过来的事件 $emit
			ratingType(type) {
				this.selectType = type;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			},
			contentToggle(onlyContent) {
				this.onlyContent = onlyContent;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			}
		},
		components: {
			Star,
			Split,
			Ratingselect
		},
		filters: {
			formatDate(time) {
				var date = new Date(time);
				return formatDate(date,'yyyy-MM-dd hh:mm');
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	
	.ratingss
		position: absolute
		top: 174px
		bottom: 0
		width: 100%
		left:0
		overflow: hidden
		.overview
			display: flex
			psdding: 18px 0
			.overview-left
				flex: 0 0 137px
				padding: 6px 0
				border-right: 1px solid rgba(7,17,27,0.1)
				text-align: center
				@media only screen and (max-width: 320px)
					flex: 0 0 120px
					width: 120px
				.score
					font-size: 24px
					line-height: 28px
					margin-bottom: 6px
					color: rgb(255,153,0)
				.title
					font-size: 12px
					line-height: 12px
					margin-bottom: 8px
					color: rgb(7,17,27)
				.rank
					font-size: 10px
					line-height: 10px
					color: rgb(147,153,159)
			.overview-right
				flex: 1
				padding: 6px 0 6px 24px
				@media only screen and (max-width: 320px)
					padding-left: 6px
				.score-wrapper
					margin-bottom: 8px
					font-size: 0
					.title
						display: inline-block
						vertical-align: top
						font-size: 12px
						line-height: 18px
						color: rgb(7,17,27)
					.star
						display: inline-block
						vertical-align: top
						margin: 0 12px
					.score
						display: inline-block
						vertical-align: top
						line-height: 18px
						color: rgb(255,153,0)
						font-size: 12px
				.delivery-wrapper
					font-size: 0
					.title
						font-size: 12px
						line-height: 18px
						color: rgb(7,17,27)
					.delivery
						margin-left: 12px
						font-size: 12px
						color: rgb(147,153,159)	
				
		.rating-wrapper
			padding: 0 18px
			.rating-item
				display: flex
				padding: 18px 0
				border-1px(rgba(7,17,27,0.1))
				.avatar
					flex: 0 0 28px
					width: 28px
					margin-right: 12px
					img
						border-radius: 50%
				.content
					flex: 1
					position: relative
					.name
						font-size: 10px
						line-height: 12px
						color: rgb(7,17,27)
						margin-bottom: 4px
					.star-wrapper
						font-size:0
						margin-bottom: 6px
						.star
							display: inline-block
							vertical-align: top
							margin-right: 6px
						.delivery
							display: inline-block
							vertical-align: top
							font-size: 10px
							color: rgb(147,153,159)
					.text
						line-height: 18px
						color: rgb(7,17,27)
						font-size: 12px
						font-weight: 600
						margin-bottom: 12px
					.recommend
						font-size: 0
						line-height: 16px
						.icon-thumb_up,.item
							font-size: 12px
							display: inline-block
							margin: 0 8px 4px 0
						.icon-thumb_up
							color: rgb(0,160,220)
						.item
							padding: 0 6px
							border: 1px solid rgba(7,17,27,0.1)
							border-radius: 1px
							color: rgb(147,153,159)
							background: #fff
					.time
						position: absolute
						top: 0
						right: 0
						font-size: 10px
						font-weight: 200
						line-height: 12px
						color: rgb(147,153,159)
						margin-right: 18px
</style>
