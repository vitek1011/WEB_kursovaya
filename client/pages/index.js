import React, { Component } from "react";
import { connect } from "react-redux";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";

import Head from "next/head";
import Good from "../components/Good";
import { addToCart } from "../redux/actions/cartActions";
import {
  getGoods,
  deleteGood,
  updateGood,
} from "../redux/actions/goodsActions";
import { Form } from "formik";

class Home extends Component {
  state = {
    filter: "",
  };

  componentDidMount() {
    this.props.onGetGoods();
  }

  onAddToCart = (e, good) => {
    e.preventDefault();
    this.props.onAddToCart(good);
  };

  render() {
    const goods = this.props.goods.goods;
    const users = this.props.users;

    return (
      <div>
        <Head>
          <title>Test</title>
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          />
        </Head>

        {/* <FormGroup>
          <FormControlLabel
            control={<Checkbox name="filter" />}
            label="Gilad Gray"
          />
          <FormControlLabel
            control={<Checkbox name="filter" />}
            label="Jason Killian"
          />
          <FormControlLabel
            control={<Checkbox name="filter" />}
            label="Antoine Llorca"
          />
        </FormGroup> */}

        <RadioGroup
          aria-label="Выберите фильтр"
          name="filter"
          value={this.state.filter}
          onChange={(e) => {
            console.log(e.target.value);
            this.setState({ filter: e.target.value });
            this.props.onGetGoods(e.target.value);
          }}
        >
          <FormControlLabel value="name" control={<Radio />} label="Имя" />

          <FormControlLabel value="price" control={<Radio />} label="Цена" />
        </RadioGroup>

        <div className="row row-cols-1 row-cols-md-3 container mx-auto">
          {goods.map((good) => (
            <Good
              key={good.id}
              good={good}
              onAddToCart={this.onAddToCart}
              onDeleteGood={this.props.onDeleteGood}
              onUpdateGood={this.props.onUpdateGood}
              user={users}
            />
          ))}
        </div>

        <style jsx>{`
          .row-cols-md-3 {
            margin: 3vh 1.5vw 1.5vh 1.5vw;
          }
        `}</style>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGetGoods: (filter) => {
      dispatch(getGoods(filter));
    },
    onAddToCart: (good) => {
      dispatch(addToCart(good));
    },
    onDeleteGood: (id) => {
      dispatch(deleteGood(id));
    },
    onUpdateGood: (good) => {
      dispatch(updateGood(good));
    },
  };
};

const mapStateToProps = (state) => ({
  goods: state.goods,
  users: state.users,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
