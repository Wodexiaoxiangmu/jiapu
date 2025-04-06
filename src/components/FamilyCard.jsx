import React, { useState } from 'react';
import { Card, Button, Modal, Form, Input, Space, Upload, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

const FamilyCard = ({ member, onEdit, onDelete, onAddChild }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    form.setFieldsValue(member);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onEdit({ ...member, ...values });
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div className="family-card">
      <Card
        title={member.name}
        cover={member.imageUrl && <img alt={member.name} src={member.imageUrl} style={{ height: 200, objectFit: 'cover' }} />}
        extra={
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={handleEdit}
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(member.id)}
              danger
            />
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={() => onAddChild(member.id)}
            />

          </Space>
        }
      >
        <p><strong>联系方式：</strong>{member.contact}</p>
        <p><strong>附加信息：</strong>{member.additionalInfo}</p>
      </Card>

      <Modal
        title="编辑成员信息"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={member}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contact"
            label="联系方式"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="additionalInfo"
            label="附加信息"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="imageUrl"
            label="照片"
          >
            <Upload
              maxCount={1}
              listType="picture-card"
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  form.setFieldValue('imageUrl', reader.result);
                };
                return false;
              }}
            >
              {form.getFieldValue('imageUrl') ? (
                <img
                  src={form.getFieldValue('imageUrl')}
                  alt="avatar"
                  style={{ width: '100%' }}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传照片</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FamilyCard;