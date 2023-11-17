import React, { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
// import OptimizeTest from "./OptimizeTest";

// 231117 로직을 앱컴포넌트 밖으로 구현하기위해 useReducer 사용한것임으로 밖에다가 reducer함수를 만들어준다.
// 첫번째로 받는 파라미터는 상태변화가 일어나기 직전의 state, 두번째 파라미터는 어떤상태 변화를 일으켜야하는지에 대한
// 정보가 담겨져있는 action객체
const reducer = (state, action) => {
  switch (action.type) {
    //리턴하는 값이 리듀서의 새로운 state값이 된다.
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      //reducer에서 created_data를 못받았기떄문에 별돌 써준다
      const created_date = new Date().getTime();

      //onCreate함수를 수정하면서 전달했던 Data를 spread연산자로 펼쳐준다
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }

    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }

    case "EDIT": {
      return action.map((it) =>
        it.id === action.targetId ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};

//231117 ContextAPI
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  //231117 dispatch를 호출하면, reducer이 실행되고, 그 reducer가 return 하는 값이 데이터의 값이 된다.
  const [data, dispatch] = useReducer(reducer, []);

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

    //231117 init에 필요한 데이터(두번째 인자)를 전달하지않으면 reducer는 알길이 없음
    dispatch({ type: "INIT", data: initData });
  };

  //마운트 시점에 수행할 콜백함수에 getData라고 api를 호출하는 함수를 적용
  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 1500);
  }, []);

  // author, content, emotion을 Oncreate함수가 받아서 이데이터에 업데이트 시키려고함
  // 안에 값들을 oncreate가 파라미터로 값으로 받을예정

  //231115
  //첫번째 인자로 전달하는 콜백 함수가 다이어리 에디터가 작성 완료를 눌렀을 때 데이터를 추가하는 함수가 되고,
  //두번째 인자로는 Depth를 전달하는데 빈배열로 전달해서 마운트 되는 시점에 한 번만 만들고 그다음 부터는 첫 번째 만들었던 함수를
  //그대로 재사용할 수 있도록 -> onCreate홤수가 재생성 되지 않으면 최신의 데이터 스테이트의 값을 참고할수가 없게 되는 딜레마 발생

  // => 함수형 업데이트를 활용한다. 화살표 함수로 전달함 여기에다가 인자로 데이터를 받아서
  // 아이템을 추가한 데이터를 리턴하는 그런 콜백 함수를 이 set data함수에다가 전달 할것, 이렇게 상태 변화 함수,
  //set state함수에 함수를 전달하는 것을 함수형 업데이트라고 표현하는데 이렇게 되면 dependency array를 비워도 항상 최슨의 state를 인자를 통해서 창고할 수 있게 되면서
  //우리가 이 depth를 비울수 있게 된다.   setData((data) => [newItem, ...data])

  const onCreate = useCallback((author, content, emotion) => {
    // 231117 새로운 아이템의 데이터를 전달해 줘야 되기 때문에 데이터값은 newItem에 있는 프로퍼티를 사용
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });

    //데이터아이디 +1되어야함
    dataId.current += 1;
  }, []);

  //231116 최적화 useCallback묶은다음 Dependency Array에 아무것도 전달 안한다음, setData에 함수형 업데이트 하도록 지시해야됨
  //아래에 선언된 New Diary List가 필터로 생성 되고 있음("const newDiaryList = data.filter((it) => it.id !== targetId)")이거를 수정해야함

  const onRemove = useCallback((targetId) => {
    //targetid를 지워달라고 할꺼기 때문에 id값만 전해주면 된다.
    dispatch({
      type: "REMOVE",
      targetId,
    });
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: "EDIT", targetId, newContent });
  }, []);

  //231117 onCreate,onEdit, onRemove함수들을 리렌더링 되지않게 묶음& 절대 재생성될일 없게 Depth를 빈배열로 전달
  //useMemo를 활용해야하는 이유 => 사용하지 않는다면 앱 컴포넌트가 재생성될때 객체도 재생성되기 때문이다(어쩔수 없는부분)
  //그렇기 때문에 useMemo를 활용해서 재생성되지 않게 객체로 묶어 줘야한다.
  const memoizedDispatches = useMemo(() => {
    return {
      onCreate,
      onEdit,
      onRemove,
    };
  }, []);

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
    //231117 value 값에 함수를 전달해주게 되면 재생성이 됨
    //즉 provider도 컴포넌트기 떄문에 props가 바뀌면 재생성 되어버린다 => 최적화한게 무쓸모됨
    //데이터 스테이츠가 업데이트 될때마다 리렌더링 된단 소리

    //이럴떈, 문맥, 컨텍스트 를 중첩으로 사용하면 된다(ex: diaryStateContext는 오직 이 데이터, 다이어리를 위해 존재하게 만들어 준다.
    //지금 우리가 전달하려는 값 onCreate,onEdit, onDelete와 같은 state를 변화시키는 함수  => dispatch를 내보내려 하는것)
    //이럴땐 export const diary-dispatch-context라고 새로운 컨텍스트를 하나더 생성해준다.

    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        {/* 이중 문맥으로 감싸져있다. 이 dispatch함수들을
        DiaryDispatchContext.Provider의 value값에 함수를 전달해주면 된다. 
        그러면 다시 렌더링 될 이유가 없기 때문에 다시 렌더링 되지 않는다.
        => onCreate,onEdit, onRemove는 재생성되지않는 함수들로만 이루어져 있기 때문에 리렌더링 되지않게 만들면 됨*/}

        <DiaryEditor onCreate={onCreate} />
        <div>전 체 일 기 : {data.length}</div>
        <div>기 분 좋 은 일 기 갯 수 : {goodCount}</div>
        <div>기 분 나 쁜 일 기 갯 수 : {badCount}</div>
        <div>기 분 좋 은 일 기 비 율 : {goodRatio}%</div>
        <DiaryList />
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
