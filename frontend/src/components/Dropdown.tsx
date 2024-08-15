import { useEffect, useRef } from "react";
import {
 openAddOrEditBoardModal,
 openDeleteBoardOrTaskModal,
} from "../redux/features/modalSlice"
import { Dispatch, SetStateAction } from "react";

import { useAppDispatch } from "../redux/hooks";

interface IDropdown {
 show: boolean;
 setShow: Dispatch<SetStateAction<boolean>>;
}

export default function BoardDropdown({show,setShow}: IDropdown){
 const dropDownRef = useRef<HTMLDivElement>(null);
 const dispatch = useAppDispatch();

 const openEditBoard = () => {
  dispatch(openAddOrEditBoardModal("Edit Board"));
  setShow(!show);
 };

 const openDeleteBoard = () => {
  dispatch(
   openDeleteBoardOrTaskModal({
    variant: "Delete this board?",
   })
  );
  setShow(!show);
 };

 useEffect(() => {
  const handleClickOutside = (e:MouseEvent) => {
   if (
    dropDownRef.current &&
    !dropDownRef.current.contains(e.target as Node)
   ) {
    setShow(false);
   }
  }

  if (show) {
   document.addEventListener("mousedown", handleClickOutside);
  } else {
   document.removeEventListener("mousedown", handleClickOutside);
  }
  return () => {
   document.removeEventListener("mousedown", handleClickOutside);
  };

 }, [show, setShow]);


 return(
  <div ref={dropDownRef} className={`${show ? "block" : "hidden"} bg-very-dark-grey absolute w-48 top-[170%] shadow-sm right-1  py-2 px-4 rounded-2xl`}>
   <div>
    <button onClick = {openEditBoard} className="text-sm py-2 text-gray-500">
     Edit Board
    </button>
   </div>
   <div>
    <button onClick={openDeleteBoard} className="text-sm py-2 text-red">
     Delete Board
    </button>
   </div>

  </div>
 )
}