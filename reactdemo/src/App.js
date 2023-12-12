import { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import { increment, asyncIncrement, decrement, asyncDecrement } from "./redux/actions";

import http from './utils/apiService.js';
import './App.css';


function App({ count, increments, asyncIncrements, decrements, asyncDecrements }) {
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState([]);
  const keywordRef = useRef(null);
  const handleKeyword = () => {
    let value = keywordRef.current.value;
    setKeyword(value);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await http.get(`/api/search/taobao_suggest?keyword=${keyword}`);
      setData(response.data.result);
    } catch (error) {
      console.error('Error fetching data', error);
      return null;
    }
  }, [keyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className='search-wrapper'>
        <div className='search-main'>
          <div className="card">
            <input
              type="text"
              placeholder='请输入关键字'
              className='keywords'
              ref={keywordRef}
              onChange={handleKeyword}
            />
            <div className='btns' onClick={fetchData}>搜索</div>
          </div>
        </div>
      </div>
      <div className="content-wrapper">
        <div className="content-main">
          <div className="list">
            {
              data ? data.map((item, index) => (
                <div className="item" key={index}>
                  {item[0]}--{item[1]}元
                </div>
              )) : "数据加载中..."
            }
          </div>
        </div>
      </div>
      <div className="counter">
        <h1>Counter:{count}</h1>
        <button onClick={increments}>同步+</button>
        <button onClick={asyncIncrements}>异步+</button>
        <button onClick={decrements}>同步-</button>
        <button onClick={asyncDecrements}>异步-</button>
      </div>
      <div className="grid-container">
        <div className="left">left</div>
        <div className="bottom">bottom</div>
        <div className="right">right</div>
        <div className="top">top</div>
        <div className="middle">middle</div>
      </div>
      <div className="row">

        <div class="col width-2"></div>
        <div class="col width-2"></div>
        <div class="col width-2"></div>
        <div class="col width-2"></div>
        <div class="col width-2"></div>
        <div class="col width-2"></div>

        <div class="col width-4"></div>
        <div class="col width-4"></div>
        <div class="col width-4"></div>

        <div class="col width-6"></div>
        <div class="col width-6"></div>
        <div class="col width-12"></div>
      </div>
    </>
  );
}


const mapStateToProps = (state) => {
  return {
    count: state.count,
  }
}
const mapDispatchToProps = (dispatch) => ({
  increments: () => dispatch(increment()),
  decrements: () => dispatch(decrement()),
  asyncIncrements: () => dispatch(asyncIncrement()),
  asyncDecrements: () => dispatch(asyncDecrement()),
}
)
export default connect(mapStateToProps, mapDispatchToProps)(App);
