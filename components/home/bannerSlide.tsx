"use client"; // nếu dùng Next.js app router

import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import bannerImage from "../../asset/images/banner/image.png";


const Banner = () => {
  return (
    <div
      className="w-full h-screen relative overflow-hidden mt-5"
      style={{
        backgroundImage: `url(${bannerImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Carousel chữ ở góc trên phải */}
      <Carousel
        controls={false}
        indicators={false}
        fade={true}
        interval={3000}
        className="absolute top-5 right-5 w-auto bg-transparent"
      >
        <Carousel.Item>
          <div className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
            Chữ chạy 1
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
            Chữ chạy 2
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
            Chữ chạy 3
          </div>
        </Carousel.Item>
      </Carousel>

      {/* Optional gradient để chữ nổi bật hơn nếu cần */}
      {/* <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/50 to-transparent"></div> */}
    </div>
  );
};

export default Banner;
