import { useFetchDataFromDbQuery } from "../redux/services/apiSlice";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { openAddOrEditBoardModal, setActiveBoardIndex, getActiveBoardIndex,setPageTitle } from "../redux/features/modalSlice";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import iconBoard from "../../public/icon-board.svg"
import iconBoardWhite from "../../public/icon-board-white.png"
import "react-loading-skeleton/dist/skeleton.css";
import iconBoardPurple from "../../public/icon-board-purple.png"
import SidebarFooter from "./SidebarFooter";
import iconShowSidebar from "../../public/icon-show-sidebar.svg"

export default function Sidebar(){
 let { data, } = useFetchDataFromDbQuery();
 console.log(data);
 let boards: [] = [];
 data = {...boards};
 
 const [showSidebar, setShowSidebar] = useState<boolean>(true);

 const dispatch = useAppDispatch();

 const handleNav = (index: number, name: string) => {
  dispatch(setActiveBoardIndex(index));
  dispatch(setPageTitle(name));
 };

 const currentBoardIndex = useAppSelector(getActiveBoardIndex);
 return(
  <>
   <div className="relative hidden md:block h-[35.91rem] ">
   <aside className={`${
    !showSidebar
     ? "w-0 overflow-hidden"
     : "w-[15.80rem] bg-dark-grey flex-none h-full py-6 pr-6"
   }transition-width duration-150 ease-out relative`} >

     {data ? (
      <>
       <p className="text-medium-grey pl-[2.12rem] text-[.95rem] font-semibold uppercase pb-3">
        {`All Boards (${data[0]?.boards.length > 0 ? data[0]?.boards.length : 0})`}
       </p>
       {data[0]?.boards.map(
        (board: { [key: string]: any }, index: number) => {
         const { name } = board;
         const isActive = index === currentBoardIndex;
         return (
          <div
           onClick={() => handleNav(index, name)}
           key={index}
           className={`${isActive
             ? "bg-main-purple text-white"
             : "text-medium-grey transition ease-in duration-150 delay-150 hover:bg-light-grey dark:hover:bg-white hover:text-main-purple"
            } cursor-pointer rounded-tr-full rounded-br-full flex items-center space-x-2 pl-[2.12rem] py-3 pb-3`}
          >
           {isActive ? (
            <img src={iconBoardWhite} alt="active board icon" />
           ) : (
            <img src={iconBoard} alt="board icon" />
           )}
           <p className="text-lg capitalize">{name}</p>
          </div>
         );
        }
       )}
      </>
     ) : (
      <SkeletonTheme
       baseColor={"#2b2c37"}
       highlightColor={"#444"}
      >
       <p className="pl-6">
        <Skeleton
         borderRadius={"0.25rem"}
         height={40}
         width={"100%"}
         count={4}
        />
       </p>
      </SkeletonTheme>
     )}
     <button
      onClick={() => dispatch(openAddOrEditBoardModal("Add New Board"))}
      className="flex items-center space-x-2 pl-[2.12rem] py-3"
     >
      <img src={iconBoardPurple} alt="board icon" />
      <p className="text-base font-bold capitalize text-main-purple">
       {" "}
       + Create New Board
      </p>
     </button>
     <SidebarFooter showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
   </aside>
    <div
     onClick={() => setShowSidebar(!showSidebar)}
     className={`${!showSidebar ? "block" : "hidden"
      } cursor-pointer h-12 w-14 bg-main-purple dark:hover:bg-primary transition ease-in 
        duration-150 delay-150 absolute left-full rounded-tr-full rounded-br-full bottom-4 flex items-center justify-center`}
    >

     <img
      src={iconShowSidebar}
      alt="show sidebar"
      className="object-contain"
     />
    </div>
  </div>
  </>
 )
}