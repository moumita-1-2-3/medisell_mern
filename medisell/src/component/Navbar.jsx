// import React from 'react'
// import '../style/navbar.css'
// import Button from '@mui/material/Button';
// import { Outlet,Link } from 'react-router-dom'
// import logo from '../../src/image/logo.gif'


// function Navbar() {
//   return (
//     < >
//    <nav className='w-full h-16 bg-gradient-to-r from-indigo-500 flex iteam-center justify-between px-4 md:px4 ' >
//     {/* Image */}
//     <img className='h-12  flex  justify-start '  src={logo} alt=""  />
//     <ul className='md:flex hidden font-semibold mt-5 pr-10' >
//         <li className='mx-[10px] cursor-pointer text-xl text-black dark:text-sky-700'><Link to="/">Home</Link></li>
//         <li className='mx-[10px] cursor-pointer text-xl text-black dark:text-sky-700'><Link to="/company">Company</Link></li>
//         <li className='mx-[10px] cursor-pointer text-xl text-black dark:text-sky-700'><Link to="/product">Product</Link></li>
//         <li className='mx-[10px] cursor-pointer text-xl text-black dark:text-sky-700'><Link to="/aboutus">AboutUs</Link></li>
//     </ul>
//    <div className='my-2  display:flex justify-end flex   '>
//    <div>
//    <Link to="/signin"> <Button  variant="contained" disableElevation>
//       SignIn/Login
//     </Button></Link>
//    </div>
//     {/* <div>
//       <Link><li className='4xl' >&#8801; </li></Link>
//     </div> */}
//    </div>
//    </nav>
//    <Outlet/>
//    </>
//   )
// }

// export default Navbar
import React ,{ useState, useEffect }from 'react'
import '../style/navbar.css'
import Button from '@mui/material/Button';
import { Link, useNavigate, Outlet} from 'react-router-dom'
import logo from '../../src/image/logo.gif'
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [loading, setLoading] = useState(false);

  // Check if the user is logged in by making a request to a protected route (like `getCurrentUser`)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await axios.get('http://localhost:8000/api/v1/users/get-current-user', { withCredentials: true }); // Request to check if the user is logged in
        setIsLoggedIn(true); // If the request succeeds, user is logged in
      } catch (err) {
        setIsLoggedIn(false); // If the request fails, user is not logged in
      }
    };

    checkLoginStatus(); // Call the function to check login status
  }, []); // Run this effect only once when the component mounts

  const handleLogout = async () => {
    setLoading(true); // Show loading state during logout

    try {
      // Send logout request to the backend
      await axios.post('http://localhost:8000/api/v1/users/logout', {}, { withCredentials: true });

      // Once logged out, update the UI
      setIsLoggedIn(false);
      setLoading(false);

      // Redirect to home or login page after successful logout
      navigate('/');  // Redirect to homepage or login
    } catch (err) {
      setLoading(false); // Stop loading if error occurs
      console.error('Logout error:', err);
    }
  };


  return (
    <>
      <nav className='w-full h-16 bg-gradient-to-r from-indigo-500 flex items-center justify-between px-4 md:px-4'>
        <img className='h-12 flex justify-start' src={logo} alt="Logo" />
        
        <ul className='md:flex hidden font-semibold mt-5 pr-10'>
          <li className='mx-[10px] cursor-pointer text-xl text-black dark:text-sky-700'><Link to="/">Home</Link></li>
          <li className='mx-[10px] cursor-pointer text-xl text-black dark:text-sky-700'><Link to="/company">Company</Link></li>
          <li className='mx-[10px] cursor-pointer text-xl text-black dark:text-sky-700'><Link to="/product">Product</Link></li>
          <li className='mx-[10px] cursor-pointer text-xl text-black dark:text-sky-700'><Link to="/aboutus">About Us</Link></li>
        </ul>
        
        <div className='my-2 flex justify-end my-6'>
          <div>
          {isLoggedIn ? (
              <Button variant="contained" disableElevation onClick={handleLogout} disabled={loading}>
                {loading ? 'Logging Out...' : 'Logout'}
              </Button>
            ) : (
              <Link to="/signin">
                <Button variant="contained" disableElevation>
                  SignIn/Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* This will render nested routes */}
      <Outlet />
    </>
  );
}

export default Navbar;

