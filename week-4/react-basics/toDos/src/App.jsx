import { useState, useRef } from "react";
import "./App.css";

function App() {
  const idRef = useRef(0); // useRef maintains a persistent reference
  const [todo, setToDo] = useState([]); 
  const [title, setTitle] = useState(""); 
  const [desc, setDesc] = useState(""); 

  function handleClick() {
    idRef.current++; // Increment the idRef.current value
    const todoObj = {
      title: title,
      desc: desc,
      id: idRef.current,
    };
    setToDo([...todo, todoObj]); 
    setTitle(""); 
    setDesc(""); 
  }

  function handleDelete(id) {
    const updateTodo = todo.filter((ele) => ele.id !== id); 
    setToDo(updateTodo);
  }

  return (
    <div className="text-center margin-10">
      <div>
        <label>Title</label>
        <br />
        <input
          type="text"
          value={title}
          placeholder="Enter Title"
          onChange={(e) => setTitle(e.target.value)} 
        />
        <br />
        <br />
        <label>Description</label>
        <br />
        <input
          type="text"
          value={desc}
          placeholder="Enter Description"
          onChange={(e) => setDesc(e.target.value)} 
        />
        <br />
        <br />
        <button onClick={handleClick}>Add To Do</button>
      </div>
      {todo.map((item) => (
        <div className="mb-10" key={item.id}>
          <div className="colorBlue">Title: {item.title}</div>
          <div>Description: {item.desc}</div>
          <button onClick={() => handleDelete(item.id)}>Mark Done</button>
        </div>
      ))}
    </div>
  );
}

export default App;
