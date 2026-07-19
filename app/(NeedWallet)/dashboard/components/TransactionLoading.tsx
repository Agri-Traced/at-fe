import { Typography } from "antd"
import { useTranslation } from "react-i18next";

export const TransactionLoading = ({ loadingIPFS, loading, isPending, isConfirming }: { loadingIPFS?: boolean; loading?: boolean; isPending?: boolean; isConfirming?: boolean }) => {
  const { t } = useTranslation();
  return (<>
    {loadingIPFS && <Typography.Text type="secondary" className="text-center block mt-4">{t('Uploading batch data to IPFS...')}</Typography.Text>}
    {loading && <Typography.Text type="secondary" className="text-center block mt-4">{t('Submitting transaction to blockchain...')}</Typography.Text>}
    {isPending && <Typography.Text type="secondary" className="text-center block mt-4">{t('Submitting batch to server...')}</Typography.Text>}
    {isConfirming && <Typography.Text type="secondary" className="text-center block mt-4">{t('Confirming transaction on server...')}</Typography.Text>}
  </>)
}
