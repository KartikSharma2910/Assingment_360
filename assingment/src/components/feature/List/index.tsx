import { useEffect, useState } from "react";
import { Button } from "../../common";
import "./styles.css";

type TaskProps = {
  id: string | undefined;
  name: string | undefined;
  status: boolean;
};

/**
 * Getting task list from local storage
 */

const getLocalData = () => {
  const task = localStorage.getItem("tasks");
  return task && JSON.parse(localStorage.getItem("tasks") || "{}");
};

const List = () => {
  const [value, setValue] = useState("");
  const [task, setTask] = useState<TaskProps[]>(getLocalData() || []);
  const [editingTodoId, setEditingTodoId] = useState<string | undefined>("");
  const [editedTodoText, setEditedTodoText] = useState<string | undefined>("");

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
   * [Edit Item]
   * Function to edit Item in the list
   */

  const editFunction = (todo: TaskProps) => {
    const updatedTodos = task.map((editTask) => {
      if (editTask.id === todo.id) {
        return { ...editTask, name: editedTodoText };
      }
      return editTask;
    });
    setTask(updatedTodos);
    setEditingTodoId("");
    setEditedTodoText("");
  };

  /**
   * [Complete Item]
   * Function to set task completed in the list
   */

  const checkCompleted = (id: string | undefined) => {
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
          type="text"
          className="input"
          placeholder="Enter your task here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          className="addTask"
          disabled={value === ""}
          onClick={() => addItem()}
          label="Add Task"
        />
      </div>
      <div className="itemsWrapper">
        {task.map((item, index) => {
          return (
            <div
              key={index}
              className={!item.status ? "item" : "completedItem"}
            >
              {editingTodoId === item.id && item.status !== true ? (
                <input
                  type="text"
                  className="editInput"
                  value={editedTodoText}
                  onChange={(e) => setEditedTodoText(e.target.value)}
                  onBlur={(e) => {
                    editFunction(item);
                    if (e.target.value === "") {
                      setTask(task.filter(({ id }) => id !== item.id));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      editFunction(item);
                      if (editedTodoText === "") {
                        setTask(task.filter(({ id }) => id !== item.id));
                      }
                    }
                  }}
                />
              ) : (
                <div
                  onDoubleClick={() => {
                    setEditingTodoId(item.id);
                    setEditedTodoText(item.name);
                  }}
                  className={!item.status ? "task" : "completedTask"}
                >
                  {item.name}
                </div>
              )}
              <div>
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
        <Button
          className="clearButton"
          disabled={!task.filter((item) => item.status === true).length}
          onClick={() => setTask(task.filter((item) => item.status !== true))}
          label="Clear Task"
        />
      </div>
    </div>
  );
};

export default List;
