import React from 'react'
import logo from '../assets/fae_estate_footer.png';

export default function Footer() {
  return (
    <footer className="bg-slate-800 flex flex-col">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
            <div className="mt-auto sm:flex sm:items-center sm:justify-between">
                <a href="https://frolicking-travesseiro-1bd6e2.netlify.app/" className="flex items-center mb-4 sm:mb-0">
                    <img className='h-16' src={logo} />                
                    {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span> */}
                </a>
                <ul className="flex flex-wrap justify-end mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                    <li>
                        <a href="/" className="mr-4 hover:text-white md:mr-6 ">Home</a>
                    </li>
                    <li>
                        <a href="/about" className="mr-4 hover:text-white md:mr-6">About</a>
                    </li>
                    <li>
                        <a href="/*" className="hover:text-white">Terms of Service</a>
                    </li>
                </ul>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 Franco Alvarez Estate™. All Rights Reserved.</span>
        </div>
    </footer>
  )
}
