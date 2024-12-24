import React from 'react';
import axios from 'axios';
import getBaseUrl from '../utils/baseURL';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);


const UserTable = ({ users, setUsers }) => {
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${getBaseUrl()}/api/auth/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    MySwal.fire({
      title: 'Bạn có chắc không?',
      text: `Có phải bạn muốn đổi vai trò của người này sang ${newRole}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đúng!',
      cancelButtonText: 'Giữ nguyên'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`${getBaseUrl()}/api/auth/${userId}`, { role: newRole });
          setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
          toast.success('Role updated successfully');
        } catch (error) {
          console.error('Error updating user role:', error);
        }
      }
    });
  };

  return (
    <div className="overflow-x-auto">
        <ToastContainer />
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Người dùng</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Vai trò</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;