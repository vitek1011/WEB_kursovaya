import React from "react";
import {
  Button,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@material-ui/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
// import { projectStorage } from "../components/base";

const useStyles = makeStyles((theme) => ({
  root: {
    color: "white",
  },
}));

const goodCreateSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  price: Yup.string().required(),
});

const Window = (props) => {
  const [file, setFile] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  // const db = app().firestore();

  const renderInitialValues = () => {
    if (props.good) {
      return props.good;
    } else {
      return { name: "", description: "", price: 0, file: {} };
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderOnSubmit = async (good) => {
    if (props.good) {
      setOpen(false);
      props.update(good);
    } else {
      setOpen(false);
      props.createGood({ ...good, file }).then((data) => {
        console.log(data);
      });

      // const storageRef = projectStorage.ref();
      // const fileRef = storageRef.child(file.name);
      // await fileRef.put(file);
      // // db.collection("goods").doc().
    }
  };

  return (
    <div>
      {props.type === "edit" ? (
        <Button size="small" color="primary" onClick={handleClickOpen}>
          Редактировать
        </Button>
      ) : (
        <Button className={classes.root} onClick={handleClickOpen}>
          Добавить в каталог
        </Button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <Formik
          initialValues={renderInitialValues()}
          validationSchema={goodCreateSchema}
          onSubmit={(values) => {
            renderOnSubmit(values);
          }}
        >
          {({ errors, touched, values, handleChange }) => (
            <Form>
              <DialogTitle id="form-dialog-title">
                Добавить в каталог
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Заполните поля для добавления в каталог.
                </DialogContentText>

                <TextField
                  autoFocus
                  value={values.name}
                  error={errors.name && touched.name}
                  margin="dense"
                  name="name"
                  onChange={handleChange}
                  label="Название детали"
                  type="text"
                  helperText={errors.name}
                  fullWidth
                />

                <TextField
                  error={errors.description && touched.description}
                  margin="dense"
                  name="description"
                  label="Описание детали"
                  type="text"
                  value={values.description}
                  helperText={errors.description}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  error={errors.price && touched.price}
                  margin="dense"
                  name="price"
                  label="Цена"
                  type="number"
                  value={values.price}
                  helperText={errors.price}
                  onChange={handleChange}
                />

                <input
                  type="file"
                  name="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Отмена
                </Button>
                <Button type="submit" color="primary">
                  Добавить
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default Window;
