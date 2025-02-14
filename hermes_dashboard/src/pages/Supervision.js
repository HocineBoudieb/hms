import React from 'react';


const Supervision = () => {

  return ( 
        <div className='flex flex-col p-6 ml-64 mt-16'>
          <h1 className='text-3xl font-bold' title='Supervision'>Supervision</h1>
          <div className='grid grid-cols-2 justify-center gap-6 items-center'>
            <div className='border border-gray-300 rounded-xl p-2 h-[370px]'><iframe title='Coupe' src="http://localhost:3000/workshop/2ccf67ae1241" className='w-[1000px] h-[600px] scale-[60%] origin-top-left'/></div>
            <div className='border border-gray-300 rounded-xl p-2 h-[370px]'><iframe title='Coupe' src="http://localhost:3000/workshop/2ccf67ae1041" className='w-[1000px] h-[600px] scale-[60%] origin-top-left' /></div>
            <div className='border border-gray-300 rounded-xl p-2 h-[370px]'><iframe title='Coupe' src="http://localhost:3000/workshop/2ccf67c3ea11" className='w-[1000px] h-[600px] scale-[60%] origin-top-left' /></div>
            <div className='border border-gray-300 rounded-xl p-2 h-[370px]'><iframe title='Coupe' src="http://localhost:3000/workshop/2ccf67c3e980" className='w-[1000px] h-[600px] scale-[60%] origin-top-left' /></div>
          </div>
        </div>
  );
};

export default Supervision;