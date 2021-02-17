import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.global.css";
import { IpcRendererEvent } from "electron";
import store from "./storage";

const { ipcRenderer } = require("electron");

const Hello = () => {
  const [fileText, setFileText] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    ipcRenderer
      .invoke("get-counter", "counter")
      .then((result: any) => {
        setCount(result);
      })
      .catch();
  }, []);

  ipcRenderer.on("get-message", (event: IpcRendererEvent, message: string) => {
    setFileText(message);
  });

  ipcRenderer.on(
    "get-new-counter",
    (event: IpcRendererEvent, value: number) => {
      console.log(value);
      setCount(value);
    }
  );

  function func() {
    console.log("click");
    ipcRenderer.send("notify");
  }

  function writeToFile(fileName: string, message: string) {
    ipcRenderer.send("write-to-file", fileName, message);
  }

  function createNewWindow() {
    ipcRenderer.send("create-new-window");
    console.log("kuku");
  }

  function changeText(event: any) {
    event.preventDefault();
    setText(event.target.value);
  }

  return (
    <div>
      <p>Hello</p>
      <button onClick={() => func()}>Click me</button>
      <button onClick={() => writeToFile("helloworld.txt", text)}>
        Write to file
      </button>
      <button onClick={() => createNewWindow()}>New window</button>
      <p>File text: {fileText}</p>
      <input name="text" value={text} onChange={changeText} />
      <div>
        <p>Counter: {count}</p>
        <button
          onClick={() => {
            setCount(count + 1);
            ipcRenderer.send("change-store", "counter", count + 1);
          }}
        >
          Increase
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
