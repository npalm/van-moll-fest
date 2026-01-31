import { useEffect, useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHARE_TEXT = 'Check out Van Moll Fest Winter 2026!';

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // Get the current URL dynamically (works on any deployed domain)
  const appUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${appUrl}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSignalShare = () => {
    // Signal doesn't have a direct web share URL, so we use the native share if available
    // or fallback to copying the message
    if (navigator.share) {
      navigator.share({
        title: 'Van Moll Fest Winter 2026',
        text: SHARE_TEXT,
        url: appUrl,
      });
    } else {
      // Fallback: copy the share text for Signal
      navigator.clipboard.writeText(`${SHARE_TEXT} ${appUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = appUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Van Moll Fest Winter 2026',
          text: SHARE_TEXT,
          url: appUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title */}
        <h2
          id="share-modal-title"
          className="text-lg font-semibold text-slate-900 dark:text-white mb-6 text-center"
        >
          Share Van Moll Fest
        </h2>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-3 rounded-xl shadow-inner">
            <QRCodeSVG
              value={appUrl}
              size={160}
              level="M"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#1e293b"
            />
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsAppShare}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            aria-label="Share on WhatsApp"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-xs font-medium">WhatsApp</span>
          </button>

          {/* Signal */}
          <button
            onClick={handleSignalShare}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="Share on Signal"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.917 1.043 5.593 2.778 7.678l-1.65 4.985a.5.5 0 00.632.632l4.985-1.65A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6c-2.29 0-4.42-.69-6.19-1.87l-.29-.19-3.01 1 1-2.93-.21-.33A9.56 9.56 0 012.4 12c0-5.3 4.31-9.6 9.6-9.6 5.3 0 9.6 4.31 9.6 9.6 0 5.3-4.31 9.6-9.6 9.6zm5.25-7.05c-.29-.15-1.71-.85-1.98-.94-.27-.1-.46-.15-.66.15-.19.29-.76.94-.93 1.14-.17.19-.34.22-.63.07-.29-.14-1.23-.45-2.34-1.44-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.66-1.58-.9-2.16-.24-.57-.48-.49-.66-.5-.17-.01-.36-.01-.56-.01-.19 0-.51.07-.77.36-.27.29-1.02 1-1.02 2.43 0 1.43 1.05 2.82 1.19 3.01.15.19 2.06 3.14 4.99 4.4.7.3 1.24.48 1.66.61.7.22 1.34.19 1.84.12.56-.08 1.71-.7 1.95-1.38.25-.68.25-1.26.17-1.38-.07-.12-.27-.19-.56-.34z" />
            </svg>
            <span className="text-xs font-medium">Signal</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            aria-label="Copy link"
          >
            {copied ? (
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            )}
            <span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Native share button (mobile) */}
        {'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            More sharing options
          </button>
        )}

        {/* URL display */}
        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400 break-all">
          {appUrl}
        </p>
      </div>
    </div>
  );
}
