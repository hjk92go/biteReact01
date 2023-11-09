import React, { useEffect, useState } from "react";
//얕은 비교를 하지 않고 렌더링 최적화 하기

const CounterA = React.memo(({ count }) => {
  useEffect(() => {
    console.log(`CounterA Update - count :: ${count}`);
  });

  return <div>{count}</div>;
});

const CounterB = React.memo(({ obj }) => {
  useEffect(() => {
    console.log(`CounterB Update - count :: ${obj.count}`);
  });

  return <div> {obj.count}</div>;
});

const areEqual = (prevProps, nextProps) => {
  //return true; //이전 프랍이랑 현재 프랍이랑 일치 -> 리렌더링 X
  //return false; //이전과 현재가 다르다 -> 리렌더링 O

  if (prevProps.obj.count === nextProps.obj.count) {
    return true;
  }
  return false;
};

//아래와 같이 사용
const MemoizeCounterB = React.memo(CounterB, areEqual);

const OptimizeTest = () => {
  const [count, setCount] = useState(1);
  const [obj, setObj] = useState({
    count: 1,
  });

  //클릭해서 이벤트를 줬지만 1로 값이 바뀜 -> 결과적으로는 값이 바뀌는게 없는 상황
  return (
    <div style={{ padding: 50 }}>
      <div>
        <h2>Counter A</h2>
        <CounterA count={count} />
        <button onClick={() => setCount(count)}>A Button</button>
      </div>
      <div>
        <h2>Counter B</h2>
        <MemoizeCounterB obj={obj} />
        <button
          onClick={() =>
            setObj({
              count: obj.count,
            })
          }
        >
          B Button
        </button>
      </div>
    </div>
  );
};

export default OptimizeTest;
