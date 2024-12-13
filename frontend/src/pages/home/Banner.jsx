import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bannerImg from "../../assets/banner.png";
import bannerImg2 from "../../assets/tranguudaikhongtienmat_T12_1920x500 (1).jpg";
import bannerImg3 from "../../assets/1200x600_vnpay_ngay_sale_t11.jpg";

const sliderItems = [bannerImg, bannerImg2, bannerImg3];

const Banner = () => {
  // Settings for React Slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 py-16 px-4 md:px-16 max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Slider Section */}
        <div className="md:w-2/3 w-full">
          <Slider {...settings}>
            {sliderItems.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="rounded-lg shadow-lg max-w-full h-auto"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Banner Images Section */}
        <div className="md:w-1/3 w-full flex flex-col gap-4">
          <div className="flex-1">
            <img
              src={bannerImg2}
              alt="Banner 2"
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>
          <div className="flex-1">
            <img
              src={bannerImg3}
              alt="Banner 3"
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;