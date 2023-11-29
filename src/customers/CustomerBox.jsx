import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import Select from "react-select";
import Grid from '@mui/material/Unstable_Grid2';
import {
	IconButton, Tooltip,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CreatableSelect from 'react-select/creatable';
import { CreatableSelectBox, SelectBox } from '@/_helpers';
import { CustomerDialog } from '../customers/CustomerDialog';
import {
	alertService, customerService,
} from '@/_services';

function CustomerBox({ onChange, value, ref, isSubmitting }) {

	const [customers, setCustomers] = useState([]);
	//const [customer, setCustomer] = useState(customerService.getNew(""));// the purpose is to provide customer object
	const [customer, setCustomer] = useState({});// the purpose is to provide customer object
	const [saveCustomer, setSaveCustomer] = useState("");
	const [inputValue, setInputValue] = useState({});
	const [openCD, setOpenCD] = useState(false); /* CustomerDialog open state */

	/*console.group('CustomerBox state init ');
	console.log("CustomerBox customer BEFORE -> ", customer);
	console.log("CustomerBox saveCustomer -> ", saveCustomer);
	console.log("CustomerBox customer AFTER -> ", customer);

	console.log("CustomerBox inputValue -> ", inputValue);
	console.groupEnd();*/

	const persistCustomer = useMemo(() => {
		console.log("CustomerBox useMemo setInputValue -> ", customer);
		return customer || {
			id: "",
			name: "",
			email: "",
			phone: "",
		};
	}, [saveCustomer]);

	const fetchCustomers = useCallback(async () => {
		customerService.getAll()
			.then(rawCustomers => {
				setCustomers(rawCustomers.map((item) => ({
					value: item.id,
					label: item.name,
					email: item.email,
					phone: item.phone,
				})));
			}
			).then(() => {
				console.log("CustomerBox fetchCustomers setInputValue -> ", persistCustomer);
				if (persistCustomer) setInputValue(persistCustomer);
			});
	}, []);
	useEffect(() => {
		console.log("CustomerBox useEffect saveCustomer -> ", customer);
		fetchCustomers();
	}, [saveCustomer]);

	const handleCustomerInputChange = (input, reason) => {

		if (reason.action === "input-change" || reason.action === "set-value") {
			console.log("CustomerBox reason setCustomer setInputValue ->", reason);
			setInputValue({ id: "new", name: input, email: "", phone: "" });
			return;
		}
		if (reason.action === "input-blur" ||
			reason.action === "menu-close") {
			console.log("CustomerBox reason setCustomer ->", reason);
			return;
		}
	};

	const handleCustomerOnChange = (val) => {
		/* replace label and value with name and id */
		if (customers && val) {
			console.log("CustomerBox handleCustomerOnChange val -> ", val);
			const find = customers.find((c) => c.value === val);
			if (find) {
				console.log("CustomerBox handleCustomerOnChange find -> ", find);
				const strobj = JSON.stringify(customers.find((c) => c.value === val)).replace("value", 'id').replace("label", 'name');
				setCustomer(JSON.parse(strobj));
			} else {
				setCustomer({ id: "new", name: val, email: "", phone: "" });
			}
		}
	}

	return (
		<Grid container={true} spacing={2} md={4} direction='row' wrap='nowrap' >
			<Grid item md={10} xs={10} >
				{customers && (
					<CreatableSelect
						inputId={inputValue?.id}
						inputValue={inputValue?.name}
						options={customers}
						onChange={val => {
							console.log(`CustomerBox CreatableSelect onChange val -> ${JSON.stringify(val)}`);
							onChange(val?.value);
							handleCustomerOnChange(val?.value);
						}}
						value={(customers && value) ? customers.find((c) => c.value === value) : ''}
						isSearchable
						isDisabled={isSubmitting}
						placeholder="Клиент"
						onInputChange={handleCustomerInputChange}
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
					setInputValue={setInputValue}
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
};

/*
					<Select

						options={customers}
						onChange={val => {
							onChange(val?.value);
							handleCustomerOnChange(val?.value);
						}}
						value={(customers && value) ? customers.find((c) => c.value === value) : ''}
						isSearchable
						isDisabled={isSubmitting}
						placeholder="Клиент"
						onBlur={onCustomerBlur}
						onInputChange={handleCustomerInputChange}
					/>
					*/
/*
const editedCustomers = useMemo(() => {
console.log("CustomerBox useMemo saveCustomer -> ", saveCustomer);
const newState = customers.map((obj) => {
if (obj.value === customer.id) {
console.log("CustomerBox useMemo updateCustomer customer.id -> ", customer.id);
let myObj = {...obj};
Object.entries(saveCustomer).forEach(([key]) => {
if (key === "name") myObj["label"] = customer[key];
else myObj[key] = customer[key];
console.log("CustomerBox useMemo updateCustomer customer[key]-> ", customer[key]);					
});
	
return myObj;
}
return obj;
});
	
return newState;
}, [saveCustomer]);
	
useEffect(() => {
console.log("CustomerBox useEffect setCustomers -> ", editedCustomers[0]);
//setCustomers(editedCustomers);
setCustomers(editedCustomers.map((item) => ({
value: item.id,
label: item.name,
email: item.email,
phone: item.phone,
})));
}, [editedCustomers]);
*/
/*
async function createCustomer(label) {
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
}*/
/*
const onCustomerBlur = (event) => {
const label = event?.target.value?.trim() || "";
const optionExists = customers.find((opt) => opt.label === label);

if (!label || optionExists) {
return;
}
console.log("CustomerBox onCustomerBlur -> ", event?.target.value);
const option = { label, value: "new", email: "", phone: "" };
setCustomer({ id: "new", name: label, email: "", phone: "" });
setCustomers([...(value || []), option]);
}*/

/*

	const fetchCustomers = useCallback(async () => {
	const cstId = customer?.name;
	console.log("CustomerBox fetchCustomers cstId -> ", customer?.name);
	const rawCustomers = await customerService.getAll();
	setCustomers(rawCustomers.map((item) => ({
		value: item.id,
		label: item.name,
		email: item.email,
		phone: item.phone,
	})));
	setInputValue(cstId || 'werwerwerert');
	
	console.log("CustomerBox useEffect fetchCustomers inputValue -> ", inputValue);
}, []);
*/