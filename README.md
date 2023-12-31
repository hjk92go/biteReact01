# 한입 크기로 잘라 먹는 리액트 실습 따라하기 (1)

# 간단한 일기장 프로젝트

git clone url
git pull

# React 컴포넌트의 생애 주기(생명주기)

- 탄생 : 화면에 나타나는 순간(Mount)

  - ComponentDidMount => 컴포넌트가 마운트 되는 순간에 어떤걸 수행할수 있는 함수

- 변화 : 업데이트(리렌더\_Update)
  state가 바뀌거나 부모가 리렌더 되거나 prop이 바뀌어서 컴포넌트 자신이 리렌더 되는과정을 변화라고 표현

  - ComponentDidUpdate => 컴포넌트가 변화 하는 순간에 사용

- 죽음 : 컴포넌트가 화면에서 사라지는것(UnMount)
  - ComponentWillUnmount => 컴포넌트가 언마운트 되기전에 호출해서 사용

# React Hooks

- 함수형 컴포넌트에서 클래스형 컴포넌트의 기능을 훔쳐와서 사용할수 있도록 도와주는 기능
- 중복 코드, 가독성 문제 등등을 해결하기 위해 등장함.

# useMemo

- 리액트에서 이렇게 return을 가지고 있는 함수를 메모이제이션 해서 이런 연산을 최적화 하기위해 useMemo를 사용한다.
- 우리가 최적화 하고 싶은 메모이제이션함수를 감싸주면된다.
- useMemo함수를 반환하는게 아니라 값을 반환한다.

- useMemo에서 자주하는 실수
  - useMemo를 사용하게 되면 더이상 함수가 아니게 된다.
  - 왜냐하면 useMemo라는 기능은 어떤 함수를 전달을 받아서 무엇을 리턴하는가? => callback함수가 리턴하는 값을 그냥 리턴하기 때문에

# React.memo(OptimizeTest.js컴포넌트 참고)

- React.memo 기능 => 함수형 컴포넌트에게 업데이트 조건을 걸자
- React.memo는 고차 컴포넌트( HOC, Higher Order Component ) -> 고차 컴포넌트는 컴포넌트를 가져와 새 컴포넌트를 반환하는 함수
- React.memo는 동일한 props로 동일한 결과를 렌더링한다면 결과를 메모이징하고, 렌더링하지 않고 마지막으로 렌더링된 결과를
  재사용(= 똑같은 prop을 받으면 똑같은걸 내놓겠다, 똑같은 prop을 바뀐것처럼 줘도 똑같잖아 하고 계산X(리렌더X))
- React.memo의 비교대상이 객체인 경우 메모리 주소가 다르기 때문에 값이 같다고 다르다고 인지하여 리렌더 시키는 경우가 있음
- -> 이경우에 areEqual를 사용하여 자세히 객체 값을 비교해 준다. true를 반환할 경우 리렌더링X, false를 반환하는 경우 리렌더링O

# useCallback

- 메모이제이션 된 콜백 "함수"를 반환 한다.
- 사용 하기 전 어떤 컴포넌트가 최적화 대상인지 먼저 찾아야함
  -> 리액트 디벨로퍼 툴스 이용하기(디벨로퍼 툴즈 하이라이트 업데이트 웹 컴포넌트 기능 체크 박스를 켜주면 리렌더링이 일어나는 컴포넌트를 쉽게 확인이 가능하다.)

# useReducer

- useState처럼 리액트의 상태관리를 돕는 리액트 훅이다.
- 컴포넌트를 무겁게 사용하는건 좋지 않음 -> 상태 변화 로직들을 컴포넌트에서 분리할 수 있게 되어서 컴포넌트를 더 가볍게 작성할 수 있도록 도와준다.

  - img04참고) "const [count, dispatch] = useReducer(reducer,1);"에서 count는 useState에서의 state라고 생각하고 사용하면 된다.
  - dispatch는 상태를 변화시키는 액션을 발생시키는 함수, useReducer함수를 호출할때 reducer라는 함수를 꼭 전달해줘야한다.
  - 두번째로 전달하는 인자 "1"은 state의 초기값이 된다.

  - const [count, dispatch] = useReducer(reducer,1);를 정리하자면, 초기값이 1로 할당, 이값을 변경시키고 싶으면 상태변화 함수인 디스패치를 호출해서 상태변화를 일으키면, 상태변화 처리 함수인 reducer가 처리를 하게된다.

  - 상태 변화 함수가 일어나는 로직을 살펴보면, onClick={()=> dispatch({type:1})}
    dispatch 함수를 호출하면서 객체를 전달하게 되는데 이객체에는 꼭 type라는 프로퍼티가 들어있다. 이때 dispatch와 함께
    전달되는 이 객체를 우리는 action 객체라고 부른다. action은 곧 상태변화라고 생각하면 된다.

  - 즉 상태 변화를 설명할 객체라고 생각하면 되고, 이 dispatch가호출되면서 전달된 이 action객체는 reducer로 날아가게 된다.
    그러니까 dispatch가 호출이 되면 상태별화가 일어나야하고, 그 상태 변화에 대한 처리는 이 reducer가 수행한다.

  - 그렇게 되면 reduce함수는 디스패치가 일어나면 처리하기 위해 호출 되는데, 첫번재 인자는 가장 최신의 state를 받고, 두번쨰는 디스패치를 호출할 때 전달해줬던 action객체(type:1)를 받게 된다.

# Context API

- 프롭스 드릴링 문제(부모->자식) 해결가능

<사용방법>

- Context 생성

  - const MyContext = React.createContext(defaultvalue);

- Context Provider를 통한 데이터 공급 / 아래와 같이 작성
  - <MyContext.Provider value = { 전역으로 전달하고자하는 값 } > {/_이 Context안에 위치할 자식 컴포넌트들_/}</MyContext.Provider>
- 값을 전달 받을수 있는 컴포넌트 수의 제한은 없고, 프로바이더의 컴포넌트 자식으로만 존재하면 모든 컴포넌트는 이 프로바이더가 전달하는 값을 사용할 수 있다.
