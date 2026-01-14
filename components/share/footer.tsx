const Footer = () => {
    return (
        <footer className="bg-white text-gray-800 py-12 border border-gray-50 mt-5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* About */}
                    <div>
                        <div className="mb-4">
                            <a href="./index.html">
                                <img   src="https://preview.colorlib.com/theme/ashion/img/logo.png" alt="Logo" className="h-12" />
                            </a>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt cilisis.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h6 className="font-semibold text-gray-800 mb-4">Quick Links</h6>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-blue-500 transition">About</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition">Blogs</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition">Contact</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h6 className="font-semibold text-gray-800 mb-4">Account</h6>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-blue-500 transition">My Account</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition">Orders Tracking</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition">Checkout</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition">Wishlist</a></li>
                        </ul>
                    </div>

                    {/* Newsletter & Social */}
                    <div>
                        <h6 className="font-semibold text-gray-800 mb-4">NEWSLETTER</h6>
                        <form className="flex mb-4">
                            <input
                                type="text"
                                placeholder="Email"
                                className="w-full px-3 py-2 rounded-l-md focus:outline-none border border-gray-300 text-gray-800"
                            />
                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-4 rounded-r-md font-semibold text-white transition">
                                Subscribe
                            </button>
                        </form>
                        <div className="flex space-x-4 text-gray-500">
                            <a href="#" className="hover:text-blue-500 transition"><i className="fa fa-facebook"></i></a>
                            <a href="#" className="hover:text-blue-500 transition"><i className="fa fa-twitter"></i></a>
                            <a href="#" className="hover:text-blue-500 transition"><i className="fa fa-youtube-play"></i></a>
                            <a href="#" className="hover:text-blue-500 transition"><i className="fa fa-instagram"></i></a>
                            <a href="#" className="hover:text-blue-500 transition"><i className="fa fa-pinterest"></i></a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-gray-300 pt-4 text-center text-gray-500 text-sm">
                    <p>
                        Copyright © {new Date().getFullYear()} All rights reserved | This template is made with
                        <i className="fa fa-heart text-red-500 mx-1" aria-hidden="true"></i> by
                        <a href="https://colorlib.com" target="_blank" className="hover:text-blue-500 transition">Colorlib</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
