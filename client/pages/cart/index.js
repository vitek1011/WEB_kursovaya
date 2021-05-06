import React from "react";
import { connect } from "react-redux";
import Head from "next/head";
import Octicon, { X } from "@primer/octicons-react";

import {
  deleteFromCart,
  incrementCount,
} from "../../redux/actions/cartActions";
import { CartWrapper, EmptyCart } from "../../css/cart";

const Cart = (props) => {
  const onDelete = (e, id) => {
    e.preventDefault();
    props.deleteFromCart(id);
  };

  const calculateCart = () => {
    let sum = 0;

    props.cart.forEach((good) => {
      sum += good.price * good.quantity;
    });

    return sum;
  };

  return (
    <div>
      <Head>
        <title>Test</title>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
        />
      </Head>

      {props.cart.length ? (
        <CartWrapper className="table container mx-auto">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {props.cart.map((good, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <th>{good.name}</th>
                <th>{good.description}</th>
                <th>
                  <input
                    className="quantity"
                    type="number"
                    min="1"
                    max="10"
                    size="1"
                    value={good.quantity}
                    onChange={(e) =>
                      props.incrementCount({ e: e.target.value, id: good.id })
                    }
                  />
                </th>
                <th>
                  <div className="left">{good.price}</div>
                  <div className="right">
                    <button
                      className="btn"
                      onClick={(e) => onDelete(e, good.id)}
                    >
                      <Octicon icon={X} />
                    </button>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
          <th colSpan="5" className="total">
            <p>Total: {calculateCart()}</p>
          </th>
        </CartWrapper>
      ) : (
        <EmptyCart className="cartMsg">
          <p>Your cart is empty</p>
        </EmptyCart>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStateToProps, { deleteFromCart, incrementCount })(
  Cart
);
