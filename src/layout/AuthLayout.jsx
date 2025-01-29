import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="w-1/2 flex justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
