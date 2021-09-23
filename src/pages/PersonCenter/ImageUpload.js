import OSS from 'ali-oss';
import React, { useState } from 'react';
import { Upload, Icon, Spin } from 'antd';

const cdnPath = '你的cdn地址';

const ImageUpload = props => {

    // 上一个组件传来的修改资源URL的函数，可用于展示远程的资源
    const [show, changeShow] = useState(false);

    const fileList = [];
    const client = self => {
        return new OSS({
            region: 'oss-cn-hongkong',
            accessKeyId: 'LTAI5tGL6NvqBXzsSgUNvyBL',
            accessKeySecret: 'RtQIYf8iO6XDJ4uYV3xPpHq9jnYn6F',
            bucket: 'gmtpro-pictrue',
        });
    };

    const uploadPath = (path, file) => {
        // return `${path}/${file.name.split('.')[0]}-${file.uid}.${file.type.split('/')[1]}`
        return `${path}/identity_card/`
    };

    const UploadToOss = (self, path, file) => {
        const url = uploadPath(path, file);
        return new Promise((resolve, reject) => {
            client(self)
                .multipartUpload(url, file)
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };

    const beforeUpload = file => {
        changeShow(true);
        const floder = 'identity_card';
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            UploadToOss(this, floder, file)
                .then(data => {
                    changeShow(false);
                    return data;
                })
                .then(data => {

                });
        };

        return false;
    };

    const uploadProps = {
        beforeUpload: beforeUpload,
        fileList: fileList,
        accept: 'image/*',
        listType: 'picture-card',
    };

    const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    return (
        <div>
            {show === true ? (
                <Spin style={{ position: 'relative', left: '40px' }} />
            ) : (
                <Upload {...uploadProps}>{uploadButton}</Upload>
            )}
            <br />
        </div>
    );
};

export default ImageUpload;