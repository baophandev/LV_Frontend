import { Outlet } from "react-router-dom";
import background from "../assets/Header.png";

const AuthLayout = () => {
  return (
    <div
      className="w-full flex justify-center items-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-1/2 flex justify-center items-center">
        <Outlet />
      </div>
      <div className="w-1/2 min-h-screen items-center flex">
        <div className="uppercase text-3xl text-white font-bold drop-shadow-lg ">
          <span className="bg-sky-400">Comforty</span>
          <br />
          <span className="bg-sky-400 mt-3 inline-block">
            Nội thất hàng đầu Việt Nam...
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
