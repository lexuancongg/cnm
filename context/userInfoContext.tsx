"use client"
import React, { Context, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import customerService from "@/services/customer/customerService";

// khởi tạo context
export const UserInfoContext: Context<UserInfo> = React.createContext({
    firstName: '',
    lastName: '',
    email: '',
    fetchUserInfo: () => {
    }
});

export function UserInfoProvider({ children }: React.PropsWithChildren): ReactElement {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        fetchUserInfo();
    }, [])

    const fetchUserInfo: () => void = useCallback(() => {
        customerService.getMyProfile()
            .then((userInfo) => {

                setFirstName(userInfo.firstName);
                setLastName(userInfo.lastName);
                setEmail(userInfo.email);
            })
            .catch((err) => {
                console.log("error get profile ",  err)
                // window.location.href = "http://localhost:8000/oauth2/authorization/ecommerce";

            })
    }, [])


    const userInfo: UserInfo = useMemo(() => (
        {
            firstName,
            lastName,
            email,
            fetchUserInfo
        }
    )
        , [firstName, lastName, email, fetchUserInfo]
    );
    return <UserInfoContext.Provider value={userInfo}>{children}</UserInfoContext.Provider>;

}
export const useUserInfoContext = () => {
    const { email, firstName, lastName, fetchUserInfo } = useContext(UserInfoContext);
    return { email, firstName, lastName, fetchUserInfo };
};
