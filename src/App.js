import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDescription from './pages/ProductDescription';
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "./store";
import { useSelector } from "react-redux"
import { useEffect } from "react";

import Upload from './pages/Upload';
import EmailVerify from './components/emailverify'
import Editprofile from './pages/editprofile';
import Profile from './pages/Profile';
import ProductList from './pages/ProductList';
import AllUsers from './pages/AllUsers';
import SuspendAccount from './pages/SuspendAccount';
import MyAuctions from './pages/MyAuctions';
import AllChats from './pages/AllChats';
import AdminHome from './pages/AdminHome';
import Chat from './pages/Chat';


function App() {

  const dispath = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  useEffect(() => {
    if (localStorage.getItem("userId")) {
      dispath(authActions.login())
    }
  }, [])

  return (
    <>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/products/:category' element={<ProductList/>} />
        {/* <Route path='/login' element={<Login />} /> */}
        <Route path='/login' element={!isLoggedIn ? (
          <Login />
        ) : (
          <Navigate replace to={"/"} />
        )} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/product/:id' element={<ProductDescription />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/editProfile' element={<Editprofile/>} />
        <Route path='/myauctions' element={<MyAuctions/>} />
        <Route path='/viewprofile/:id' element={<Profile/>} />
        <Route path='/admin/allusers' element={<AllUsers/>} />
        <Route path='/admin' element={<AdminHome/>} />
        <Route path='/suspendaccount/:id' element={<SuspendAccount/>} />
        <Route path='/allchats/:id' element={<AllChats/>} />
        <Route path='/users/:id/verify/:token' element={<EmailVerify />} />
        <Route path='/allchats/:id/chat/:id' element={<Chat/>} />
      </Routes>

    </>
  );
}

export default App;
