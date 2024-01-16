import React, { useEffect, useState } from 'react'
import useDymanicForm from '../../hooks/useDymanicForm'
import { useDispatch, useSelector } from 'react-redux'
import { addCustomer, clientHistoryFilter, getAllCustomers, getHistory, placeOrder } from '../../redux/adminActions'
import { filterHistory, invalidate, logout } from '../../redux/adminSlice'
import { toast } from 'react-toastify'

const Dashboard = () => {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const [selectedUser, setSelectedUser] = useState()
    const { loading, error, customerAdded, customers, orderPlace, history } = useSelector(state => state.admin)

    const handleSubmit = () => {
        dispatch(addCustomer(STATE))
    }
    const CONFIG = [
        { fieldName: "fname", type: "text" },
        { fieldName: "address", type: "text" },
        { fieldName: "mobile", type: "text" },
        {
            fieldName: "Add New Customer",
            type: "submit",
            onClick: handleSubmit
        },
    ]
    const [UI, STATE, PRE] = useDymanicForm(CONFIG)
    const handleOrder = () => {
        dispatch(placeOrder({ ...ORDER_STATE, userId: selectedUser.id }))
    }
    const [ORDER_UI, ORDER_STATE, ORDER_PRE] = useDymanicForm([
        { fieldName: "jars", type: "number" },
        { fieldName: "date", type: "date" },
        {
            fieldName: "Add New Order",
            type: "submit",
            onClick: handleOrder
        },
    ])

    useEffect(() => {
        if (customerAdded) {
            console.log("customer added ")
            dispatch(invalidate())
            dispatch(getAllCustomers())
        }
    }, [customerAdded])
    useEffect(() => {
        dispatch(getAllCustomers())
    }, [])
    useEffect(() => {
        if (orderPlace) {
            toast.success("order placed success")
            dispatch(invalidate())
        }
    }, [])

    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"

    ]


    if (loading) return <span className="loading loading-spinner loading-md"></span>

    return <>
        <div className='mt-10 text-end'>
            <button
                onClick={e => dispatch(logout())}
                class="btn btn-error">Logout</button>
        </div>
        <div className='text-end my-10'>
            <button className="btn btn-primary" onClick={() => window.my_modal_3.showModal()}>Add Customer</button>
        </div>
        <div>
            <div className="overflow-x-auto">
                <table className="table border-2">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>name</th>
                            <th>address</th>
                            <th>mobile</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        {customers && customers.map((item, i) => <tr>
                            <td>{i + 1}</td>
                            <td>{item.fname}</td>
                            <td>{item.address}</td>
                            <td>{item.mobile}</td>
                            <td>
                                <button onClick={() => {
                                    setSelectedUser(item)
                                    window.order.showModal()
                                }} className="btn btn-primary mx-2">+ Order</button>

                                <button
                                    onClick={() => {
                                        setSelectedUser(item)
                                        setShow(true)
                                        dispatch(getHistory(item.id))
                                    }}
                                    className="btn  mx-2">History</button>
                                <button className="btn btn-outline btn-error">Delete</button>
                            </td>
                        </tr>)}
                    </tbody>

                </table>
            </div>
        </div>

        <dialog id="my_modal_3" className="modal">
            <form method="dialog" className="modal-box">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h3 className="font-bold text-lg">Add New Customer</h3>
                <div>
                    {UI}
                </div>
            </form>
        </dialog>

        <dialog id="order" className="modal">
            <form method="dialog" className="modal-box">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h3 className="font-bold text-lg">Add New Order</h3>
                {ORDER_UI}
            </form>
        </dialog>


        <dialog id="orderHistory" className={`modal ${show && "modal-open"}`}>
            <form method="dialog" className="modal-box">
                <button onClick={e => setShow(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h3 className="font-bold text-lg text-center">History!</h3>

                <select onChange={e => dispatch(clientHistoryFilter({
                    id: selectedUser.id,
                    month: e.target.value
                }))}
                    className="select select-bordered w-full">
                    <option disabled selected>Choose Month</option>
                    {
                        MONTHS.map((item, i) => <option value={i}>{item}</option>)
                    }


                </select>
                {history && history.length === 0 && <h1 className='font-bold'>Order Not Avalible</h1>}
                <table className='table'>
                    <thead>
                        <td>jarr</td>
                        <td>date</td>
                        <td className='font-bold'>Bill</td>
                    </thead>
                    <tbody>
                        {history && history.map(item => <tr key={item.id}>
                            <td>{item.jars}</td>
                            <td>{item.date}</td>
                            <td className='font-bold'>{history && history.reduce((sum, item) => sum + +item.jars, 0) * 20}</td>


                        </tr>)}
                    </tbody>
                </table>
            </form>
        </dialog>
    </>
}

export default Dashboard