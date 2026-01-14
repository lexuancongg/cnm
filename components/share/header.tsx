"use client"
import React, { useContext, useEffect, useRef, useState } from "react";
import { data_menu } from "@/asset/data/data_menu";
import Link from "next/link";
import { useCartContext } from "@/context/cartContext";
import LoadImageSafe from "../common/loadImageSafe";
import { Dropdown } from "react-bootstrap";

const Header = ({ children }: React.PropsWithChildren) => {
    const { numberCartItems } = useCartContext();
    const [showDropdownSuggestions, setShowDropdownSuggestions] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('');
    const inputSearchRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // funcition event
    const handleInputFocus = () => {
        setShowDropdownSuggestions(true);
    }

    const handleSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {

    }

    const categories = [
        { id: 1, name: 'Electronics', slug: 'electronics' },
        { id: 2, name: 'Mobile Phones', slug: 'mobile-phones' },
        { id: 3, name: 'Laptops', slug: 'laptops' },
        { id: 4, name: 'Cameras', slug: 'cameras' },
        { id: 5, name: 'Audio', slug: 'audio' },
        { id: 6, name: 'Smart Watches', slug: 'smart-watches' },
        { id: 7, name: 'Accessories', slug: 'accessories' },
        { id: 8, name: 'Home Appliances', slug: 'home-appliances' },
        { id: 9, name: 'Gaming', slug: 'gaming' },
    ];


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setShowDropdownSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }

    }, [])



    const [showSearch, setShowSearch] = useState(false);

    return (
        <header className="shadow-md bg-white relative">
            {/* ---- Top bar ---- */}
            <nav className="bg-black border-b border-gray-800">
                <div className="container mx-auto flex justify-between items-center h-10 px-4 text-sm">
                    {/* Left */}
                    <div className="text-gray-200 font-medium flex items-center">
                        shop cnm

                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-6">
                        {data_menu.map((item) => (
                            <Link
                                href={item.links}
                                key={item.id}
                                className="flex items-center gap-1 text-gray-300 hover:text-blue-400 transition"
                            >
                                {item.icon && <i className={item.icon}></i>}
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>



            {/* ---- Main header ---- */}
            <div className="container mx-auto flex items-center justify-between py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="https://preview.colorlib.com/theme/ashion/img/logo.png"
                        alt="Logo"
                        className="h-20 w-20 object-contain rounded-full"
                    />
                    <div className="flex flex-col leading-none">
                        <span
                            className="text-sm font-semibold text-gray-500 tracking-wide"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            SHOP
                        </span>
                        <span
                            className="text-xl font-medium text-gray-800 tracking-tight"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            CNM
                        </span>
                    </div>

                </Link>


                <nav className="flex gap-3 items-center text-gray-700 font-medium">
                    {categories.slice(0, 5).map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="text-sm text-gray-600 font-medium px-3 py-1 rounded-full  hover:text-white hover:bg-blue-500 transition-all duration-300 tracking-wide"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            {cat.name}
                        </Link>
                    ))}

                    {categories.length > 5 && (
                        <Dropdown>
                            <Dropdown.Toggle className="text-sm text-gray-600 font-medium px-3 py-1 rounded-full border border-gray-200 hover:text-white hover:bg-blue-500 transition-all duration-300 tracking-wide bg-transparent">
                                More
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="bg-white border rounded shadow-lg text-sm">
                                {categories.slice(5).map((cat) => (
                                    <Dropdown.Item
                                        key={cat.id}
                                        href={`/category/${cat.slug}`}
                                        className="px-4 py-2 hover:bg-gray-100 text-gray-700 transition"
                                    >
                                        {cat.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    )}

                    <Dropdown>
                        <Dropdown.Toggle className="text-sm text-gray-600 font-medium px-3 py-1 rounded-full border border-gray-200 hover:text-white hover:bg-blue-500 transition-all duration-300 tracking-wide bg-transparent">
                            Pages
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="bg-white border rounded shadow-lg text-sm">
                            <Dropdown.Item
                                href="/about"
                                className="px-4 py-2 hover:bg-gray-100 text-gray-700 transition"
                            >
                                About
                            </Dropdown.Item>
                            <Dropdown.Item
                                href="/contact"
                                className="px-4 py-2 hover:bg-gray-100 text-gray-700 transition"
                            >
                                Contact
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </nav>



                {/* Icons (Search + Cart) */}
                <div className="flex items-center gap-6">
                    {/* Search icon */}
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className="text-xl hover:text-blue-600 transition"
                    >
                        <i className="bi bi-search"></i>
                    </button>

                    {/* Cart */}
                    <Link href="/cart" className="relative">
                        <i className="bi bi-cart3 text-2xl"></i>
                        {numberCartItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {numberCartItems}
                            </span>
                        )}
                    </Link>
                    <div className="flex items-center gap-2">
                        {children}
                    </div>

                </div>
            </div>

            {/* ---- Dropdown search ---- */}
            {showSearch && (
                <div className="absolute left-0 top-full w-full bg-white shadow-md border-t z-50">
                    <div className="container mx-auto py-4">
                        <form className="flex items-center gap-2">
                            <i className="bi bi-search text-gray-500 text-xl"></i>
                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="flex-grow border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                            />
                            <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );

}
export default Header;

