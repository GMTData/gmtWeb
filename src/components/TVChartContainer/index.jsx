import * as React from 'react';
import './index.css';
import { widget } from '../../static/charting_library';
import DataFeed from './datafeed';
import { getAuthority } from '@/utils/authority';
import { queryStockAuthorize, queryRicLists } from './service';
import { message, AutoComplete } from 'antd';

const { Option } = AutoComplete;

const userInfo = getAuthority();//获取用户相关信息
// 定义变量读取参数
let datafeed;
function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export class TVChartContainer extends React.PureComponent {

	constructor(props) {
		super(props);
		//查询是否有权限
		this.state = {
			dataFlag: false,
			params: {
				// ric: 'AAPL',
				ric: '002594.SZ',
				accessToken: userInfo.accessToken
			},
			ricList: [],
			ricParams: {
				ric: '',
				pageSize: 10,
				page: 1,
				accessToken: userInfo.accessToken,
			},
		}
		this.checkAuthorize = this.checkAuthorize.bind(this)
		this.tradingviewLoad = this.tradingviewLoad.bind(this)
		this.checkAuthorize()


	}

	//查看数据是否有权限
	checkAuthorize(e) {
		if (e) {
			this.state.params.ric = e;
		}
		queryStockAuthorize(this.state.params).then(
			res => {
				if (res.state) {
					this.setState({ dataFlag: res.data })
					this.tradingviewLoad(e)
				} else {
					message.error(res.message)
				}
			}
		)
	}


	static defaultProps = {
		// symbol: 'AAPL',
		symbol: '002594.SZ',
		interval: 'D',
		containerId: 'tv_chart_container',
		datafeedUrl: 'https://demo_feed.tradingview.com',
		// libraryPath: '/gmtweb/charting_library/',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
	};


	tvWidget = null;


	tradingviewLoad(ric) {
		// 创建datafeed实例，此时实例为自己编写的类，需要按照官网的规则编写
		datafeed = new DataFeed();

		let widgetOptions = {

		};
		//判断是否有权限
		if (this.state.dataFlag) {
			widgetOptions = {
				theme: 'Dark',
				symbol: ric ? ric : this.props.symbol,
				// BEWARE: no trailing slash is expected in feed URL
				datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
				interval: this.props.interval,
				container: this.props.containerId,
				library_path: this.props.libraryPath,
				locale: localStorage.umi_locale === "zh-CN" ? 'zh' : 'en',
				disabled_features: ['use_localstorage_for_settings'],
				enabled_features: ['study_templates'],
				charts_storage_url: this.props.chartsStorageUrl,
				charts_storage_api_version: this.props.chartsStorageApiVersion,
				client_id: this.props.clientId,
				user_id: this.props.userId,
				fullscreen: this.props.fullscreen,
				autosize: this.props.autosize,
				studies_overrides: this.props.studiesOverrides,
			}
		} else {
			widgetOptions = {
				theme: 'Dark',
				symbol: ric ? ric : this.props.symbol,
				// BEWARE: no trailing slash is expected in feed URL
				datafeed,
				interval: this.props.interval,
				container: this.props.containerId,
				library_path: this.props.libraryPath,
				locale: localStorage.umi_locale === "zh-CN" ? 'zh' : 'en',
				disabled_features: ['use_localstorage_for_settings'],
				enabled_features: ['study_templates'],
				charts_storage_url: this.props.chartsStorageUrl,
				charts_storage_api_version: this.props.chartsStorageApiVersion,
				client_id: this.props.clientId,
				user_id: this.props.userId,
				fullscreen: this.props.fullscreen,
				autosize: this.props.autosize,
				studies_overrides: this.props.studiesOverrides,
			}
		}

		const tvWidget = new widget(widgetOptions);
		this.tvWidget = tvWidget;

		tvWidget.onChartReady(() => {

			tvWidget.headerReady().then(() => {
				const button = tvWidget.createButton();
				button.setAttribute('title', 'Click to show a notification popup');
				button.classList.add('apply-common-tooltip');
				button.addEventListener('click', () => tvWidget.showNoticeDialog({
					title: 'Notification',
					body: 'TradingView Charting Library API works correctly',
					callback: () => {
						console.log('Noticed!');
					},
				}));

				button.innerHTML = 'Check API';
			});

			//图标因为权限问题未加载则去请求权限,有权限的继续回调,无权限则调用同花顺接口
			if (!tvWidget.activeChart().dataReady()) {
				this.checkAuthorize()
			}

		});

	}

	componentWillUnmount() {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}


	//模糊查询ric集合
	queryRicListData = (e) => {
		this.state.ricParams.ric = e;
		queryRicLists(this.state.ricParams).then(
			res => {
				if (res.state) {
					if (res?.data?.result && res.data.result.length > 0) {
						this.setState({
							ricList: res.data.result
						})
					}
				} else {
					message.error(res.message);
				}
			}
		);
	}

	render() {
		return (
			<div>
				<div>
					<AutoComplete
						onChange={(e) => this.queryRicListData(e)}
						name='code'
						style={{ margin: '20px', width: 320 }}
						onSelect={(e) => this.checkAuthorize(e)}
						placeholder='ric'
					>
						{this.state.ricList.length > 0 ? this.state.ricList.map((ric, index) => (
							<Option key={index} value={ric.ric}>
								{ric.ric}
							</Option>
						)) : ''}
					</AutoComplete>
				</div>
				<div
					id={this.props.containerId}
					className={'TVChartContainer'}
				/>
			</div>


		);
	}
}
