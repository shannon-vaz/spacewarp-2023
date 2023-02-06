import { Modal } from "@/components/Modal";
import { useErrorHandler } from "@/hooks/useErrorHandler";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const QrReader = require("react-qr-scanner");

export interface QRCodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (text: string) => void;
}

export interface ScanResult {
  text: string;
}

export const QRCodeScannerModal: React.FC<QRCodeScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const errorHandler = useErrorHandler();
  return (
    <Modal isOpen={isOpen} onClose={onClose} header="WalletConnect QR Scanner">
      <QrReader
        facingMode="rear"
        delay={500}
        onScan={(result: ScanResult | undefined) => {
          if (!result) {
            return;
          }
          onScanSuccess(result.text);
          onClose();
        }}
        onError={(err: unknown) => {
          errorHandler.handle(err);
        }}
      />
    </Modal>
  );
};
