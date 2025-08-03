"use client"; // ← Rất quan trọng nếu layout sử dụng component như Menu, Button, etc.

import Link from 'next/link';
import './globals.css';
import {Layout, Menu} from 'antd';
import {HomeOutlined, FileTextOutlined, BarChartOutlined} from '@ant-design/icons';
import Providers from './providers';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';

export default function RootLayout({children}: { children: React.ReactNode }) {
    const {Content} = Layout;

    return (
        <html lang="vi">
        <body>
        <AuthProvider>
            <Providers>
                <Layout className="min-h-screen">
                    <Header />
                    <Content className="flex-1">
                        {children}
                    </Content>
                </Layout>
            </Providers>
        </AuthProvider>
        </body>
        </html>
    );
}