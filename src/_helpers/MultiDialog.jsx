import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const MultiDialog = (props) => {
  const [open, setOpen] = React.useState(false);
  const { modalTitle, contentText, doSave } = props;

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onSave = () => {
    doSave();
  };
  return (
    <div>
      <Button onClick={onOpen}>Клиенты</Button>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{modalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{contentText}</DialogContentText>
          <CustomerAddEdit
            name="name"
            label="Наименование"
            defaultValue="input..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export { MultiDialog };