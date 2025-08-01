"use client"; // ← Rất quan trọng nếu layout sử dụng component như Menu, Button, etc.

import Link from 'next/link';
import './globals.css';
import {Layout, Menu} from 'antd';
import {HomeOutlined, FileTextOutlined, BarChartOutlined} from '@ant-design/icons';
import Providers from './providers';

export default function RootLayout({children}: { children: React.ReactNode }) {
    const {Header, Content} = Layout;

    return (
        <html lang="vi">
        <body>
        <Providers>
            <Layout>
                <Header style={{background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                    <Menu mode="horizontal" defaultSelectedKeys={['home']}>
                        <Menu.Item key="home" icon={<HomeOutlined/>}>
                            <Link href="/">Trang chủ</Link>
                        </Menu.Item>
                        <Menu.Item key="quiz" icon={<FileTextOutlined/>}>
                            <Link href="/quiz">Luyện đề</Link>
                        </Menu.Item>
                        <Menu.Item key="result" icon={<BarChartOutlined/>}>
                            <Link href="/result">Kết quả</Link>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{padding: '24px', minHeight: '100vh', backgroundColor: '#f9fafb'}}>
                    {children}
                </Content>
            </Layout>
        </Providers>
        </body>
        </html>
    );
}