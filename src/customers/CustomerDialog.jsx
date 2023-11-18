import React, {useMemo, useEffect} from "react";
import { useForm, useFormState } from 'react-hook-form';
import { ErrorMessage } from "@hookform/error-message";
import PropTypes from 'prop-types';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import {
  customerService, alertService
} from '@/_services';

const CustomerDialog = (props) => {
  const { open, title, description, customer, setCustomer, onClose } = props;
  const defaultValues = useMemo(() => {
    return {
      id: customer?.id || 0,
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || ""
    }
  },[open]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    defaultValues
  });

  useEffect(() => {
    // this will reset to defaultValues as said in the docs
    reset(defaultValues)
 }, [open, reset])

  /*const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {
      id: customer?.id || 0,
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || ""
    }
  });*/

  console.log("CustomerDialog ->", customer);
  const { ref: inputRefName, ...inputPropsName } = register("name", {
    required: "Необходимо заполнить.",
    minLength: {
      value: 5,
      message: "Не короче 5 букв."
    }
  });
  const { ref: inputRefEmail, ...inputPropsEmail } = register("email", {
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "введите email"
    }
  });
  const { ref: inputRefPhone, ...inputPropsPhone } = register("phone", {
    pattern: {
      value: /^\([\d]{3}\) [\d]{3}-[\d]{4}/i,
      message: "формат номера (000) 000-0000"
    }
  });
  async function onSubmit(data) {
    alert(JSON.stringify(data));
    return customerService.create(data)
      .then(() => {
        alertService.success('Customer added', { keepAfterRouteChange: true });
        setCustomer(data)
      })
      .then(reset())      
  }

  return (
    <div>
      <Dialog open={open} onClose={onClose} >
        <form onSubmit={(event) => {if (event) console.log("event found"); event?.preventDefault();
    event?.stopPropagation();handleSubmit(onSubmit)(event)}}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{description}</DialogContentText>
            <TextField
              inputRef={inputRefName}
              {...inputPropsName}
              placeholder="input name..."
              label="Наименование"
              error={!!errors?.name}
              helperText={errors?.name?.message}
            />
            <TextField
              inputRef={inputRefEmail}
              {...inputPropsEmail}
              label="email"
              placeholder="input email..."
              error={!!errors?.email}
              helperText={errors?.email?.message}
            />
            <TextField
              inputRef={inputRefPhone}
              {...inputPropsPhone}
              label="Телефон"
              placeholder="input Телефон..."
              error={!!errors?.phone}
              helperText={errors?.phone?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Закрыть</Button>
            <Button type="submit">Сохранить</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
export { CustomerDialog };

CustomerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  customer: PropTypes.object.isRequired,
  setCustomer: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  doSave: PropTypes.func.isRequired
};