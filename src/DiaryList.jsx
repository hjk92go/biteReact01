import DiaryItem from "./DiaryItem";

const DiaryList = ({ onEdit, diaryList, onRemove }) => {
  return (
    <div className="DiaryList">
      <h1>일기 리스트</h1>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {diaryList.map((it) => (
          //하나의 객체에 포함된 모든 데이터를 스프레드 연산자를 통해서 다 전달한다.
          <DiaryItem key={it.id} {...it} onEdit={onEdit} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};

//undefined로 전달될것같은 props들을 기본적으로 설정할수 있는 기능
DiaryList.defaultProps = {
  diaryList: [],
};

export default DiaryList;
