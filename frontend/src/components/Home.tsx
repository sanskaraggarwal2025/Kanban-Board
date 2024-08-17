import Sidebar from "./Sidebar";
import Board from "./Board";
import { Navbar } from "./Header.tsx"
import Login from "./Login.tsx";
import { useFetchDataFromDbQuery } from "../redux/services/apiSlice.ts";
const Home = () => {
 let token = localStorage.getItem('token');
 console.log(token);
  let { data, } = useFetchDataFromDbQuery();
  console.log(data);
  let str = JSON.stringify(data);
 return (
    
  <>
  {/* <p>{str}</p> */}
   {
    !token ?
     <Login />
     : (
      <>
       <Navbar></Navbar>
       <div className="h-full">
        <div className="md:flex h-full">
         <Sidebar />
         <Board />
        </div>
       </div>
      </>
     )
   }

  </>
 )
}

export default Home