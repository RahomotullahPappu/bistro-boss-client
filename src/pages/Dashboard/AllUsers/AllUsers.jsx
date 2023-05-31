import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { FaTrashAlt, FaUserShield } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const AllUsers = () => {
  const [axiosSecure] = useAxiosSecure()
  const { data: users = [], refetch } = useQuery(['users'], async () => {
    const res = await axiosSecure.get('/users')
    return res.data;
  })

  const handleMakeAdmin = user => {
      fetch(`http://localhost:5000/users/admin/${user._id}`, {
        method: 'PATCH', 
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if(data.modifiedCount){
          refetch();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `${user.name} is an Admin Now!`,
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
  }

  const handleDelete = users => {
   
}


  return (
    <div className="w-full">
      <Helmet>
        <title>Bistro Boss | All Users</title>
      </Helmet>
      <h3 className="text-3xl font-semibold my-4 text-center">Total users: {users.length}</h3>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          {/* head */}
          <thead>
            <tr>
              <th className="bg-[#D1A054]">#</th>
              <th className="bg-[#D1A054]">Name</th>
              <th className="bg-[#D1A054]">Email</th>
              <th className="bg-[#D1A054]">Role</th>
              <th className="bg-[#D1A054]">Action</th>
            </tr>
          </thead>
          <tbody>
                
                {
                    users.map((user, index) => <tr 
                     key={user._id}>
                      <th>{index + 1}</th>
                      <td>{user.name}</td>
                      <td>{user.email}</td>                     
                      <td>{
                        user.role === 'admin' ? 'admin' : 
                        <button onClick={() => handleMakeAdmin(user)} className="btn btn-ghost bg-orange-400  text-white"><FaUserShield></FaUserShield></button>
                        }</td>
                      <td><button onClick={() => handleDelete(user)} className="btn btn-ghost bg-red-600  text-white"><FaTrashAlt></FaTrashAlt></button></td>
                    </tr>)
                }


            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;