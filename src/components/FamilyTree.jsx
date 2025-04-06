import React, { useState, useEffect } from 'react';
import { Button, Row, Col, message } from 'antd';
import axios from 'axios';
import FamilyCard from './FamilyCard';
import './FamilyTree.css';

const API_URL = 'http://localhost:5000/api';

const FamilyTree = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${API_URL}/members`);
      setMembers(response.data);
    } catch (error) {
      message.error('获取家族成员失败');
    }
  };

  const findParent = (memberId, memberList) => {
    for (const member of memberList) {
      if (member.children?.some(child => child.id === memberId)) {
        return member;
      }
      if (member.children?.length) {
        const parent = findParent(memberId, member.children);
        if (parent) return parent;
      }
    }
    return null;
  };

  const handleAddRoot = async () => {
    const newMember = {
      name: '新成员',
      contact: '',
      additionalInfo: '',
      children: []
    };
    try {
      const response = await axios.post(`${API_URL}/members`, newMember);
      setMembers([...members, response.data]);
      message.success('添加成功');
    } catch (error) {
      message.error('添加失败');
  };

  const handleEdit = async (updatedMember) => {
    try {
      await axios.put(`${API_URL}/members/${updatedMember._id}`, updatedMember);
      const updateMemberTree = (memberList) => {
        return memberList.map(member => {
          if (member._id === updatedMember._id) {
            return { ...member, ...updatedMember };
          }
          if (member.children?.length) {
            return { ...member, children: updateMemberTree(member.children) };
          }
          return member;
        });
      };
      setMembers(updateMemberTree(members));
      message.success('更新成功');
    } catch (error) {
      message.error('更新失败');
  };

  const handleDelete = async (memberId) => {
    try {
      await axios.delete(`${API_URL}/members/${memberId}`);
      const deleteMemberFromTree = (memberList) => {
        return memberList.filter(member => {
          if (member._id === memberId) {
            return false;
          }
          if (member.children?.length) {
            member.children = deleteMemberFromTree(member.children);
          }
          return true;
        });
      };
      setMembers(deleteMemberFromTree(members));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
  };

  const handleAddChild = async (parentId) => {
    const newMember = {
      name: '新成员',
      contact: '',
      additionalInfo: '',
      children: []
    };
    try {
      const response = await axios.post(`${API_URL}/members`, newMember);
      const childMember = response.data;

      const parent = await axios.get(`${API_URL}/members/${parentId}`);
      if (parent.data) {
        const updatedParent = {
          ...parent.data,
          children: [...(parent.data.children || []), childMember._id]
        };
        await axios.put(`${API_URL}/members/${parentId}`, updatedParent);
        await fetchMembers();
        message.success('添加子成员成功');
      }
    } catch (error) {
      message.error('添加子成员失败');
  };

  

  const renderFamilyTree = (memberList) => {
    return memberList.map(member => (
      <div key={member.id} className="tree-node">
        <div className="card-wrapper">
          <FamilyCard
            member={member}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddChild={handleAddChild}

          />
        </div>
        {member.children?.length > 0 && (
          <div className="children-container">
            {renderFamilyTree(member.children)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="family-tree">
      <Row justify="center" style={{ marginBottom: 20 }}>
        <Col>
          <Button type="primary" onClick={handleAddRoot}>
            添加家族成员
          </Button>
        </Col>
      </Row>
      {renderFamilyTree(members)}
    </div>
  );
};

export default FamilyTree;