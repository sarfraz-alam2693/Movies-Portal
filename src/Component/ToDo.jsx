import { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";

function ToDo() {
  const savedToDoList = JSON.parse(localStorage.getItem("toDoList"));
  const [title, setTitle] = useState("");
  const [toDoList, setToDoList] = useState(savedToDoList || []);

  useEffect(() => {
    localStorage.setItem("toDoList", JSON.stringify(toDoList));
  }, [toDoList]);

  function handleAdd() {
    if (!title.trim()) {
      alert("Title cannot be empty.");
      return;
    }
    setToDoList((prevList) => {
      return [...prevList, title];
    });
  }

  /**
   * Delete ToDo
   * @param {event} e
   * @param {String} item
   */
  function deleteTodo(e, item) {
    e.preventDefault();
    console.log("tyoeof", typeof item);
    setToDoList((prevList) => prevList.filter((elem) => elem !== item));
  }
  /**
   *  TODO:: Update ToDo
   * @param {String} item
   */
  function updateTodo(item) {
    console.log("update");
  }
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-7">
            <h1>ToDo</h1>
            <label>Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>
          <h2>ToDo List :</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>delete</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {toDoList &&
                toDoList.map((item, i) => (
                  <tr key={i}>
                    <td>{item}</td>
                    <td>
                      <Button
                        onClick={(e) => {
                          deleteTodo(e, item);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                    <td>
                      <Button onClick={updateTodo(item)}>update</Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
export default ToDo;
