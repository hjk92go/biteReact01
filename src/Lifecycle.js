import { useEffect, useState } from "react";

const Lifecycle = () => {
  //   const [count, setCount] = useState(0);
  //   const [text, setText] = useState("");

  const [isVisivle, setIsVisivle] = useState(false);
  const toggle = () => setIsVisivle(!isVisivle);
  const UnmountTest = () => {
    useEffect(() => {
      console.log("Mount!!!");
      //unmount 만드는법  => mount를 제어하는 useEffect에 전달되는 callback함수가 함수하나를 return 하게 하면됨
      return () => {
        //unMount 시점에 실행됨
        console.log("UnMount!!!");
      };
    }, []);

    return <div>Unmount Testing Component</div>;
  };

  //라이프 사이클(1)_Mount
  //컴포넌트가 탄생할때, 즉 마운트 될때 제어해볼수 있는 Hook => useEffect

  /**
   * 
  useEffect(() => {
      console.log("Mount!!!");
    }, []);
    
    */

  //라이프 사이클(2)_Update
  //컴포넌트가 업데이트되는 순간을 제어(state변경, props변경, 부모 컴포넌트 리렌더링...등..) = 리렌더링된다

  /**
   * 
  useEffect(() => {
    console.log("Update!!!");
  });

  useEffect(() => {
    console.log(`count is update: ${count}!!!`);

    if (count > 5) {
      alert("Count가 5를 넘었습니다. 따라서 1로 초기화 합니다.");
      setCount(1);
    }
  }, [count]);

  useEffect(() => {
    console.log(`count is update: ${text}!!!`);
  }, [text]);
  */

  //라이프 사이클(3)_UnMount
  //Unmount가 되는 순간을 제어해볼예정
  useEffect(() => {
    console.log("mount!!!");
  });

  return (
    <div className={{ padding: 20 }}>
      {/* {count}
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +
      </button>
      <div>
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </div> */}

      <button onClick={toggle}>ON/OFF</button>

      {isVisivle && <UnmountTest />}
    </div>
  );
};

export default Lifecycle;
