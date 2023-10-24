import { useEffect, useRef, useState } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

// https://jsonplaceholder.typicode.com/comments

function App() {
  const [data, setData] = useState([]);

  //데이터아이디 1부터
  const dataId = useRef(0);

  const getData = async () => {
    //주소 넣어준다음, 이결과 값의 then으로 res.json()메서드를 통해 우리가 원하는 데이터인 이 json값들만 뽑아주도록한다
    const res = await fetch("https://jsonplaceholder.typicode.com/comments").then((res) =>
      res.json()
    );

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime() + 1,
        id: dataId.current++,
      };
    });

    setData(initData);
  };

  //마운트 시점에 수행할 콜백함수에 getData라고 api를 호출하는 함수를 적용
  useEffect(() => {
    getData();
  }, []);

  // author, content, emotion을 Oncreate함수가 받아서 이데이터에 업데이트 시키려고함
  // 안에 값들을 oncreate가 파라미터로 값으로 받을예정
  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current++,
    };
    //데이터아이디 +1되어야함
    dataId.current += 1;
    //...data, newItem순으로 진행하면 원래데이터에 가장마지막에 이어붙인 효과 가능
    setData([newItem, ...data]);
  };

  const onRemove = (targetId) => {
    console.log(`${targetId}가 삭제되었습니다.`);

    //해당 id값을 제외한 나머지를 새로운 배열만듬
    const newDiaryList = data.filter((it) => it.id !== targetId);
    //만든 새로운 배열을 setData로 보내주면 삭제 완료
    setData(newDiaryList);
  };

  const onEdit = (targetId, newContent) => {
    //setData를 통해서 값을 전달할껀데 어떤값을 전달하냐 =>
    //id가 일치하는 원소를 찾는데 찾아서 전달할꺼임
    //원본데이터를 다 불러온다음 targetId가 일치한다면, 컨텐츠를 새로운 컨텐츠로 업데이트 시켜줄꺼고 아니라면 원래있던내용을 반환할것이다.
    setData(data.map((it) => (it.id === targetId ? { ...it, content: newContent } : it)));
  };

  return (
    <div>
      <DiaryEditor onCreate={onCreate} />
      <DiaryList onEdit={onEdit} diaryList={data} onRemove={onRemove} />
    </div>
  );
}

export default App;
