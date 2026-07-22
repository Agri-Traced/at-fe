'use client';

import { TableList } from "@/app/components/TableList";
import { useAuth } from "@/contexts/auth";
import { useBatchesByUserId, usePutActivitySteps } from "@/hooks/batchs";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BatchDetail } from "../components/BatchDetail";
import { Button } from "antd";
import { CarryOutFilled, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { HarvestForm } from "../components/HarvestForm";
import { Loading } from "@/app/components/Loading";
import { useRouter } from "next/router";

export default function FarmerPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useBatchesByUserId(user!.id, query);
  const allowCreateBatch = user!.role === "FARMER" && query === "PLANTED";
  const [batchId, setBatchId] = useState<string | null>(null);
  const batch = useMemo(() => data?.find((b) => b.id === batchId), [data, batchId]);
  const [openHarvestModal, setOpenHarvestModal] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const { mutate: updateSteps, isPending: isUpdatingSteps } = usePutActivitySteps();
  useEffect(() => {
    if (user?.role !== "FARMER") {
      router.push("/dashboard");
    }
  }, [user]);
  return (
    batch ? (
      <>
        <BatchDetail onReturn={() => setBatchId(null)} batch={batch} type="FARMER" onChangeSteps={(updatedSteps) => {
          updateSteps({ batchId: batch.id, data: updatedSteps });
        }} />
        <div className="flex justify-center">
          <Button
            type="primary"
            icon={<CarryOutFilled />}
            onClick={() => setOpenHarvestModal(true)}
          >
            {t("Harvested batch")}
          </Button>
          <HarvestForm open={openHarvestModal} onClose={() => setOpenHarvestModal(false)} id={batchId} unit={batch?.unit} />
        </div>
      </>
    ) : (
      <TableList getBatch={setBatchId} data={data} isLoading={isLoading} isError={isError} error={error} allowCreateBatch={allowCreateBatch} query={query} />
    )
  )
}