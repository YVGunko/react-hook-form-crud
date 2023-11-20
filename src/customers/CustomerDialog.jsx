import React, {useMemo, useEffect} from "react";
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useConfirm } from "material-ui-confirm";
import TextField from "@mui/material/TextField";
import {
  customerService, alertService
} from '@/_services';

function handleOnSubmit(event, handleSubmit, onSubmit) {
  event?.preventDefault();
  event?.stopPropagation(); 
  handleSubmit(onSubmit)(event);
}

const NEW_CUSTOMER = "Добавить клиента";
const EDIT_CUSTOMER = "Изменить данные клиента";
const FORM_DESCRIPTION = "Внесите данные клиента. Минимальная длина наименования 5 букв.";

const CustomerDialog = (props) => {
  const { open, setOpen, customer, setSaveCustomer } = props;
  const defaultValues = useMemo(() => {
    console.log("CustomerDialog useMemo open -> ", open);
    return {
      id: customer?.id || "new",
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || ""
    }
  },[open]);

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset
  } = useForm({
    defaultValues
  });
  /* for ConfirmProvider */
  const confirm = useConfirm();

  useEffect(() => {
    // this will reset to defaultValues as said in the docs
    reset(defaultValues)
 }, [open, reset])

  console.log("CustomerDialog ->", customer);
  const { ref: inputRefName, ...inputPropsName } = register("name", {
    required: "Необходимо заполнить.",
    minLength: {
      value: 5,
      message: "Не менее 5 букв."
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
      value: /^[\d]{3}-[\d]{3}-[\d]{4}/i,
      message: "формат номера 000-000-0000"
    }
  });

  function handleOnClose() {
    console.log("isDirty -> ", isDirty)
    if (isDirty) {
      confirm({ description: `Были внесены изменения, закрыть не сохраняя?` })
      .then()
      .then(() => setOpen(false));
    } else setOpen(false);
  }
  function onSubmit(data) {
    return (data?.id === "new")
        ? createCustomer(data)
        : updateCustomer(data);
  }
  function createCustomer(data) {
    return customerService.create(data)
      .then((data) => {
        alertService.success(`Клиент ${data.name} добавлен`, { keepAfterRouteChange: true });
      })
      .then(setSaveCustomer(true));      
  }
  function updateCustomer(data) {
    return customerService.update(data.id, data)
      .then((data) => {
        alertService.success(`Данные клиента ${data.name} изменены`, { keepAfterRouteChange: true });
      })
      .then(setSaveCustomer(true));      
  }
  return (
    <div>
      <Dialog open={open} onClose={handleOnClose} >
        <form onSubmit={(event) => {handleOnSubmit(event, handleSubmit, onSubmit);}}>
          <DialogTitle>{customer.id === "new" ? NEW_CUSTOMER : EDIT_CUSTOMER}</DialogTitle>
          <DialogContent >
            <DialogContentText>{FORM_DESCRIPTION}</DialogContentText>
            <TextField sx={{ mt: 1, mb: 1 }} 
              focused
              inputRef={inputRefName}
              {...inputPropsName}
              label="Наименование"
              error={!!errors?.name}
              helperText={errors?.name?.message}
              size="small"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField sx={{ mt: 1, mb: 1 }} 
              inputRef={inputRefEmail}
              {...inputPropsEmail}
              label="E-Mail"
              error={!!errors?.email}
              helperText={errors?.email?.message}
              size="small"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField sx={{ mt: 1, mb: 1 }} 
              inputRef={inputRefPhone}
              {...inputPropsPhone}
              label="Телефон"
              error={!!errors?.phone}
              helperText={errors?.phone?.message}
              size="small"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOnClose}>Закрыть</Button>
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
  customer: PropTypes.object.isRequired,
  setSaveCustomer: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
};


