import { useRef, useState } from "react";

const DiaryItem = ({
  id,
  author,
  content,
  emotion,
  created_date,
  onRemove,
  onEdit,
}) => {
  //수정을 위한form(수정중인지, 수정전 값을 보관할state)
  const [isEdit, setIsEdit] = useState(false);
  const toggleIsEdit = () => setIsEdit(!isEdit);

  //수정폼에 입력하는 데이터핸들링을 위해 state
  const [localContent, setLocalContent] = useState(content);

  //focus
  const localContentInput = useRef();

  const handleRemove = () => {
    if (window.confirm(`${id}번째 일기를 정말 삭제하겠습니까?`)) {
      onRemove(id);
    }
  };

  //수정취소를 눌렸을때 원래의 값이 돌아오게
  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content);
  };

  //수정완료를 눌렸을때 이벤트 처리할 함수
  const handleEdit = () => {
    //값을 보내기전 확인작업

    if (localContent.length < 5) {
      localContentInput.current.focus();
      return;
    }
    if (window.confirm(`${id}번째 일기를 수정하시겠습니까?`)) {
      onEdit(id, localContent);

      //수정폼을 닫아줘야함
      toggleIsEdit();
    }
  };

  return (
    <div className="DiaryItem">
      <div className="info">
        <span className="author_info">
          | 작성자 : {author} | 감정점수 : {emotion} |
        </span>
        <br />
        <span className="date">{new Date(created_date).toLocaleString()}</span>
      </div>
      <div className="content">
        {isEdit ? (
          <>
            <textarea
              ref={localContentInput}
              value={localContent}
              onChange={(e) => {
                setLocalContent(e.target.value);
              }}
            />
          </>
        ) : (
          <>{content}</>
        )}
      </div>

      {isEdit ? (
        <>
          <button onClick={handleQuitEdit}>취 소</button>
          <button onClick={handleEdit}>완 료</button>
        </>
      ) : (
        <>
          <button onClick={handleRemove}>삭 제 하 기</button>
          <button onClick={toggleIsEdit}>수 정 하 기</button>
        </>
      )}
    </div>
  );
};

export default DiaryItem;
