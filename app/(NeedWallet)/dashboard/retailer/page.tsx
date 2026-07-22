'use client';

import { TableList } from "@/app/components/TableList";
import { useAuth } from "@/contexts/auth";
import { useBatchesByUserId, useCompanyBatches, usePutActivitySteps } from "@/hooks/batchs";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { BatchDetail } from "../components/BatchDetail";
import { Button, Modal } from "antd";
import { CarryOutFilled, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { HarvestForm } from "../components/HarvestForm";
import { AssignForm } from "../components/AssignForm";
import { QualityTestForm } from "../components/QualityTestForm";

export default function RetailerPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { user } = useAuth();
  if (!user) return;
  const { data, isLoading, isError, error } = useCompanyBatches(user.companyId, query);
  const allowCreateBatch = user.role === "FARMER" && query === "PLANTED";
  const [batchId, setBatchId] = useState<string | null>(null);
  const batch = useMemo(() => data?.find((b) => b.id === batchId), [data, batchId]);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [openQualityTestModal, setOpenQualityTestModal] = useState(false);
  const { t } = useTranslation();
  const { mutate: updateSteps } = usePutActivitySteps();

  const batchData = data

  const allowQuality = data

  return (
    batch && allowQuality ? (
      <>
        <BatchDetail onReturn={() => setBatchId(null)} batch={batch} type="RETAILER" onChangeSteps={(updatedSteps) => {
          updateSteps({ batchId: batch.id, data: updatedSteps });
        }} />
        <div className="flex justify-center">
          <Button
            type="primary"
            icon={<CarryOutFilled />}
            onClick={() => setOpenQualityTestModal(true)}
          >
            {t("Quality Test")}
          </Button>
          <QualityTestForm open={openQualityTestModal} onClose={() => setOpenQualityTestModal(false)} id={batchId} />
        </div>
      </>
    ) : (
      <>
        <TableList getBatch={setBatchId} data={data} isLoading={isLoading} isError={isError} error={error} allowCreateBatch={allowCreateBatch} query={query} bonusButton={() => { setOpenAssignModal(true); }} />
        <AssignForm id={batchId} open={openAssignModal} onClose={() => setOpenAssignModal(false)} />
      </>
    )
  )
}