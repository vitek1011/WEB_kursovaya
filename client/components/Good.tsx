// import image from "../images/movieHouse.png";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import Window from "./goodModal";
import { Good } from "../redux/types";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    backgroundColor: "#CFD8DC",
    margin: "5px",
  },
  media: {
    height: 140,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

interface GoodProps {
  good: Good;
  user: {
    username: string;
  };
  onDeleteGood: (id: string) => void;
  onUpdateGood: (good: Good) => void;
  onAddToCart: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    good: Good
  ) => void;
}

export default ({
  good,
  onAddToCart,
  user,
  onDeleteGood,
  onUpdateGood,
}: GoodProps) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia className={classes.media} image={good.image.url} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {good.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {good.description}
          </Typography>
          <Typography variant="h3" component="h4">
            {good.price}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {user.username && (
          <div>
            <Window type="edit" good={good} update={onUpdateGood} />

            <Button
              variant="contained"
              color="secondary"
              size="small"
              className={classes.button}
              startIcon={<DeleteIcon />}
              onClick={() => onDeleteGood(good.id)}
            >
              Удалить
            </Button>
          </div>
        )}
      </CardActions>
    </Card>
  );
};
