import React, { useState } from "react";
import {
  Card,
  Button,
  Tag,
  Tooltip,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Space,
  Popconfirm,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  TagOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { BatchRelation } from "@/hooks/batchs";
import { OrganizationTypeType, StepTemplate } from "@/generated/zod";
import { UploadWidget } from "@/app/components/UploadWiget";

type Step = Omit<StepTemplate, "processTemplateId">;

type Props = {
  batch: BatchRelation;
  type: OrganizationTypeType;
  onChangeSteps?: (updatedSteps: Step[]) => void;
  onReturn?: () => void; // Callback khi nhấn nút quay lại
  isUpdatingStep?: boolean;
};

export const BatchDetail = ({
  batch,
  type,
  onChangeSteps,
  onReturn,
  isUpdatingStep,
}: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<Step>();

  // State cho Modal Thêm/Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const steps: Step[] = type === "RETAILER" ? batch?.qualityTest?.steps ?? [] : type === "FARMER" ? batch?.activity?.steps ?? [] : [];
  const image = Form.useWatch("imageUrl", form);
  // Sắp xếp các bước theo order tăng dần
  const sortedSteps = [...steps].sort((a, b) => a.stepOrder - b.stepOrder);
  // Re-index lại stepOrder từ 1 -> N
  const reorderSteps = (list: Step[]): Step[] => {
    return list.map((step, idx) => ({
      ...step,
      stepOrder: idx + 1,
    }));
  };

  // Mở Modal Thêm mới ở vị trí bất kỳ
  const handleOpenAddModal = (targetIndex: number) => {
    setInsertAtIndex(targetIndex);
    setEditingIndex(null);
    setImageUrl("");
    form.resetFields();
    form.setFieldsValue({
      isRequired: true,
      dayOffset: targetIndex > 0 ? (sortedSteps[targetIndex - 1]?.dayOffset || 0) + 1 : 0,
    });
    setIsModalOpen(true);
  };

  // Mở Modal Chỉnh sửa
  const handleOpenEditModal = (index: number) => {
    const stepToEdit = sortedSteps[index];
    setEditingIndex(index);
    setInsertAtIndex(null);
    setImageUrl(stepToEdit.imageUrl || "");
    form.setFieldsValue(stepToEdit);
    setIsModalOpen(true);
  };

  // Xóa một bước
  const handleDeleteStep = (index: number) => {
    const newList = [...sortedSteps];
    newList.splice(index, 1);
    onChangeSteps?.(reorderSteps(newList));
  };

  const handleFormSubmit = (values: Step) => {
    let newList = [...sortedSteps];
    const updatedStepValue: Step = {
      ...values,
      imageUrl: imageUrl || null,
    };

    if (editingIndex !== null) {
      newList[editingIndex] = {
        ...newList[editingIndex],
        ...updatedStepValue,
      };
    } else if (insertAtIndex !== null) {
      newList.splice(insertAtIndex, 0, updatedStepValue);
    }

    Promise.resolve(onChangeSteps?.(reorderSteps(newList)))
      .then(() => {
        setIsModalOpen(false); // Đóng modal khi thành công
      })
      .catch((err) => {
        console.error("Lỗi API:", err); // Giữ modal nếu thất bại
      });
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={onReturn}
          icon={<ArrowLeftOutlined />}
        />
        <Typography.Title level={4} className="mb-4">
          {t("Process Steps for ")} {batch.category}
        </Typography.Title>
      </div>
      <div className="w-full max-w-3xl mx-auto">
        {/* Nút chèn ở ĐẦU danh sách (khi chưa có gì hoặc muốn chèn vào vị trí đầu) */}
        <div className="flex justify-center mb-4 gap-3">
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => handleOpenAddModal(0)}
            className="border-blue-400 text-blue-600 hover:text-blue-700 bg-blue-50/50"
          >
            {sortedSteps.length === 0 ? t("Add First Step") : t("Insert Step at Beginning")}
          </Button>
        </div>

        {/* Danh sách các Card bước */}
        <div className="relative">
          {sortedSteps.map((step, index) => {
            return (
              <React.Fragment key={step.id || `step-${index}`}>
                {/* CARD BƯỚC QUY TRÌNH */}
                <div className="relative z-10">
                  <Card
                    hoverable
                    onClick={() => handleOpenEditModal(index)}
                    className="shadow-sm border-neutral-200 overflow-hidden transition-all duration-300 hover:shadow-md"
                    styles={{ body: { padding: "16px 20px" } }}
                  >
                    <div className="flex flex-row justify-between items-start gap-3 mb-2">
                      {/* Header: Số thứ tự + Title */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                          {step.stepOrder}
                        </div>
                        <div>
                          <h4 className="font-semibold text-base text-neutral-800 m-0 leading-snug">
                            {step.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Tag icon={<ClockCircleOutlined />} color="blue" className="m-0 text-xs">
                              {t("Day")} {step.dayOffset}
                            </Tag>
                            {step.isRequired ? (
                              <Tag color="red" className="m-0 text-xs">{t("Required")}</Tag>
                            ) : (
                              <Tag color="default" className="m-0 text-xs">{t("Optional")}</Tag>
                            )}
                          </div>
                        </div>
                      </div>

                      <Space hidden={step.isRequired} onClick={(e) => e.stopPropagation()}>
                        <Popconfirm
                          title={t("Delete this step?")}
                          onConfirm={() => handleDeleteStep(index)}
                          okText={t("Yes")}
                          cancelText={t("No")}
                        >
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Space>
                    </div>

                    {/* Body: Hình ảnh & Mô tả & Metadata */}
                    <div className="flex flex-col md:flex-row gap-4 mt-3 pt-3 border-t border-neutral-100">
                      {step.imageUrl && (
                        <img
                          src={step.imageUrl}
                          alt={step.title}
                          className="w-full md:w-28 h-24 object-cover rounded-md border border-neutral-200 shrink-0"
                        />
                      )}

                      <div className="flex-1 space-y-2 text-sm text-neutral-600">
                        {step.description && <p className="m-0">{step.description}</p>}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                          {step.keyword && (
                            <>
                              <span className="flex items-center gap-1">
                                <TagOutlined className="text-blue-500" />
                                <strong>{t("Keyword")}:</strong> {step.keyword}: {step.values ?? t("Undefined")}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* ĐƯỜNG KẺ NỐI VÀ NÚT CHÈN BƯỚC Ở GIỮA/CỦỐI */}
                <div className="relative flex justify-center items-center py-5 -my-2">
                  {/* Đường dóng nối giữa 2 Card */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-blue-200 z-0"></div>

                  {/* Nút Chèn ở giữa 2 bước */}
                  <Tooltip title={t("Insert step here")}>
                    <Button
                      shape="circle"
                      size="small"
                      type="primary"
                      icon={<PlusOutlined className="text-xs" />}
                      onClick={() => handleOpenAddModal(index + 1)}
                      className="z-10 shadow-md hover:scale-110 transition-transform bg-blue-500 hover:bg-blue-600"
                    />
                  </Tooltip>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* MODAL THÊM / SỬA STEP */}
        <Modal
          title={editingIndex !== null ? t("Edit Step") : t("Add Step")}
          open={isModalOpen}
          confirmLoading={isUpdatingStep}
          cancelButtonProps={{ disabled: isUpdatingStep }}
          closable={!isUpdatingStep}
          onCancel={() => setIsModalOpen(false)}
          onOk={() => form.submit()}
          destroyOnHidden
        >
          <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="mt-4">
            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                className="col-span-2"
                name="title"
                label={t("Step Title")}
                rules={[{ required: true, message: t("Please enter step title") }]}
              >
                <Input placeholder={t("e.g., Fertilize Round 1, Check Vehicle Temp...")} />
              </Form.Item>
              <Form.Item
                name="dayOffset"
                label={t("Day Offset")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} className="!w-full" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="keyword" rules={[{ required: true }]} label={t("Keyword")}>
                <Input placeholder={t("e.g., Fertilizing, Watering...")} />
              </Form.Item>

              <Form.Item name="values" rules={[{ required: true }]} label={t("Values")}>
                <Input placeholder={t("e.g., NPK 15-15-15, 25°C...")} />
              </Form.Item>
            </div>

            <Form.Item className="w-full">
              <UploadWidget imageUrl={(url) => setImageUrl(url)} image={image} />
            </Form.Item>

            <Form.Item name="description" label={t("Description")}>
              <Input.TextArea rows={3} placeholder={t("Detailed instructions for this step...")} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};