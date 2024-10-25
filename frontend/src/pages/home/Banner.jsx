import React from 'react'
import bannerImg from '../../assets/banner.png'
const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12'>
        {/*right side */}
       <div className='md:w-1/2 w-full flex items-center md:justify-end'>
            <img src={bannerImg} alt="Banner" />
       </div> 
        {/*left side */}
       <div className='md:w-1/2 w-full'>
          <h1 className ='md:text-5xl text-2xl font-medium mb-7'>New release this weekend</h1>
          <p className='mb-10'>It's time to update your reading list with some of the<br />
             latest and greatest releases in the literary world. From<br />
              heart-pumping thrillers to captivating memoirs, this<br />
               week's new releases offer something for everyone</p>
            <button className='btn-primary'>Subcribe</button>
       </div>

         
    </div>
  )
}

export default Banner