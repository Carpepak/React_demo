import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from "react";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  //let readed file become DataURL, use this img embedded the web,and store into the Obj.result
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  //nice judge
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 8;
  if (!isLt2M) {
    message.error('Image must smaller than 8MB!');
  }
  return isJpgOrPng && isLt2M;
}

const MyUpload = ({imageUrl, setImgUrl}) => {
  const [loading, setLoading] = useState(false);

  const handleChange = info => {
    
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      let url = info.file.xhr.response;
      url = url.split('"');
      url=url[1];
      setImgUrl(url);
      getBase64(info.file.originFileObj, imageUrl => {
        setLoading(false);
      }
      );
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="http://localhost:4000/upload"
      beforeUpload={beforeUpload}
      onChange={handleChange}
      
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
}

export default MyUpload;