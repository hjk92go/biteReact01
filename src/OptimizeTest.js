import React, { useEffect, useState } from "react";

//react.memo를 감싸주면text가 바뀌지 않는이상 바뀌지 않음
const TextView = React.memo(({ text }) => {
  useEffect(() => {
    console.log(`Update :: Text :: ${text}`);
  });

  return <div>{text}</div>;
});

const CountView = ({ count }) => {
  //리렌더링이 일어났을때 프롭스가 각각 어떻게 되는지 확인
  //Count 증가할때마다, text도 같이 호출(react.memo사용x시 자원 낭비)()
  useEffect(() => {
    console.log(`Update :: Count :: ${count}`);
  });

  return <div>{count}</div>;
};

const OptimizeTest = () => {
  const [count, setCount] = useState(1);
  const [text, setText] = useState("");

  return (
    <div style={{ padding: 50 }}>
      <div>
        <div>count</div>
        <CountView count={count} />
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <h2>Text</h2>
        <TextView text={text} />

        <input value={text} onChange={(e) => setText(e.target.value)}></input>
      </div>
    </div>
  );
};

export default OptimizeTest;
