import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { customerService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [customers, setCustomers] = useState(null);

    useEffect(() => {
        customerService.getAll().then(x => setCustomers(x));
    }, []);

    function deleteCustomer(id) {
        setCustomers(customers.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        customerService.delete(id).then(() => {
            setCustomers(customers => customers.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>Customers</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Customer</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Name</th>
                        <th style={{ width: '30%' }}>Email</th>
                        <th style={{ width: '30%' }}>Phone</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {customers && customers.customers.map(customer =>
                        <tr key={customer.id}>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${customer.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => deleteCustomer(customer.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={customer.isDeleting}>
                                    {customer.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!customers &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {customers && !customers.customers.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No Customers To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { List };