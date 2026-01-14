import Category from "@/components/home/category";
import FeaturedProduct from "@/components/home/featuredProduct";
import MainBanner from "@/components/home/mainBanner";
import BannerSlide from "@/components/home/bannerSlide";
import ServicesSection from "@/components/home/servicesSection";

import RecommentProduct from "@/components/home/recommentProducts";
export default function Home(){

    return (
        <div className="homepage">
            <MainBanner></MainBanner>
            <Category></Category>
            <FeaturedProduct></FeaturedProduct>
            <RecommentProduct></RecommentProduct>
            <ServicesSection></ServicesSection>

        </div>
    );
}