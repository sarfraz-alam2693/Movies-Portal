import { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, listTodo, deleteTodo } from "../redux/slice/todoSlice";

function ToDo() {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const todos = useSelector(listTodo);

  const toDoList = todos?.payload?.todo || [];

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
            <Button onClick={() => dispatch(addTodo(title))}>Add</Button>
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
                      <Button onClick={() => dispatch(deleteTodo(item))}>
                        Delete
                      </Button>
                    </td>
                    <td>
                      <Button>update</Button>
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
