import { useEffect, useState } from "react";
import "./styles.css";

type TaskProps = {
  id: string | undefined;
  name: string | undefined;
  status: boolean;
};

const getLocalData = () => {
  const task = localStorage.getItem("tasks");
  return task && JSON.parse(localStorage.getItem("tasks") || "{}");
};

const List = () => {
  const [value, setValue] = useState("");
  const [task, setTask] = useState<TaskProps[]>(getLocalData() || []);
  const [edit, setEdit] = useState(false);
  const [isEditItem, setIsEditItem] = useState(0);

  /**
   * Setting task list to local storage
   */

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(task));
  }, [task]);

  /**
   * [Add Task]
   * Function to add a new task
   */

  const addItem = () => {
    if (!value) {
      return;
    } else if (value && edit) {
      setTask(
        task.map((elem, index) => {
          if (index === isEditItem) {
            return { ...elem, name: value };
          }
          return elem;
        })
      );
      setValue("");
      setEdit(false);
    } else {
      const newTask = [...task];
      const inputData = {
        id: new Date().getTime().toString(),
        name: value,
        status: false,
      };
      newTask.push(inputData);
      setTask(newTask);
      setValue("");
    }
  };

  /**
   * [Delete Item]
   * Function to delete item from the list
   */

  const deleteItem = (id: number) => {
    const updatedItems = task.filter((_, idx) => {
      return idx !== id;
    });
    setTask(updatedItems);
  };

  /**
   * [Edit Item]
   * Function to edit items in the list
   */

  const editItem = (id: number) => {
    const newEditItems: any = task.find((_, idx) => {
      return idx === id;
    });
    setEdit(true);
    setValue(newEditItems?.name);
    setIsEditItem(id);
  };

  /**
   * [Complete Item]
   * Function to set task completed in the list
   */

  const checkCompleted = (id: any) => {
    const updatedtask = task.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          status: !todo.status,
        };
      }
      return todo;
    });
    setTask(updatedtask);
  };

  return (
    <div className="container">
      <img src="/todo.png" alt="todo" className="imageWrapper" />
      <div className="inputWrapper">
        <input
          className="input"
          placeholder="Enter your task here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          className="addTask"
          disabled={value === ""}
          onClick={() => addItem()}
        >
          {edit ? "Edit Task" : "Add Task"}
        </button>
      </div>
      <div className="itemsWrapper">
        {task.map((item, index) => {
          return (
            <div
              key={index}
              className={!item.status ? "item" : "completedItem"}
            >
              <div className={!item.status ? "task" : "completedTask"}>
                {item.name}
              </div>
              <div>
                {!item.status && (
                  <>
                    <img
                      src="/edit.png"
                      alt="edit"
                      className="editImageIcon"
                      onClick={() => editItem(index)}
                    />
                    <img
                      onClick={() => deleteItem(index)}
                      src="/delete.png"
                      alt="delete"
                      className="deleteImageIcon"
                    />
                  </>
                )}
                {!item.status ? (
                  <img
                    onClick={() => checkCompleted(item.id)}
                    src="/unchecked.png"
                    alt="unchecked"
                    className="deleteImageIcon"
                  />
                ) : (
                  <img
                    onClick={() => checkCompleted(item.id)}
                    src="/checkedCheckbox.png"
                    alt="checkBox"
                    className="deleteImageIcon"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <button className="clearButton" onClick={() => setTask([])}>
          Clear All Task
        </button>
      </div>
    </div>
  );
};

export default List;
