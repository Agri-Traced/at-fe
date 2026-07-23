'use client';

import { TableList } from "@/app/components/TableList";
import { useAuth } from "@/contexts/auth";
import { useBatch, useBatchesByUserId, usePutActivitySteps } from "@/hooks/batchs";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "antd";
import { CarryOutFilled, PlusOutlined, TruckOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Loading } from "@/app/components/Loading";
import { useRouter } from "next/navigation";
import { HarvestForm } from "../../components/HarvestForm";
import { BatchDetail } from "../../components/BatchDetail";
import { TransitDetail } from "../../components/TransitDetail";
import { TransitForm } from "../../components/TransitForm";
import { AssignForm } from "../../components/AssignForm";

export default function FarmerPage() {
  const { user } = useAuth();
  const [openHarvestModal, setOpenHarvestModal] = useState(false);
  const [openTransitModal, setOpenTransitModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [openQualityTestModal, setOpenQualityTestModal] = useState(false);
  const { mutate: updateSteps, isPending: isUpdatingSteps } = usePutActivitySteps();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { t } = useTranslation();

  if (!user) return null;
  if (!id) return <div className="p-8 text-center">{t("Batch not found")}</div>;

  const { data, isLoading: loading } = useBatch(id);

  const AddLogAction = data?.status === 'PLANTED'
  const AssignAction = data?.status === 'HARVESTED'
  const TransitAction = data?.status === 'IN_TRANSIT'

  if (loading) return <Loading />;

  return (
    <>
      {AddLogAction || (user.role === 'RETAILER' && TransitAction) && (
        <>
          <BatchDetail onReturn={window.history.back} batch={data} type={user.role as any} onChangeSteps={(updatedSteps) => {
            updateSteps({ batchId: data.id, data: updatedSteps });
          }} />
          <div className="flex justify-center">
            <Button
              type="primary"
              icon={<CarryOutFilled />}
              onClick={() => setOpenHarvestModal(true)}
            >
              {t("Harvested batch")}
            </Button>
            <HarvestForm open={openHarvestModal} onClose={() => setOpenHarvestModal(false)} id={id} unit={data?.unit} />
          </div>
        </>
      )}
      {TransitAction && user.role === 'SHIPPER' && (
        <>
          <TransitDetail onReturn={() => window.history.back()} batch={data} />
          <div className="flex justify-center">
            <Button
              type="primary"
              icon={<CarryOutFilled />}
              onClick={() => setOpenTransitModal(true)}
            >
              {t("Transit batch")}
            </Button>
            <TransitForm open={openTransitModal} onClose={() => setOpenTransitModal(false)} id={id} location={data?.farmer?.company?.location} />
          </div>
        </>
      )}
      {AssignAction && user.role === 'RETAILER' && (
        <>
          <Button
            type="primary"
            icon={<TruckOutlined />}
            onClick={() => setOpenAssignModal(true)}
          >
            {t("Assign batch")}
          </Button>
          <AssignForm id={id} open={openAssignModal} onClose={() => setOpenAssignModal(false)} />
        </>
      )}
    </>
  )
}