import { getAuthority } from '@/utils/authority';
import { message } from 'antd';
const userInfo = getAuthority();//获取用户相关信息
import { queryInterdayTH } from './service';
import moment from 'moment';

class DataFeed {
    constructor() {
    }

    //服务端配置
    onReady(cb) {
        cb({
            // exchanges: [],
            // symbols_types: [],
            exchanges: [
                { value: "", name: "All Exchanges", desc: "" },
                { value: "XETRA", name: "XETRA", desc: "XETRA" },
                { value: "NSE", name: "NSE", desc: "NSE" }
            ],
            symbols_types: [
                { name: "All types", value: "" },
                { name: "Stock", value: "stock" },
                { name: "Index", value: "index" }
            ],
            // supported_resolutions: [1, 5, 15, 30, 60, 240, 360, 480, 720, 1440, 10080, 44640],
            supported_resolutions: ["D", "2D", "3D", "W", "3W", "M", "6M"],
            supports_time: true,
            supports_marks: false,
            supports_timescale_marks: false,
            supports_search: true,
            supports_group_request: false,
            supports_marks: true,
            supports_timescale_marks: true,

        })

    }





    // 解析数据
    resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
        var data = {
            name: symbolName,
            ticker: symbolName,
            has_intraday: true, // 分钟数据
            has_daily: true, // 日k线数据
            has_weekly_and_monthly: true, // 月，周数据
            has_empty_bars: true,
            supported_resolutions: ["D", "2D", "3D", "W", "3W", "M", "6M"],
            intraday_multipliers: ['1', '5', '15', '30', '60', '240', '360', '480', '720', '1440', '10080', '44640'],
            minmov: 1,
            minmov2: 0,
            pointvalue: 1,
            pricescale: 1000000,
            // description: symbolName,
            // type: 'stock',
            // exchange: symbolName,
            // listed_exchange: symbolName,
            // volume_precision: 1,
            data_status: 'streaming',
            session: '24x7',
            timezone: 'Asia/Shanghai',
        };

        if (!this.onSymbolResolvedCallback) {
            this.onSymbolResolvedCallback = onSymbolResolvedCallback;
        }

        setTimeout(function () {
            onSymbolResolvedCallback(data);
        }, 10);
    }

    // 渲染首次视图的数据
    getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
        this.symbolInfo = symbolInfo;
        let { from, to, firstDataRequest, countBack } = periodParams;
        this.firstDataRequest = firstDataRequest;
        this.onHistoryCallback = onHistoryCallback;
        this.resolution = resolution;
        // 封装函数渲染视图
        this.history(from * 1000, to * 1000, onHistoryCallback, onErrorCallback);
    }

    // 封装渲染视图的函数
    async history(from, to, cb, ecb) {
        if (to && to < 1262275200000) {
            this.bar = [];
            cb([], {
                noData: true,
                nextTime: new Date().getTime()
            });
            return;
        }
        let bar = [];
        const step = this.resolution * 60

        if (this.firstDataRequest) {
            //查询同花顺接口数据
            let params = {
                ric: this.symbolInfo.name,
                period: 'D',
                startTime: from ? moment(from).format('YYYY-MM-DD') : '',
                endTime: to ? moment(to).format('YYYY-MM-DD') : '',
                accessToken: userInfo.accessToken
            }

            try {
                // 请求k线数据
                queryInterdayTH(params).then(res => {
                    if (res.state) {
                        const { data } = res;
                        const len = data ? data[params.ric] ? data[params.ric].length : 0 : 0;
                        if (len > 0) {
                            data[params.ric].map((item) => {
                                let barValue = {};
                                // 时间戳
                                barValue.time = item.time ? Number(new Date(item.time).getTime()) : new Date().getTime();
                                // 开
                                barValue.open = Number(item.open);
                                // 高
                                barValue.high = Number(item.high);
                                // 低
                                barValue.low = Number(item.low);
                                // 收
                                barValue.close = Number(item.close);
                                // 量
                                barValue.volume = Number(item.volume);
                                bar.push(barValue);
                            })
                            cb(bar, {
                                noData: false
                            });
                        } else {
                            cb([], {
                                noData: true, nextTime: new Date().getTime()
                            });
                        }
                    } else {
                        message.error(res.message)
                        cb([], {
                            noData: true, nextTime: new Date().getTime()
                        });
                    }
                })
            } catch (err) {
                ecb(err)
                console.log(err)
            }
        }
        this.bar = bar;
    }


    // 新数据更新    
    subscribeBars(symbolInfo, resolution, onRealtimeCallback, listenerGuid, onResetCacheNeededCallback) {
        this.onResetCacheNeededCallback = onResetCacheNeededCallback
        if (this._subscribers?.hasOwnProperty(listenerGuid)) {
            return;
        }
        this._subscribers[listenerGuid] = {
            lastBarTime: null,
            listener: onRealtimeCallback,
            resolution: resolution,
            symbolInfo: symbolInfo
        };
    }

    // 更新
    update(listenerGuid, lastBar) {
        // 已取消监听取消追加
        if (!this._subscribers.hasOwnProperty(listenerGuid)) {
            return;
        }
        let subscriptionRecord = this._subscribers[listenerGuid];
        if (
            subscriptionRecord.lastBarTime !== null &&
            lastBar.time < subscriptionRecord.lastBarTime
        ) {
            return;
        }
        const isNewBar =
            subscriptionRecord.lastBarTime !== null &&
            lastBar.time > subscriptionRecord.lastBarTime;
        if (isNewBar) {
            subscriptionRecord.lastBarTime = lastBar.time;
        }
        subscriptionRecord.listener(lastBar);
    }

    // 循环读取实时数据
    async readTicker() {
        // ws 将数据存放在 windown.g_k_ticker 中
        if (window.g_k_ticker && window.g_k_ticker.length) {
            for (let listenerGuid in this._subscribers) {
                let item = window.g_k_ticker;
                if (item) {
                    let d = {
                        time: item.time ? Number(new Date(item.time).getTime()) : new Date().getTime(),
                        open: Number(item.open),
                        high: Number(item.high),
                        low: Number(item.low),
                        close: Number(item.close),
                        volume: Number(item.volume)
                    };
                    // 更新 tradingView 视图
                    this.update(listenerGuid, d);
                }
            }
        }
        // 更新完成后清空上次的数据
        window.g_k_ticker = [];
        // 轮询延时
        await new Promise(resolve => {
            setTimeout(resolve, 300);
        });
        // 轮询
        this.readTicker();
    }
}

export default DataFeed;
