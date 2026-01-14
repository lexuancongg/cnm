import { FaCar, FaMoneyBillWave, FaHeadphones, FaHandsHelping } from "react-icons/fa";

const ServicesSection = () => {
  return (
    <section className="services mt-6 py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <div className="text-red-500 text-4xl mb-4">
              <FaCar />
            </div>
            <h6 className="text-lg font-semibold mb-2">Free Shipping</h6>
            <p className="text-gray-600 text-sm">For all orders over $99</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <div className="text-red-500 text-4xl mb-4">
              <FaMoneyBillWave />
            </div>
            <h6 className="text-lg font-semibold mb-2">Money Back Guarantee</h6>
            <p className="text-gray-600 text-sm">If goods have problems</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <div className="text-red-500 text-4xl mb-4">
              <FaHandsHelping />
            </div>
            <h6 className="text-lg font-semibold mb-2">Online Support 24/7</h6>
            <p className="text-gray-600 text-sm">Dedicated support</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <div className="text-red-500 text-4xl mb-4">
              <FaHeadphones />
            </div>
            <h6 className="text-lg font-semibold mb-2">Payment Secure</h6>
            <p className="text-gray-600 text-sm">100% secure payment</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
