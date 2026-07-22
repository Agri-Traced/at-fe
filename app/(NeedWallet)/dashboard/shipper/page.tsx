'use client';

import { TableList } from "@/app/components/TableList";
import { useAuth } from "@/contexts/auth";
import { useBatchesByUserId, useCompanyBatches, usePutActivitySteps } from "@/hooks/batchs";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BatchDetail } from "../components/BatchDetail";
import { Button } from "antd";
import { CarryOutFilled, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { HarvestForm } from "../components/HarvestForm";
import { TransitDetail } from "../components/TransitDetail";
import { TransitForm } from "../components/TransitForm";
import { useRouter } from "next/navigation";

export default function ShipperPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useCompanyBatches(user!.companyId, query);
  const allowCreateBatch = user!.role === "FARMER" && query === "PLANTED";
  const [batchId, setBatchId] = useState<string | null>(null);
  const batch = useMemo(() => data?.find((b) => b.id === batchId), [data, batchId]);
  const [openHarvestModal, setOpenHarvestModal] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  useEffect(() => {
    if (user?.role !== "SHIPPER") {
      router.push("/dashboard");
    }
  }, [user]);
  return (
    batch ? (
      <>
        <TransitDetail onReturn={() => setBatchId(null)} batch={batch} />
        <div className="flex justify-center">
          <Button
            type="primary"
            icon={<CarryOutFilled />}
            onClick={() => setOpenHarvestModal(true)}
          >
            {t("Transit batch")}
          </Button>
          <TransitForm open={openHarvestModal} onClose={() => setOpenHarvestModal(false)} id={batchId} location={batch.farmer.company.location} />
        </div>
      </>
    ) : (
      <TableList getBatch={setBatchId} data={data} isLoading={isLoading} isError={isError} error={error} allowCreateBatch={allowCreateBatch} query={query} />
    )
  )
}