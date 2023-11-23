import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Unstable_Grid2';
import {
  IconButton, Tooltip,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { CreatableSelectBox, SelectBox } from '@/_helpers';
import { CustomerDialog } from '../customers/CustomerDialog';
import {
	alertService, customerService,
} from '@/_services';

function CustomerBox({ onChange, value, isSubmitting}) {
	const [customers, setCustomers] = useState([]);
	const fetchCustomers = useCallback(async () => {
		console.log("fetchCustomers openCD -> ", openCD);
		const rawCustomers = await customerService.getAll();
		setCustomers(rawCustomers.map((item) => ({
			value: item.id,
			label: item.name,
			email: item.email,
			phone: item.phone,
		})));
	}, []);
	useEffect(() => {
		fetchCustomers();
	}, [saveCustomer]);

	// the purpose is to provide customer object 
	const [customer, setCustomer] = useState(customerService.getNew(""));
	const [saveCustomer, setSaveCustomer] = useState("");
	const handleCustomerInputChange = (input, reason) => {

		if (reason.action === "input-change" || reason.action === "set-value") {
			console.log("reason setCustomer ->", reason);
			return;
		}
		if (reason.action === "input-blur" ||
			reason.action === "menu-close") {
			console.log("reason setCustomer ->", reason);
			return;
		}
	};
	const onCustomerBlur = (event) => {
		console.log("onCustomerBlur -> ", event?.target.value);
		if (event?.target.value)
			setCustomer({ id: "new", name: event?.target.value, email: "", phone: "" });
	}
	const handleCustomerOnChange = (val) => {
		/* replace label and value with name and id */
		if (customers && val?.value) {
			const strobj = JSON.stringify(customers.find((c) => c.value === val?.value)).replace("value", 'id').replace("label", 'name');
			setCustomer(JSON.parse(strobj));
		}
	}
	/* */
	async function getNewCustomer(label) {
		let x = {};
		const data = () => ({
			id: "new", name: label, email: "", phone: ""
		});
		x = await customerService.create(data)
			.then((data) => {
				alertService.success(`Клиент ${data.name} добавлен`, { keepAfterRouteChange: true });
			});
		return x.map((item) => ({
			value: item.id,
			label: item.name,
			email: item.email,
			phone: item.phone,
		}))
	};

	/* CustomerDialog open state */
	const [openCD, setOpenCD] = useState(false);

	return (
		<Grid container={true} spacing={2} md={4} direction='row' wrap='nowrap' >
			<Grid item md={10} xs={10} >
				{customers && (
					<SelectBox
						onChange={onChange}
						value={value}
						rows={customers}
						isSearchable
						placeholder="Клиент"
					/>
				)}
			</Grid>
			<Grid item md={2} xs={2} sx={{ ml: -2 }}>
				<CustomerDialog
					open={openCD}
					setOpen={setOpenCD}
					customer={customer}
					setCustomer={setCustomer}
					setSaveCustomer={setSaveCustomer}
				></CustomerDialog>
				<IconButton onClick={() => {
					setOpenCD(true); // update state on click
				}} disabled={isSubmitting} color="info">
					{isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
					<Tooltip id="button-add-customer" title="Создать клиента">
						<EmailOutlinedIcon />
					</Tooltip>
				</IconButton>
			</Grid>
		</Grid>
	)

}
export { CustomerBox };

CustomerBox.propTypes = {
	onChange: PropTypes.func,
	value: PropTypes.string,
	isSubmitting: PropTypes.bool,
};