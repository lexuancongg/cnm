'use client'


export default function MyOrdersLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        // <body>{children}</body>  : nó ghì đè phần body trong layout gốc => nên chỉ hiển thị page của myorder
        <div>{children}</div>
    )}