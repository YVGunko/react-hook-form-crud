import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Unstable_Grid2';
import {
	IconButton, Tooltip,
} from '@mui/material';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import CreatableSelect from 'react-select/creatable';
import { CustomerDialog } from '../customers/CustomerDialog';
import {
	customerService,
} from '@/_services';

function CustomerBox({ onChange, value, isDisabled, isSubmitting }) {

	const [customers, setCustomers] = useState([]);
	const [saveCustomer, setSaveCustomer] = useState(false);
	const [customer, setCustomer] = useState({});// the purpose is to provide customer object
	const [selectedCustomerId, setSelectedCustomerId] = useState(value || "");
	const [openCD, setOpenCD] = useState(false); /* CustomerDialog open state */

	const fetchCustomers = useCallback(async () => {
		const rawCustomers = await customerService.getAll();
		setCustomers(rawCustomers);
	}, []);
	useEffect(() => {
		fetchCustomers();
	}, [saveCustomer, fetchCustomers]);

	useEffect(() => {
		const find = customers.find((c) => c.id === selectedCustomerId);
		if (find) {
			setCustomer(find);
			onChange(find?.id); //atempt to set customer_id field
		}
	}, [customers, selectedCustomerId]);

	useEffect(() => {
		if (customer?.id) setSelectedCustomerId(customer?.id);
	}, [customer]);

	const handleCustomerOnChange = (val) => {
		if (customers && val) {
			const find = customers.find((c) => c.id === val);
			if (find) {
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

	const formatCreateLabel = (inputValue) => `Создать нового клиента: ${inputValue}`;
	
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
							onChange(val?.value);
							handleCustomerOnChange(val?.value);
						}}
						value={{ value: customer?.id, label: customer?.name }}
						isSearchable
						isDisabled={isDisabled}
						placeholder="Клиент"
						formatCreateLabel={formatCreateLabel} 
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
					<Tooltip id="button-add-customer" title="Редактировать данные клиента">
						<ManageAccountsOutlinedIcon />
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
	isDisabled: PropTypes.bool,
	isSubmitting: PropTypes.bool,
};