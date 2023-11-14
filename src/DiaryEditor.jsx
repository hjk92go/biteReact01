import React, { useEffect, useRef, useState } from "react";

const DiaryEditor = ({ onCreate }) => {
  useEffect(() => {
    console.log("Diary Editor 렌더");
  });

  const authorInput = useRef();
  const contentInput = useRef();

  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 1,
  });

  //동작이 비슷한 state는 두개로 구분하지 않고 하나도 묶어줄수있다.
  //   const [author, setAuthor] = useState("hjk");
  //   const [content, setContent] = useState("");

  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value, //이 컨텐츠와 변경할 태그의 이름인 컨텐츠의 이름은 실제로 바꿔야하는 state property키와 같다.
    });
  };

  const handleSubmit = () => {
    if (state.author.length < 1) {
      authorInput.current.focus();
      return;
    }

    if (state.content.length < 5) {
      contentInput.current.focus();
      return;
    }

    onCreate(state.author, state.content, state.emotion);
    alert("저장 성공");

    //저장 성공시 초기화
    setState({
      author: "",
      content: "",
      emotion: 1,
    });
  };

  return (
    <div className="DiaryEditor">
      <h2>오 늘 의 일 기</h2>

      <div>
        <input
          ref={authorInput}
          name="author"
          value={state.author}
          onChange={handleChangeState}
          placeholder="작성자"
          type="text"
          //onChange={(e) =>
          // setState({
          //      ...state, //원래의 값으로 미리 펼쳐버리기때문에 변하는값 하나만 아래와 같이 표현이 가능해진다.
          //순서를 밑으로 주면 굉장히 이상해지므로(업데이트했지만, 다시 원래 값으로 덮어짐 => 업데이트가 안되는 현상 발생)
          // author: e.target.value,
          //  })
          // }
        />
      </div>

      <div>
        <textarea
          ref={contentInput}
          value={state.content}
          onChange={handleChangeState}
          name="content"
          placeholder="일기"
          type="text"
        />
      </div>

      <div>
        <select name="emotion" value={state.emotion} onChange={handleChangeState}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>

      <div>
        <button onClick={handleSubmit}>일 기 저 장 하 기</button>
      </div>
    </div>
  );
};

//231114 일기리스트가 아닌 일기 작성하는 폼이 일기가 삭제되었다고 렌더링 될 필요가 없으므로
//React.memo를 써줘서 최적화를 진행해준다.

//컴포넌트에 작성하기 힘든경우에, 아래와 같이 export default에 묶어주면
//react메모로 묶인 다이어리를 에디터 밖으로 내보내겠단 뜻으로 결론적으로 똑같게 됨
export default React.memo(DiaryEditor);
