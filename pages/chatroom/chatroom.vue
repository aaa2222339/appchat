<template>
	<view>
		<view class="status-bar">
			<!-- open-type="navigateBack"：跳到上一页面或多级页面 -->
			<navigator open-type="navigateBack" class="login-c" hover-class="none">
				<image src="../../static/back.png" class="login-back"></image>
			</navigator>
			<!-- <view>智慧医疗小助手</view> -->
		</view>
		<view class="main">
			<view v-for="(e,index) in chat" :key="index">
				<!-- 客户端-->
				<view class="right msg" v-if="e.fid == 1">
					<image :src="'../../static/images/'+e.img+'.png'"></image>
					<view class="nr">
						<view class="neir">
							{{e.neir}}
						</view>
						<view class="nt">{{timeDetia(e.time)}}</view>
					</view>
				</view>
				<!-- 服务器 -->
				<view class="left msg" v-if="e.fid==0">

					<!-- 显示表1 -->
					<view v-if="e.type==1">
						<image :src="'../../static/images/'+e.img+'.png'"></image>
						<view class="nr">
							<view>
								<uni-table border>
									<!-- 表头 -->
									<uni-tr>
										<uni-th align="center">NAME</uni-th>
										<uni-th align="center">FUNCTION</uni-th>
									</uni-tr>
									<!-- 数据 -->
									<uni-tr v-for="(line,index) in e.table1.row_datas">
										<uni-td>{{line['e_1.name']}}</uni-td>
										<uni-td>{{line['e_1.function']}}</uni-td>
									</uni-tr>
								</uni-table>
							</view>
							<view class="nt">{{timeDetia(e.time)}}</view>
						</view>

					</view>

					<!-- 显示图谱 -->
					<!-- <view v-if="e.type==2">
						<image :src="'../../static/images/'+e.img+'.png'"></image>
						<view class="nr">
							<view>
								<view id="echarts" class="echarts">
									{{echarts.initkg(e.kgid)}}
								</view>
							</view>
							<view class="nt">{{timeDetia(e.time)}}</view>
						</view>
					</view> -->
					
					<!-- 显示表3 -->
					<view v-if="e.type==3">
						<image :src="'../../static/images/'+e.img+'.png'"></image>
						<view class="nr">
							<!-- <view class="neir"> -->
							<view>
								<uni-table border>
									<uni-tr>
										<uni-th align="center">问题</uni-th>
										<uni-th align="center">详细描述</uni-th>
										<uni-th align="center">回答</uni-th>
									</uni-tr>
									<uni-tr v-for="(line,index) in e.table3.row_datas">
										<uni-td>{{line['e_1.question']}}</uni-td>
										<uni-td>{{line['e_1.question_ms']}}</uni-td>
										<uni-td>{{line['e_1.answer']}}</uni-td>
									</uni-tr>
								</uni-table>
							</view>
							<view class="nt">{{timeDetia(e.time)}}</view>
						</view>
					</view>
				</view>

				<!-- 欢迎用户 -->
				<view class="center" v-if="e.id==3">
					<view class="inner">{{e.name}}</view>
				</view>

			</view>
		</view>

		<view class="send">
			<textarea type="text" confirm-type="send" class="chat-send" v-model="chatm" auto-height="true"
				show-confirm-bar="false" maxlength="-1" />
			<image src="../../static/send.png" mode="aspectFit" @tap="sendMsg"></image><!-- @tap 点击时触发 -->
		</view>

	</view>
</template>


<script>
	export default {
		data() {
			return {
				chatm: '', //消息内容
				name: '', //用户名称
				uname: '',
				fid: '',
				uid: 'a',
				img: '', //用户头像
				chat: [], //聊天内容
				member: 0, //成员个数
				animationData: {},
				bb: false,
				bg: 'none',
				users: '',
				kgid:-1,// 知识图谱框 id
				option: { // 知识图谱数据（某个例子)
					title: {
						text: '商户营业状态'
					},

					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						orient: 'vertical',
						x: 'right',
						y: 'bottom',
						data: ['营业中', '未营业']
					},
					calculable: true,
					series: [{
						name: '访问来源',
						type: 'pie',
						radius: ['30%', '40%'],
						itemStyle: {
							normal: {
								label: {
									show: false
								},
								labelLine: {
									show: false
								}
							},
							emphasis: {
								label: {
									show: true,
									position: 'center',
									textStyle: {
										fontSize: '20',
										fontWeight: 'bold'
									}
								}
							}
						},
						data: [{
								value: 635,
								name: '营业中'
							},
							{
								value: 310,
								name: '未营业'
							},
						]
					}]
				},
				// option: {
				// 	title: {
				// 		text: ''
				// 	},
				// 	tooltip: {},
				// 	animationDurationUpdate: 1500,
				// 	animationEasingUpdate: 'quinticInOut',
				// 	label: {
				// 		normal: {
				// 			show: true,
				// 			textStyle: {
				// 				fontSize: 12
				// 			},
				// 		}
				// 	},
				// 	legend: {
				// 		x: "center",
				// 		show: false
				// 	},
				// 	series: [

				// 		{
				// 			type: 'graph',
				// 			layout: 'force',
				// 			symbolSize: 45,
				// 			focusNodeAdjacency: true,
				// 			roam: true,
				// 			edgeSymbol: ['none', 'arrow'],
				// 			categories: [{
				// 				name: '查询实体',
				// 				itemStyle: {
				// 					normal: {
				// 						color: "#009800",
				// 					}
				// 				}
				// 			}, {
				// 				name: 'HudongItem',
				// 				itemStyle: {
				// 					normal: {
				// 						color: "#4592FF",
				// 					}
				// 				}
				// 			}, {
				// 				name: 'NewNode',
				// 				itemStyle: {
				// 					normal: {
				// 						color: "#C71585",
				// 					}
				// 				}
				// 			}],
				// 			label: {
				// 				normal: {
				// 					show: true,
				// 					textStyle: {
				// 						fontSize: 12,
				// 					},
				// 				}
				// 			},
				// 			force: {
				// 				repulsion: 1000
				// 			},
				// 			edgeSymbolSize: [4, 50],
				// 			edgeLabel: {
				// 				normal: {
				// 					show: true,
				// 					textStyle: {
				// 						fontSize: 10
				// 					},
				// 					formatter: "{c}"
				// 				}
				// 			},
				// 			data: result_json_list[i].data,
				// 			links: result_json_list[i].links,
				// 			lineStyle: {
				// 				normal: {
				// 					opacity: 0.9,
				// 					width: 1.3,
				// 					curveness: 0,
				// 					color: "#262626",
				// 				}
				// 			}
				// 		}
				// 	]
				// }
			}
		},
		onLoad: function(e) {
			this.name = e.name;
			this.img = e.img;
			this.join(this.name, this.img);
		},
		methods: {
			timeDetia: function(date) {
				var time;
				var d = new Date(date);
				var n = new Date();
				//获取时间戳
				var dd = d.getTime();
				var h = d.getHours();
				var m = d.getMinutes();
				var Y = d.getFullYear();
				var M = d.getMonth() + 1;
				var D = d.getDate();
				//现在时间
				var nn = n.getTime();
				var hh = n.getHours();
				var mm = n.getMinutes();
				var YY = n.getFullYear();
				var MM = n.getMonth() + 1;
				var DD = n.getDate();

				if (D == DD && M == MM && Y == YY) {
					if (h < 10) {
						h = '0' + h;
					}
					if (m < 10) {
						m = '0' + m;
					}
					time = h + ':' + m;
					return time;
				} else if (D + 1 == DD && M == MM && Y == YY) {
					if (h < 10) {
						h = '0' + h;
					}
					if (m < 10) {
						m = '0' + m;
					}
					time = '昨天' + ' ' + h + ':' + m;
					return time;
				} else {
					if (M < 10) {
						M = '0' + M;
					}
					if (D < 10) {
						D = '0' + D;
					}
					if (h < 10) {
						h = '0' + h;
					}
					if (m < 10) {
						m = '0' + m;
					}
					time = Y + '年' + M + '月' + D + '日' + ' ' + h + ':' + m;
					return time;
				}
			},
			//发送消息
			sendMsg: function() {
				if (this.chatm.length > 0) {
					let onemsg = {
						neir: this.chatm,
						img: this.img, // 客户端头像
						time: new Date(),
						fid: 1, // 客户端
					}
					this.chat.push(onemsg);
					this.chatm = ''; //清空
					// 给服务器发消息
					this.$axios({
							method: "get", //指定请求方式
							url: "http://222.29.68.23:30108/medical/ask/answerQuestion.do",
							params: {
								query: onemsg.neir // 问题作为参数
							}
						})
						.then(res => {
							console.log('服务器有回复')
							let msgres = '服务器消息'
							// 提取服务器回复
							let result_json_list = this.$jquery.parseJSON(res.data.data.integrationResults)
							// 回复中的第一个table
							let table1 = result_json_list[0]
							let data1 = {
								// neir:msgres,
								type: 1, // table1
								table1: table1,
								time: new Date(),
								// img: this.img, // 服务器头像
								img: 'pku', // 服务器头像
								fid: 0, // 服务器
							}
							this.chat.push(data1);
							// 回复中的第2个知识图谱
							this.kgid = this.kgid+1 // 第几个图谱了
							console.log('上',this.kgid)
							let data2 = {
								type: 2, // 图谱
								kgid:this.kgid,
								time: new Date(),
								// img: this.img, // 服务器头像
								img: 'pku', // 服务器头像
								fid: 0, // 服务器
							}
							this.chat.push(data2);
							// 回复中的第3个表 table3
							let table3 = result_json_list[2]
							console.log(table3)
							let data3 = {
								// neir:msgres,
								type: 3, // table3
								table3: table3,
								time: new Date(),
								// img: this.img, // 服务器头像
								img: 'pku', // 服务器头像
								fid: 0, // 服务器
							}
							// 显示服务器传来的消息
							this.chat.push(data3);
						})
				}
			},
			// 欢迎用户
			join: function(name, img) {
				let wel = {
					name: '欢迎 ' + name,
					id: 3, // 3则显示到中间
				}
				this.chat.push(wel);
			}
		}
	}
</script>

<script module="echarts" lang="renderjs">
	export default {
		// mounted() {
		// 	if (typeof window.echarts === 'function') {
		// 		this.initEcharts()
		// 	} else {
		// 		// 动态引入较大类库避免影响页面展示
		// 		const script = document.createElement('script')
		// 		// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
		// 		script.src = 'static/echarts.js'
		// 		script.onload = this.initEcharts.bind(this)
		// 		document.head.appendChild(script)
		// 	}
		// },
		methods: {
			// initkg(newValue, oldValue, ownerInstance, instance) {// 默认传来的参数
			initkg(kgid) {// 默认传来的参数
				console.log(kgid)
				if (typeof window.echarts === 'function') {
					// this.initEcharts(kgid)
					this.initEcharts(111111111111111)
				} else {
					// 动态引入较大类库避免影响页面展示
					const script = document.createElement('script')
					// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
					script.src = 'static/echarts.js'
					script.onload = this.initEcharts.bind(this)
					document.head.appendChild(script)
				}
			},
			initEcharts() {
				// let eleid = 'echarts' + kgid
				let eleid = 'echarts'
				// console.log(kgid)
				// console.log(eleid)
				let myChart = echarts.init(document.getElementById(eleid))
				// 观测更新的数据在 view 层可以直接访问到
				myChart.setOption(this.option)
			}
		}
	}
</script>

<style lang="scss">
	.status-bar {
		text-align: center;
		position: fixed;
		left: 0;
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		overflow: hidden;
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		z-index: 998;
		color: #272832;
		-webkit-transition-property: all;
		transition-property: all;
		background: rgba(255, 255, 255, 0.96);

		.login-c {
			width: 60rpx;
			height: 60rpx;
			padding-top: 22rpx;
			padding-left: 32rpx;
		}

		.login-back {
			width: 20rpx;
			height: 34rpx;
		}

		.scrollv {
			width: 84%;

			.users {
				//background: #eee;
				display: flex;

				.user-l {
					padding: 12rpx 8rpx;
					position: relative;

					image {
						width: 64rpx;
						height: 64rpx;
						border-radius: 50%;
					}

					.tip {
						width: 14rpx;
						height: 14rpx;
						background: rgba(255, 77, 60, 1);
						position: absolute;
						top: 12rpx;
						right: 10rpx;
						border-radius: 50%;
						z-index: 10;
					}
				}

			}
		}
	}

	.main {
		padding: 160rpx 28rpx 160rpx;
	}

	.main,
	.modfiy-mian {

		.msg {
			display: flex;

			align-items: flex-end;
			padding: 40rpx 0;

			image {
				flex: none;
				width: 64rpx;
				height: 64rpx;
				border-radius: 18rpx;
				margin: 0 20rpx;

			}

			.nr {
				.neir {
					max-width: 380rpx;
					padding: 26rpx 32rpx;
					min-height: 48rpx;
					font-size: 28rpx;
					color: rgba(25, 29, 35, 1);
					line-height: 40rpx;
				}

				.nt {
					padding-top: 8rpx;
					position: absolute;
					font-size: 24rpx;
					color: rgba(25, 29, 35, 0.5);
					line-height: 34rpx;
				}
			}
		}

		.left {
			flex-direction: row;

			.neir {
				background: rgba(244, 244, 244, 1);
				border-radius: 24rpx 24rpx 24rpx 0px;
			}
		}

		.right {
			flex-direction: row-reverse;

			.neir {
				background: rgba(255, 234, 222, 1);
				border-radius: 24rpx 24rpx 0px 24rpx;
			}

			.nt {
				right: 132rpx;
			}
		}

		.center {
			text-align: center;
			padding: 32rpx 0 20rpx;

			.inner {
				font-size: 24rpx;
				display: inline-block;
				color: rgba(25, 29, 35, 0.5);
				line-height: 34rpx;
			}
		}
	}

	.send {
		position: fixed;
		z-index: 1002;
		bottom: 0;
		width: 100%;

		padding-bottom: var(--status-bar-height);
		min-height: 100rpx;
		background: rgba(255, 255, 255, 0.96);
		display: flex;

		.chat-send {
			margin: 12rpx 48rpx;

			flex: 1;
			width: 100%;
			min-height: 40rpx;
			background: rgba(242, 242, 242, 1);
			border-radius: 24rpx;
			font-size: 28rpx;
			color: rgba(25, 29, 35, 1);
			line-height: 40rpx;
			padding: 24rpx 80rpx 24rpx 24rpx;
		}

		image {
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			right: 68rpx;
			top: 32rpx;
		}
	}

	.modify {
		position: fixed;
		overflow: hidden;
		left: 0;
		bottom: -90%;
		width: 100%;
		height: 90%;
		z-index: 1000;
		background: #fff;
		border-radius: 48rpx 48rpx 0px 0px;
	}

	.u-name {
		position: absolute;
		top: 0;
		background-color: #fff;
		height: 80rpx;
		text-align: center;
		width: 100%;
		line-height: 80rpx;
	}

	.modfiy-mian {
		padding: 88rpx 28rpx 120rpx;
		box-sizing: border-box;
		height: 100%;
	}

	.bg {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.echarts {
		margin-top: 100px;
		width: 100%;
		height: 300px;
	}
</style>
