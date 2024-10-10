import AddBadgeForm from './components/AddBadgeForm';
import ListBadges from './components/ListBadges';

import { Layout } from 'antd';
const { Content } = Layout;

function App() {
  return (
    
    <Content style={{ padding: '0 150px', background: 'white' }} >
      <AddBadgeForm />
      <ListBadges />
    </Content>
  );
}

export default App;
