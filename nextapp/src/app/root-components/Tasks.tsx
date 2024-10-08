import { useAppDispatch } from "../../redux/hooks";
import {
  openTaskDetailsModal,
} from "../../redux/features/modalSlice";
import { Draggable } from "react-beautiful-dnd";

export interface ISubtask {
  id: string,
  isCompleted: boolean;
  title?: string;
}

interface ITask {
  id: string,
  title: string;
  subtasks: ISubtask[];
  description: string;
  status: string;
}

interface ITasksProps {
  tasks: ITask[];
}

export default function Tasks({ tasks }: ITasksProps) {
  const dispatch = useAppDispatch();

  const handleOpenModal = (
    id:string,
    status: string, 
    title: string,
  ) => {
    dispatch(
      openTaskDetailsModal({
       id,
       status,
       title,
      })
    );
  };

  return (
    tasks &&
    tasks.map((task, index) => {
      const { title, subtasks, description, status, id } = task;
      const completedSubtasks = subtasks?.filter(
        (subtask) => subtask?.isCompleted === true
      ).length;

      return (
        <Draggable key={id} draggableId={id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={() =>
                handleOpenModal(id, status, title)
              }
              className="bg-white dark:bg-dark-grey hover:text-main-purple p-6 rounded-md mt-6 cursor-pointer shadow-md"
            >
              <p className="transition ease-in duration-150 delay-150 font-bold">
                {title}
              </p>
              <p className="text-medium-grey text-xs mt-2">{`${completedSubtasks} of ${subtasks.length} subtasks`}</p>
            </div>
           )} 
       </Draggable> 
      );
    })
  );
}
