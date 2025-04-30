import { Link } from "react-router";
import vnpayLogo from "../assets/vnpay.png";
import { useEffect, useState } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router";

export const VNPaySuccesss = () => {
  // const navigate = useNavigate();
  const [userData, setUserData] = useState();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const userResponse = await api.get("/phone/user/myInfo");
  //       setUserData(userResponse.data);
  //       console.log(userData);
  //     } catch (userError) {
  //       console.log("Lỗi dữ liệu người dùng:", userError);
  //     }
  //   };
  //   fetchUser();
  // }, []);

  const handlePlaceOrder = async () => {
    if (userData) {
      const selectedAddress = JSON.parse(localStorage.getItem("address"));
    
      const mapItemIds = JSON.parse(localStorage.getItem("items"));
      const mapItemIdsArray = Array.isArray(mapItemIds) ? mapItemIds : [mapItemIds];


      const notes = localStorage.getItem("note");
      let reqBody = {
        addressId: selectedAddress.id,
        note: notes,
        method: "BANKING",
        itemId: mapItemIdsArray,
      };
      console.log(reqBody);
      try {
        // const response = await api.post(`/phone/order/${userData.id}`, reqBody);
        localStorage.removeItem('address')
        localStorage.removeItem('notes')
        localStorage.removeItem('items')
      } catch (e) {
        console.log("Lỗi đặt hàng. Vui lòng thử lại sau." + e);
      }
    }
  };

  useEffect(() => {
    handlePlaceOrder()
  }, [userData])

  return (
    <div className="w-full h-screen items-center justify-center up flex flex-col gap-2 bg-white">
      <img src={vnpayLogo} alt="" />
      <span className="inline-block text-2xl text-green-400 font-semibold">
        THANH TOÁN THÀNH CÔNG
      </span>
      <span className="inline-block font-semibold text-slate-600">
        NEXOR Chân thành cảm ơn quý khách!
      </span>
      <Link className="text-blue-400 underline" to={'/user'}>
        {" "}
        Xem đơn hàng
      </Link>
    </div>
  );
};
