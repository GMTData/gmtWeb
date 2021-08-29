import { getAuthority } from '@/utils/authority';
const userInfo = getAuthority();//获取用户相关信息
import { queryInterdayTH } from './service';

class DataFeed {
    constructor() {
        //查询同花顺接口数据
        this.state = {
            params: {
                // ric: '002594.SZ',
                ric: 'AAPL.O',
                startTime: '2020-01-01',
                endTime: '2020-02-01',
                period: 'D',
                accessToken: userInfo.accessToken
            }
        }
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
    getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        console.log(firstDataRequest)
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

        if (!this.firstDataRequest) {
            try {
                // 请求k线数据
                queryInterdayTH(this.state.params).then(res => {
                    if (res.status === 200) {
                        const { data } = res;
                        const len = data.length;
                        // if (len > 0) {
                        //     data.map(item => {
                        //         let barValue = {};
                        //         // 时间戳
                        //         barValue.time = Number(item[0]);
                        //         // 开
                        //         barValue.open = Number(item[1]);
                        //         // 高
                        //         barValue.high = Number(item[2]);
                        //         // 低
                        //         barValue.low = Number(item[3]);
                        //         // 收
                        //         barValue.close = Number(item[4]);
                        //         // 量
                        //         barValue.volume = Number(item[5]);
                        //         bar.push(barValue);
                        //     })
                        //     cb(bar, {
                        //         noData: false
                        //     });
                        // } else {
                        //     cb([], {
                        //         noData: true
                        //     });
                        // }
                    } else {
                        cb([], {
                            noData: true
                        });
                    }
                })
            } catch (err) { }
        }
        this.bar = bar;
    }


    // 新数据更新    
    subscribeBars(symbolInfo, resolution, onRealtimeCallback, listenerGuid, onResetCacheNeededCallback) {
        this.onResetCacheNeededCallback = onResetCacheNeededCallback
        if (this._subscribers.hasOwnProperty(listenerGuid)) {
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
                    // let d = {
                    //     time: parseInt(item[0]),
                    //     open: Number(item[1]),
                    //     high: Number(item[2]),
                    //     low: Number(item[3]),
                    //     close: Number(item[4]),
                    //     volume: Number(item[5])
                    // };
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
