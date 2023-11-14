import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import OptimizeTest from "./OptimizeTest";

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
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });

    setData(initData);
  };

  //마운트 시점에 수행할 콜백함수에 getData라고 api를 호출하는 함수를 적용
  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 1500);
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
      id: dataId.current,
    };
    //데이터아이디 +1되어야함
    dataId.current += 1;
    //...data, newItem순으로 진행하면 원래데이터에 가장마지막에 이어붙인 효과 가능
    setData([newItem, ...data]);
  };

  const onRemove = (targetId) => {
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

  //ch09_기분이 좋은 일기가 몇개인지 / 안좋은게 몇개인지 / 기분좋은 일기의 비율이 어떻게 되는지 / 이세가지 데이터를 구할예정

  //리액트에서 이렇게 return을 가지고 있는 함수를 메모이제이션 해서 이런 연산을 최적화 하기위해 useMemo를 사용하게됨
  //우리가 최적화 하고 싶은 메모이제이션함수를 감싸주면된다.
  const getDiaryAnalysis = useMemo(() => {
    //좋은 일기 => 데이터state에서 필터를 이용하여 감정점수가 3점인것을 추린다음 그것의 길이를 구하면 갯수가 나온다.
    const goodCount = data.filter((it) => it.emotion >= 3).length;

    //나쁜 일기 => 일기 전체갯수에서 좋은 일기 갯수를 빼면 나머지는 나쁜일기 갯수
    const badCount = data.length - goodCount;

    //좋은 일기의 비율 => 좋은일기갯수/전체일기갯수 *100
    const goodRatio = (goodCount / data.length) * 100.0;

    return { goodCount, badCount, goodRatio };
    //데이터 랭쓰가 변화하지 않는이상 계산하지않고 반환함
  }, [data.length]);

  //getDiaryAnalysis함수를 지역함수로 만들었기때문에 다른 함수들(onEdit,onRemove,OnCreate...) 처럼 리턴전에 호출을 하도록 할 것
  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <div>
      <OptimizeTest />
      <DiaryEditor onCreate={onCreate} />
      <div>전 체 일 기 : {data.length}</div>
      <div>기 분 좋 은 일 기 갯 수 : {goodCount}</div>
      <div>기 분 나 쁜 일 기 갯 수 : {badCount}</div>
      <div>기 분 좋 은 일 기 비 율 : {goodRatio}%</div>
      <DiaryList onEdit={onEdit} diaryList={data} onRemove={onRemove} />
    </div>
  );
}

export default App;
