import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { EditBadgeForm } from './EditBadgeForm';
 
function ListBadges() {
  const [badges, setBadges] = useState([]);

  const deleteBadge = async id => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/badges/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBadges(badges.filter(badge => badge.id !== id));
        message.success('Badge deleted successfully!');
      } else {
        message.error('Failed to delete badge');
      }
    } catch (err) {
      message.error('An error occurred');
    }
  };

 const getBadges = async () => {
 
  try {
      const response = await fetch(`${process.env.REACT_APP_URL}/badges`);

      if (response.ok) {
        const jsonData = await response.json();
        setBadges(jsonData);
      } else {
        message.error('Failed to get badges');
      }
    } catch (err) {
      message.error('A server error occurred');
    }
};

  useEffect(() => {
    getBadges();
  }, []);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Badge Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, badge) => (
        <>
          <EditBadgeForm badge={badge} />
          <Popconfirm
            title="Are you sure to delete this badge?"
            onConfirm={() => deleteBadge(badge.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" style={{ marginLeft: 8 }} danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <h5 style={{ textAlign: 'center', marginTop: '2rem' }}>Badges List</h5>
      <Table
        columns={columns}
        dataSource={badges}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </>
  );
}

export default ListBadges;