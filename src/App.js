import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './component/Navbar/Navbar';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme } from './Theme/DarkTheme';
import Login from './component/Login/Login';
import UserStatement from './component/UserStatement/UserStatement';
import UserDashboard from './component/UserDashboard/UserDashboard';
import SignUp from './component/SignUp/SignUp';
import Admin from './component/AdminDashboard/Admin';
import NotVerified from './component/NotVerified/NotVerified';
import UserProfile from './component/UserProfile/UserProfile';

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/user' element={<UserDashboard />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='/adminDashboard' element={<Admin />} />
          <Route path="/user-profile" element={<UserProfile />} /> {/* This line was incorrect */}
          <Route path="/notVerified" element={<NotVerified />} />
          <Route path="/statement/:username" element={<UserStatement />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;