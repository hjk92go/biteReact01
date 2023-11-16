import { memo, useEffect, useRef, useState } from "react";

const DiaryItem = ({ onRemove, onEdit, id, author, content, emotion, created_date }) => {
  useEffect(() => {
    console.log(`${id}번 일기아이템 렌더`);
  });

  const localContentInput = useRef();
  const [localContent, setLocalContent] = useState(content);
  const [isEdit, setIsEdit] = useState(false);
  const toggleIsEdit = () => setIsEdit(!isEdit);

  const handleClickRemove = () => {
    if (window.confirm(`${id}번째 일기를 정말 삭제하시겠습니까?`)) {
      onRemove(id);
    }
  };

  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content);
  };

  const handleEdit = () => {
    if (localContent.length < 5) {
      localContentInput.current.focus();
      return;
    }

    if (window.confirm(`${id}번 째 일기를 수정하시겠습니까?`)) {
      onEdit(id, localContent);
      toggleIsEdit();
    }
  };

  return (
    <div className="DiaryItem">
      <div className="info">
        <span className="author_info">
          작성자 : {author} | 감정 : {emotion}
        </span>
        <br />
        <span className="date">{new Date(created_date).toLocaleDateString()}</span>
      </div>
      <div className="content">
        {isEdit ? (
          <textarea
            ref={localContentInput}
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
          />
        ) : (
          content
        )}
      </div>
      {isEdit ? (
        <>
          <button onClick={handleQuitEdit}>수정 취소</button>
          <button onClick={handleEdit}>수정 완료</button>
        </>
      ) : (
        <>
          <button onClick={handleClickRemove}>삭제하기</button>
          <button onClick={toggleIsEdit}>수정하기</button>
        </>
      )}
    </div>
  );
};
export default memo(DiaryItem);

// import React, { useEffect, useRef, useState } from "react";

// //다이어리 아이템은 지금 리액트 메모로 감싼다고 최적화가 이루어지는 컴포넌트는 아님(하단에 감싸놓음)
// //onEdit, onRemove는 데이터 스테이트가 변화하면 재생성될수 밖에 없는 함수
// //그러므로 app.components.로 가서 onCreate를 최적화할때와 같은 방법으로 최적화 해준다.

// const DiaryItem = ({ onRemove, onEdit, id, author, content, emotion, created_date }) => {
//   useEffect(() => {
//     console.log(`${id}번 일기아이템 렌더`);
//   });

//   //수정을 위한form(수정중인지, 수정전 값을 보관할state)
//   const [isEdit, setIsEdit] = useState(false);
//   const toggleIsEdit = () => setIsEdit(!isEdit);

//   //수정폼에 입력하는 데이터핸들링을 위해 state
//   const [localContent, setLocalContent] = useState(content);

//   //focus
//   const localContentInput = useRef();

//   const handleRemove = () => {
//     if (window.confirm(`${id}번째 일기를 정말 삭제하겠습니까?`)) {
//       onRemove(id);
//     }
//   };

//   //수정취소를 눌렸을때 원래의 값이 돌아오게
//   const handleQuitEdit = () => {
//     setIsEdit(false);
//     setLocalContent(content);
//   };

//   //수정완료를 눌렸을때 이벤트 처리할 함수
//   const handleEdit = () => {
//     //값을 보내기전 확인작업

//     if (localContent.length < 5) {
//       localContentInput.current.focus();
//       return;
//     }
//     if (window.confirm(`${id}번째 일기를 수정하시겠습니까?`)) {
//       onEdit(id, localContent);

//       //수정폼을 닫아줘야함
//       toggleIsEdit();
//     }
//   };

//   return (
//     <div className="DiaryItem">
//       <div className="info">
//         <span className="author_info">
//           | 작성자 : {author} | 감정점수 : {emotion} |
//         </span>
//         <br />
//         <span className="date">{new Date(created_date).toLocaleString()}</span>
//       </div>
//       <div className="content">
//         {isEdit ? (
//           <>
//             <textarea
//               ref={localContentInput}
//               value={localContent}
//               onChange={(e) => {
//                 setLocalContent(e.target.value);
//               }}
//             />
//           </>
//         ) : (
//           <>{content}</>
//         )}
//       </div>

//       {isEdit ? (
//         <>
//           <button onClick={handleQuitEdit}>취 소</button>
//           <button onClick={handleEdit}>완 료</button>
//         </>
//       ) : (
//         <>
//           <button onClick={handleRemove}>삭 제 하 기</button>
//           <button onClick={toggleIsEdit}>수 정 하 기</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default React.memo(DiaryItem);
