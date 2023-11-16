import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

const App = () => {
  const [data, setData] = useState([]);

  const dataId = useRef(0);

  const getData = async () => {
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

  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 1500);
  }, []);

  const onCreate = useCallback((author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };

    dataId.current += 1;
    setData((data) => [newItem, ...data]);
  }, []);

  const onRemove = useCallback((targetId) => {
    setData((data) => data.filter((it) => it.id !== targetId));
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    setData((data) => data.map((it) => (it.id === targetId ? { ...it, content: newContent } : it)));
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    if (data.length === 0) {
      return { goodcount: 0, badCount: 0, goodRatio: 0 };
    }

    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100.0;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
};
export default App;

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import "./App.css";
// import DiaryEditor from "./DiaryEditor";
// import DiaryList from "./DiaryList";
// import OptimizeTest from "./OptimizeTest";

// function App() {
//   const [data, setData] = useState([]);

//   //데이터아이디 1부터
//   const dataId = useRef(0);

//   const getData = async () => {
//     //주소 넣어준다음, 이결과 값의 then으로 res.json()메서드를 통해 우리가 원하는 데이터인 이 json값들만 뽑아주도록한다
//     const res = await fetch("https://jsonplaceholder.typicode.com/comments").then((res) =>
//       res.json()
//     );

//     const initData = res.slice(0, 20).map((it) => {
//       return {
//         author: it.email,
//         content: it.body,
//         emotion: Math.floor(Math.random() * 5) + 1,
//         created_date: new Date().getTime(),
//         id: dataId.current++,
//       };
//     });

//     setData(initData);
//   };

//   //마운트 시점에 수행할 콜백함수에 getData라고 api를 호출하는 함수를 적용
//   useEffect(() => {
//     setTimeout(() => {
//       getData();
//     }, 1500);
//   }, []);

//   // author, content, emotion을 Oncreate함수가 받아서 이데이터에 업데이트 시키려고함
//   // 안에 값들을 oncreate가 파라미터로 값으로 받을예정

//   //231115
//   //첫번째 인자로 전달하는 콜백 함수가 다이어리 에디터가 작성 완료를 눌렀을 때 데이터를 추가하는 함수가 되고,
//   //두번째 인자로는 Depth를 전달하는데 빈배열로 전달해서 마운트 되는 시점에 한 번만 만들고 그다음 부터는 첫 번째 만들었던 함수를
//   //그대로 재사용할 수 있도록 -> onCreate홤수가 재생성 되지 않으면 최신의 데이터 스테이트의 값을 참고할수가 없게 되는 딜레마 발생

//   // => 함수형 업데이트를 활용한다. 화살표 함수로 전달함 여기에다가 인자로 데이터를 받아서
//   // 아이템을 추가한 데이터를 리턴하는 그런 콜백 함수를 이 set data함수에다가 전달 할것, 이렇게 상태 변화 함수,
//   //set state함수에 함수를 전달하는 것을 함수형 업데이트라고 표현하는데 이렇게 되면 dependency array를 비워도 항상 최슨의 state를 인자를 통해서 창고할 수 있게 되면서
//   //우리가 이 depth를 비울수 있게 된다.   setData((data) => [newItem, ...data])

//   const onCreate = useCallback((author, content, emotion) => {
//     const created_date = new Date().getTime();
//     const newItem = {
//       author,
//       content,
//       emotion,
//       created_date,
//       id: dataId.current,
//     };
//     //데이터아이디 +1되어야함
//     dataId.current += 1;
//     //...data, newItem순으로 진행하면 원래데이터에 가장마지막에 이어붙인 효과 가능
//     setData((data) => [newItem, ...data]);
//   }, []);

//   //231116 최적화 useCallback묶은다음 Dependency Array에 아무것도 전달 안한다음, setData에 함수형 업데이트 하도록 지시해야됨
//   //아래에 선언된 New Diary List가 필터로 생성 되고 있음("const newDiaryList = data.filter((it) => it.id !== targetId)")이거를 수정해야함

//   const onRemove = useCallback((targetId) => {
//     //해당 id값을 제외한 나머지를 새로운 배열만듬(231116 최적화 과정에서 업데이트 함수로 수정)
//     //const newDiaryList = data.filter((it) => it.id !== targetId);  만든 새로운 배열을 setData로 보내주면 삭제 완료

//     //231116 데이터를 다루는 부분을 자른 다음에 데이터를 전달해서 데이터를 리턴 받아야함
//     //왜냐하면 이 setData함수에 전달되는 파라미터에 최신 state가 전달되는 거기 때문에 항상 최신 state를 이용하기 위해서 함수형 업데이트의 인자 부분의 데이터를 이용해야한다.
//     //그리고 return 부분의 데이터를 사용해야 최신형 업데이트를 사용할 수 있다.
//     setData((data) => data.filter((it) => it.id !== targetId));
//   }, []);

//   const onEdit = useCallback((targetId, newContent) => {
//     //setData를 통해서 값을 전달할껀데 어떤값을 전달하냐 => id가 일치하는 원소를 찾는데 찾아서 전달할꺼임
//     //원본데이터를 다 불러온다음 targetId가 일치한다면, 컨텐츠를 새로운 컨텐츠로 업데이트 시켜줄꺼고 아니라면 원래있던내용을 반환할 것이다.

//     //setData(data.map((it) => (it.id === targetId ? { ...it, content: newContent } : it)));에서 아래와 같이 함수형으로 업데이트 시켜 주면된다.
//     setData((data) => data.map((it) => (it.id === targetId ? { ...it, content: newContent } : it)));
//   }, []);

//   //ch09_기분이 좋은 일기가 몇개인지 / 안좋은게 몇개인지 / 기분좋은 일기의 비율이 어떻게 되는지 / 이세가지 데이터를 구할예정

//   //리액트에서 이렇게 return을 가지고 있는 함수를 메모이제이션 해서 이런 연산을 최적화 하기위해 useMemo를 사용하게됨
//   //우리가 최적화 하고 싶은 메모이제이션함수를 감싸주면된다.
//   const getDiaryAnalysis = useMemo(() => {
//     //좋은 일기 => 데이터state에서 필터를 이용하여 감정점수가 3점인것을 추린다음 그것의 길이를 구하면 갯수가 나온다.
//     const goodCount = data.filter((it) => it.emotion >= 3).length;

//     //나쁜 일기 => 일기 전체갯수에서 좋은 일기 갯수를 빼면 나머지는 나쁜일기 갯수
//     const badCount = data.length - goodCount;

//     //좋은 일기의 비율 => 좋은일기갯수/전체일기갯수 *100
//     const goodRatio = (goodCount / data.length) * 100.0;

//     return { goodCount, badCount, goodRatio };
//     //데이터 랭쓰가 변화하지 않는이상 계산하지않고 반환함
//   }, [data.length]);

//   //getDiaryAnalysis함수를 지역함수로 만들었기때문에 다른 함수들(onEdit,onRemove,OnCreate...) 처럼 리턴전에 호출을 하도록 할 것
//   const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

//   return (
//     <div>
//       {/* <OptimizeTest /> */}
//       <DiaryEditor onCreate={onCreate} />
//       <div>전 체 일 기 : {data.length}</div>
//       <div>기 분 좋 은 일 기 갯 수 : {goodCount}</div>
//       <div>기 분 나 쁜 일 기 갯 수 : {badCount}</div>
//       <div>기 분 좋 은 일 기 비 율 : {goodRatio}%</div>
//       <DiaryList onEdit={onEdit} diaryList={data} onRemove={onRemove} />
//     </div>
//   );
// }

// export default App;
