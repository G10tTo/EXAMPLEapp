import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Typography } from 'antd';

const { Text } = Typography;

function AddBadgeForm() {
  const [form] = Form.useForm();

  const onFinish = async values => {
    // Trim leading/trailing spaces and reduce multiple spaces to single space
    const trimmedTitle = values.title.trim().replace(/\s+/g, ' ');
    const formData = {
      ...values,
      title: trimmedTitle,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/badges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location = "/";
        message.success('Badge added successfully!');
      } else if (response.status === 409) {
        // Handle conflict (title already exists)
        form.setFields([
          {
            name: 'title',
            errors: ['This badge title already exists. Please choose a different title.']
          }
        ]);
      } else {
        message.error('Failed to add badge');
      }
    } catch (err) {
      console.error(err.message);
      message.error('A server error occurred');
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value.slice(0, 100);
    form.setFieldsValue({ title: value });
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value.slice(0, 300);
    form.setFieldsValue({ description: value });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>Badges</h1>
      
      <Form.Item
        label="Badge Title"
        name="title"
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
        label="Description"
        name="description"
        rules={[
          { required: true, message: 'Please enter a description' },
          { min: 3, message: 'Description must be at least 3 characters' },
          { max: 300, message: 'Description cannot be longer than 300 characters' },
          { whitespace: true, message: 'Description cannot be empty or just whitespace' }
        ]}
      >
        <Input.TextArea
          rows={4}
          onChange={handleDescriptionChange}
          placeholder="Enter badge description"
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

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Add Badge
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AddBadgeForm;