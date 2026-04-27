type LoadingOverlayProps = {
  message: string;
  detail?: string;
  onCancel?: () => void;
};

export default function LoadingOverlay({
  message,
  detail,
  onCancel,
}: LoadingOverlayProps) {
  return (
    <div className="app-loading-overlay">
      <div className="app-loading-card">
        <div className="app-loading-spinner" />
        <div className="app-loading-message">{message}</div>
        {detail ? <div className="app-loading-detail">{detail}</div> : null}
        {onCancel ? (
          <button
            type="button"
            className="btn btn-sm btn-light app-loading-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}
