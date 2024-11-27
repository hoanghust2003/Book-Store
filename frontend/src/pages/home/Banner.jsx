import React from 'react'
import bannerImg from '../../assets/banner.png'
const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12 bg-white dark:bg-gray-900 text-black dark:text-white'>
        {/*right side */}
       <div className='md:w-1/2 w-full flex items-center md:justify-end'>
            <img src={bannerImg} alt="Banner" />
       </div> 
        {/*left side */}
       <div className='md:w-1/2 w-full'>
          <h1 className ='md:text-5xl text-2xl font-medium mb-7'>Bản phát hành cuối tuần </h1>
          <p className='mb-10'>
            Đã đến lúc bạn làm mới danh sách sách của mình với những
            <br />
            tác phẩm mới nhất và tuyệt vời nhất trong thế giới văn chương. 
            <br />
            Từ những cuốn tiểu thuyết gay cấn khiến tim đập thình thịch đến những hồi ký 
            <br />
            đầy cuốn hút, các ấn phẩm ra mắt tuần này chắc chắn sẽ 
            <br/>
            mang đến điều gì đó đặc biệt cho mọi độc giả.
          </p>
            <button className='btn-primary'>Subcribe</button>
       </div>

         
    </div>
  )
}

export default Banner