import { Form, Upload, message, Button, Icon } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const ossPath = 'https://gmtpro-pictrue.oss-cn-hongkong.aliyuncs.com/';
class AliyunOSSUpload extends React.Component {
    constructor(props) {
        super(props)
        this.getFile = this.getFile.bind(this)
    }
    state = {
        OSSData: {},
        fileList: []
    };

    async componentDidMount() {
        await this.init();
    }

    init = async () => {
        try {
            const OSSData = await this.mockGetOSSData();
            this.setState({
                OSSData,
            });
        } catch (error) {
            message.error(error);
        }
    };

    // Mock get OSS api
    // https://help.aliyun.com/document_detail/31988.html
    mockGetOSSData = () => ({
        dir: 'identity_card/',
        expire: '1577811661',
        region: 'oss-cn-hongkong',
        accessKeyId: 'LTAI5tGL6NvqBXzsSgUNvyBL',
        accessKeySecret: 'RtQIYf8iO6XDJ4uYV3xPpHq9jnYn6F',
        bucket: 'gmtpro-pictrue'
    });


    onChange = ({ fileList }) => {
        const { onChange } = this.props;
        console.log('Aliyun OSS:', fileList);
        fileList.filter(v => {
            console.log(client.signatureUrl(v.url))
            v.url = ossPath + v.url
        });
        this.setState({
            fileList: fileList
        })
        if (onChange) {
            onChange([...fileList]);
        }
    };

    onRemove = (file) => {
        const { value, onChange } = this.props;
        const files = this.state.fileList.filter(v => v.url !== file.url);
        if (onChange) {
            onChange(files);
        }
    };

    getExtraData = file => {
        const { OSSData } = this.state;

        return {
            key: file.url,
            region: OSSData.region,
            accessKeyId: OSSData.accessKeyId,
            accessKeySecret: OSSData.accessKeySecret,
            bucket: OSSData.bucket
        };
    };


    getFile = e => {
        let upurl = "identity_card/" + e.target.files[0].name;
        client.multipartUpload(upurl, e.target.files[0]).then(function (result) {
            console.log(result);
            console.log(client.signatureUrl(upurl))
        }).catch(function (err) {
            console.log(err);
        });
    };
    beforeUpload = async file => {
        const { OSSData } = this.state;
        const expire = OSSData.expire * 1000;

        if (expire < Date.now()) {
            await this.init();
        }
        const suffix = file.name.slice(file.name.lastIndexOf('.'));
        const filename = Date.now() + suffix;
        file.url = OSSData.dir + file.name;
        return file;
    };


    render() {
        const { value } = this.props;
        const props = {
            name: 'file',
            fileList: value,
            listType: 'picture-card',
            action: this.state.OSSData.host,
            onChange: this.onChange,
            onRemove: this.onRemove,
            data: this.getExtraData,
            beforeUpload: this.beforeUpload,
        };

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            // <Upload {...props}>
            //     {uploadButton}
            // </Upload>
            <input onChange={this.getFile} type='file' />
        );
    }
}

export default AliyunOSSUpload;