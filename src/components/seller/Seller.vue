<template>
  <div class="seller" ref="sellerWrapper">
  	<div class="seller-content">
  		<div class="overview">
  			<h1 class="title">{{seller.name}}</h1>
  			<div class="desc border-1px">
  				<star :size="36" :score="seller.score"></star>
  				<span class="text">({{seller.ratingCount}})</span>
  				<span class="text">月售{{seller.sellCount}}单</span>
  			</div>
  			<ul class="remark">
  				<li class="block">
  					<h2>起送价</h2>
  					<div class="content">
  						<span class="stress">{{seller.minPrice}}</span>元
  					</div>
  				</li>
  				<li class="block">
  					<h2>商家配送</h2>
  					<div class="content">
  						<span class="stress">{{seller.deliveryPrice}}</span>元
  					</div>
  				</li>
  				<li class="block">
  					<h2>平均配送时间</h2>
  					<div class="content">
  						<span class="stress">{{seller.deliveryTime}}</span>分钟
  					</div>
  				</li>
  			</ul>
  			<div class="favorite" @click="toggleFavorite">
  				<span class="icon-favorite" :class="{'active':favorite}"></span>
  				<span class="text">{{favoriteText}}</span>
  			</div>
  		</div>
  		<!-- 分割区组件 -->
  		<split></split>
  		<!-- 公告 -->
  		<div class="bulletin">
  			<h1 class="title">公告与活动</h1>
  			<div class="content-wrapper border-1px">
  				<p class="content">{{seller.bulletin}}</p>
  			</div>
  			<!-- 活动 -->
  			<ul v-if="seller.supports" class="supports">
				<li v-for="(item, index) in seller.supports" class="support-item border-1px">
					<span class="icon" :class="classMap[seller.supports[index].type]"></span>
					<span class="text">{{seller.supports[index].description}}</span>
				</li>
			</ul>
  		</div>
  		<!-- 分割区组件 -->
  		<split></split>
  		<!-- 商家实景 -->
  		<div class="pics">
  			<h2 class="title">商家实景</h2>
  			<div class="pic-wrapper" ref="picWrapper">
  				<ul class="pic-list" ref="picList">
  					<li v-for="pic in seller.pics" class="pic-item">
  						<img :src="pic" width="120" height="90" alt="">
  					</li>
  				</ul>
  			</div>
  		</div>
  		<!-- 分割区组件 -->
  		<split></split>
  		<!-- 商家信息 -->
  		<div class="info">
  			<h2 class="title border-1px">商家信息</h2>
  			<ul>
  				<li v-for="info in seller.infos" class="info-item border-1px">{{info}}</li>
  			</ul>
  		</div>
  	</div>
  </div>
</template>

<script>
	import BScroll from 'better-scroll'
	import Star from '../star/Star'
	import Split from '../split/Split'

	const ERR_OK = 0;

	export default {
		data() {
			return {
				seller: {},
				favorite: false
			}
		},
		watch: {
			seller() {
				this._initScroll();
				this._initPics();
			}
		},
		methods: {
			_initScroll(){
				if(!this.scroll) {
					this.scroll = new BScroll(this.$refs.sellerWrapper, {
						click: true
					})
				}else {
					this.scroll.refresh();
				}
			},
			_initPics() {
				// 计算picWrapper 宽度
				if(this.seller.pics) {
					let picWidth = 120;
					let marginR = 6;
					let width = (picWidth + marginR) * this.seller.pics.length - marginR;

					this.$refs.picList.style.width = width + 'px';
					this.$nextTick(() => {
						if(!this.picScroll) {
							this.picScroll = new BScroll(this.$refs.picWrapper, {
								scrollX: true,
								eventPassthrough: 'vertical'
							});
						}else{
							this.picScroll.refresh();
						}
					});
				}
			},
			toggleFavorite(event) {
				if(!event._constructed) {
					return;
				}
				this.favorite = !this.favorite;
			}
		},
		created() {
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
			this.$http.get('/api/seller').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.seller = response.data;
				}
			});
		},
		mounted() {
			this._initScroll();
			this._initPics();
		},
		computed: {
			favoriteText() {
				return this.favorite ? '已收藏' : '收藏';
			}
		},
		components: {
			Star,
			Split
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	
	.seller
		position: absolute
		top: 174px
		bottom: 0
		width: 100%
		left:0
		overflow: hidden
		.overview
			position: relative
			padding: 18px
			.title
				margin: 8px 0
				line-height: 14px
				color: rgb(7,17,27)
				font-size: 14px
			.desc
				font-size: 0
				padding-bottom: 18px
				border-1px(rgba(7,17,27,0.1))
				.star
					display: inline-block
					vertil-align: top
					line-height: 18px
					margin-right: 8px
				.text
					display: inline-block
					line-height: 18px
					vertil-align: top
					margin-right: 12px
					color: rgb(77,85,93)
					font-size: 10px
			.remark
				display: flex
				padding-top: 18px
				.block
					flex: 1
					text-align: center
					border-right: 1px solid rgba(7,17,27,0.1)
					&:last-child
						border-right: none
					h2
						font-size: 10px
						margin-bottom: 4px
						line-height: 10px
						color: rgb(147,153,159)
					.content
						line-height: 24px
						font-size: 10px
						color: rgb(7,17,27)
						.stress
							font-size: 24px
							font-weight: 200
			.favorite
				position: absolute
				right: 11px
				top: 18px
				width: 50px
				text-align: center
				.icon-favorite
					display: block
					margin-bottom: 4px
					color: #d4d6d9
					line-height: 24px
					font-size: 24px
					&.active
						color: rgb(240,20,20)
				.text
					line-height: 10px
					font-size: 10px
					color: rgb(77,89,93)
		.bulletin
			padding: 18px 18px 0 18px
			.title
				margin-bottom: 8px
				line-height: 12px
				color: rgb(7,17,27)
				font-size: 14px
			.content-wrapper
				padding: 0 12px 16px 12px 
				border-1px(rgba(7,17,27,0.1))
				.content
					line-height: 24px
					font-size: 12px
					color: rgb(240,20,20)
			.supports
				.support-item
					padding: 16px 12px
					font-size: 12px
					border-1px(rgba(7,17,27,0.1))
					.icon
						display: inline-block
						vertical-align: top
						width: 12px
						height: 12px
						margin-right: 4px
						background-size: 12px 12px
						background-repeat: no-repeat
						&.decrease
							bg-image('decrease_4')
						&.discount
							bg-image('discount_4')
						&.guarantee
							bg-image('guarantee_4')
						&.invoice
							bg-image('invoice_4')
						&.special
							bg-image('special_4')
					.text
						line-height: 16px
						font-size: 12px
						color: rgb(7,17,27)
						font-weight: 200
		
		.pics
			padding: 18px
			.title
				margin-bottom: 12px
				line-height: 14px
				color: rgb(7,17,27)
				font-size: 14px
			.pic-wrapper
				width: 100%
				overflow: hidden
				white-space: nowrap
				.pic-list
					font-size: 0
					.pic-item
						display: inline-block
						margin-right: 6px
						width: 120px
						height: 90px
						&:last-child
							margin-right: 0
		
		.info
			padding: 18px 18px 0 18px
			.title
				padding-bottom: 8px
				line-height: 12px
				color: rgb(7,17,27)
				font-size: 14px
				border-1px(rgb(7,17,27,0.1))
			.info-item
				padding: 16px 12px
				line-height: 16px
				font-size: 12px
				border-1px(rgb(7,17,27,0.1))
				color: rgb(7,17,27)
				&:last-child
					border-none()
</style>
