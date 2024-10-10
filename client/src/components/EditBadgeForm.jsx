import React, { useState } from 'react';
import { Modal, Button, Form, Input, message, Typography } from 'antd';

const { Text } = Typography;

export function EditBadgeForm({ badge }) {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => setVisible(false);
  const handleShow = () => {
    setVisible(true);
    form.setFieldsValue({
      title: badge.title,
      description: badge.description
    });
  };

  const handleTitleChange = (e) => {
    const value = e.target.value.slice(0, 100);
    form.setFieldsValue({ title: value });
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value.slice(0, 300);
    form.setFieldsValue({ description: value });
  };

  const updateBadge = async () => {
    try {
      const values = await form.validateFields();
      const trimmedTitle = values.title.trim().replace(/\s+/g, ' ');
      const body = { ...values, title: trimmedTitle };

      console.log('Sending to backend:', body);

      const response = await fetch(`${process.env.REACT_APP_URL}/badges/${badge.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        message.success('Badge updated successfully!');
        setVisible(false);
        window.location = "/";
      } else if (response.status === 409) {
        form.setFields([
          {
            name: 'title',
            errors: ['This badge title already exists. Please choose a different title.']
          }
        ]);
      } else {
        message.error('Failed to update badge');
      }
    } catch (err) {
      console.error(err.message);
      message.error('An error occurred');
    }
  };

  return (
    <>
      <Button type="default" onClick={handleShow}>
        Edit
      </Button>

      <Modal
        title="Edit Badge"
        open={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={updateBadge}>
            Edit
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: 'Please enter the badge title' },
              { max: 100, message: 'Title cannot be longer than 100 characters' },
              { whitespace: true, message: 'Title cannot be empty or just whitespace' }
            ]}
          >
            <Input
              onChange={handleTitleChange}
              placeholder="Enter badge title"
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Please enter a description' },
              { min: 3, message: 'Description must be at least 3 characters' },
              { max: 300, message: 'Description cannot be longer than 300 characters' },
              { whitespace: true, message: 'Description cannot be empty or just whitespace' }
            ]}
          >
            <Input.TextArea
              onChange={handleDescriptionChange}
              placeholder="Enter badge description"
              rows={4}
              maxLength={300}
              showCount={{
                formatter: ({ count, maxLength }) => (
                  <Text type={count < 3 ? 'danger' : undefined}>
                    {count}/{maxLength}
                  </Text>
                )
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}