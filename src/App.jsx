import React from 'react';
import { Layout } from 'antd';
import FamilyTree from './components/FamilyTree';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Header style={{ background: '#fff', padding: '0 20px' }}>
        <h1 style={{ margin: 0 }}>家族谱系</h1>
      </Header>
      <Content style={{ padding: '20px', minHeight: 'calc(100vh - 64px)' }}>
        <FamilyTree />
      </Content>
    </Layout>
  );
}

export default App;