import { Batch, CategorySchema } from "@/generated/zod";
import { BatchRelation } from "@/hooks/batchs";
import {
  AppstoreOutlined,
  CloseOutlined,
  EyeOutlined,
  LinkOutlined,
  PlusOutlined,
  QrcodeOutlined,
  SearchOutlined,
  SyncOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Card,
  Flex,
  Input,
  List,
  Result,
  Select,
  Space,
  Tag,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateForm } from "../(NeedWallet)/dashboard/components/CreateForm";
import DashboardSkeleton from "../(NeedWallet)/dashboard/components/DashboardSkeleton";
import { QRBlock } from "./QRBlock";
import { userAgent } from "next/server";

type Props = {
  data: BatchRelation[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
  allowCreateBatch: boolean;
  query: string;
  getBatch: (id: string) => void;
  bonusButton?: () => void;
};

// Khai báo bảng màu cho từng loại sản phẩm
const categoryColors: Record<Batch["category"], string> = {
  VEGETABLE: "green",
  FRUIT: "orange",
  GRAIN: "gold",
  BEAN: "#8B4513",
  HERB: "lime",
  OTHER: "default",
};

export const TableList = ({
  data,
  isLoading,
  isError,
  error,
  allowCreateBatch,
  query,
  getBatch,
  bonusButton,
}: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { modal } = App.useApp();

  // Lọc dữ liệu theo tên sản phẩm và loại sản phẩm
  const filteredData = data
    ? data.filter(
      (item) =>
        item.productName.toLowerCase().includes(searchInput.toLowerCase()) &&
        (selectedCategory ? item.category === selectedCategory : true)
    )
    : [];

  return (
    <>
      {/* thanh công cụ tìm kiếm và lọc */}
      <Flex wrap justify="space-between" className="mb-4!" gap={10}>
        <div className="sm:w-[50%] w-full flex items-center gap-3">
          <Input
            suffix={<SearchOutlined />}
            placeholder={t("Input batch name")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Select
            prefix={<AppstoreOutlined />}
            options={CategorySchema.options.map((option) => ({
              value: option,
              label: option,
            }))}
            placeholder={t("Select Category")}
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            allowClear
            className="min-w-36"
          />
          <Space>
            <Tooltip title={t("Invalidate Query")}>
              <Button
                shape="circle"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ["batches", query] });
                }}
              >
                <CloseOutlined />
              </Button>
            </Tooltip>
            <Tooltip title={t("Reset Filters")}>
              <Button
                shape="circle"
                onClick={() => {
                  setSearchInput("");
                  setSelectedCategory(null);
                }}
              >
                <SyncOutlined />
              </Button>
            </Tooltip>
          </Space>
        </div>

        {allowCreateBatch && (
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setOpenCreateModal(true)}
            >
              {t("Create")}
            </Button>
            <CreateForm
              open={openCreateModal}
              onClose={() => setOpenCreateModal(false)}
            />
          </Space>
        )}
      </Flex>

      {/* HIỂN THỊ DẠNG CARD LIST */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <Result
          status="error"
          title={error?.message || t("Failed to load data")}
        />
      ) : (
        <List<BatchRelation>
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          pagination={{
            defaultPageSize: 12,
            pageSizeOptions: [8, 12, 24, 48],
            showSizeChanger: true,
          }}
          dataSource={filteredData}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Card
                onClick={() => getBatch(item.id)}
                hoverable
                className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
                cover={
                  <div className="relative h-48 w-full overflow-hidden bg-neutral-100 flex items-center justify-center">
                    <img
                      alt={item.productName}
                      src={item.imageUrl || "/logo.png"}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {/* Tag thể loại góc trên bên phải */}
                    <div className="absolute top-2 right-2">
                      <Tag
                        color={categoryColors[item.category]}
                        className="m-0! font-semibold px-2 py-0.5 shadow-sm"
                      >
                        {item.category}
                      </Tag>
                    </div>
                  </div>
                }
                actions={[
                  bonusButton && (
                    <Button
                      type="text"
                      key="detail"
                      hidden={!bonusButton}
                      icon={<TruckOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        bonusButton && bonusButton();
                        getBatch(item.id)
                      }}
                      className="text-neutral-600 hover:text-blue-600!"
                    >
                      {t("Assign")}
                    </Button>
                  ),
                  <Button
                    type="text"
                    key="detail"
                    icon={<QrcodeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      modal.success({
                        icon: null,
                        content: <QRBlock id={item.id} />,
                      });
                    }}
                    className="text-neutral-600 hover:text-blue-600!"
                  >
                    {t("QR")}
                  </Button>,
                  <Link onClick={(e) => e.stopPropagation()} href={`/trace/${item.id}`} key="trace" className="w-full">
                    <Button
                      type="text"
                      icon={<LinkOutlined />}
                      className="text-blue-600 w-full"
                    >
                      {t("Trace")}
                    </Button>
                  </Link>,
                ].filter(Boolean)}
              >
                <Card.Meta
                  title={
                    <Tooltip title={item.productName}>
                      <span
                        onClick={() => getBatch(item.id)}
                        className="font-semibold text-base text-neutral-800 hover:text-blue-600 cursor-pointer block truncate"
                      >
                        {item.productName}
                      </span>
                    </Tooltip>
                  }
                  description={
                    <div className="space-y-1.5 mt-2 text-xs text-neutral-500">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-neutral-600">
                          {t("Product Variety")}:
                        </span>
                        <span className="font-normal text-neutral-800 truncate max-w-[120px]">
                          {item.productVariety}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-neutral-600">
                          {t("Created At")}:
                        </span>
                        <span>{dayjs(item.createdAt).format("DD/MM/YYYY")}</span>
                      </div>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </>
  );
};