import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './utils/authGuard';
import Navbar from './components/Navbar/Navbar';

// Lazy-load pages
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const ItemDetails = lazy(() => import('./pages/ItemDetails/ItemDetails'));
const PostItem = lazy(() => import('./pages/PostItem/PostItem'));
const MyActivity = lazy(() => import('./pages/MyActivity/MyActivity'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Chat = lazy(() => import('./pages/Chat/Chat'));
const Notifications = lazy(() => import('./pages/Notifications/Notifications'));

// Full-screen loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-textMuted font-body text-sm">Loading...</p>
    </div>
  </div>
);

const PROTECTED = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/item/:id', element: <ItemDetails /> },
  { path: '/post', element: <PostItem /> },
  { path: '/activity', element: <MyActivity /> },
  { path: '/profile', element: <Profile /> },
  { path: '/chat', element: <Chat /> },
  { path: '/notifications', element: <Notifications /> },
];

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            {PROTECTED.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<AuthGuard>{element}</AuthGuard>}
              />
            ))}

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
