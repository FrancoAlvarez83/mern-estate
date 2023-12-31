import {useSelector} from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import Swal from 'sweetalert2'





export default function Profile() {

  
  const fileRef = useRef(null)
  const {currentUser, loading, error} = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setfileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingErrors, setShowListingErrors] = useState(false);
  const [userListings, setUserListings] = useState([]);
  
  const dispatch = useDispatch();
  

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
      },
      (error)=>{
        setfileUploadError(true);
      },

      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({...formData, avatar: downloadURL});
        })
      })
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#334155',
        confirmButtonText: 'Yes, delete it!',
      });
  
      if (!result.isConfirmed) {
        return; // User canceled the action
      }
  
      dispatch(deleteUserStart());
  
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await res.json();
  
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  //! revisar si se usa singOutFailure y success. en el tutorial usa deleteAccountFailure y success
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingErrors(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json()
      if(data.success === false) {
        setShowListingErrors(true);
        return;
      }
        setUserListings(data);
    } catch (error) {
        setShowListingErrors(true);
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
        console.log(error.message)
    }
  }
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
         <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
         <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded</span>
          ) : (
            ''
          )}
        </p>
         <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' defaultValue={currentUser.username} onChange={handleChange} />        
         <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' defaultValue={currentUser.email} onChange={handleChange} />
         <input type="password" placeholder='password' className='border p-3 rounded-lg'  id='password'/>
         <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-80 disabled:opacity-60'>{loading ? 'Loading' : 'Update Account'}</button>         
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='bg-red-500 text-white cursor-pointer rounded-lg px-3 text-center inline-flex items-center hover:opacity-90'>Delete Account</span>
        <span onClick={handleSignOut} className='bg-slate-900 text-white cursor-pointer rounded-lg p-3 hover:opacity-90'>Logout</span>
      </div>
      

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-500 mt-5'>{updateSuccess ? 'User was updated succesfully' : ''}{console.log(updateSuccess)}</p>

      <div className='flex flex-col text-center gap-3'>
        <Link className='w-full bg-green-700 text-white rounded-lg p-3 hover:opacity-90'  to={"/create-listing"}>
            Create Listing
        </Link>
        <button onClick={handleShowListings} className='w-full bg-blue-900 text-white rounded-lg p-3 hover:opacity-90'>Show Listings</button>
        <p className='text-red-500 mt-5'>{showListingErrors ? 'Error Loading Listings' : ''}</p>
      </div>

      
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='flex justify-around border-2 border-slate-300 items-center p-2 gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-40 w-40 object-contain'                  
                />
              </Link>
              <Link
                className='text-slate-700 flex-1 hover:opacity-90 truncate'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center gap-3'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='bg-red-500 rounded-lg p-2 text-white hover:opacity-90'
                >
                  Delete Listing
                </button>
                <Link className='flex justify-center' to={`/update-listing/${listing._id}`}>
                  <button className='bg-green-700 rounded-lg p-2 text-white hover:opacity-90'>Edit Listing</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}