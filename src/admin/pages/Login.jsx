import React, { useEffect } from 'react'
import useDymanicForm from '../../hooks/useDymanicForm'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../redux/adminActions'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const dispatch = useDispatch()
    const handleSubmit = () => {
        dispatch(login(STATE))
    }
    const CONFIG = [
        { fieldName: "email", type: "email" },
        { fieldName: "password", type: "password" },
        { fieldName: "Login", type: "submit", onClick: handleSubmit },
    ]
    const [UI, STATE, PRE] = useDymanicForm(CONFIG)
    const navigate = useNavigate()
    const { auth } = useSelector(state => state.admin)
    useEffect(() => {
        if (auth) {
            navigate("/admin/dash")
        }
    }, [auth])
    return <div className='w-1/1 mx-auto mt-10 border-2 border-gray-200 p-4'>
        {UI}
    </div>
}

export default Login