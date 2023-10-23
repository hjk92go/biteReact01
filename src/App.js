import { useRef, useState } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

function App() {
  const [data, setData] = useState([]);

  //데이터아이디 1부터
  const dataId = useRef(0);

  // author, content, emotion을 Oncreate함수가 받아서 이데이터에 업데이트 시키려고함
  // 안에 값들을 oncreate가 파라미터로 값으로 받을예정
  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    //데이터아이디 +1되어야함
    dataId.current += 1;
    //...data, newItem순으로 진행하면 원래데이터에 가장마지막에 이어붙인 효과 가능
    setData([newItem, ...data]);
  };

  return (
    <div>
      <DiaryEditor onCreate={onCreate} />
      <DiaryList diaryList={data} />
    </div>
  );
}

export default App;
