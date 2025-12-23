import './App.css';
import { Route, Routes } from 'react-router-dom';
import Banner from './Componets/BannerComponets/Banner';
import Nav from './Componets/NavComponets/Nav';
import Menu from './Componets/MenuComponets/Menu';
import About from './Componets/AboutComponets/About';
import Contact from './Componets/ContactUsComponents/Contact';
import Footer from './Componets/FooterComponets/Footer';
import Login from './Componets/LoginComponets/login';
import Register from './Componets/RegistrationComponets/Register';
import Regular from './Componets/RegularCakecomponent/Recake';
import Open from './Componets/OpenComponest/Open';
import AddCategory from './Componets/AddCategoryComponent/AddCategory';
import AddSubCategory from './Componets/AddSubCategoryComponent/AddSubCategory';
import ManageUsers from './Componets/ManageUserComponent/ManageUser';
import AdminHome from './Componets/AdminHomeComponent/AdminHome';
import Logout from './Componets/LogoutComponent/Logout';
import PaymentGateway from './Componets/PaymentOption/PaymentOption';
import ManageOrders from './Componets/ManageOders/ManageOders';
import ManageAds from './Componets/MangeADs/ManageAds';
import ManageContacts from './Componets/ManageContacts/ManageContacts';
import MyOrders from './Componets/MyOrders/MyOrders';
import AdsCarousel from './Componets/AdsDisplay/AdsCarousel';
import CustomCake from './Componets/CustomCakeComp/CustomCake';
import ReviewOrder from './Componets/ReviewOrderComp/ReviewOrder';
import DistanceChecker from './Componets/DistanceChecker/DistanceChecker';
import AdminCustomOrders from './Componets/AdminCustomOrders/AdminCustomOrders';
import UserCustomOrders from './Componets/UserCustomOrComp/UserCustomOrders';
import AddToCart from './Componets/AddToCart/AddToCart';
function App(){
  return (
    <>
      <Nav />
      <Banner />
      <Routes>
        <Route path='/' element={<><Menu /><AdsCarousel /></>} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/admin/manage-ads' element={<ManageAds />} />
        <Route path='/cart' element={<AddToCart/>}/>
        <Route path='/product' element={<Open />} />
        <Route path='/category/:catnm' element={<Regular />} />
        <Route path='/add-category' element={<AddCategory />} />
        <Route path='/add-subcategory' element={<AddSubCategory />} />
        <Route path='/manage-users' element={<ManageUsers />} />
        <Route path='/admin' element={<AdminHome />} />
        <Route path='/adminhome' element={<AdminHome />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/payment' element={<PaymentGateway />} />
        <Route path='/manage-oders' element={<ManageOrders />} />
        <Route path='/admin/contacts' element={<ManageContacts />} />
        <Route path='/orders' element={<MyOrders />} />
        <Route path='/customcake' element={<CustomCake />} />
        <Route path='/review' element={<ReviewOrder />} />
        <Route path='/all_custom_oders' element={<AdminCustomOrders />} />
        <Route path='/my-custom-orders' element={<UserCustomOrders />} />
        {/* ✅ New Route for Distance Checker */}
        <Route path='/distance-check' element={<DistanceChecker />} />
      </Routes>
      <Footer />
    </>
  );
}
export default App;
