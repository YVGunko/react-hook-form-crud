import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Unstable_Grid2';
import {
	IconButton, Tooltip,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CreatableSelect from 'react-select/creatable';
import { CustomerDialog } from '../customers/CustomerDialog';
import {
	customerService,
} from '@/_services';

function CustomerBox({ onChange, value, resetField, isSubmitting }) {

	const [customers, setCustomers] = useState([]);
	const [saveCustomer, setSaveCustomer] = useState(false);
	console.log("CustomerBox value -> ", value);
	const [customer, setCustomer] = useState({});// the purpose is to provide customer object
	const [selectedCustomerId, setSelectedCustomerId] = useState(value || "");
	const [openCD, setOpenCD] = useState(false); /* CustomerDialog open state */

	const fetchCustomers = useCallback(async () => {
		console.log("CustomerBox useEffect fetchCustomers -> ", customer);
		const rawCustomers = await customerService.getAll();
		setCustomers(rawCustomers);
	}, []);
	useEffect(() => {
		fetchCustomers();
	}, [saveCustomer, fetchCustomers]);

	useEffect(() => {
		const find = customers.find((c) => c.id === selectedCustomerId);
		if (find) {
			console.log("CustomerBox useEffect selectedCustomerId was found -> ", selectedCustomerId);
			setCustomer(find);
			//resetField("customer_id", { defaultValue: selectedCustomerId });
		}
	}, [customers, selectedCustomerId, resetField]);

	useEffect(() => {
		console.log("CustomerBox useEffect customer -> ", customer);
		if (customer?.id) setSelectedCustomerId(customer?.id);
	}, [customer]);

	const handleCustomerOnChange = (val) => {
		if (customers && val) {
			console.log("CustomerBox handleCustomerOnChange val -> ", val);
			const find = customers.find((c) => c.id === val);
			if (find) {
				console.log("CustomerBox handleCustomerOnChange find -> ", find);
				setCustomer(find);
			} else {
				setCustomer({ id: "new", name: val || "", email: "", phone: "" });
			}
		}
	}

	const handleCreate = (inputValue) => {
		setCustomer({ id: "new", name: inputValue, email: "", phone: "" });
		setOpenCD(true);
	};

	return (
		<Grid container={true} spacing={2} md={12} direction='row' wrap='nowrap' >
			<Grid item md={10} xs={10} >
				{customers && (
					<CreatableSelect
						options={customers.map((item) => ({
							value: item.id,
							label: item.name
						}))}
						onChange={val => {
							console.log(`CustomerBox CreatableSelect onChange val -> ${JSON.stringify(val)}`);
							onChange(val?.value);
							handleCustomerOnChange(val?.value);
						}}
						value={{ value: customer?.id, label: customer?.name }}
						isSearchable
						isDisabled={isSubmitting}
						placeholder="Клиент"

						onCreateOption={handleCreate}
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
					handleCustomerOnChange(value);
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
	resetField: PropTypes.func,
};