import { useEffect, useState, useRef } from "react";
import {
 useFetchDataFromDbQuery,
 useUpdateBoardToDbMutation,
} from "../redux/services/apiSlice";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
 getActiveBoardIndex,
 setPageTitle,
 getPageTitle,
 openAddOrEditBoardModal,
} from "../redux/features/modalSlice";
import Tasks from "./Tasks";
import addTask from "../../public/icon-add-task-mobile.svg"
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { testData } from "../config";

export interface ISubtask {
 id: string;
 isCompleted: boolean;
 title?: string;
}

interface ITask {
 id: string;
 title: string;
 subtasks: ISubtask[];
 description: string;
 status: string;
}




interface Column {
 id: string;
 name: string;
 tasks: ITask[]; // Update this type to match your actual data structure
}




export default function Board () {
 const [columns, setColumns] = useState<Column[]>([]);
 const currentBoardIndex = useAppSelector(getActiveBoardIndex);
 const pageTitle = useAppSelector(getPageTitle);
 let { data, isLoading } = useFetchDataFromDbQuery();
 const [updateBoardToDb] = useUpdateBoardToDbMutation();
 const initialRender = useRef(true);
 const dispatch = useAppDispatch();

 useEffect(() => {
  if (data) {
   console.log(data);
   
   const [boards] = data!;
   if (boards) {
    const activeBoardData = boards.boards.find(
     (_board: { name: string }, index: number) => index === currentBoardIndex
    );
    if (activeBoardData) {
     dispatch(setPageTitle(activeBoardData.name));
     const { columns } = activeBoardData;
     setColumns(columns);
    }
    else {
     dispatch(setPageTitle(''));
    }
   }
  }
 }, [data, pageTitle]);

 useEffect(() => {
  // Check if it's the initial render, to avoid sending the data to the backend on mount
  if (!initialRender.current) {
   // Update the backend with the new order
   try {
    if (data) {
     const [boards] = data;
     const boardsCopy = [...boards.boards];
     const updatedBoard = {
      ...boards.boards[currentBoardIndex],
      columns,
     };
     boardsCopy[currentBoardIndex] = updatedBoard;
     updateBoardToDb(boardsCopy);
    }
   } catch (error) {
    // Handle error
    console.error("Error updating board:", error);
   }
  } else {
   // Set initial render to false after the first render
   initialRender.current = false;
  }
 }, [columns]);

 data = testData;

 const handleDragEnd = () => {
  console.log('fdmnf');
  
 }



 return (
  <div className="bg-very-dark-grey p-6 w-full h-[35.91rem] overflow-x-auto overflow-y-auto">
   {isLoading ? (
    <SkeletonTheme
     baseColor={"#2b2c37"}
     highlightColor={"#444"}
    >
     <div className="flex space-x-6">
      {[1, 2, 3, 4].map((number) => {
       return (
        <div key={number}>
         <Skeleton
          borderRadius={"0.25rem"}
          height={80}
          width={"17.5rem"}
          count={4}
         />
        </div>
       );
      })}
     </div>
    </SkeletonTheme>
   ) : (
    <>
     {
      (data![0].boards.length > 0) ? (
       <>
        {(columns.length > 0) ? (
         <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-6">
           {columns.map((column, index) => {
            const { name, tasks, id } = column;
            return (
             <div key={index} className="w-[17.5rem] text-white shrink-0">
              <p>{`${name} `}</p>
              <Droppable droppableId={id}>
               {(provided) => (
                <div
                 ref={provided.innerRef}
                 {...provided.droppableProps}
                 className="h-full"
                >
                 {tasks &&
                  (tasks.length > 0 ? (
                   <Tasks tasks={tasks!} />
                  ) : (
                   <div className="mt-6 h-full rounded-md border-dashed border-4 border-medium-grey " />
                  ))}
                 {provided.placeholder}
                </div>
               )}
              </Droppable>
             </div>
            )
           })}
           {columns.length < 7 ? (
            <div
             onClick={() =>
              dispatch(openAddOrEditBoardModal("Edit Board"))
             }
             className="cursor-pointer rounded-md bg-dark-grey hover:text-main-purple w-[17.5rem] mt-12 shrink-0 flex justify-center items-center shadow-sm"
            >
             <p className="font-bold text-2xl text-white">+ New Column</p>
            </div>
           ) : (
            ""
           )}
          </div>
         </DragDropContext>
        ) : (
         <div className="w-full h-full flex justify-center items-center">
          <div className="flex flex-col items-center">
           <p className="text-medium-grey text-sm text-center">
            This board is empty. Create a new column to get started.
           </p>
           <button
            onClick={() =>
             dispatch(openAddOrEditBoardModal("Edit Board"))
            }
            className=" transition ease-in duration-150 delay-150 dark:hover:bg-primary text-white px-4 py-2 flex mt-6 rounded-3xl items-center space-x-2"
           >
            <img src={addTask} alt="icon-add-task" />
            <p>Add New Column</p>
           </button>
          </div>
         </div>

        )}
       </>
      ): (
         <div className="w-full h-full flex justify-center items-center">
          <div className="flex flex-col items-center">
           <p className="text-medium-grey text-sm text-center">
            You haven&apos;t created a board yet. Create a new board to get started.
           </p>
           <button
            onClick={() =>
             dispatch(openAddOrEditBoardModal("Add New Board"))
            }
            className="bg-main-purple transition ease-in duration-150 delay-150 dark:hover:bg-primary text-white px-4 py-2 flex mt-6 rounded-3xl items-center space-x-2"
           >
            <img src={addTask} alt="icon-add-task" />
            <p>Create New Board</p>
           </button>
          </div>
         </div>
      )}
    </>
   )}
   {/* TaskDetailModal */}
  </div>
 )


}