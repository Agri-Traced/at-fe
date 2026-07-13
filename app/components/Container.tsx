import { Row, Col } from 'antd';

export const Container = ({ children }: { children: React.ReactNode }) => (
    <Row justify="center" className="min-h-screen w-full h-full flex-col items-center justify-center gap-4 px-4">
      <Col xs={24} sm={20} md={16} lg={12} >
        {children}
      </Col>
    </Row>
);