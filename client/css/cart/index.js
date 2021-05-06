import styled from "styled-components";

export const CartWrapper = styled.table`
  margin: 3vh 1.5vw 1.5vh 1.5vw;

  .total {
    text-align: right;
  }

  .quantity {
    width: 50px;
  }

  .btn {
    padding-top: 1px;
  }

  .left,
  .right {
    display: inline-block;
    width: 100%;
    margin-right: -100%;
  }

  .right {
    text-align: right;
  }

  .left a,
  .right a {
    display: inline-block;
    position: relative;
  }

  .left a {
    width: 200px;
    height: 100px;
    background: green;
  }

  .right a {
    width: 100px;
    height: 200px;
    background: pink;
  }
`;

export const EmptyCart = styled.div`
  text-align: center;
  font-size: 50px;
  height: 100vh;
  padding-top: 30vh;

  .btn {
    font-size: 30px;
  }
`;
