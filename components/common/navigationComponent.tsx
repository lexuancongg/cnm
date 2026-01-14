import {NavigationPathModel} from "@/models/Navigation/NavigationPathModel";
import React from "react";
import {Breadcrumb} from "react-bootstrap";

type Props = {
    props: NavigationPathModel[]
}
export default function NavigationComponent({props}:Props): React.ReactElement {
    return  (
        <Breadcrumb className={'pt-3'}>
            {props.map((navigationPathModel:NavigationPathModel , index:number) => (
                <Breadcrumb.Item  href={navigationPathModel.url} key={index} active={index == props.length -1}>
                    {navigationPathModel.pageName}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    )


}