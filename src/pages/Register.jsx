import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../api/authApi";

export const Register = () => {
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    password: "",
    repeatPassword: "",
    phoneNumber: "",
    dob: "",
    avatar: null,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setUserData({
      ...userData,
      [name]: type === "file" ? files[0] : value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    Object.keys(userData).forEach((key) => {
      if (!userData[key] && key !== "avatar") {
        newErrors[key] = "Trường này không được để trống";
      }
    });

    if (userData.password !== userData.repeatPassword) {
      newErrors.repeatPassword = "Mật khẩu không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append(
      "user",
      new Blob(
        [
          JSON.stringify({
            displayName: userData.displayName,
            email: userData.email,
            password: userData.password,
            phoneNumber: userData.phoneNumber,
            dob: userData.dob,
          }),
        ],
        { type: "application/json" }
      )
    );

    formData.append(
      "avatar",
      userData.avatar || new Blob([], { type: "application/octet-stream" })
    );

    try {
      const response = await registerApi(formData);
      console.log(response);
      setSuccessMessage("Tạo tài khoản thành công!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-1/2 flex flex-col items-center justify-center gap-3">
      <div className="uppercase text-3xl font-extrabold text-white">
        ĐĂNG KÝ
      </div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
        <input
          type="text"
          name="displayName"
          placeholder="Họ và tên"
          className="bg-gray-200 w-full h-10 rounded-3xl p-3 outline-none"
          value={userData.displayName}
          onChange={handleChange}
        />
        {errors.displayName && (
          <span className="text-red-500">{errors.displayName}</span>
        )}
        <input
          type="text"
          name="phoneNumber"
          placeholder="Số điện thoại"
          className="bg-gray-200 w-full h-10 rounded-3xl p-3 outline-none"
          value={userData.phoneNumber}
          onChange={handleChange}
        />
        {errors.phoneNumber && (
          <span className="text-red-500">{errors.phoneNumber}</span>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="bg-gray-200 w-full h-10 rounded-3xl p-3 outline-none"
          value={userData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="text-red-500">{errors.email}</span>}
        <input
          type="date"
          name="dob"
          placeholder="Ngày sinh"
          className="bg-gray-200 w-full h-10 rounded-3xl p-3 outline-none"
          value={userData.dob}
          onChange={handleChange}
        />
        {errors.dob && <span className="text-red-500">{errors.dob}</span>}
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          className="bg-gray-200 w-full h-10 rounded-3xl p-3 outline-none"
          value={userData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password}</span>
        )}
        <input
          type="password"
          name="repeatPassword"
          placeholder="Nhập lại mật khẩu"
          className="bg-gray-200 w-full h-10 rounded-3xl p-3 outline-none"
          value={userData.repeatPassword}
          onChange={handleChange}
        />
        {errors.repeatPassword && (
          <span className="text-red-500">{errors.repeatPassword}</span>
        )}
        <input
          type="file"
          name="avatar"
          accept="image/*"
          className="w-full"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-sky-500 w-full h-10 rounded-3xl text-white font-bold"
        >
          Tạo tài khoản
        </button>
      </form>
      <Link to="/login" className="text-sky-500">
        Đăng nhập
      </Link>
      {successMessage && (
        <span className="text-green-500">{successMessage}</span>
      )}
    </div>
  );
};
