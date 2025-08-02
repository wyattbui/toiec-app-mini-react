// components/SimpleHeader.tsx
'use client';

import { Layout, Typography } from 'antd';
import Link from 'next/link';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function SimpleHeader() {
  return (
    <AntHeader className="bg-white shadow-sm border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2">
          <Text strong className="text-lg text-gray-800">
            TOEIC Mini
          </Text>
        </Link>
      </div>
      <div>
        <Text>Simple Header - Working!</Text>
      </div>
    </AntHeader>
  );
}
