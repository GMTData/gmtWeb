//标题数据
export const menuList = [
    {
        id: 0,
        name: '概览',
        nameEn: 'Overview',
    },
    {
        id: 1,
        name: '公司资料&证券资料',
        nameEn: 'Company Information & Securities Information',
        subMenu: [
            {
                id: 101,
                name: '公司介绍',
                nameEn: 'Company introduction'
            },
            {
                id: 102,
                name: '董事会高管',
                nameEn: 'Board of directors'
            },
            {
                id: 103,
                name: '股票详情',
                nameEn: 'Stock details'
            }
        ]
    },
    {
        id: 2,
        name: '新闻公告&研究报告',
        nameEn: 'Press Announcements & Research Reports'
    },
    {
        id: 3,
        name: '股本股东',
        nameEn: 'Equity shareholders',
        subMenu: [
            {
                id: 301,
                name: '股东报告',
                nameEn: 'Shareholder report',
                type: 'Consolidated',
            },
            {
                id: 302,
                name: '基金持仓',
                nameEn: 'Fund positions',
                type: 'Fund'
            },
        ]
    },
    {
        id: 4,
        name: '盈利预测&研究报告',
        nameEn: 'Earnings Forecasts & Research Reports',
        subMenu: [
            {
                id: 401,
                name: '现金流量表预测',
                nameEn: 'Cash flow statement forecast',
            },
            {
                id: 402,
                name: '资产负债表预测',
                nameEn: 'Balance sheet forecast',
            },
            {
                id: 403,
                name: '损益表预测',
                nameEn: 'Profit and loss statement forecast',
            },
            {
                id: 404,
                name: '推荐&目标价',
                nameEn: 'Recommendation & Target Price',
            },
        ]
    },
    {
        id: 5,
        name: '交易&估值',
        nameEn: 'Trading & Valuation',
        subMenu: [
            {
                id: 501,
                name: '每日行情',
                nameEn: 'The daily market',
            },
            {
                id: 502,
                name: '估值分析',
                nameEn: 'Valuation analysis',
            },
        ]
    },
    {
        id: 6,
        name: '财务数据',
        nameEn: 'Financial data',
        subMenu: [
            {
                id: 601,
                name: '成长能力',
                nameEn: 'Growth ability',
            },
            {
                id: 602,
                name: '现金流量',
                nameEn: 'The cash flow',
            },
            {
                id: 603,
                name: '损益表',
                nameEn: 'The income statement',
            },
            {
                id: 604,
                name: '资产负债表',
                nameEn: 'Balance sheet',
            },
            {
                id: 605,
                name: '盈利能力与收益质量',
                nameEn: 'Profitability and earnings quality',
            },
            {
                id: 606,
                name: '营运能力',
                nameEn: 'Operation ability',
            },
            // {
            //     id: 607,
            //     name: '主营构成',
            // },
            {
                id: 608,
                name: '资本结构与偿债能力',
                nameEn: 'Capital structure and solvency',
            },
        ]
    },
    {
        id: 7,
        name: '重大事件',
        nameEn: 'Significant events',
        subMenu: [
            {
                id: 701,
                name: '重大事件',
                nameEn: 'Significant events',
            },
            {
                id: 702,
                name: '股利数据',
                nameEn: 'Dividend data',
            },
        ]
    },
    {
        id: 8,
        name: '同行比较',
        nameEn: 'Peer comparison',
        subMenu: [
            {
                id: 801,
                name: '财务比率比较',
                nameEn: 'Financial ratio comparison',
            },
            {
                id: 802,
                name: '财务数据比较',
                nameEn: 'Comparison of financial data',
            },
            {
                id: 803,
                name: '估值分析比较',
                nameEn: 'Valuation analysis and comparison',
            },
            {
                id: 804,
                name: '市场表现比较',
                nameEn: 'Market performance comparison',
            },
            // {
            //     id: 805,
            //     name: '盈利预测比较',
            // }
        ]
    },
]
//现金流量表
export const dataCas = [
    {
        nameCN: 'Net Income/Starting Line',
        nameEN: 'Net Income/Starting Line',
        type: 'ONET',
        typeExt: 'ONET'
    },
    {
        nameCN: 'Depreciation/Depletion',
        nameEN: 'Depreciation/Depletion',
        type: 'SDED',
        typeExt: 'SDED'
    },
    {
        nameCN: 'Amortization',
        nameEN: 'Amortization',
        type: 'SAMT',
        typeExt: 'SAMT'
    },
    {
        nameCN: 'Deferred Taxes',
        nameEN: 'Deferred Taxes',
        type: 'OBDT',
        typeExt: 'OBDT'
    },
    {
        nameCN: 'Non-Cash Items',
        nameEN: 'Non-Cash Items',
        type: 'SNCI',
        typeExt: 'SNCI'
    },
    {
        nameCN: 'Cash Receipts',
        nameEN: 'Cash Receipts',
        type: 'OCRC',
        typeExt: 'OCRC'
    },
    {
        nameCN: 'Cash Payments',
        nameEN: 'Cash Payments',
        type: 'OCPD',
        typeExt: 'OCPD'
    },
    {
        nameCN: 'Cash Taxes Paid',
        nameEN: 'Cash Taxes Paid',
        type: 'SCTP',
        typeExt: 'SCTP'
    },
    {
        nameCN: 'Cash Interest Paid',
        nameEN: 'Cash Interest Paid',
        type: 'SCIP',
        typeExt: 'SCIP'
    },
    {
        nameCN: 'Changes in Working Capital',
        nameEN: 'Changes in Working Capital',
        type: 'SOCF',
        typeExt: 'SOCF'
    },
    {
        nameCN: 'Cash from Operating Activities',
        nameEN: 'Cash from Operating Activities',
        type: 'OTLO',
        typeExt: 'OTLO'
    },
    {
        nameCN: 'Capital Expenditures',
        nameEN: 'Capital Expenditures',
        type: 'SCEX',
        typeExt: 'SCEX'
    },
    {
        nameCN: 'Other Investing Cash Flow Items, Total',
        nameEN: 'Other Investing Cash Flow Items, Total',
        type: 'SICF',
        typeExt: 'SICF'
    },
    {
        nameCN: 'Cash from Investing Activities',
        nameEN: 'Cash from Investing Activities',
        type: 'ITLI',
        typeExt: 'ITLI'
    },
    {
        nameCN: 'Financing Cash Flow Items',
        nameEN: 'Financing Cash Flow Items',
        type: 'SFCF',
        typeExt: 'SFCF'
    },
    {
        nameCN: 'Total Cash Dividends Paid',
        nameEN: 'Total Cash Dividends Paid',
        type: 'FCDP',
        typeExt: 'FCDP'
    },
    {
        nameCN: 'Issuance (Retirement) of Stock, Net',
        nameEN: 'Issuance (Retirement) of Stock, Net',
        type: 'FPSS',
        typeExt: 'FPSS'
    },
    {
        nameCN: 'Issuance (Retirement) of Debt, Net',
        nameEN: 'Issuance (Retirement) of Debt, Net',
        type: 'FPRD',
        typeExt: 'FPRD'
    },
    {
        nameCN: 'Cash from Financing Activities',
        nameEN: 'Cash from Financing Activities',
        type: 'FTLF',
        typeExt: 'FTLF'
    },
    {
        nameCN: 'Foreign Exchange Effects',
        nameEN: 'Foreign Exchange Effects',
        type: 'SFEE',
        typeExt: 'SFEE'
    },
    {
        nameCN: 'Net Change in Cash',
        nameEN: 'Net Change in Cash',
        type: 'SNCC',
        typeExt: 'SNCC'
    }

]

//损益表
export const dataIncome = [
    {
        nameCN: 'Revenue',
        nameEN: 'Revenue',
        type: 'SREV',
        typeExt: 'SREV'
    },
    {
        nameCN: 'Total Premiums Earned',
        nameEN: 'Total Premiums Earned',
        type: 'SPRE',
        typeExt: 'SPRE'
    },
    {
        nameCN: 'Net Investment Income',
        nameEN: 'Net Investment Income',
        type: 'RNII',
        typeExt: 'RNII'
    },
    {
        nameCN: 'Realized Gains (Losses)',
        nameEN: 'Realized Gains (Losses)',
        type: 'RRGL',
        typeExt: 'RRGL'
    },
    {
        nameCN: 'Interest Income, Bank',
        nameEN: 'Interest Income, Bank',
        type: 'SIIB',
        typeExt: 'SIIB'
    },
    {
        nameCN: 'Other Revenue, Total',
        nameEN: 'Other Revenue, Total',
        type: 'SORE',
        typeExt: 'SORE'
    },
    {
        nameCN: 'Total Revenue',
        nameEN: 'Total Revenue',
        type: 'RTLR',
        typeExt: 'RTLR'
    },
    {
        nameCN: 'Cost of Revenue, Total',
        nameEN: 'Cost of Revenue, Total',
        type: 'SCOR',
        typeExt: 'SCOR'
    },
    {
        nameCN: 'Gross Profit',
        nameEN: 'Gross Profit',
        type: 'SGRP',
        typeExt: 'SGRP'
    },
    {
        nameCN: 'Fuel Expense',
        nameEN: 'Fuel Expense',
        type: 'EFEX',
        typeExt: 'EFEX'
    },
    {
        nameCN: 'Operations & Maintenance',
        nameEN: 'Operations & Maintenance',
        type: 'EDOE',
        typeExt: 'EDOE'
    },
    {
        nameCN: 'Total Interest Expense',
        nameEN: 'Total Interest Expense',
        type: 'STIE',
        typeExt: 'STIE'
    },
    {
        nameCN: 'Net Interest Income',
        nameEN: 'Net Interest Income',
        type: 'ENII',
        typeExt: 'ENII'
    },
    {
        nameCN: 'Loan Loss Provision',
        nameEN: 'Loan Loss Provision',
        type: 'ELLP',
        typeExt: 'ELLP'
    },
    {
        nameCN: 'Net Interest Income after Loan Loss Provision',
        nameEN: 'Net Interest Income after Loan Loss Provision',
        type: 'SIAP',
        typeExt: 'SIAP'
    },
    {
        nameCN: 'Losses, Benefits, and Adjustments, Total',
        nameEN: 'Losses, Benefits, and Adjustments, Total',
        type: 'SLBA',
        typeExt: 'SLBA'
    },
    {
        nameCN: 'Amort. Of Policy Acquisition Costs',
        nameEN: 'Amort. Of Policy Acquisition Costs',
        type: 'EPAC',
        typeExt: 'EPAC'
    },
    {
        nameCN: 'Selling/General/Administrative Expenses, Total',
        nameEN: 'Selling/General/Administrative Expenses, Total',
        type: 'SSGA',
        typeExt: 'SSGA'
    },
    {
        nameCN: 'Research & Development',
        nameEN: 'Research & Development',
        type: 'ERAD',
        typeExt: 'ERAD'
    },
    {
        nameCN: 'Depreciation/Amortization',
        nameEN: 'Depreciation/Amortization',
        type: 'SDPR',
        typeExt: 'SDPR'
    },
    {
        nameCN: 'Interest Expense (Income), Net Operating',
        nameEN: 'Interest Expense (Income), Net Operating',
        type: 'SINN',
        typeExt: 'SINN'
    },
    {
        nameCN: 'Unusual Expense (Income)',
        nameEN: 'Unusual Expense (Income)',
        type: 'SUIE',
        typeExt: 'SUIE'
    },
    {
        nameCN: 'Other Operating Expenses, Total',
        nameEN: 'Other Operating Expenses, Total',
        type: 'SOOE',
        typeExt: 'SOOE'
    },
    {
        nameCN: 'Total Operating Expense',
        nameEN: 'Total Operating Expense',
        type: 'ETOE',
        typeExt: 'ETOE'
    },
    {
        nameCN: 'Operating Income',
        nameEN: 'Operating Income',
        type: 'SOPI',
        typeExt: 'SOPI'
    },
    {
        nameCN: 'Interest Income (Expense), Net Non-Operating',
        nameEN: 'Interest Income (Expense), Net Non-Operating',
        type: 'SNIN',
        typeExt: 'SNIN'
    },
    {
        nameCN: 'Gain (Loss) on Sale of Assets',
        nameEN: 'Gain (Loss) on Sale of Assets',
        type: 'NGLA',
        typeExt: 'NGLA'
    },
    {
        nameCN: 'Allowance for Funds Used During Const.',
        nameEN: 'Allowance for Funds Used During Const.',
        type: 'NAFC',
        typeExt: 'NAFC'
    },
    {
        nameCN: 'Non-Interest Income, Bank',
        nameEN: 'Non-Interest Income, Bank',
        type: 'SNII',
        typeExt: 'SNII'
    },
    {
        nameCN: 'Non-Interest Expense, Bank',
        nameEN: 'Non-Interest Expense, Bank',
        type: 'SNIE',
        typeExt: 'SNIE'
    },
    {
        nameCN: 'Other, Net',
        nameEN: 'Other, Net',
        type: 'SONT',
        typeExt: 'SONT'
    },
    {
        nameCN: 'Income Before Tax',
        nameEN: 'Income Before Tax',
        type: 'EIBT',
        typeExt: 'EIBT'
    },
    {
        nameCN: 'Income Tax - Total',
        nameEN: 'Income Tax - Total',
        type: 'TTAX',
        typeExt: 'TTAX'
    },
    {
        nameCN: 'Income After Tax',
        nameEN: 'Income After Tax',
        type: 'TIAT',
        typeExt: 'TIAT'
    },
    {
        nameCN: 'Minority Interest',
        nameEN: 'Minority Interest',
        type: 'CMIN',
        typeExt: 'CMIN'
    },
    {
        nameCN: 'Equity In Affiliates',
        nameEN: 'Equity In Affiliates',
        type: 'CEIA',
        typeExt: 'CEIA'
    },
    {
        nameCN: 'U.S. GAAP Adjustment',
        nameEN: 'U.S. GAAP Adjustment',
        type: 'CGAP',
        typeExt: 'CGAP'
    },
    {
        nameCN: 'Net Income Before Extra. Items',
        nameEN: 'Net Income Before Extra. Items',
        type: 'NIBX',
        typeExt: 'NIBX'
    },
    {
        nameCN: 'Total Extraordinary Items',
        nameEN: 'Total Extraordinary Items',
        type: 'STXI',
        typeExt: 'STXI'
    },
    {
        nameCN: 'Net Income',
        nameEN: 'Net Income',
        type: 'NINC',
        typeExt: 'NINC'
    },
    {
        nameCN: 'Total Adjustments to Net Income',
        nameEN: 'Total Adjustments to Net Income',
        type: 'SANI',
        typeExt: 'SANI'
    },
    {
        nameCN: 'Income Available to Common Excl. Extra. Items',
        nameEN: 'Income Available to Common Excl. Extra. Items',
        type: 'CIAC',
        typeExt: 'CIAC'
    },
    {
        nameCN: 'Income Available to Common Incl. Extra. Items',
        nameEN: 'Income Available to Common Incl. Extra. Items',
        type: 'XNIC',
        typeExt: 'XNIC'
    },
    {
        nameCN: 'Dilution Adjustment*',
        nameEN: 'Dilution Adjustment*',
        type: 'SDAJ',
        typeExt: 'SDAJ'
    },
    {
        nameCN: 'Diluted Net Income*',
        nameEN: 'Diluted Net Income*',
        type: 'SDNI',
        typeExt: 'SDNI'
    },
    {
        nameCN: 'Diluted Weighted Average Shares*',
        nameEN: 'Diluted Weighted Average Shares*',
        type: 'SDWS',
        typeExt: 'SDWS'
    },
    {
        nameCN: 'Diluted EPS Excluding Extrordinary Items*',
        nameEN: 'Diluted EPS Excluding Extrordinary Items*',
        type: 'SDBF',
        typeExt: 'SDBF'
    },
    {
        nameCN: 'Dividends per Share - Common Stock Primary Issue',
        nameEN: 'Dividends per Share - Common Stock Primary Issue',
        type: 'DDPS1',
        typeExt: 'DDPS1'
    },
    {
        nameCN: 'Diluted Normalized EPS',
        nameEN: 'Diluted Normalized EPS',
        type: 'VDES',
        typeExt: 'VDES'
    },
]
//资产负债
export const dataBalance = [
    {
        nameCN: 'Cash',
        nameEN: 'Cash',
        type: 'ACSH',
        typeExt: 'ACSH'
    },
    {
        nameCN: 'Cash & Equivalents',
        nameEN: 'Cash & Equivalents',
        type: 'ACAE',
        typeExt: 'ACAE'
    },
    {
        nameCN: 'Short Term Investments',
        nameEN: 'Short Term Investments',
        type: 'ASTI',
        typeExt: 'ASTI'
    },
    {
        nameCN: 'Cash and Short Term Investments',
        nameEN: 'Cash and Short Term Investments',
        type: 'SCSI',
        typeExt: 'SCSI'
    },
    {
        nameCN: 'Accounts Receivable - Trade, Net',
        nameEN: 'Accounts Receivable - Trade, Net',
        type: 'AACR',
        typeExt: 'AACR'
    },
    {
        nameCN: 'Total Receivables, Net',
        nameEN: 'Total Receivables, Net',
        type: 'ATRC',
        typeExt: 'ATRC'
    },
    {
        nameCN: 'Total Inventory',
        nameEN: 'Total Inventory',
        type: 'AITL',
        typeExt: 'AITL'
    },
    {
        nameCN: 'Prepaid Expenses',
        nameEN: 'Prepaid Expenses',
        type: 'APPY',
        typeExt: 'APPY'
    },
    {
        nameCN: 'Other Current Assets, Total',
        nameEN: 'Other Current Assets, Total',
        type: 'SOCA',
        typeExt: 'SOCA'
    },
    {
        nameCN: 'Total Current Assets',
        nameEN: 'Total Current Assets',
        type: 'ATCA',
        typeExt: 'ATCA'
    },
    {
        nameCN: 'Cash & Due from Banks',
        nameEN: 'Cash & Due from Banks',
        type: 'ACDB',
        typeExt: 'ACDB'
    },
    {
        nameCN: 'Other Earning Assets, Total',
        nameEN: 'Other Earning Assets, Total',
        type: 'SOEA',
        typeExt: 'SOEA'
    },
    {
        nameCN: 'Net Loans',
        nameEN: 'Net Loans',
        type: 'ANTL',
        typeExt: 'ANTL'
    },
    {
        nameCN: 'Property/Plant/Equipment, Total - Gross',
        nameEN: 'Property/Plant/Equipment, Total - Gross',
        type: 'APTC',
        typeExt: 'APTC'
    },
    {
        nameCN: 'Accumulated Depreciation, Total',
        nameEN: 'Accumulated Depreciation, Total',
        type: 'ADEP',
        typeExt: 'ADEP'
    },
    {
        nameCN: 'Property/Plant/Equipment, Total - Net',
        nameEN: 'Property/Plant/Equipment, Total - Net',
        type: 'APPN',
        typeExt: 'APPN'
    },
    {
        nameCN: 'Goodwill, Net',
        nameEN: 'Goodwill, Net',
        type: 'AGWI',
        typeExt: 'AGWI'
    },
    {
        nameCN: 'Intangibles, Net',
        nameEN: 'Intangibles, Net',
        type: 'AINT',
        typeExt: 'AINT'
    },
    {
        nameCN: 'Total Utility Plant, Net',
        nameEN: 'Total Utility Plant, Net',
        type: 'SUPN',
        typeExt: 'SUPN'
    },
    {
        nameCN: 'Long Term Investments',
        nameEN: 'Long Term Investments',
        type: 'SINV',
        typeExt: 'SINV'
    },
    {
        nameCN: 'Insurance Receivables',
        nameEN: 'Insurance Receivables',
        type: 'APRE',
        typeExt: 'APRE'
    },
    {
        nameCN: 'Note Receivable - Long Term',
        nameEN: 'Note Receivable - Long Term',
        type: 'ALTR',
        typeExt: 'ALTR'
    },
    {
        nameCN: 'Other Long Term Assets, Total',
        nameEN: 'Other Long Term Assets, Total',
        type: 'SOLA',
        typeExt: 'SOLA'
    },
    {
        nameCN: 'Deferred Policy Acquisition Costs',
        nameEN: 'Deferred Policy Acquisition Costs',
        type: 'ADPA',
        typeExt: 'ADPA'
    },
    {
        nameCN: 'Other Assets, Total',
        nameEN: 'Other Assets, Total',
        type: 'SOAT',
        typeExt: 'SOAT'
    },
    {
        nameCN: 'Total Assets',
        nameEN: 'Total Assets',
        type: 'ATOT',
        typeExt: 'ATOT'
    },
    {
        nameCN: 'Accounts Payable',
        nameEN: 'Accounts Payable',
        type: 'LAPB',
        typeExt: 'LAPB'
    },
    {
        nameCN: 'Payable/Accrued',
        nameEN: 'Payable/Accrued',
        type: 'LPBA',
        typeExt: 'LPBA'
    },
    {
        nameCN: 'Accrued Expenses',
        nameEN: 'Accrued Expenses',
        type: 'LAEX',
        typeExt: 'LAEX'
    },
    {
        nameCN: 'Policy Liabilities ',
        nameEN: 'Policy Liabilities ',
        type: 'SPOL',
        typeExt: 'SPOL'
    },
    {
        nameCN: 'Total Deposits',
        nameEN: 'Total Deposits',
        type: 'LDBT',
        typeExt: 'LDBT'
    },
    {
        nameCN: 'Other Bearing Liabilities, Total',
        nameEN: 'Other Bearing Liabilities, Total',
        type: 'SOBL',
        typeExt: 'SOBL'
    },
    {
        nameCN: 'Total Short Term Borrowings',
        nameEN: 'Total Short Term Borrowings',
        type: 'LSTB',
        typeExt: 'LSTB'
    },
    {
        nameCN: 'Notes Payable/Short Term Debt',
        nameEN: 'Notes Payable/Short Term Debt',
        type: 'LSTD',
        typeExt: 'LSTD'
    },
    {
        nameCN: 'Current Port. of LT Debt/Capital Leases',
        nameEN: 'Current Port. of LT Debt/Capital Leases',
        type: 'LCLD',
        typeExt: 'LCLD'
    },
    {
        nameCN: 'Other Current Liabilities, Total',
        nameEN: 'Other Current Liabilities, Total',
        type: 'SOCL',
        typeExt: 'SOCL'
    },
    {
        nameCN: 'Total Current Liabilities',
        nameEN: 'Total Current Liabilities',
        type: 'LTCL',
        typeExt: 'LTCL'
    },
    {
        nameCN: 'Long Term Debt',
        nameEN: 'Long Term Debt',
        type: 'LLTD',
        typeExt: 'LLTD'
    },
    {
        nameCN: 'Capital Lease Obligations',
        nameEN: 'Capital Lease Obligations',
        type: 'LCLO',
        typeExt: 'LCLO'
    },
    {
        nameCN: 'Total Long Term Debt',
        nameEN: 'Total Long Term Debt',
        type: 'LTTD',
        typeExt: 'LTTD'
    },
    {
        nameCN: 'Total Debt',
        nameEN: 'Total Debt',
        type: 'STLD',
        typeExt: 'STLD'
    },
    {
        nameCN: 'Deferred Income Tax',
        nameEN: 'Deferred Income Tax',
        type: 'SBDT',
        typeExt: 'SBDT'
    },
    {
        nameCN: 'Minority Interest',
        nameEN: 'Minority Interest',
        type: 'LMIN',
        typeExt: 'LMIN'
    },
    {
        nameCN: 'Other Liabilities, Total',
        nameEN: 'Other Liabilities, Total',
        type: 'SLTL',
        typeExt: 'SLTL'
    },
    {
        nameCN: 'Total Liabilities',
        nameEN: 'Total Liabilities',
        type: 'LTLL',
        typeExt: 'LTLL'
    },
    {
        nameCN: 'Redeemable Preferred Stock',
        nameEN: 'Redeemable Preferred Stock',
        type: 'SRPR',
        typeExt: 'SRPR'
    },
    {
        nameCN: 'Preferred Stock - Non Redeemable, Net',
        nameEN: 'Preferred Stock - Non Redeemable, Net',
        type: 'SPRS',
        typeExt: 'SPRS'
    },
    {
        nameCN: 'Common Stock',
        nameEN: 'Common Stock',
        type: 'SCMS',
        typeExt: 'SCMS'
    },
    {
        nameCN: 'Additional Paid-In Capital',
        nameEN: 'Additional Paid-In Capital',
        type: 'QPIC',
        typeExt: 'QPIC'
    },
    {
        nameCN: 'Retained Earnings (Accumulated Deficit)',
        nameEN: 'Retained Earnings (Accumulated Deficit)',
        type: 'QRED',
        typeExt: 'QRED'
    },
    {
        nameCN: 'Treasury Stock - Common',
        nameEN: 'Treasury Stock - Common',
        type: 'QTSC',
        typeExt: 'QTSC'
    },
    {
        nameCN: 'ESOP Debt Guarantee',
        nameEN: 'ESOP Debt Guarantee',
        type: 'QEDG',
        typeExt: 'QEDG'
    },
    {
        nameCN: 'Unrealized Gain (Loss)',
        nameEN: 'Unrealized Gain (Loss)',
        type: 'QUGL',
        typeExt: 'QUGL'
    },
    {
        nameCN: 'Other Equity, Total',
        nameEN: 'Other Equity, Total',
        type: 'SOTE',
        typeExt: 'SOTE'
    },
    {
        nameCN: 'Total Equity',
        nameEN: 'Total Equity',
        type: 'QTLE',
        typeExt: 'QTLE'
    },
    {
        nameCN: 'Total Liabilities & Shareholders’ Equity',
        nameEN: 'Total Liabilities & Shareholders’ Equity',
        type: 'QTEL',
        typeExt: 'QTEL'
    },
    {
        nameCN: 'Total Common Shares Outstanding',
        nameEN: 'Total Common Shares Outstanding',
        type: 'QTCO',
        typeExt: 'QTCO'
    },
    {
        nameCN: 'Total Preferred Shares Outstanding',
        nameEN: 'Total Preferred Shares Outstanding',
        type: 'QTPO',
        typeExt: 'QTPO'
    },

]
//主营能力
export const dataOperationAbility = [
    {
        nameCN: '营业周期',
        nameEN: '',
        type: 'AINVTURN',
        typeExt: 'AINVTURN'
    },
    {
        nameCN: '存货周转天数',
        nameEN: '',
        type: 'AINVTURN',
        typeExt: 'AINVTURN'
    },
    {
        nameCN: '存货周转率',
        nameEN: '',
        type: 'AINVTURN',
        typeExt: 'AINVTURN'
    },
    {
        nameCN: '应收账款周转天数',
        nameEN: '',
        type: 'AINVTURN',
        typeExt: 'AINVTURN'
    },
    {
        nameCN: '应收账款周转率',
        nameEN: '',
        type: 'AINVTURN',
        typeExt: 'AINVTURN'
    },
    {
        nameCN: '应付账款周转天数',
        nameEN: '',
        type: 'AINVTURN',
        typeExt: 'AINVTURN'
    },
    {
        nameCN: '应付账款周转率',
        nameEN: '',
        type: 'ARECTURN',
        typeExt: 'ARECTURN'
    },
    {
        nameCN: '流动资产周转率',
        nameEN: '',
        type: 'AINVTURN',
        typeExt: 'AINVTURN'
    },
    {
        nameCN: '固定资产周转率',
        nameEN: '',
        type: 'AINVTURN',
        typeExt: 'AINVTURN'
    },
    {
        nameCN: '总资产周转率',
        nameEN: '',
        type: 'AASTTURN',
        typeExt: 'AASTTURN'
    }
]
//f10-5 资产负债表 利润表 现金流量表  估值等的预测字段
export const dataForecast = [
    {
        nameCN: '每股账面价值',
        nameEN: 'Book Value per Share',
        type: 'BPS',
        section: 'Balance Sheet'
    },
    {
        nameCN: '净收入',
        nameEN: 'Net Income',
        type: 'NET',
        section: 'Income Statement'
    },
    {
        nameCN: '资产净值',
        nameEN: 'Net Asset Value',
        type: 'NAV',
        section: 'Balance Sheet'
    },
    {
        nameCN: '毛利率',
        nameEN: 'Gross Margin',
        type: 'GRM',
        section: 'Income Statement'
    },
    {
        nameCN: '税前利润',
        nameEN: 'Pre-tax Profit',
        type: 'PRE',
        section: 'Income Statement'
    },
    {
        nameCN: '资产收益率',
        nameEN: 'ROA',
        type: 'ROA',
        section: 'Valuation'
    },
    {
        nameCN: '资本支出',
        nameEN: 'Capital Expenditure',
        type: 'CPX',
        section: 'Cash Flow Statement'
    },
    {
        nameCN: '税息折旧及摊销前利润',
        nameEN: 'EBITDA',
        type: 'EBT',
        section: 'Income Statement'
    },
    {
        nameCN: '每股股息',
        nameEN: 'Dividend per Share	',
        type: 'DPS',
        section: 'Income Statement'
    },
    {
        nameCN: '每股盈余',
        nameEN: 'EPS',
        type: 'EPS',
        section: 'Income Statement'
    },
    {
        nameCN: '资本利润率;股权收益率',
        nameEN: 'ROE',
        type: 'ROE',
        section: 'Valuation'
    },
    {
        nameCN: '收入',
        nameEN: 'Revenue',
        type: 'SAL',
        section: 'Income Statement'
    },
    {
        nameCN: '每股收益-全面报告',
        nameEN: 'EPS - Fully Reported',
        type: 'GPS',
        section: 'Income Statement'
    },
    {
        nameCN: '净债务',
        nameEN: 'Net Debt',
        type: 'NDT',
        section: 'Balance Sheet'
    },
    {
        nameCN: '每股现金流量',
        nameEN: 'Cash Flow per Share',
        type: 'CPS',
        section: 'Cash Flow Statement'
    },
    {
        nameCN: '息税前利润',
        nameEN: 'EBIT',
        type: 'EBI',
        section: 'Income Statement'
    },
]