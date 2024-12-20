import Header from "../components/header";
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
      <>
        <Header></Header>
        <div className="w-full flex flex-col justify-center items-center mt-24 mb-5">
          <Outlet />
        </div>
        <Footer></Footer>
      </>
    );
}
 
export default MainLayout;