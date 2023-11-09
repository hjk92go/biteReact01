// 부모, <App />에서 state-> count, text가 있을경우
// 해당 state를 prop를 받는 컴포넌트는 업데이트 될때마다 리렌더링이 된다.

//ex) <CountView />는 count를, <TextView />는 text를 prop받는다고 가정,
// count가 업데이트 되면, <CountView />는 당연히 리렌더
// <TextView />는 리렌더링 될 필요 없는데 리렌더링 되므로 불필요한 연산이 발생됨 -> 성능상 문제로 이어짐

//자식 컴포넌트에 조건을 걸어서 해결(사용하는 state가 업뎃될때라는 조건을 건다.)

//React.memo 기능 => 함수형 컴포넌트에게 업데이트 조건을 걸자
//React.memo는 고차 컴포넌트( HOC, Higher Order Component )
//-> 고차 컴포넌트는 컴포넌트를 가져와 새 컴포넌트를 반환하는 함수

//React.memo는 동일한 props로 동일한 결과를 렌더링한다면 결과를 메모이징하고, 렌더링하지 않고 마지막으로 렌더링된 결과를 재사용
//=(똑같은 prop을 받으면 똑같은걸 내놓겠다, 똑같은 prop을 바뀐것처럼 줘도 똑같잖아 하고 계산X(리렌더X))

//const MyComponent = React.memo(function MyComponent(props) {
/* props를 사용하여 렌더링 */
//컴포넌트를 이렇게 감싸주게 되면,
//props가 바뀌지 않으면 리렌더링 하지 않은 강화된 컴포넌트를 돌려주겠다는 의미
//});
