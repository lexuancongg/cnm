    'use client'
    import React, {useEffect, useState} from "react";
    import {Image} from "react-bootstrap";
    type Props = {
        src: string;
        alt?: string;
        width?:number;
        height?:number;
        className?: string;
        fallBack?: string;
        style?: React.CSSProperties
    };
    const LoadImageSafe = (
        {
            width = 500,
            height =500,
            src,
            className,
            style,
            alt,
            fallBack : fallBackImage ='../../asset/images/fallback/default-fallback-image.png',
            ...props
        }: Props
    ) => {
        const [fallBack,setFallBack] = useState<string|null>(null);
        const [srcUrl,setSrcUrl] = useState<string>(src);

        useEffect(()=>{
            setSrcUrl(src);
            setFallBack(null);
        },[src])

        return(
            <Image
                width={width}
                height={height}
                className={className}
                src={fallBack || srcUrl}
                alt={alt}
                {...props}
                onError={(event)=>{
                    event.currentTarget.onerror = null;
                    setFallBack(fallBackImage)
                }}
            >
            </Image>
        )

    }
    export default LoadImageSafe;