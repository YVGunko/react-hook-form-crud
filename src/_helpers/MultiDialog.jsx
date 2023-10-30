import * as React from "react";
import PropTypes from 'prop-types';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const MultiDialog = (props) => {
  const [open, setOpen] = React.useState(false);
  const { title, description, content, doSave } = props;

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
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
          {content}
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

MultiDialog.propTypes = {
  title: PropTypes.string.isRequired, 
  description: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired,
  doSave: PropTypes.func.isRequired,
};