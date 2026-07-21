'use client';

import { Modal, Button, Typography, Divider, Space, Badge } from 'antd';
import {
  SearchOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
  FireFilled,
  WalletOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface MetaMaskSignModalProps {
  open: boolean;
  onClose: () => void;
  onSign: () => void;
}

export default function MetaMaskSignModal({ open, onClose, onSign }: MetaMaskSignModalProps) {
  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      centered
      width={390}
      styles={{
        body: { padding: '24px 20px' },

      }}
    >
      {/* --- HEADER --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space size={8}>
          <span style={{ fontSize: 24 }}>🦊</span>
          <Text strong style={{ fontSize: 16, color: '#141414', fontFamily: 'Inter, sans-serif' }}>MetaMask</Text>
        </Space>
        <Button type="text" shape="circle" icon={<SearchOutlined style={{ fontSize: 18, color: '#8c8c8c' }} />} />
      </div>

      {/* --- TITLE --- */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700, fontSize: 26, letterSpacing: '-0.5px' }}>
          Sign Transaction
        </Title>
      </div>

      {/* --- CONNECTED STATUS --- */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 20 }}>
        <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />
        <Text type="secondary" style={{ fontSize: 14 }}>
          Connected to:{' '}
          <Text strong style={{ color: '#d32f2f' }}>
            Provenance Verify dApp
          </Text>
        </Text>
      </div>

      <Divider style={{ margin: '0 0 20px 0', borderColor: '#f0f0f0' }} />

      {/* --- TRANSACTION DETAILS --- */}
      <div style={{ marginBottom: 24 }}>
        <Space size={8} style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 16 }}>💼</span>
          <Text strong style={{ fontSize: 15, color: '#434343' }}>Transaction Details</Text>
        </Space>

        <div style={{ paddingLeft: 24 }}>
          {/* To Contract */}
          <div style={{ marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <span style={{ color: '#8c8c8c', marginTop: 2 }}>•</span>
            <Paragraph style={{ margin: 0, fontSize: 14, color: '#1f1f1f' }}>
              <Text strong>To:</Text> <Text code style={{ fontSize: 13 }}>0x7aF2Bc...91fA</Text>{' '}
              <Text type="secondary">(Provenance Smart Contract)</Text>
            </Paragraph>
          </div>

          {/* Date / Action */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <span style={{ color: '#8c8c8c', marginTop: 2 }}>•</span>
            <Paragraph style={{ margin: 0, fontSize: 14, color: '#1f1f1f' }}>
              <Text strong>Data:</Text> Submit Supply Chain Step 5: Customer{' '}
              <Text type="danger" strong>(22/05/2024)</Text>
            </Paragraph>
          </div>
        </div>
      </div>

      <Divider style={{ margin: '0 0 20px 0', borderColor: '#f0f0f0' }} />

      {/* --- GAS FEE ESTIMATE --- */}
      <div style={{ marginBottom: 32 }}>
        <Space size={8} style={{ marginBottom: 16 }}>
          <FireFilled style={{ color: '#fa8c16', fontSize: 16 }} />
          <Text strong style={{ fontSize: 15, color: '#434343' }}>Gas Fee Estimate</Text>
        </Space>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 4 }}>
          {/* Base Fee */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary" style={{ fontSize: 14 }}>Base Fee:</Text>
            <Text strong style={{ color: '#003eb3', fontSize: 15 }}>0.0006 ETH</Text>
          </div>

          {/* Priority Fee */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary" style={{ fontSize: 14 }}>Priority Fee:</Text>
            <Text strong style={{ color: '#003eb3', fontSize: 15 }}>0.0001 ETH</Text>
          </div>

          <Divider style={{ margin: '6px 0', borderColor: '#f5f5f5' }} />

          {/* Total Gas Cost */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: 14, color: '#1f1f1f' }}>Total Gas Cost:</Text>
            <Text strong style={{ color: '#003eb3', fontSize: 18 }}>0.0007 ETH</Text>
          </div>
        </div>
      </div>

      {/* --- FOOTER BUTTONS --- */}
      <div style={{ display: 'flex', gap: 14 }}>
        <Button
          onClick={onClose}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 16,
            backgroundColor: '#f5f5f5',
            color: '#1f1f1f',
            border: 'none',
            fontWeight: 600,
            fontSize: 15
          }}
        >
          REJECT
        </Button>
        <Button
          type="primary"
          onClick={onSign}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 16,
            backgroundColor: '#037dd6',
            borderColor: '#037dd6',
            fontWeight: 600,
            fontSize: 15,
            boxShadow: '0 4px 12px rgba(3, 125, 214, 0.2)'
          }}
        >
          SIGN
        </Button>
      </div>
    </Modal>
  );
}