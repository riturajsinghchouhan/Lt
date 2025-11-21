import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'; 

function Auth()
{
    const navigate = useNavigate();

    useEffect(()=>{
     var path=window.location.pathname;
     if(path==="/admin"|| path==="/about"|| path==="/login"|| path==="/Register"|| path==="/add-category"|| path==="/add-subcategory"|| path==="/logout"|| path==="/orders"|| path==="/payment"|| path==="/manage-orders"|| path==="/manage-users"|| path==="/contact"|| path==="/category/:catnm")
     {
      if(!localStorage.getItem("token") || localStorage.getItem("role")!="admin")  //ye true jb dega jb token set nahi hoga 
        navigate("/logout")
     }
     else if(path=="/")
     {
      if(!localStorage.getItem("token") || localStorage.getItem("role")!="user")   
        navigate("/logout");
     }
     else
     {
        if(localStorage.getItem("role")=="admin")            
            navigate("/admin");
        else if(localStorage.getItem("role")=="user")
            navigate("/");
        else
            navigate("/");    
     }
    },[]);
    
    return(
        <></>
    )
}

export default Auth