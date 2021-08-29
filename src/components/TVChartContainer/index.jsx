import * as React from 'react';
import './index.css';
import { widget } from '../../static/charting_library';
import DataFeed from './datafeed';
import { getAuthority } from '@/utils/authority';
import { queryStockAuthorize } from './service';
import { message } from 'antd';

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
		let params = {
			ric: 'AAPL.O',
			accessToken: userInfo.accessToken
		}
		this.state = {
			dataFlag: true
		}

		//查看数据是否有权限
		queryStockAuthorize(params).then(
			res => {
				if (res.state) {
					this.setState({ dataFlag: res.data })
				} else {
					message.error(res.message)
				}
			}
		)
	}


	static defaultProps = {
		symbol: 'AAPL',
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


	componentDidMount() {
		// 创建datafeed实例，此时实例为自己编写的类，需要按照官网的规则编写
		datafeed = new DataFeed();


		let widgetOptions = {

		};
		//判断是否有权限
		if (this.state.dataFlag) {
			widgetOptions = {
				theme: 'Dark',
				symbol: this.props.symbol,
				// BEWARE: no trailing slash is expected in feed URL
				datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
				interval: this.props.interval,
				container_id: this.props.containerId,
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
				symbol: this.props.symbol,
				// BEWARE: no trailing slash is expected in feed URL
				datafeed,
				interval: this.props.interval,
				container_id: this.props.containerId,
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
		});
	}

	componentWillUnmount() {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	render() {
		return (
			<div
				id={this.props.containerId}
				className={'TVChartContainer'}
			/>
		);
	}
}
