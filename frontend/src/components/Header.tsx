import { useState, useEffect } from "react";
import navbarLogoDark from "../../public/navbar-logo-dark.png";
import addTask from '../../public/icon-add-task-mobile.svg'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import BoardDropdown from "./Dropdown";
import ellipses from "../../public/icon-vertical-ellipsis.svg"
import {
  openNavModal,
  getPageTitle,
  openAddOrEditTaskModal,
} from "../redux/features/modalSlice"
import "react-loading-skeleton/dist/skeleton.css";
import { useFetchDataFromDbQuery } from "../redux/services/apiSlice"
import { useAppDispatch, useAppSelector } from "../redux/hooks";

interface Column {
  name: string;
  tasks?: any[]; // Update this type to match your actual data structure
}

export function Navbar() {
  const pageTitle = useAppSelector(getPageTitle);
  console.log(pageTitle);
  
  const [show, setShow] = useState<boolean>(false);
  const { data, isLoading } = useFetchDataFromDbQuery();
  console.log(data);
  
  const [columns, setColumns] = useState<Column[]>([]);
  const dispatch = useAppDispatch();

  return (
    <>
      <nav className="bg-dark-grey md:flex hidden h-24">
        <div className="w-[18.75rem] border-r-2 border-lines-dark pl-[2.12rem] flex items-center">
          <img src={navbarLogoDark} alt="logo" />
        </div>


        <div className="border-b-2 w-full pr-[2.12rem] flex justify-between items-center">
          {!isLoading ? (
            <p className="text-xl capitalize text-white font-bold pl-6">
              No Board(s) yet
            </p>
          ) : (
            <SkeletonTheme
              baseColor={"#2b2c37"}
              highlightColor={"#444"}
            >
              <p>
                <Skeleton
                  borderRadius={"0.25rem"}
                  height={40}
                  width={"100%"}
                  count={1}
                />
              </p>
            </SkeletonTheme>
          )}

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                columns.length > 0
                  ? dispatch(
                    openAddOrEditTaskModal({
                      variant: "Add New Task",
                      isOpen: true
                    })
                  )
                  : ""
            }}
              className="bg-main-purple text-white px-4 py-2 flex rounded-3xl items-center space-x-2"
            >
              <img src={addTask} alt="icon-add-task" />
              <p>Add New Task</p>
            </button>
            <div className="relative flex items-center">
              <button onClick={() => setShow(!show)}>
                <img src={ellipses} alt="icon-vertical-ellipsis" />
              </button>
              <BoardDropdown show={show} setShow={setShow} />
            </div>

          </div>

        </div>
      </nav>
    </>

  );
}