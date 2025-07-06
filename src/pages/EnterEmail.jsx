import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordApi } from "../api/userApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const EnterEmail = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    try {
        await forgotPasswordApi({email: email});
    }catch(err){
        console.log(err);
    }
  }

  return (
    <div className="w-1/2 flex flex-col items-center justify-center gap-3 ">
      <div className="uppercase text-3xl font-extrabold text-white">
        NHẬP EMAIL CỦA BẠN
      </div>
      {/* Bọc các input trong form để hỗ trợ submit bằng Enter */}
      <div className="w-full flex flex-col gap-3">
        <input
          type="email"
          placeholder="Mật khẩu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-200 w-full h-10 rounded-3xl p-3 outline-none gap-2"
        />
        <div className="flex items-center gap-2">
          <Link className="text-white bg-sky-500 p-2 rounded-3xl" to={"/login"}>
            <ArrowBackIcon />
          </Link>
          <button
            onClick={handleSubmit}
            className="bg-sky-500 w-full h-10 rounded-3xl text-white font-bold"
          >
            Gửi thông tin
          </button>
        </div>
      </div>
    </div>
  );
};
