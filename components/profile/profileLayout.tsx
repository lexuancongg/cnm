'use client';

import { FC } from "react";

import ProfileLeftSideBar from "../profile/profileLeftSideBar";


// Props type
type Props = {
  menuActive: string;
  children: React.ReactNode;
};



const ProfileLayoutComponent: FC<Props> = ({ children, menuActive }) => {
    return (
        <div className="min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <aside className="lg:col-span-3">
                        <ProfileLeftSideBar menuActive={menuActive} />
                    </aside>

                    <main className="lg:col-span-9 bg-white rounded-xl shadow-md p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayoutComponent;