import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { EditBadgeForm } from './EditBadgeForm';

function ListBadges() {
  const [badges, setBadges] = useState([]);
  const [sortOrder, setSortOrder] = useState('default'); // default, asc, desc

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

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => {
      if (prevOrder === 'default') return 'asc'; // Ascending (Oldest)
      if (prevOrder === 'asc') return 'desc';   // Descending (Most Recent)
      return 'default';                         // Back to default
    });
  };

  // Sort the badges based on sortOrder
  const sortedBadges = [...badges].sort((a, b) => {
    if (sortOrder === 'default') return 0;
    const dateA = new Date(a.modified_date || 0);
    const dateB = new Date(b.modified_date || 0);
    if (sortOrder === 'asc') return dateA - dateB; // Oldest first
    if (sortOrder === 'desc') return dateB - dateA; // Most recent first
    return 0;
  });

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
      title: (
        <>
          Last Modified{' '}
          <Button onClick={toggleSortOrder} type="link">
            {sortOrder === 'default' && '↕'}
            {sortOrder === 'asc' && '↓'}
            {sortOrder === 'desc' && '↑'}
          </Button>
        </>
      ),
      dataIndex: 'modified_date',
      key: 'modified_date',
      render: (text) => (text ? new Date(text).toLocaleString() : '-'),
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
        dataSource={sortedBadges}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </>
  );
}

export default ListBadges;
