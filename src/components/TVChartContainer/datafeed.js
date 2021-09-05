import { getAuthority } from '@/utils/authority';
import { message } from 'antd';
const userInfo = getAuthority();//获取用户相关信息
import { queryInterdayTH } from './service';
import moment from 'moment';

var detafeed_historyTime = 0

var detafeed_lastResolution = null

var detafeed_lastSymbol = null

var t_init = null

var timeFrom = null;
var timeTo = new Date().getTime()


export default class DataFeed {
    constructor() {
    }
    onReady = function (callback) {

        callback(this._configuration)

    }

    getSendSymbolName = function (symbolName) {

        var name = symbolName.split('/')

        return (name[0] + name[1]).toLocaleUpperCase()

    }

    resolveSymbol = function (symbolName, onResolve, onError) {

        onResolve({

            'name': symbolName,

            // 'timezone': 'Asia/Shanghai',

            'pricescale': 100,

            'minmov': 1,

            'minmov2': 0,

            'ticker': symbolName,

            'description': '',

            'session': '24x7',

            'type': 'bitcoin',

            'volume_precision': 10,

            'has_intraday': true,

            'intraday_multipliers': ['3', '5', '15', '60', '240', '1D'],

            'has_weekly_and_monthly': false,

            'has_no_volume': false,

            'regular_session': '24x7'

        })

    }

    getApiTime = function (resolution) {

        switch (resolution) {

            case '3':

                return '3m'

            case '5':

                return '5m'

            case '15':

                return '15m'

            case '60':

                return '1h'

            case '240':

                return '4h'

            case '1D':

                return '1d'

            default:

                return '15m'

        }

    }

    getBars = function (symbolInfo, resolution, periodParams, onResult, onError) {

        if (!detafeed_historyTime || (resolution !== detafeed_lastResolution) || detafeed_lastSymbol !== symbolInfo.name) {

            // 储存请求过的产品

            detafeed_lastSymbol = symbolInfo.name

            // 记录目前时间搓，就用目前的目前时间搓往前请求历史数据

            detafeed_historyTime = Date.now()

        }

        let { from, to, firstDataRequest, countBack } = periodParams;
        timeFrom = from * 1000;
        timeTo = to * 1000;
        clearInterval(t_init)

        const e_time = Number((Date.now() + '').substr(0, 9) + '0000')

        //查询同花顺接口数据
        let params = {
            ric: detafeed_lastSymbol,
            period: 'D',
            startTime: from ? moment(from * 1000).format('YYYY-MM-DD') : '',
            endTime: to ? moment(to * 1000).format('YYYY-MM-DD') : '',
            accessToken: userInfo.accessToken
        }

        // 请求k线数据
        queryInterdayTH(params).then(res => {
            if (res.state) {
                const { data } = res;
                const len = data ? data[params.ric] ? data[params.ric].length : 0 : 0;
                if (len > 0) {

                    // 记录这次请求的时间周期

                    const k_list = data[params.ric]

                    detafeed_lastResolution = resolution

                    var meta = { noData: false }

                    var bars = []

                    if (k_list.length) {


                        localStorage.setItem('k_open', Number(k_list[k_list.length - 1].open).toFixed(2))

                        localStorage.setItem('k_high', Number(k_list[k_list.length - 1].high).toFixed(2))

                        localStorage.setItem('k_low', Number(k_list[k_list.length - 1].low).toFixed(2))

                        localStorage.setItem('k_close', Number(k_list[k_list.length - 1].close).toFixed(2))

                        localStorage.setItem('k_volume', Number(k_list[k_list.length - 1].volume).toFixed(2))

                        detafeed_historyTime = e_time

                        for (var i = 0; i < k_list.length; i += 1) {

                            bars.push({

                                time: k_list[i].time ? Number(new Date(k_list[i].time).getTime()) : new Date().getTime(),

                                close: k_list[i].close,

                                open: k_list[i].open,

                                high: k_list[i].high,

                                low: k_list[i].low,

                                volume: k_list[i].volume

                            })

                        }

                    } else {

                        meta = { noData: true }

                    }
                    onResult(bars, meta)

                }

            } else {

                console.log(message)

            }

        })

    }
    subscribeBars = function (symbolInfo, resolution, onTick, listenerGuid, onResetCacheNeededCallback) {

        const self = this

        t_init = setInterval(function () {

            const e_time = Number((Date.now() + '').substr(0, 9) + '0000')

            //查询同花顺接口数据
            let params = {
                ric: self.getSendSymbolName(symbolInfo.name),
                period: 'D',
                startTime: timeFrom,
                endTime: timeTo,
                accessToken: userInfo.accessToken
            }

            queryInterdayTH(params).then(res => {
                if (res.state) {
                    const { data } = res;
                    const len = data ? data[params.ric] ? data[params.ric].length : 0 : 0;
                    if (len > 0) {

                        // 记录这次请求的时间周期

                        const k_list = data[params.ric]

                        detafeed_lastResolution = resolution

                        var meta = { noData: false }

                        var bars = []

                        if (k_list.length) {
                            localStorage.setItem('k_open', Number(k_list[k_list.length - 1].open).toFixed(2))

                            localStorage.setItem('k_high', Number(k_list[k_list.length - 1].high).toFixed(2))

                            localStorage.setItem('k_low', Number(k_list[k_list.length - 1].low).toFixed(2))

                            localStorage.setItem('k_close', Number(k_list[k_list.length - 1].close).toFixed(2))

                            localStorage.setItem('k_volume', Number(k_list[k_list.length - 1].volume).toFixed(2))

                            detafeed_historyTime = e_time

                            for (var i = 0; i < k_list.length; i += 1) {

                                bars.push({

                                    time: k_list[i].time ? Number(new Date(k_list[i].time).getTime()) : new Date().getTime(),

                                    close: k_list[i].close,

                                    open: k_list[i].open,

                                    high: k_list[i].high,

                                    low: k_list[i].low,

                                    volume: k_list[i].volume
                                })
                            }

                        } else {

                            meta = { noData: true }

                        }
                        onResult(bars, meta)

                    }
                

                } else {

                    console.log(res.message)

                }

            })

        }, 6000)

    }

    unsubscribeBars = function (listenerGuid) {

        // 取消订阅产品的callback

    }

}