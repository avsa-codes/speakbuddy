import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfileSetupPage from './pages/ProfileSetupPage/ProfileSetupPage';
import HomePage from './pages/HomePage/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import GroupsPage from './pages/GroupsPage/GroupsPage';
import './socket/socket';
import ConversationPage from './pages/Conversation/ConversationPage';


function App() {


  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/setup-profile" element={<ProfileSetupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/conversation" element={<ConversationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
