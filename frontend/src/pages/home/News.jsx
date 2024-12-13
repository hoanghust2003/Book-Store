import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

import news1 from "../../assets/news/news-1.png";
import news2 from "../../assets/news/news-2.png";
import news3 from "../../assets/news/news-3.png";
import news4 from "../../assets/news/news-4.png";
import { Link } from "react-router-dom";

const news = [
  {
    id: 1,
    title: "Hội nghị thượng đỉnh về khí hậu toàn cầu kêu gọi hành động khẩn cấp",
    description:
      "Các nhà lãnh đạo thế giới tập trung tại Hội nghị thượng đỉnh về khí hậu toàn cầu để thảo luận về các chiến lược cấp bách nhằm chống biến đổi khí hậu, tập trung vào việc giảm phát thải carbon và thúc đẩy các giải pháp năng lượng tái tạo.",
    image: news1,
  },
  {
    id: 2,
    title: "Công bố đột phá trong công nghệ AI",
    description:
      "Các nhà nghiên cứu vừa công bố một bước đột phá lớn trong trí tuệ nhân tạo, với những tiến bộ mới hứa hẹn sẽ cách mạng hóa các ngành công nghiệp từ chăm sóc sức khỏe đến tài chính.",
    image: news2,
  },
  {
    id: 3,
    title: "Sứ mệnh không gian mới nhằm mục đích khám phá các thiên hà xa xôi",
    description:
      "NASA đã công bố kế hoạch cho một sứ mệnh không gian mới nhằm khám phá các thiên hà xa xôi, với hy vọng tìm ra hiểu biết sâu sắc về nguồn gốc của vũ trụ.",
    image: news3,
  },
  {
    id: 4,
    title: "Thị trường chứng khoán đạt mức cao kỷ lục trong bối cảnh phục hồi kinh tế",
    description:
      "Thị trường chứng khoán toàn cầu đã đạt mức cao kỷ lục khi những dấu hiệu phục hồi kinh tế tiếp tục xuất hiện sau những thách thức do đại dịch toàn cầu gây ra.",
    image: news4,
  },
  {
    id: 5,
    title: "Chiếc điện thoại thông minh mới sáng tạo được công ty công nghệ hàng đầu phát hành",
    description:
      "Một công ty công nghệ hàng đầu vừa cho ra mắt mẫu điện thoại thông minh mới nhất với công nghệ tiên tiến, thời lượng pin được cải thiện và thiết kế mới đẹp mắt.",
    image: news2,
  },
];

const News = () => {
  return (
    <div className="py-16 bg-white dark:bg-gray-900 text-black dark:text-white max-w-screen-xl mx-auto font-roboto">
      <h2 className="text-3xl font-semibold mb-6">Tin tức</h2>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {news.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-12 bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-md">
              {/* content */}
              <div className="py-4">
                <Link to="/">
                  <h3 className="text-lg font-medium hover:text-blue-500 mb-4">
                    {item.title}
                  </h3>
                </Link>
                <div className="w-12 h-[4px] bg-primary mb-5"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>

              <div className="flex-shrink-0">
                <img src={item.image} alt="" className="w-full object-cover" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default News;
