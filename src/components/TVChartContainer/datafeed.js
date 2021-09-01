import { getAuthority } from '@/utils/authority';
import { message } from 'antd';
const userInfo = getAuthority();//获取用户相关信息
import { queryInterdayTH } from './service';

class DataFeed {
    constructor() {
    }

    // 服务端配置
    onReady(cb) {
        cb({
            exchanges: [],
            symbols_types: [],
            supports_time: true,
            supported_resolutions: [1, 5, 15, 30, 60, 240, 360, 480, 720, 1440, 10080, 44640],
            supports_marks: false,
            supports_timescale_marks: false
        })
    }

    // 解析数据
    resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
        var data = {
            name: symbolName,
            has_intraday: true, // 分钟数据
            has_daily: true, // 日k线数据
            has_weekly_and_monthly: true, // 月，周数据
        };

        if (!this.onSymbolResolvedCallback) {
            this.onSymbolResolvedCallback = onSymbolResolvedCallback;
        }

        setTimeout(function () {
            onSymbolResolvedCallback(data);
        }, 0);
    }

    // 渲染首次视图的数据
    getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
        this.symbolInfo = symbolInfo;
        let { from, to, firstDataRequest } = periodParams;
        this.firstDataRequest = firstDataRequest;
        this.onHistoryCallback = onHistoryCallback;
        this.resolution = resolution;
        // 封装函数渲染视图
        this.history(from * 1000, to * 1000, onHistoryCallback);
    }

    // 封装渲染视图的函数
    async history(from, to, cb) {
        if (to && to < 1262275200000) {
            this.bar = [];
            cb([], {
                noData: true
            });
            return;
        }
        let bar = [];
        const step = this.resolution * 60

        if (this.firstDataRequest) {
            //查询同花顺接口数据
            let params = {
                ric: this.symbolInfo.name,
                period: this.resolution,
                startTime: '2020-01-01',
                endTime: '2020-02-01',
                accessToken: userInfo.accessToken
            }

            try {
                // 请求k线数据
                queryInterdayTH(params).then(res => {
                    if (res.state) {
                        const { data } = res;
                        const len = data ? data[params.ric] ? data[params.ric].length : 0 : 0;
                        if (len > 0) {
                            data[params.ric].map(item => {
                                let barValue = {};
                                // 时间戳
                                barValue.time = Number(item.time);
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
                if (item[0]) {
                    let d = {
                        time: parseInt(item.time),
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
