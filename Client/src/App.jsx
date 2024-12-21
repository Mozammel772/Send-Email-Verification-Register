import React from 'react';
import { toast, ToastContainer } from 'react-toastify';

function App() {
  const notify = () => {
    toast.success('🦄 Wow so easy!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,  
      theme: "light",
      // transition: Zoom,
      });
    // toast.success("This is a success message!");
    // toast.error("This is an error message!");
  };

  return (
    <div className='mt-40'>
      <button className='btn btn-secondary' onClick={""}>Show Toast</button>
      <ToastContainer />
    </div>
  );
}

export default App;
