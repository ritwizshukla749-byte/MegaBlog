import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { Outlet } from "react-router-dom";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        dispatch(logout());
      });
  }, [dispatch]);

  
    return (
      <div
        className="min-h-screen flex flex-wrap
    content-between bg-gray-400 "
      >
        <div className="w-full block">
          <Header />
          <main>
            
            <Outlet /> 

          </main>
          <Footer />
        </div>
      </div>
    );
  
}

export default App;
