import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

const dummyList = [
  {
    id: 1,
    author: "hjk",
    content: "hello",
    emotion: 5,
    created_date: new Date().getTime(),
  },
  {
    id: 2,
    author: "김현주",
    content: "hi",
    emotion: 3,
    created_date: new Date().getTime(),
  },
  {
    id: 3,
    author: "현주김",
    content: "hello world",
    emotion: 2,
    created_date: new Date().getTime(),
  },
];

function App() {
  return (
    <div>
      <DiaryEditor />
      <DiaryList diaryList={dummyList} />
    </div>
  );
}

export default App;
