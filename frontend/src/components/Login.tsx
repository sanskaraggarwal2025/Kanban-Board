import { useForm,SubmitHandler } from "react-hook-form";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios"
import { BACKEND_URL } from "../config";

interface loginType {
 email: string;
 password: string;
}

const Login = () => {

 const { register, handleSubmit } = useForm<loginType>();
 const navigate = useNavigate();

 const onSubmit:SubmitHandler<loginType> = async(data:loginType) => {
  let res = await axios.post(`${BACKEND_URL}/api/v1/user/login`, {
   email: data.email,
   password: data.password,
  });
  console.log(res);
  
  localStorage.setItem("token", res.data.jwt);
  // localStorage.setItem("userId", res.data.userId);
  if (res) {
   navigate('/');
  }
  console.log(res);
  console.log(res.data.jwt);
 };  
 

 return (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-900 ">
   <form
    onSubmit={handleSubmit(onSubmit)}
    className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm"
   >
    <h2 className="text-2xl font-bold mb-4 text-center text-white">Login</h2>
    <div className="mb-4">
     <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
     <input
      {...register("email")}
      type="email"
      placeholder="Email"
      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500"
     />
    </div>
    <div className="mb-4">
     <label htmlFor="password" className="block text-gray-400 mb-2">Password</label>
     <input
      {...register("password")}
      type="password"
      placeholder="Password"
      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500"
     />
    </div>
    <div className="text-center">
     <Link to="/signup">
      <p className="text-gray-400 pb-2">Don't have an account?SignUp</p>
     </Link>
     <button
      type="submit"
      className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-700"
     >
      Login
     </button>
    </div>
   </form>
  </div>
 )
}

export default Login