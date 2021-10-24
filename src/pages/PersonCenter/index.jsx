import { Button, message, Steps, Input, InputNumber, Modal, Pagination, Select, Tabs, Descriptions, Form, Radio, Table, Menu, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { changePassword, getWithdrawList, commissionList, purchaseRecord, productList, calPayMoney, generateOrder, insertDatum, insertWithdraw, getBlance, infoUpdate, getUserInfo, countryCode } from './service';
import styles from './index.less';
import { getAuthority, setAuthority } from '@/utils/authority';
import { EditOutlined, CheckOutlined, CopyOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fileSizeTransform, isEmpty, passwordReg, clientUp, gradeZN, UUIDGMT, eamilReg, copyDomTxt, changePayType } from '@/utils/utils';
import payment from '../../assets/payment.png'
import { useForm } from 'antd/lib/form/Form';
import ic_account from '../../assets/ic_account.svg';
import ic_income from '../../assets/ic_income.svg';
import ic_product from '../../assets/ic_product.svg';
import ic_sell from '../../assets/ic_sell.svg';
import ic_share from '../../assets/ic_share.svg';

const { Step } = Steps;
const oneStepZN = '第一步:请选择产品';
const oneStepEn = 'Step 1: Please select the product';
const twoStepZN = '会员级别';
const twoStepEN = 'Membership grade';
const threeStepZN = '价格';
const threeStepEN = 'The price';
const fourStepZN = '第二步:请确认付款';
const fourStepEN = 'Step 2: Please confirm payment';
const fiveStepZN = '应付金额';
const fiveStepEN = 'Amount payable';
const sixStepZN = '如果信息无误，请继续下一步，完成支付';
const sixStepEN = 'If the information is correct, please proceed to the next step and complete the payment';
//全剧变量
//购买产品参数中转
let productObj = {
  uniqueIdentification: '',
  productName: '',
  paymentVoucherUrl: '',
  money: ''
}

//实名认证信息参数
let paramsRealNameObj = {
  realName: "",
  country: '',
  usdLink: "", //usd链接
  prCode: "", //二维码图片地址
  identityCardUrlPositive: "", //身份证正面
  identityCardUrlReverse: "", //身份证反面
}

//出金提交参数
let balanceParams = {
  realName: '',
  account: '',
  cashAmount: '',
  qrCode: '1',
  usdLink: '',
  remark: '',
  userId: '',
  payType: '1'
}

const { Option } = Select;
const { TabPane } = Tabs;

const { SubMenu } = Menu;

const PersonCenter = () => {
  /** 国际化配置 */
  const intl = useIntl();

  const [form] = Form.useForm();
  const [formRealName] = Form.useForm();
  const contentWdith = window.innerWidth - 260;//内容区域宽度


  // submenu keys of first level
  const rootSubmenuKeys = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5'];

  const [openKeys, setOpenKeys] = useState(['sub1', 'sub2', 'sub3', 'sub4', 'sub5']);
  const [keyType, setKeyType] = useState('1')

  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  //设置选中的栏目
  const onSelectKey = ({ item, key }) => {
    setKeyType(key)
    if (key == 3 || key == 4) {
      getProductList()
    } else if (key == 7) {
      queryWithdrawList()
    } else if (key == 8) {
      queryCommissionList()
    } else if (key == 5) {
      queryPurchaseRecord()
    }

  }

  const columnsProduct = [
    {
      title: <span>{intl.locale === "zh-CN" ? '序号' : 'The serial number'}</span>,
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => {
        return <span>{index + 1} </span>
      }
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '产品名称' : 'Product name'}</span>,
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '产品价格' : 'Product price'}</span>,
      dataIndex: 'productPrice',
      key: 'productPrice',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '产品等级' : 'Product level'}</span>,
      dataIndex: 'unqiueIdentification',
      key: 'unqiueIdentification',
      render: (text, record) => {
        return <span>{gradeZN(text)}</span>
      }
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '是否购买' : 'Whether or not to buy'}</span>,
      dataIndex: 'isPurchase',
      key: 'isPurchase',
      render: (text, record) => {
        if (text == 1) {
          return <span>{intl.locale === "zh-CN" ? '已购买' : 'Have to buy'}</span>
        } else if (text == 2) {
          return <span>{intl.locale === "zh-CN" ? '未购买' : 'Not to buy'}</span>
        }
      }
    },
  ];

  //佣金记录
  const columnsCommission = [
    {
      title: <span>{intl.locale === "zh-CN" ? '序号' : 'The serial number'}</span>,
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => {
        return <span>{index + 1} </span>
      }
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '姓名' : 'Name'}</span>,
      dataIndex: 'receiveName',
      key: 'receiveName',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '账户' : 'account'}</span>,
      dataIndex: 'receiveAccount',
      key: 'receiveAccount',
      render: (text, record, index) => {
        return <span>{text ? 'GMT' + text : text}</span>
      }
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '来自会员姓名' : 'From member`s name'}</span>,
      dataIndex: 'purchaseName',
      key: 'purchaseName',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '来自订单' : 'From the order'}</span>,
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '金额' : 'The amount of'}</span>,
      dataIndex: 'commissionMoney',
      key: 'commissionMoney',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '返佣比列' : 'Commission than columns'}</span>,
      dataIndex: 'receiverRebate',
      key: 'receiverRebate',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '备注' : 'remark'}</span>,
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '创建时间' : 'create Time'}</span>,
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
      }
    },
  ]


  //出金记录
  const columnsWithdraw = [
    {
      title: <span>{intl.locale === "zh-CN" ? '序号' : 'The serial number'}</span>,
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => {
        return <span>{index + 1} </span>
      }
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '姓名' : 'Name'}</span>,
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '出金账户' : 'account'}</span>,
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '出金金额' : 'The amount of gold'}</span>,
      dataIndex: 'cashAmount',
      key: 'cashAmount',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? 'USDT钱包地址' : 'USDT wallet address'}</span>,
      dataIndex: 'usdLink',
      key: 'usdLink',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '收款二维码' : 'Qr code of receipt'}</span>,
      dataIndex: 'qrCode',
      key: 'qrCode',
      render: (text, record) => {
        return <a target='_blank' href={text ? clientUp.signatureUrl(text) : ''}> {intl.locale === "zh-CN" ? '查看' : 'To view'}</a>
      }
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '审核状态' : 'Review the status'}</span>,
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        if (text == 1) {
          return <span>{intl.locale === "zh-CN" ? '通过' : 'Pass'}</span>
        } else if (text == 2) {
          return <span>{intl.locale === "zh-CN" ? '不通过' : 'Not Pass'}</span>
        } else if (text == 0) {
          return <span>{intl.locale === "zh-CN" ? '待审核' : 'To audit'}</span>
        }
      }
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '备注' : 'Note the gold'}</span>,
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '创建时间' : 'Creation time'}</span>,
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: {
        compare: (a, b) => {
          let aTimeString = a.createTime;
          let bTimeString = b.createTime;
          let aTime = new Date(aTimeString).getTime();
          let bTime = new Date(bTimeString).getTime();
          return aTime - bTime;
        },
        multiple: 2,
      },
      render: (text, record) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
      }
    },
  ];

  //购买记录
  const columnsPurchase = [
    {
      title: <span>{intl.locale === "zh-CN" ? '序号' : 'The serial number'}</span>,
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => {
        return <span>{index + 1} </span>
      }
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '订单号' : 'The order number'}</span>,
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '所属会员' : 'Its member'}</span>,
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '充值账户' : 'Top-up account'}</span>,
      dataIndex: 'recommandCode',
      key: 'recommandCode',
      render: (text, record, index) => {
        return <span>{text ? 'GMT' + text : text}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.personCenter.purchaseType" defaultMessage="购买类型" />,
      dataIndex: 'purchaseType',
      key: 'purchaseType',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '购买金额' : 'Purchase amount'}</span>,
      dataIndex: 'money',
      key: 'money',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '购买等级' : 'Buy rating'}</span>,
      dataIndex: 'uniqueIdentification',
      key: 'uniqueIdentification',
      render: (text, record) => {
        return <span>{gradeZN(text)}</span>
      }
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '支付凭证' : 'Payment voucher'}</span>,
      dataIndex: 'paymentVoucherUrl',
      key: 'paymentVoucherUrl',
      render: (text, record) => {
        return <a target='_blank' href={text ? clientUp.signatureUrl(text) : ''}> {intl.locale === "zh-CN" ? '查看' : 'To view'}</a>
      }
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '上级推荐号' : 'Superior recommendation Number'}</span>,
      dataIndex: 'superiorRecommandCode',
      key: 'superiorRecommandCode',
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '审核状态' : 'Review the status'}</span>,
      dataIndex: 'payStatus',
      key: 'payStatus',
      render: (text, record) => {
        if (text == 1) {
          return <span>{intl.locale === "zh-CN" ? '通过' : 'Pass'}</span>
        } else if (text == 2) {
          return <span>{intl.locale === "zh-CN" ? '不通过' : 'Not Pass'}</span>
        } else if (text == 0) {
          return <span>{intl.locale === "zh-CN" ? '待审核' : 'To audit'}</span>
        }
      }
    },
    {
      title: <span>{intl.locale === "zh-CN" ? '审核备注' : 'Review the note'}</span>,
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: <FormattedMessage id="pages.personCenter.payTime" defaultMessage="购买时间" />,
      dataIndex: 'payTime',
      sorter: {
        compare: (a, b) => {
          let aTimeString = a.payTime;
          let bTimeString = b.payTime;
          let aTime = new Date(aTimeString).getTime();
          let bTime = new Date(bTimeString).getTime();
          return aTime - bTime;
        },
        multiple: 2,
      },
      render: (val, record) => {
        return <span>{val}</span>
      }
    },
  ];

  let user = getAuthority();//获取用户相关信息

  const [userInfo, setUserInfo] = useState(user)
  const [cutPage, setCutPage] = useState(1);

  //出金列表参数
  let params = {
    keyWord: userInfo.userName ? userInfo.userName : '',
    pageSize: 10,
    pageNumber: 1,
    accessToken: user?.accessToken
  }

  const [withdraw, setWithdraw] = useState([]);
  const [withdrawData, setWithdrawData] = useState({})
  //查询出金记录列表
  const queryWithdrawList = () => {
    getWithdrawList(params).then(
      res => {
        if (res?.state) {
          setWithdraw(res?.data?.result)
          setWithdrawData(res?.data)
        } else {
          message.error(res?.message);
        }
      }
    );
  }

  const onChangeWithdraw = (page, pageSize) => {
    params.pageSize = pageSize ? pageSize : '10';
    params.pageNumber = page ? page : '1';
    setCutPage(page);
    queryWithdrawList();
  }

  const onShowSizeChangeWithdraw = (current, size) => {
    params.pageSize = size ? size : '10';
    params.pageNumber = current ? current : '1';
    setCutPage(current);
    queryWithdrawList();
  }

  //购买记录参数
  let paramsPurchase = {
    userId: userInfo.id ? userInfo.id : '',
    pageSize: 10,
    pageNumber: 1,
    recommand: '',
    accessToken: user?.accessToken
  }

  const [purchase, setPurchase] = useState([]);
  const [purchaseData, setPurchaseData] = useState({})
  const [cutPagePurchase, setCutPagePurchase] = useState(1);

  //查询购买记录列表
  const queryPurchaseRecord = () => {
    purchaseRecord(paramsPurchase).then(
      res => {
        if (res?.state) {
          setPurchase(res?.data?.result)
          setPurchaseData(res?.data)
        } else {
          message.error(res?.message);
        }
      }
    );
  }

  const onChangePurchase = (page, pageSize) => {
    paramsPurchase.pageSize = pageSize ? pageSize : '10';
    paramsPurchase.pageNumber = page ? page : '1';
    setCutPagePurchase(page);
    queryPurchaseRecord();
  }

  const onShowSizeChangePurchase = (current, size) => {
    paramsPurchase.pageSize = size ? size : '10';
    paramsPurchase.pageNumber = current ? current : '1';
    setCutPagePurchase(current);
    queryPurchaseRecord();
  }

  //佣金记录参数
  let paramsCommission = {
    id: userInfo.id ? userInfo.id : '',
    pageSize: 10,
    pageNumber: 1,
    accessToken: user.accessToken
  }

  const [commission, setCommission] = useState([]);
  const [commissionData, setCommissionData] = useState({})
  const [cutPageCommission, setCutPageCommission] = useState(1);

  //查询佣金记录列表
  const queryCommissionList = () => {
    commissionList(paramsCommission).then(
      res => {
        if (res?.state) {
          setCommission(res?.data?.result)
          setCommissionData(res?.data)
        } else {
          message.error(res?.message);
        }
      }
    );
  }

  const onChangeCommission = (page, pageSize) => {
    paramsCommission.pageSize = pageSize ? pageSize : '10';
    paramsCommission.pageNumber = page ? page : '1';
    setCutPageCommission(page);
    queryCommissionList();
  }

  const onShowSizeChangeCommission = (current, size) => {
    paramsCommission.pageSize = size ? size : '10';
    paramsCommission.pageNumber = current ? current : '1';
    setCutPageCommission(current);
    queryCommissionList();
  }

  const [loadingState, setLoadingState] = useState(true);//loading

  let pageTotal = '共';
  let pageItems = '条';
  //parentId
  useEffect(() => {
    if (intl.locale === "zh-CN") {
      params.language = 'ZH';
      pageTotal = '共';
      pageItems = '条';
    } else {
      params.language = 'EN';
      pageTotal = 'Total';
      pageItems = 'items';
    }

    queryUserInfo()

  }, []);

  //修改密码
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    getChangePassWord(form.getFieldsValue())
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //修改密码
  const getChangePassWord = (item) => {
    if (isEmpty(item.newPassword) || isEmpty(item.oldPassword) || isEmpty(item.againNewPassword)) {
      message.error(intl.locale === "zh-CN" ? '请填写完整' : 'Please complete')
      return false
    }
    if (!isEmpty(item.newPassword) && !isEmpty(item.againNewPassword)) {
      if (item.newPassword !== item.againNewPassword) {
        message.error(intl.locale === "zh-CN" ? '两次输入密码不一致' : 'The two passwords are inconsistent')
        return false
      }
    }

    if (!passwordReg.test(item.newPassword) || !passwordReg.test(item.oldPassword) || !passwordReg.test(item.againNewPassword)) {
      message.error(intl.locale === "zh-CN" ? '密码格式不合规' : 'The password format is invalid')
      return false
    }

    let dataParams = {
      info: userInfo.userName ? userInfo.userName : userInfo.iphoneNumber ? userInfo.iphoneNumber : userInfo.emailAdress ? userInfo.emailAdress : '',
      newPassword: item.newPassword,
      oldPassword: item.oldPassword,
      accessToken: user?.accessToken
    }
    changePassword(dataParams).then(
      res => {
        if (res?.state) {
          setIsModalVisible(false);
          message.success('success')
        } else {
          message.error(res?.message);
        }
      }
    );
  }

  //选择不同的菜单触发对应的方法
  const selectTab = (e) => {
    if (e == 2) {
      getProductList()
    } else if (e == 3) {
      queryWithdrawList()
    } else if (e == 4) {
      queryCommissionList()
    } else if (e == 5) {
      queryPurchaseRecord()
    }
  }

  //产品列表
  const [product, setProduct] = useState([])
  const getProductList = async () => {
    const res = await productList(productParams);
    if (res?.state) {
      setProduct(res?.data)
    } else {
      message.error(res?.message)
    }
  }

  //实名信息认证   
  const [isModalRealNameVisible, setIsModalRealNameVisible] = useState(false);
  const [approve, setApprove] = useState(0)

  const showModalRealName = (type) => {
    setApprove(type)
    setIsModalRealNameVisible(true);
    // setTimeout(() => {
    //   $("#country").countrySelect({
    //     defaultCountry: "cn",
    //   });
    // }, 20);
    getCountryCode()
  };

  //获取国际码
  let paramsCode = {
    language: intl.locale === "zh-CN" ? 'CH' : 'US',
    accessToken: user?.accessToken
  }

  const [countryState, setCountryState] = useState([]);
  const getCountryCode = () => {
    countryCode(paramsCode).then(
      res => {
        if (res?.state) {
          setCountryState(res?.data)
        } else {
          message.error(res?.message);
        }
      }
    )
  }

  const setCountryId = (e, option) => {
    paramsRealNameObj.country = option?.id;
  }

  const handleOkRealName = () => {
    realNameInfo()
  };

  const handleCancelRealName = () => {
    setIsModalRealNameVisible(false);
  };

  const [imgUrl, setImgUrl] = useState('')

  //上传文件1
  const getFile = e => {
    let upurl = "identity_card/" + e.target.files[0].name;
    clientUp.multipartUpload(upurl, e.target.files[0]).then(function (result) {
      paramsRealNameObj.identityCardUrlPositive = result?.name;
      setImgUrl(clientUp.signatureUrl(upurl))
    }).catch(function (err) {
      message.error(err);
    });
  };

  const [imgUrlOther, setImgUrlOther] = useState('')

  //上传文件2
  const getFileOther = e => {
    let upurl = "identity_card/" + e.target.files[0].name;
    clientUp.multipartUpload(upurl, e.target.files[0]).then(function (result) {
      paramsRealNameObj.identityCardUrlReverse = result?.name;
      setImgUrlOther(clientUp.signatureUrl(upurl))
    }).catch(function (err) {
      message.error(err);
    });
  };

  const [imgUrlPayment, setImgUrlPayment] = useState('')
  //上传二维码
  const getFilePayment = e => {
    let upurl = "identity_card/" + e.target.files[0].name;
    clientUp.multipartUpload(upurl, e.target.files[0]).then(function (result) {
      paramsRealNameObj.prCode = result?.name;
      setImgUrlPayment(clientUp.signatureUrl(upurl))
    }).catch(function (err) {
      message.error(err);
    });
  };

  //实名认证信息参数
  let paramsRealName = {
    realName: "",
    usdLink: "", //usd链接
    prCode: "", //二维码图片地址
    identityCardUrlPositive: "", //身份证正面
    identityCardUrlReverse: "", //身份证反面
    userId: userInfo.recommendationCode,                //用户的推荐号
    accessToken: user?.accessToken
  }

  //实名认证
  const realNameInfo = async () => {
    //实名认证信息参数
    paramsRealName.identityCardUrlPositive = paramsRealNameObj.identityCardUrlPositive;
    paramsRealName.identityCardUrlReverse = paramsRealNameObj.identityCardUrlReverse;
    paramsRealName.prCode = paramsRealNameObj.prCode ? paramsRealNameObj.prCode : '';
    paramsRealName.realName = formRealName.getFieldValue('realName') ? formRealName.getFieldValue('realName') : '';
    paramsRealName.usdLink = formRealName.getFieldValue('uuidPay') ? formRealName.getFieldValue('uuidPay') : '';
    paramsRealName.identityNumber = formRealName.getFieldValue('cardNo') ? formRealName.getFieldValue('cardNo') : '';
    paramsRealName.country = paramsRealNameObj.country;

    if (approve == 0) {
      if (isEmpty(paramsRealName.realName) || isEmpty(paramsRealName.identityNumber)) {
        message.error(intl.locale === "zh-CN" ? '请填写完整' : 'Please complete')
        return false
      }
      if (isEmpty(paramsRealName.identityCardUrlPositive) || isEmpty(paramsRealName.identityCardUrlReverse)) {
        message.error(intl.locale === "zh-CN" ? '身份信息请上传完整' : 'Please upload complete identity information')
        return false
      }
    }
    if (approve == 1) {
      if (isEmpty(paramsRealName.usdLink)) {
        message.error(intl.locale === "zh-CN" ? '请填写完整' : 'Please complete')
        return false
      }
      if (isEmpty(paramsRealName.prCode)) {
        message.error(intl.locale === "zh-CN" ? '收款码请上传' : 'Please upload the payment code')
        return false
      }
    }

    const res = await insertDatum(paramsRealName)
    if (res?.state) {
      message.success('success')
      setIsModalRealNameVisible(false);
    } else {
      message.error(res?.message)
    }
  }

  //购买产品
  //查询产品
  let productParams = {
    accessToken: user?.accessToken,
    code: userInfo?.agent != 'ordinary' ? '' : userInfo?.superiorRecommendationCode,
    userId: userInfo?.id
  }

  //生成订单参数
  let orderParasm = {
    orderNo: UUIDGMT(),
    payTime: '',
    money: '',
    superiorRecommandCode: userInfo?.superiorRecommendationCode,
    recommandCode: userInfo?.recommendationCode,
    userId: userInfo?.id,
    uniqueIdentification: '',
    productName: '',
    payType: '9',
    paymentVoucherUrl: '',
    accessToken: user?.accessToken
  }

  //选择产品后计算应付金额
  const getGrade = (e) => {
    getCalPayMoney(e.target.value)
  }

  let calParams = {
    recommandCode: userInfo?.recommendationCode,
    userId: userInfo?.id,
    productUnqiueIdentification: '',
    accessToken: user?.accessToken
  }

  //应付金额
  const [money, setMoney] = useState('')
  const [uniqueId, setUniqueId] = useState('')
  const getCalPayMoney = async (e) => {
    calParams.productUnqiueIdentification = e.unqiueIdentification;
    productObj.uniqueIdentification = e.unqiueIdentification;
    setUniqueId(e.unqiueIdentification)
    productObj.productName = e.productName;
    if (userInfo?.agent == e.unqiueIdentification) return
    const res = await calPayMoney(calParams);
    if (res?.state) {
      productObj.money = res?.data;
      setMoney(res?.data)
    } else {
      message.error(res?.message)
    }
  }

  //购买产品步骤

  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const [imgUrlPay, setImgUrlPay] = useState('')

  //上传付款凭证
  const getFilePay = e => {
    let upurl = "identity_card/" + e.target.files[0].name;
    clientUp.multipartUpload(upurl, e.target.files[0]).then(function (result) {
      productObj.paymentVoucherUrl = result?.name;
      setImgUrlPay(clientUp.signatureUrl(upurl))
    }).catch(function (err) {
      message.error(err);
    });
  };

  //生成订单
  const payMoneyOrder = async () => {
    orderParasm.payTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    orderParasm.paymentVoucherUrl = productObj.paymentVoucherUrl;
    orderParasm.uniqueIdentification = productObj.uniqueIdentification;
    orderParasm.productName = productObj.productName;
    orderParasm.money = productObj.money;
    if (isEmpty(orderParasm.paymentVoucherUrl)) {
      message.error(intl.locale === "zh-CN" ? '付款凭证请上传' : ' Please upload the payment voucher')
      return false
    }

    const res = await generateOrder(orderParasm);
    if (res?.state) {
      message.success(res?.message)
    } else {
      message.error(res?.message)
    }
  }

  //账户管理
  const [formAccout] = Form.useForm()
  formAccout.setFieldsValue({
    usdLink: userInfo?.usdLink
  })

  const balanceSubmitter = async () => {
    if (isEmpty(formAccout.getFieldValue('cashAmount'))) {
      message.error(intl.locale === "zh-CN" ? '提现金额不能为空' : 'The withdrawal amount cannot be empty');
      return false;
    }
    if (isEmpty(formAccout.getFieldValue('usdLink'))) {
      message.error(intl.locale === "zh-CN" ? 'USDT钱包地址不能为空' : 'The USDT wallet address cannot be empty');
      return false;
    }

    //出金提交参数
    balanceParams = {
      realName: userInfo?.realName,
      account: userInfo.recommendationCode ? userInfo.recommendationCode : '',
      cashAmount: formAccout.getFieldValue('cashAmount'),
      qrCode: '1',
      usdLink: formAccout.getFieldValue('usdLink'),
      remark: formAccout.getFieldValue('remark') ? formAccout.getFieldValue('remark') : '',
      payType: formAccout.getFieldValue('payType') ? formAccout.getFieldValue('payType') : '1',
      userId: userInfo?.id,
      accessToken: user?.accessToken
    }
    balanceParams.payType = changePayType(balanceParams.payType);//处理支付方式的转换
    const res = await getBlance(
      {
        userId: userInfo?.id,
        accessToken: user.accessToken
      }
    );
    if (res?.state) {
      if (res?.data >= formAccout.getFieldValue('cashAmount')) {
        const resWith = await insertWithdraw(balanceParams);
        if (resWith?.state) {
          message.success(intl.locale === "zh-CN" ? '申请成功' : 'Application is successful');
        }
      } else {
        message.error(intl.locale === "zh-CN" ? '金额超限' : 'The amount of overrun');
        return false;
      }
    } else {
      message.error(res?.message)
    }

  }

  const [infoType, setInfoType] = useState('');
  const [typeState, setTypeState] = useState(0)
  const [formInfo] = useForm()

  //相关信息修改
  const [isModalInfoVisible, setIsModalInfoVisible] = useState(false);

  const showModalInfo = (type) => {
    setTypeState(type)
    if (intl.locale === "zh-CN") {
      if (type == 0) {
        setInfoType('用户名');
      } else if (type == 1) {
        setInfoType('邮箱');
      } else if (type == 2) {
        setInfoType('手机号');
      }
    } else {
      if (type == 0) {
        setInfoType('The user name');
      } else if (type == 1) {
        setInfoType('email');
      } else if (type == 2) {
        setInfoType('Mobile phone no.');
      }
    }

    if (type == 0) {
      formInfo.setFieldsValue({
        infoName: userInfo?.userName
      })
    } else if (type == 1) {
      formInfo.setFieldsValue({
        infoName: userInfo?.emailAdress
      })
    } else if (type == 2) {
      formInfo.setFieldsValue({
        infoName: userInfo?.iphoneNumber
      })
    }

    setIsModalInfoVisible(true);
  };

  const handleOkInfo = () => {
    changeInfo()
  };

  const handleCancelInfo = () => {
    setIsModalInfoVisible(false);
  };

  //修改信息
  const changeInfo = async () => {
    let params = {
      id: userInfo?.id
    }
    if (isEmpty(formInfo.getFieldValue('infoName'))) {
      message.error(intl.locale === "zh-CN" ? '参数不能为空' : 'The parameter cannot be empty')
      return false
    }
    if (typeState == 0) {
      params.userName = formInfo.getFieldValue('infoName')
    } else if (typeState == 1) {
      if (!eamilReg.test(formInfo.getFieldValue('infoName'))) {
        message.error(intl.locale === "zh-CN" ? '邮箱格式错误' : 'Email format error')
        return false
      }
      params.emailAdress = formInfo.getFieldValue('infoName')
    } else if (typeState == 2) {
      params.iphoneNumber = formInfo.getFieldValue('infoName')
    }

    const res = await infoUpdate(params, user?.accessToken)
    if (res?.state) {
      message.success('success')
      queryUserInfo()
      setIsModalInfoVisible(false)
    } else {
      message.error(res?.message)
    }
  }

  //查询个人信息
  const queryUserInfo = async () => {
    let parsmUser = {
      accessToken: user?.accessToken,
      recommendationCode: userInfo?.recommendationCode
    }
    const res = await getUserInfo(parsmUser)
    if (res?.state) {
      setUserInfo(res?.data)
    }
  }

  const [wayState, setWayState] = useState('1')
  //选择出金方式
  const onChangeWay = (e) => {
    setWayState(e.target.value)
  }

  //复制到粘贴板
  const copyDomContent = (id) => {
    copyDomTxt(id);
  }

  //个人推广链接地址
  const personToPromote = `https://www.gmtdata.technology/gmtweb/#/user/register?recommendationCode=` + userInfo?.recommendationCode;

  //生成推广二维码
  useEffect(() => {
    let personToPromoteQrcode = document.getElementById("personToPromoteQrcode");
    if (personToPromoteQrcode) {
      new QRCode(personToPromoteQrcode, personToPromote);
    }
  }, [keyType])

  return (
    <PageContainer>
      <div className={styles.tabContent}>
        <div>
          <Menu mode="inline"
            openKeys={openKeys}
            defaultSelectedKeys={['1']}
            onOpenChange={onOpenChange}
            onSelect={onSelectKey}
            style={{ display: 'inline-block', width: 200 }}>
            <SubMenu key="sub1" icon={<img src={ic_account} style={{ marginRight: 5 }} />} title={intl.formatMessage({
              id: 'pages.personCenter.accountInfo',
              defaultMessage: '个人信息',
            })}>
              <Menu.Item key="1" title={intl.locale === "zh-CN" ? '个人资料' : 'personal data'}><FormattedMessage id="pages.personCenter.personalData" defaultMessage="个人资料" /></Menu.Item>
              <Menu.Item key="2" title={intl.locale === "zh-CN" ? '实名认证' : 'Real-name authentication'}><FormattedMessage id="pages.personCenter.realNameAuthentication" defaultMessage="实名认证" /></Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<img src={ic_product} style={{ marginRight: 5 }} />} title={intl.locale === "zh-CN" ? '产品管理' : 'Product management'}>
              <Menu.Item key="3" title={intl.locale === "zh-CN" ? '产品列表' : 'Product list'}>{intl.locale === "zh-CN" ? '产品列表' : 'Product list'}</Menu.Item>
              <Menu.Item key="4" title={intl.locale === "zh-CN" ? '产品认购' : 'Product subscription'}>{intl.locale === "zh-CN" ? '产品认购' : 'Product subscription'}</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" icon={<img src={ic_sell} style={{ marginRight: 5 }} />} title={intl.locale === "zh-CN" ? '资金管理' : 'Money management'}>
              <Menu.Item key="5" title={intl.locale === "zh-CN" ? '购买记录' : 'Purchase records'}>{intl.locale === "zh-CN" ? '购买记录' : 'Purchase records'}</Menu.Item>
              <Menu.Item key="6" title={intl.locale === "zh-CN" ? '出金申请' : 'The gold application'}>{intl.locale === "zh-CN" ? '出金申请' : 'The gold application'}</Menu.Item>
              <Menu.Item key="7" title={intl.locale === "zh-CN" ? '出金记录' : 'The gold record'}>{intl.locale === "zh-CN" ? '出金记录' : 'The gold record'}</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" icon={<img src={ic_income} style={{ marginRight: 5 }} />} title={intl.locale === "zh-CN" ? '收益管理' : 'Revenue management'}>
              <Menu.Item key="8" title={intl.locale === "zh-CN" ? '佣金记录' : 'Commission record'}>{intl.locale === "zh-CN" ? '佣金记录' : 'Commission record'}</Menu.Item>
            </SubMenu>
            <SubMenu key="sub5" icon={<img src={ic_share} style={{ marginRight: 5 }} />} title={intl.locale === "zh-CN" ? '邀请管理' : 'Invitation management'}>
              <Menu.Item key="9" title={intl.locale === "zh-CN" ? '推广链接' : 'To promote links'}>{intl.locale === "zh-CN" ? '推广链接' : 'To promote links'}</Menu.Item>
            </SubMenu>
          </Menu>
          <div style={{ display: 'inline-block', position: 'absolute', width: contentWdith, marginLeft: 20, height: '100%', overflowY: 'scroll' }}>
            {keyType == '1' ?
              <div style={{ marginLeft: 200 }}>
                <Descriptions column={1} title={intl.formatMessage({
                  id: 'pages.personCenter.personalData',
                  defaultMessage: '个人资料',
                })}>
                  <Descriptions.Item label={intl.formatMessage({
                    id: 'pages.personCenter.ID',
                    defaultMessage: '账户',
                  })}>{userInfo.recommendationCode ? userInfo.recommendationCode : ''}</Descriptions.Item>
                  <Descriptions.Item label={intl.locale === "zh-CN" ? '会员等级：' : 'Membership level:'}>
                    {intl.locale === "zh-CN" ? gradeZN(userInfo?.agent) : userInfo?.agent}</Descriptions.Item>
                  <Descriptions.Item label={intl.formatMessage({
                    id: 'pages.personCenter.userName',
                    defaultMessage: '姓名',
                  })}>{userInfo.realName ? userInfo.realName : intl.locale === "zh-CN" ? '未实名' : 'No real name'}</Descriptions.Item>
                  <Descriptions.Item label={intl.formatMessage({
                    id: 'pages.personCenter.emailAdress',
                    defaultMessage: '邮箱',
                  })}>{userInfo.emailAdress ? userInfo.emailAdress : ''}</Descriptions.Item>
                  <Descriptions.Item label={intl.formatMessage({
                    id: 'pages.personCenter.iphoneNumber',
                    defaultMessage: '手机号',
                  })}>{userInfo.iphoneNumber ? userInfo.iphoneNumber : ''}</Descriptions.Item>
                  <Descriptions.Item label={intl.formatMessage({
                    id: 'pages.personCenter.recommendationCode',
                    defaultMessage: '我的邀请码',
                  })}>{userInfo.recommendationCode ? userInfo.recommendationCode : ''}</Descriptions.Item>

                </Descriptions>
              </div>
              : keyType == '2' ?
                <div style={{ marginLeft: 200 }}>
                  <Descriptions column={1} title={intl.formatMessage({
                    id: 'pages.personCenter.realNameAuthentication',
                    defaultMessage: '实名认证',
                  })}>
                    <Descriptions.Item label={intl.formatMessage({
                      id: 'pages.personCenter.ID',
                      defaultMessage: 'ID',
                    })}>{userInfo.recommendationCode ? userInfo.recommendationCode : ''}</Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({
                      id: 'pages.personCenter.userName',
                      defaultMessage: '姓名',
                    })}>{userInfo.userName ? userInfo.userName : ''}<a onClick={() => showModalInfo(0)}><EditOutlined /><FormattedMessage id="pages.personCenter.edit" defaultMessage='修改' /></a></Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({
                      id: 'pages.personCenter.userPassword',
                      defaultMessage: '用户密码',
                    })}><a onClick={showModal}><EditOutlined /><FormattedMessage id="pages.personCenter.edit" defaultMessage='修改' /></a></Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({
                      id: 'pages.personCenter.emailAdress',
                      defaultMessage: '邮箱',
                    })}>{userInfo.emailAdress ? userInfo.emailAdress : ''}<a onClick={() => showModalInfo(1)}><EditOutlined /><FormattedMessage id="pages.personCenter.edit" defaultMessage='修改' /></a></Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({
                      id: 'pages.personCenter.iphoneNumber',
                      defaultMessage: '手机号',
                    })}>{userInfo.iphoneNumber ? userInfo.iphoneNumber : ''}<a onClick={() => showModalInfo(2)}><EditOutlined /><FormattedMessage id="pages.personCenter.edit" defaultMessage='修改' /></a></Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({
                      id: 'pages.personCenter.recommendationCode',
                      defaultMessage: '我的邀请码',
                    })}>{userInfo.recommendationCode ? userInfo.recommendationCode : ''}</Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({
                      id: 'pages.personCenter.superiorRecommendationCode',
                      defaultMessage: '上级邀请码',
                    })}>{userInfo.superiorRecommendationCode ? userInfo.superiorRecommendationCode : ''}</Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({
                      id: 'pages.personCenter.country',
                      defaultMessage: '国家',
                    })}>{intl.locale === "zh-CN" ? userInfo?.countryZh : userInfo?.countryEn}</Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({
                      id: 'pages.personCenter.realName',
                      defaultMessage: '实名信息',
                    })}>{userInfo.realName ? userInfo.realName : ''}{!isEmpty(userInfo.identityNumber) ? <span><CheckOutlined />{intl.locale === "zh-CN" ? '已认证' : 'certified'}</span> : <a onClick={() => showModalRealName(0)}><EditOutlined />{intl.locale === "zh-CN" ? '去认证' : 'Go to the certification'}</a>}</Descriptions.Item>
                    {
                      userInfo.identityNumber ?
                        <Descriptions.Item label={intl.locale === "zh-CN" ? '身份证' : 'Id card'}>
                          {userInfo.identityNumber ? userInfo.identityNumber : ''}
                          <br />
                          <img src={clientUp.signatureUrl(userInfo?.identityCardUrlPositive)} style={{ width: 320 }} />
                          <br />
                          <img src={clientUp.signatureUrl(userInfo?.identityCardUrlReverse)} style={{ width: 320 }} />
                        </Descriptions.Item>
                        : ''
                    }
                    <Descriptions.Item label={intl.formatMessage({
                      id: 'pages.personCenter.gatheringInfor',
                      defaultMessage: '收款信息',
                    })}>{!isEmpty(userInfo?.usdLink) ? <span><CheckOutlined />{intl.locale === "zh-CN" ? '已认证' : 'certified'}</span> : <a onClick={() => showModalRealName(1)}><EditOutlined />{intl.locale === "zh-CN" ? '去认证' : 'Go to the certification'}</a>}</Descriptions.Item>
                  </Descriptions>
                </div>
                : keyType == '3' ?
                  <div>
                    <Table columns={columnsProduct} dataSource={product} rowKey={(record) => record.id} />
                  </div>
                  : keyType == '4' ?
                    <div style={{ marginLeft: 200 }}>
                      {
                        current == 0 ?
                          <div>
                            <div style={{ marginBottom: 20 }}>
                              {intl.locale === "zh-CN" ? oneStepZN : oneStepEn}
                            </div>
                            <Radio.Group onChange={getGrade}>
                              {
                                product?.length > 0 ? product.map((p) => (
                                  <Radio.Button key={p.id} value={p} disabled={p.isPurchase == 1}>{p.productName}<br />
                                    {intl.locale === "zh-CN" ? twoStepZN : twoStepEN}:{intl.locale === "zh-CN" ? gradeZN(p.unqiueIdentification) : p.unqiueIdentification}<br />
                                    {intl.locale === "zh-CN" ? threeStepZN : threeStepEN}:{p.productPrice}</Radio.Button>
                                )) : ''
                              }
                            </Radio.Group>
                            <div style={{ marginBottom: 20, marginTop: 20 }}>{intl.locale === "zh-CN" ? fourStepZN : fourStepEN}</div>
                            <div>
                              {intl.locale === "zh-CN" ? fiveStepZN : fiveStepEN}: {money}
                            </div>
                            <div>{intl.locale === "zh-CN" ? sixStepZN : sixStepEN}</div>
                          </div> :
                          current == 1 ?
                            <div>
                              <Descriptions column={1} title={intl.formatMessage({
                                id: 'pages.personCenter.payInfo',
                                defaultMessage: '收款信息',
                              })}>
                                <Descriptions.Item label={intl.formatMessage({
                                  id: 'pages.personCenter.usdtpaymentcode',
                                  defaultMessage: 'USDT收款二维码',
                                })}> <img src={payment} width='50%' /></Descriptions.Item>
                                <Descriptions.Item label={intl.formatMessage({
                                  id: 'pages.personCenter.usdtAddress',
                                  defaultMessage: 'USDT钱包地址',
                                })}>0x36fd870bb2F70887819A5105828568E2C890f16E</Descriptions.Item>
                              </Descriptions>
                            </div>
                            :
                            current == 2 ?
                              //第三步

                              <div>
                                <span className={styles.imgSpan}>
                                  <FormattedMessage
                                    id="pages.personCenter.payment"
                                    defaultMessage='付款凭证'
                                  />
                                  <br />
                                  <span>
                                    {imgUrlPay ? <img src={imgUrlPay} /> : ''}
                                  </span>
                                </span>
                                <label for="inputFilePay" class="button">
                                  <span className={styles.uploadBtn}>
                                    <FormattedMessage
                                      id="pages.personCenter.chooseFile"
                                      defaultMessage="选择文件"
                                    />
                                  </span>
                                </label>
                                <input type="file" id="inputFilePay" style={{ display: 'none' }} onChange={getFilePay} />
                              </div> : ''
                      }
                      <div className="steps-action">
                        {current < 3 - 1 && money != 0 && (
                          <Button type="primary" onClick={() => next()}>
                            {intl.locale === "zh-CN" ? '下一步' : 'The next step'}
                          </Button>
                        )}
                        {current === 3 - 1 && (
                          <Button type="primary" onClick={payMoneyOrder}>
                            {intl.locale === "zh-CN" ? '生成订单' : ' To generate orders'}
                          </Button>
                        )}
                        {current > 0 && (
                          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            {intl.locale === "zh-CN" ? '上一步' : 'The previous step'}
                          </Button>
                        )}
                      </div>
                    </div>
                    : keyType == '5' ?
                      <div>
                        <Table columns={columnsPurchase} dataSource={purchase} scroll={{ x: 1900 }} rowKey={(record) => record.id} pagination={false} />
                        <Pagination
                          style={{ marginTop: 10, float: 'right' }}
                          total={purchaseData ? purchaseData.total : 0}
                          showTotal={(total) => `${pageTotal} ${purchaseData?.total} ${pageItems} `}
                          current={cutPagePurchase ? cutPagePurchase : 1}
                          onChange={onChangePurchase}
                          showSizeChanger={onShowSizeChangePurchase} />
                      </div>
                      : keyType == '6' ?
                        <div style={{ marginLeft: 150 }}>
                          <Form
                            form={formAccout}
                            name="accout"
                            labelCol={{
                              span: 6,
                            }}
                            wrapperCol={{
                              span: 12,
                            }}
                            layout='vertical'
                            autoComplete="off"
                          >
                            <Form.Item
                              label={intl.locale === "zh-CN" ? '出金账户' : 'The gold account'}
                              name="accountName"
                            >
                              <span>
                                ({userInfo.recommendationCode ? 'GMT' + userInfo.recommendationCode : ''})
                                {intl.locale === "zh-CN" ? '可提现金额:' : 'Withdrawal amount:'}{userInfo.balance ? userInfo.balance : 0}
                              </span>
                            </Form.Item>
                            <Form.Item
                              name="cashAmount"
                              label={intl.locale === "zh-CN" ? '提现金额' : 'Withdrawal amount'}
                              rules={[
                                {
                                  required: true,
                                }
                              ]}
                            >
                              <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item
                              name="payType"
                              label={intl.locale === "zh-CN" ? '支付方式' : 'Method of payment'}
                            >
                              <Radio.Group onChange={onChangeWay} defaultValue={1}>
                                <Space direction="vertical">
                                  <Radio value={0}>{intl.locale === "zh-CN" ? '银行卡出金' : 'Bank card payment'}</Radio>
                                  <Radio value={1}>{intl.locale === "zh-CN" ? 'USDT出金' : 'USDT out gold'}</Radio>
                                  <Radio value={2}>{intl.locale === "zh-CN" ? '支付宝' : 'Alipay'}</Radio>
                                  <Radio value={3}>{intl.locale === "zh-CN" ? '微信' : 'WeChat'}</Radio>
                                </Space>
                              </Radio.Group>
                            </Form.Item>
                            {
                              wayState == 0 ?
                                <Form.Item
                                  name="usdLink"
                                  label={intl.locale === "zh-CN" ? '银行卡号' : 'Bank card number'}
                                >
                                  <Input disabled />
                                </Form.Item>
                                : wayState == 1 ?
                                  <Form.Item
                                    name="usdLink"
                                    label={intl.locale === "zh-CN" ? 'USDT钱包地址' : 'USDT wallet address'}
                                  >
                                    <Input disabled />
                                  </Form.Item>
                                  : wayState == 2 ?
                                    <Form.Item
                                      name="usdLink"
                                      label={intl.locale === "zh-CN" ? '支付宝账号' : 'Alipay Account'}
                                    >
                                      <Input />
                                    </Form.Item>
                                    : wayState == 3 ?
                                      <Form.Item
                                        name="usdLink"
                                        label={intl.locale === "zh-CN" ? '微信账号' : 'WeChat account'}
                                      >
                                        <Input />
                                      </Form.Item>
                                      : ''
                            }

                            <Form.Item
                              name="remark"
                              label={intl.locale === "zh-CN" ? '备注' : 'remark'}
                            >
                              <Input />
                            </Form.Item>
                            <Tabs defaultActiveKey="1" style={{ marginRight: '50%', marginBottom: 10 }}>
                              <TabPane tab={intl.locale === "zh-CN" ? '手机验证' : 'Phone verification'} key="1">
                                <Input />
                                <span className={styles.verification}>
                                  <span>|</span>
                                  <span className={styles.verificationText}>{intl.locale === "zh-CN" ? '发送验证码' : 'Verification code'}</span>
                                </span>
                              </TabPane>
                              <TabPane tab={intl.locale === "zh-CN" ? '邮箱验证' : 'Email address verification'} key="2">
                                <Input />
                                <span className={styles.verification}>
                                  <span>|</span>
                                  <span className={styles.verificationText}>{intl.locale === "zh-CN" ? '发送验证码' : 'Verification code'}</span>
                                </span>
                              </TabPane>
                            </Tabs>
                            <Form.Item
                              name="operate"
                              label=""
                            >
                              <Button onClick={balanceSubmitter}>{intl.locale === "zh-CN" ? '提交申请' : 'Submit an application'}</Button>
                            </Form.Item>
                          </Form>
                        </div>
                        : keyType == '7' ?
                          <div>
                            <Table columns={columnsWithdraw} dataSource={withdraw} rowKey={(record) => record.id} pagination={false} />
                            <Pagination
                              style={{ marginTop: 10, float: 'right' }}
                              total={withdrawData ? withdrawData.total : 0}
                              showTotal={(total) => `${pageTotal} ${withdrawData?.total} ${pageItems} `}
                              current={cutPage ? cutPage : 1}
                              onChange={onChangeWithdraw}
                              showSizeChanger={onShowSizeChangeWithdraw} />
                          </div>
                          : keyType == '8' ?
                            <div>
                              <Table columns={columnsCommission} dataSource={commission} rowKey={(record) => record.id} pagination={false} />
                              <Pagination
                                style={{ marginTop: 10, float: 'right' }}
                                total={commissionData ? commissionData.total : 0}
                                showTotal={(total) => `${pageTotal} ${commissionData?.total} ${pageItems} `}
                                current={cutPageCommission ? cutPageCommission : 1}
                                onChange={onChangeCommission}
                                showSizeChanger={onShowSizeChangeCommission} />
                            </div>
                            : keyType == '9' ?
                              <div style={{ marginLeft: 150 }}>
                                <Descriptions column={1} title={intl.locale === "zh-CN" ? '推广链接' : 'To promote links'}>
                                  <Descriptions.Item label={intl.locale === "zh-CN" ? '代理推广邀请码' : 'Agent promotion invitation code'}>
                                    <span id="code">{userInfo.recommendationCode ? userInfo.recommendationCode : ''}</span>
                                    <CopyOutlined style={{ marginLeft: 20 }} onClick={() => copyDomContent(userInfo?.recommendationCode)} />
                                  </Descriptions.Item>
                                  <Descriptions.Item label={intl.locale === "zh-CN" ? '代理推广链接' : 'Agent promotion link'}>
                                    {personToPromote}
                                    <CopyOutlined style={{ marginLeft: 20 }} onClick={() => copyDomContent(personToPromote)} />
                                  </Descriptions.Item>
                                  <Descriptions.Item label={intl.locale === "zh-CN" ? '推广二维码' : 'Promote QR code'}>
                                    <div id="personToPromoteQrcode"></div>
                                  </Descriptions.Item>
                                </Descriptions>
                              </div>
                              : ''}
          </div>
        </div>


        {/* <Tabs tabPosition='left' onTabClick={selectTab}>
          <TabPane tab={intl.formatMessage({
            id: 'pages.personCenter.accountInfo',
            defaultMessage: '个人信息',
          })} key="1">
            <div>
              <Descriptions column={1} title={intl.formatMessage({
                id: 'pages.personCenter.accountInfo',
                defaultMessage: '个人信息',
              })}>
                <Descriptions.Item label={intl.formatMessage({
                  id: 'pages.personCenter.ID',
                  defaultMessage: 'ID',
                })}>{userInfo.recommendationCode ? userInfo.recommendationCode : ''}</Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({
                  id: 'pages.personCenter.userName',
                  defaultMessage: '用户名',
                })}>{userInfo.userName ? userInfo.userName : ''}<a onClick={() => showModalInfo(0)}><EditOutlined /><FormattedMessage id="pages.personCenter.edit" defaultMessage='修改' /></a></Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({
                  id: 'pages.personCenter.userPassword',
                  defaultMessage: '用户密码',
                })}><a onClick={showModal}><EditOutlined /><FormattedMessage id="pages.personCenter.edit" defaultMessage='修改' /></a></Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({
                  id: 'pages.personCenter.emailAdress',
                  defaultMessage: '邮箱',
                })}>{userInfo.emailAdress ? userInfo.emailAdress : ''}<a onClick={() => showModalInfo(1)}><EditOutlined /><FormattedMessage id="pages.personCenter.edit" defaultMessage='修改' /></a></Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({
                  id: 'pages.personCenter.iphoneNumber',
                  defaultMessage: '手机号',
                })}>{userInfo.iphoneNumber ? userInfo.iphoneNumber : ''}<a onClick={() => showModalInfo(2)}><EditOutlined /><FormattedMessage id="pages.personCenter.edit" defaultMessage='修改' /></a></Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({
                  id: 'pages.personCenter.recommendationCode',
                  defaultMessage: '我的邀请码',
                })}>{userInfo.recommendationCode ? userInfo.recommendationCode : ''}</Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({
                  id: 'pages.personCenter.superiorRecommendationCode',
                  defaultMessage: '上级邀请码',
                })}>{userInfo.superiorRecommendationCode ? userInfo.superiorRecommendationCode : ''}</Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({
                  id: 'pages.personCenter.realName',
                  defaultMessage: '实名信息',
                })}>{userInfo.realName ? userInfo.realName : ''}{!isEmpty(userInfo.identityNumber) ? <span><CheckOutlined />{intl.locale === "zh-CN" ? '已认证' : 'certified'}</span> : <a onClick={showModalRealName}><EditOutlined />{intl.locale === "zh-CN" ? '去认证' : 'Go to the certification'}</a>}</Descriptions.Item>
                {
                  userInfo.identityNumber ?
                    <Descriptions.Item label={intl.locale === "zh-CN" ? '身份证' : 'Id card'}>
                      {userInfo.identityNumber ? userInfo.identityNumber : ''}
                      <br />
                      <img src={clientUp.signatureUrl(userInfo?.identityCardUrlPositive)} style={{ width: 320 }} />
                      <br />
                      <img src={clientUp.signatureUrl(userInfo?.identityCardUrlReverse)} style={{ width: 320 }} />
                    </Descriptions.Item>
                    : ''
                }
                <Descriptions.Item label={intl.formatMessage({
                  id: 'pages.personCenter.gatheringInfor',
                  defaultMessage: '收款信息',
                })}>{!isEmpty(userInfo.identityNumber) ? <span><CheckOutlined />{intl.locale === "zh-CN" ? '已认证' : 'certified'}</span> : <a onClick={showModalRealName}><EditOutlined />{intl.locale === "zh-CN" ? '去认证' : 'Go to the certification'}</a>}</Descriptions.Item>
              </Descriptions>
            </div>
          </TabPane>
          <TabPane tab={intl.formatMessage({
            id: 'pages.personCenter.productManage',
            defaultMessage: '产品管理',
          })} key="2">
            {
              current == 0 ?
                <div>
                  <div style={{ marginBottom: 20 }}>
                    {intl.locale === "zh-CN" ? oneStepZN : oneStepEn}
                  </div>
                  <Radio.Group onChange={getGrade}>
                    {
                      product?.length > 0 ? product.map((p) => (
                        <Radio.Button key={p.id} value={p} disabled={p.isPurchase == 1}>{p.productName}<br />
                          {intl.locale === "zh-CN" ? twoStepZN : twoStepEN}:{intl.locale === "zh-CN" ? gradeZN(p.unqiueIdentification) : p.unqiueIdentification}<br />
                          {intl.locale === "zh-CN" ? threeStepZN : threeStepEN}:{p.productPrice}</Radio.Button>
                      )) : ''
                    }
                  </Radio.Group>
                  <div style={{ marginBottom: 20, marginTop: 20 }}>{intl.locale === "zh-CN" ? fourStepZN : fourStepEN}</div>
                  <div>
                    {intl.locale === "zh-CN" ? fiveStepZN : fiveStepEN}: {money}
                  </div>
                  <div>{intl.locale === "zh-CN" ? sixStepZN : sixStepEN}</div>
                </div> :
                current == 1 ?
                  <div>
                    <Descriptions column={1} title={intl.formatMessage({
                      id: 'pages.personCenter.payInfo',
                      defaultMessage: '收款信息',
                    })}>
                      <Descriptions.Item label={intl.formatMessage({
                        id: 'pages.personCenter.usdtpaymentcode',
                        defaultMessage: 'USDT收款二维码',
                      })}> <img src={payment} width='50%' /></Descriptions.Item>
                      <Descriptions.Item label={intl.formatMessage({
                        id: 'pages.personCenter.usdtAddress',
                        defaultMessage: 'USDT钱包地址',
                      })}>0x36fd870bb2F70887819A5105828568E2C890f16E</Descriptions.Item>
                    </Descriptions>
                  </div>
                  :
                  current == 2 ?
                    //第三步

                    <div>
                      <span className={styles.imgSpan}>
                        <FormattedMessage
                          id="pages.personCenter.payment"
                          defaultMessage='付款凭证'
                        />
                        <br />
                        <span>
                          {imgUrlPay ? <img src={imgUrlPay} /> : ''}
                        </span>
                      </span>
                      <label for="inputFilePay" class="button">
                        <span className={styles.uploadBtn}>
                          <FormattedMessage
                            id="pages.personCenter.chooseFile"
                            defaultMessage="选择文件"
                          />
                        </span>
                      </label>
                      <input type="file" id="inputFilePay" style={{ display: 'none' }} onChange={getFilePay} />
                    </div> : ''
            }
            <div className="steps-action">
              {current < 3 - 1 && money != 0 && (
                <Button type="primary" onClick={() => next()}>
                  {intl.locale === "zh-CN" ? '下一步' : 'The next step'}
                </Button>
              )}
              {current === 3 - 1 && (
                <Button type="primary" onClick={payMoneyOrder}>
                  {intl.locale === "zh-CN" ? '生成订单' : ' To generate orders'}
                </Button>
              )}
              {current > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                  {intl.locale === "zh-CN" ? '上一步' : 'The previous step'}
                </Button>
              )}
            </div>
          </TabPane>
          <TabPane tab={intl.formatMessage({
            id: 'pages.personCenter.withdrawRecord',
            defaultMessage: '出金记录',
          })} key="3">
            <Table columns={columnsWithdraw} dataSource={withdraw} rowKey={(record) => record.id} pagination={false} />
            <Pagination
              style={{ marginTop: 10, float: 'right' }}
              total={withdrawData ? withdrawData.total : 0}
              showTotal={(total) => `${pageTotal} ${withdrawData?.total} ${pageItems} `}
              current={cutPage ? cutPage : 1}
              onChange={onChangeWithdraw}
              showSizeChanger={onShowSizeChangeWithdraw} />
          </TabPane>
          <TabPane tab={intl.formatMessage({
            id: 'pages.personCenter.commissionRecord',
            defaultMessage: '佣金记录',
          })} key="4">
            <Table columns={columnsCommission} dataSource={commission} rowKey={(record) => record.id} pagination={false} />
            <Pagination
              style={{ marginTop: 10, float: 'right' }}
              total={commissionData ? commissionData.total : 0}
              showTotal={(total) => `${pageTotal} ${commissionData?.total} ${pageItems} `}
              current={cutPageCommission ? cutPageCommission : 1}
              onChange={onChangeCommission}
              showSizeChanger={onShowSizeChangeCommission} />
          </TabPane>
          <TabPane tab={intl.formatMessage({
            id: 'pages.personCenter.purchaseRecords',
            defaultMessage: '购买记录',
          })} key="5">
            <Table columns={columnsPurchase} dataSource={purchase} scroll={{ x: 1900 }} rowKey={(record) => record.id} pagination={false} />
            <Pagination
              style={{ marginTop: 10, float: 'right' }}
              total={purchaseData ? purchaseData.total : 0}
              showTotal={(total) => `${pageTotal} ${purchaseData?.total} ${pageItems} `}
              current={cutPagePurchase ? cutPagePurchase : 1}
              onChange={onChangePurchase}
              showSizeChanger={onShowSizeChangePurchase} />
          </TabPane>
          <TabPane tab={intl.formatMessage({
            id: 'pages.personCenter.accoutManage',
            defaultMessage: '账户管理',
          })} key="6">
            <Form
              form={formAccout}
              name="accout"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 12,
              }}
              autoComplete="off"
            >
              <Form.Item
                label={intl.locale === "zh-CN" ? '出金账户' : 'The gold account'}
                name="accountName"
              >
                <span>
                  ({userInfo.recommendationCode ? 'GMT' + userInfo.recommendationCode : ''})
                  {intl.locale === "zh-CN" ? '可提现金额:' : 'Withdrawal amount:'}{userInfo.balance ? userInfo.balance : 0}
                </span>
              </Form.Item>
              <Form.Item
                name="cashAmount"
                label={intl.locale === "zh-CN" ? '提现金额' : 'Withdrawal amount'}
                rules={[
                  {
                    required: true,
                  }
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="usdLink"
                label={intl.locale === "zh-CN" ? 'USDT钱包地址' : 'USDT wallet address'}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="remark"
                label={intl.locale === "zh-CN" ? '备注' : 'remark'}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="operate"
                label=""
              >
                <Button style={{ marginLeft: '50%' }} onClick={balanceSubmitter}>{intl.locale === "zh-CN" ? '提交申请' : 'Submit an application'}</Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs> */}

        <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
          title={
            <FormattedMessage
              id="pages.personCenter.changePassword"
              defaultMessage="修改密码"
            />
          }>
          <Form
            form={form}
            name="changePassword"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            autoComplete="off"
          >
            <Form.Item
              label={intl.locale === "zh-CN" ? '旧密码' : 'The old password'}
              name="oldPassword"
              placeholder={intl.formatMessage({
                id: 'pages.personCenter.password.placeholder',
                defaultMessage: '请输入密码',
              })}
              rules={[
                {
                  required: true,
                },
                {
                  pattern: passwordReg,
                  message: (
                    <FormattedMessage
                      id="pages.register.password.reg"
                      defaultMessage="密码8-20位,数字,字母或字符至少两种！"
                    />
                  )
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label={intl.locale === "zh-CN" ? '新密码' : 'The new password'}
              placeholder={intl.formatMessage({
                id: 'pages.personCenter.newPassword.placeholder',
                defaultMessage: '请输入新密码',
              })}
              rules={[
                {
                  required: true,
                },
                {
                  pattern: passwordReg,
                  message: (
                    <FormattedMessage
                      id="pages.register.password.reg"
                      defaultMessage="密码8-20位,数字,字母或字符至少两种！"
                    />
                  )
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="againNewPassword"
              label={intl.locale === "zh-CN" ? '再次确认' : 'To confirm again'}
              placeholder={intl.formatMessage({
                id: 'pages.personCenter.againNewPassword.placeholder',
                defaultMessage: '请再次输入新密码',
              })}
              rules={[
                {
                  required: true,
                },
                {
                  pattern: passwordReg,
                  message: (
                    <FormattedMessage
                      id="pages.register.password.reg"
                      defaultMessage="密码8-20位,数字,字母或字符至少两种！"
                    />
                  )
                }
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        <Modal visible={isModalRealNameVisible} onOk={handleOkRealName} onCancel={handleCancelRealName}
          title={
            <FormattedMessage
              id="pages.personCenter.realNameInfo"
              defaultMessage="实名信息认证"
            />
          }>
          <Form
            form={formRealName}
            name="realNameInfo"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            autoComplete="off"
          >
            {approve == 0 ?
              <div>
                <Form.Item
                  label={intl.locale === "zh-CN" ? '所属会员' : 'Its member'}
                  name="vipName"
                >
                  <span>{userInfo.recommendationCode}({userInfo.userName ? userInfo.userName : userInfo.iphoneNumber ? userInfo.iphoneNumber : userInfo.emailAdress ? userInfo.emailAdress : ''})</span>
                </Form.Item>
                <Form.Item
                  name="realName"
                  label={intl.locale === "zh-CN" ? '姓名' : 'The name'}
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="cardNo"
                  label={intl.locale === "zh-CN" ? '身份证号' : 'Id number'}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="country"
                  label={intl.locale === "zh-CN" ? '国家' : 'country'}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    showSearch
                    onSelect={setCountryId}
                    placeholder={intl.locale === "zh-CN" ? '输入国家' : 'input country'}>
                    {countryState.length > 0 ? countryState.map((code, index) => (
                      <Option key={index} id={code.id} value={intl.locale === "zh-CN" ? code.countryChinese : code.countryEnglish}>
                        {intl.locale === "zh-CN" ? code.countryChinese : code.countryEnglish}
                      </Option>
                    )) : ''}
                  </Select>
                </Form.Item>
                <div className={styles.upContent}>
                  <div>
                    <span className={styles.imgSpan}>
                      <FormattedMessage
                        id="pages.personCenter.cardFront"
                        defaultMessage="身份证正面"
                      />
                      <br />
                      <span>
                        {imgUrl ? <img src={imgUrl} /> : ''}
                      </span>
                    </span>
                    <label for="inputFile" class="button">
                      <span className={styles.uploadBtn}>
                        <FormattedMessage
                          id="pages.personCenter.chooseFile"
                          defaultMessage="选择文件"
                        />
                      </span>
                    </label>
                    <input type="file" id="inputFile" style={{ display: 'none' }} onChange={getFile}></input>
                  </div>
                  <div>
                    <span className={styles.imgSpan}>
                      <FormattedMessage
                        id="pages.personCenter.cardReverse"
                        defaultMessage="身份证反面"
                      />
                      <br />
                      <span>
                        {imgUrlOther ? <img src={imgUrlOther} /> : ""}
                      </span>
                    </span>
                    <label for="inputFile1" class="button">
                      <span className={styles.uploadBtn}>
                        <FormattedMessage
                          id="pages.personCenter.chooseFile"
                          defaultMessage="选择文件"
                        />
                      </span>
                    </label>
                    <input type="file" id="inputFile1" style={{ display: 'none' }} onChange={getFileOther}></input>
                  </div>
                </div>
              </div> :
              approve == 1 ?
                <div>
                  <Form.Item
                    name="uuidPay"
                    label={intl.locale === "zh-CN" ? 'USDT钱包地址' : 'USDT wallet address'}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <div className={styles.payCode}>
                    <span className={styles.imgSpan}>
                      <FormattedMessage
                        id="pages.personCenter.payCode"
                        defaultMessage="付款码"
                      />
                      <br />
                      <span>
                        {imgUrlPayment ? <img src={imgUrlPayment} /> : ''}
                      </span>
                    </span>
                    <label for="inputFilePayment" class="button">
                      <span className={styles.uploadBtn}>
                        <FormattedMessage
                          id="pages.personCenter.chooseFile"
                          defaultMessage="选择文件"
                        />
                      </span>
                    </label>
                    <input type="file" id="inputFilePayment" style={{ display: 'none' }} onChange={getFilePayment}></input>
                  </div>
                </div> : ''}
          </Form>
        </Modal>

        <Modal visible={isModalInfoVisible} onOk={handleOkInfo} onCancel={handleCancelInfo}
          title={intl.locale === "zh-CN" ? '信息修改' : 'Modify the information'}>
          <Form
            form={formInfo}
            name="Info"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            autoComplete="off"
          >
            <Form.Item
              label={infoType}
              name="infoName"
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageContainer >
  )
};

export default PersonCenter;
