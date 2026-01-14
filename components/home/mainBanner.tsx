"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import bannerImage from "../../asset/images/banner/banner1.png"

const MainBanner = () => {
    return (
        <div
            className="relative h-screen w-full  "
            style={{
                backgroundImage: `url(${bannerImage.src})`,
                backgroundSize: "contain",
                backgroundPosition: "top center", 
                backgroundRepeat: "no-repeat",
            }}

        >
        </div>

    );
};

export default MainBanner;
