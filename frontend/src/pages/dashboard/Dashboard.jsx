import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import { MdIncompleteCircle } from 'react-icons/md'
import RevenueChart from './RevenueChart';
import UserTable from '../../components/UserTable';
const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [users, setUsers] = useState([]);
    // console.log(data)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response =  await axios.get(`${getBaseUrl()}/api/admin`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                })

                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        const fetchUsers = async () => {
          try {
            const response = await axios.get(`${getBaseUrl()}/api/auth`);
            setUsers(response.data);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };

        fetchData();
        fetchUsers();
    }, []);

    // console.log(data)

    if(loading) return <Loading/>

  return (
    <>
      <UserTable users={users} setUsers={setUsers} />
    </>
  )
}

export default Dashboard