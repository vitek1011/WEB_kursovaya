import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ThunkDispatch } from "redux-thunk";
import { bindActionCreators } from "redux";

import { login, logout, whoami } from "../redux/actions/usersActions";
import { createGood, getGoods } from "../redux/actions/goodsActions";
import Window from "./goodModal";
import Cart from "../pages/cart";
import Home from "../pages";
import { Good, AppActions } from "../redux/types";
import { AppState } from "../redux/reducers";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 3,
  },
  bg: {
    backgroundColor: "#120a8f",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  tabs: {
    position: "relative",
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: "contents",
    [theme.breakpoints.up("md")]: {
      display: "block ruby",
    },
    color: "white",
    root: {
      color: "white",
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface NavProps {
  onWhoami: (username: string) => void;
  users: {
    username: string;
  };
  onLogining: (username: string) => void;
  onLogout: (username: string) => void;
  onCreateGood: (good: Good) => void;
}

type Props = NavProps & LinkDispatchProps & LinkStateProps;

const Nav = (props: Props) => {
  const [username, setUsername] = useState("");
  const [erorr, setError] = useState(false);

  const classes = useStyles();
  const [value, setValue] = useState(0);

  useEffect(() => {
    props.onWhoami(props.users.username);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      props.onGetGoods();
    }
  };

  const onLogin = (e) => {
    e.preventDefault();

    if (username !== "") {
      props.onLogining(username);
      setError(false);
    } else {
      setError(true);
    }
  };

  const onLogout = (e) => {
    e.preventDefault();
    props.onLogout(props.users.username);
  };

  let authButtons;
  if (props.users.username != null) {
    authButtons = (
      <div className={classes.sectionDesktop}>
        {props.users.username}
        <Window createGood={props.onCreateGood} />
        <Button className={classes.sectionDesktop} onClick={(e) => onLogout(e)}>
          Выйти
        </Button>
      </div>
    );
  } else {
    authButtons = (
      <div className={classes.sectionDesktop}>
        <TextField
          color="secondary"
          label="Введите логин"
          variant="filled"
          size="small"
          onChange={(e) => setUsername(e.target.value)}
          helperText={erorr != false ? "Incorrect entry." : ""}
        />
        <Button color="inherit" onClick={(e) => onLogin(e)}>
          Войти
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.bg}>
        <Toolbar>
          <Typography variant="h6" className={classes.title} noWrap>
            Каталог
          </Typography>
          <div className={classes.tabs}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="Каталог" {...a11yProps(0)} />
              {/* <Tab label="Cart" {...a11yProps(1)} /> */}
            </Tabs>
          </div>
          <div className={classes.grow} />

          {authButtons}
        </Toolbar>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Home />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Cart />
      </TabPanel>
    </div>
  );
};

interface LinkStateProps {
  users: {
    username: string;
  };
}

interface LinkDispatchProps {
  onWhoami: (username: string) => void;
  onLogining: (username: string) => void;
  onCreateGood: (good: Good) => void;
  onLogout: (username: string) => void;
  onGetGoods: () => void;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchProps => ({
  onWhoami: bindActionCreators(whoami, dispatch),
  onLogining: bindActionCreators(login, dispatch),
  onCreateGood: bindActionCreators(createGood, dispatch),
  onLogout: bindActionCreators(logout, dispatch),
  onGetGoods: bindActionCreators(getGoods, dispatch),
});

const mapStateToProps = (state: AppState): LinkStateProps => ({
  users: state.users,
});

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
