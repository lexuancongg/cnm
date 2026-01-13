import apiClientService from '@commonServices/ApiClientService';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Dropdown } from "react-bootstrap";



const baseUrl = 'http://localhost:8000/authentication';

type UserAuthenticationInfo = {
    username: string,
}
export type authenticationInfoVm = {
    authenticatedUser: UserAuthenticationInfo,
    isAuthenticated: boolean
}


export default function AuthenticationInfo() {
   const [authenticationInfoVm, setUserAuthenticationVm] = useState<authenticationInfoVm>({
        isAuthenticated: false,
        authenticatedUser: {
            username: ''
        }
    });

  async function getAuthenticatedUser() {
    return (await apiClientService.get(baseUrl)).json();
  }

  useEffect(() => {
    getAuthenticatedUser().then((data:authenticationInfoVm) => {
      setUserAuthenticationVm(data);
      if(!data.isAuthenticated){
         window.location.href = "http://localhost:8000/login"

      }
    }).catch((err)=>console.log(err))
  }, []);

  return (
        <>
            {authenticationInfoVm.isAuthenticated
                ?
                (

                    <Dropdown>
                        <Dropdown.Toggle variant="dark" id="user-dropdow " className="bg-transparent"
                            style={{ border: 'none', color: '#b2b2b2' }}
                        >
                            {authenticationInfoVm.authenticatedUser.username || 'xuan cong'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant="dark" style={{ backgroundColor: '#222' }}>
                            <Dropdown.Item as={Link} href="/profile" className="d-block h-full">
                                Profile
                            </Dropdown.Item>

                            <Dropdown.Item as={Link} href={"/my-orders"} className="d-block h-full">My orders</Dropdown.Item>
                            <Dropdown.Item className="d-block h-full">Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )
                :
                (
                    <div>
                        <Link
                            href="http://localhost:8000/login"
                            className="block text-gray-700 hover:text-blue-600 transition px-2 py-1 text-2xl"
                        >
                            <i className="bi bi-person-circle"></i>
                        </Link>
                    </div>
                )
            }
        </>
    );
}
