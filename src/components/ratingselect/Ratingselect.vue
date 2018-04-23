<template>
  <div class="ratingselect">
  	<div class="rating-type border-1px">
  		<!-- 全部 -->
  		<span @click="select(2,$event)" class="block positive" :class="{'active':sType===2}">{{selectDesc.all}}<span class="count">{{ratings.length}}</span></span>
  		<!-- 推荐 -->
  		<span @click="select(0,$event)" class="block positive" :class="{'active':sType===0}">{{selectDesc.positive}}<span class="count">{{positives.length}}</span></span>
  		<!-- 吐槽 -->
  		<span @click="select(1,$event)" class="block negative" :class="{'active':sType===1}">{{selectDesc.negative}}<span class="count">{{negatives.length}}</span></span>
  	</div>
  	<div @click="toggleContent($event)" class="switch" :class="{'on':oContent}">
  		<span class="icon-check_circle"></span>
  		<span class="text">只看有内容的评价</span>
  	</div>
  </div>
</template>

<script>
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;

	export default {
		props: {
			ratings: {
				type: Array,
				default() {
					return [];
				}
			},
			selectDesc: {
				type: Object,
				default() {
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					}
				}
			},
			selectType: {
				type: Number,
				default: ALL
			},
			onlyContent: {
				type: Boolean,
				default: false
			}

		},
		data() {
			return {
				sType: this.selectType,
				oContent: this.onlyContent
			}
		},
		methods: {
			select(type,event) {
				if(!event._constructed) {
					return;
				}
				this.sType = type;
				// 数据传递给父组件
				this.$emit('ratingType', type);
			},
			toggleContent(event) {
				if(!event._constructed) {
					return;
				}
				this.oContent = !this.oContent;
				this.$emit('contentToggle', this.oContent);
			}
		},
		computed: {
			// 过滤评论数组 推荐的
			positives() {
				return this.ratings.filter((item) => {
					return item.rateType === POSITIVE;
				});
			},
			// 过滤评论数组 吐槽的
			negatives() {
				return this.ratings.filter((item) => {
					return item.rateType === NEGATIVE;
				})
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	
	.ratingselect
		.rating-type
			padding: 18px 0;
			margin: 0 18px;
			border-1px(rgba(7,17,27,0.2))
			font-size: 0
			.block
				display: inline-block
				padding: 8px 12px
				border-raduis: 1px
				margin-right: 8px
				color: rgb(77,85,93)
				font-size: 12px
				line-height: 16px
				&.active
					color: #fff
				.count
					font-size: 8px
					margin-left: 2px
				&.positive
					background: rgba(0,160,220,0.2)
					&.active
						background: rgb(0,160,220)
				&.negative
					background: rgba(77,85,93,0.2)
					&.active
						background: rgb(77,85,93)
				
		.switch
			padding: 12px 18px
			line-height: 24px
			color: rgb(147,153,159)
			border-bottom: 1px solid rgba(7,17,27,0.1)
			font-size: 0
			&.on
				.icon-check_circle
					color: #00c850
			.icon-check_circle
				display: inline-block
				vertical-align: top
				font-size: 24px
				margin-right: 4px
				
					
			.text
				font-size: 12px
				
</style>
