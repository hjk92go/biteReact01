import React, { useEffect, useState } from "react";

//버튼을 눌렸을때 A는 리렌더X, B는 O인 이유
//obj.count에서 count는 1로 setCount하는 격 But 콜솔 출력됨 이유? prop인 obj가 객체이기 때문에
// 객체를 비교할때 얕은 비교를 하기 때문에 문제 발생(값에 의한 비교X, 주소에 의한 비교를 하기때문(img01,02참고_객체들은 생성하자마자 메모리주소를 가짐 / 03처럼 선언된다면, 같은 메모리 값을 가지게됨))
/**
  
  function MyComponent(props) { }
  function areEqual(prevProps, nextProps) {

  export default React.memo(MyComponent, areEqual);

  areEqual라는 함수는 nextProps가 prevProps와 동일한 값을 가지면 true를 반환하고, 그렇지 않다면 false를 반환하게 안에서 코딩하고, 
  결론적으로 비교하여 함수로서 사용 되기 때문에 기존에 얖은 비교하게 하지 않고, 여기서 깊은 비교를 구현하여 true를 반환하면 리렌더링을 안시킬수도 있고
  false를 반환하면 렌더링을 시킬 수도 있다.



  */

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
        <CounterB obj={obj} />
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
