import { Outlet } from "react-router-dom";
import loginPage from "../assets/loginPage.png"

const AuthLayout = () => {
  return (
    <div
      className="w-full flex justify-center items-center"
      style={{
        backgroundImage: `url(${loginPage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-1/2 flex justify-center items-center">
        <Outlet />
      </div>
      <div className="w-1/2 min-h-screen items-center flex">
        <div className="uppercase text-3xl text-white font-bold drop-shadow-lg ">
          <span className="bg-sky-400">NEXOR</span>
          <br />
          <span className="bg-sky-400 mt-3 inline-block">
            CÔNG NGHỆ TRONG TAY BẠN...
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
