import React from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const AuthPage = () => {
  const location = useLocation();
  const isRegister = location.pathname === "/register";

  return isRegister ? <RegisterForm /> : <LoginForm />;
};

export default AuthPage;
