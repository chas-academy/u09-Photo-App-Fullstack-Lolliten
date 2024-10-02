// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Form from "../../pages/loginPage/Form"; // Reuse the Form component

// const EditProfilePage = () => {
//   const { userId } = useParams();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const getUser = async () => {
//       const response = await fetch(`http://localhost:3000/users/${userId}`);
//       const data = await response.json();
//       setUser(data);
//     };
//     getUser();
//   }, [userId]);

//   const handleUpdate = async (values) => {
//     // Logic to update user information, including password and picture
//     const response = await fetch(`http://localhost:3000/users/${userId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(values),
//     });
//     // Handle response...
//   };

//   if (!user) return null;

//   return (
//     <Form
//       initialValues={{
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         picture: user.picturePath,
//         // Add old password field for validation
//         oldPassword: "",
//       }}
//       onSubmit={handleUpdate}
//     />
//   );
// };

import React from 'react';

const EditProfilePage = () => {
  return (
    <div>
      <h1>Edit Profile</h1>
      {/* Add your form or other components here */}
    </div>
  );
};

export default EditProfilePage;