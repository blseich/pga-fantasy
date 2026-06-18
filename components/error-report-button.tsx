'use client';

import { Mail } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { parseMutationResponse } from '@/utils/api/mutation-response';

type ErrorReportButtonProps = {
  message: string;
  reportEmail?: string;
};

type ReportStatus = 'idle' | 'sending' | 'sent' | 'failed';

export default function ErrorReportButton({
  message,
  reportEmail = process.env.NEXT_PUBLIC_ERROR_REPORT_EMAIL,
}: ErrorReportButtonProps) {
  const [reportStatus, setReportStatus] = useState<ReportStatus>('idle');

  const sendReport = async () => {
    setReportStatus('sending');

    try {
      const response = await fetch('/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          page:
            typeof window === 'undefined'
              ? 'Unknown page'
              : window.location.href,
        }),
      });
      const result = await parseMutationResponse(response);
      setReportStatus(result.success ? 'sent' : 'failed');
    } catch {
      setReportStatus('failed');
    }
  };

  return (
    <div className="grid gap-2">
      <Button
        disabled={reportStatus === 'sending' || reportStatus === 'sent'}
        onClick={sendReport}
        type="button"
        variant="outline"
      >
        <Mail className="mr-2 size-4" />
        {reportStatus === 'sending' ? 'Sending...' : 'Report'}
      </Button>
      {reportStatus === 'sent' && (
        <p className="text-sm text-foreground">
          Error report sent. Try refreshing the page when you are ready.
        </p>
      )}
      {reportStatus === 'failed' && (
        <p className="text-sm text-destructive-foreground">
          Sorry, but we cannot send the automated report at this time. Please
          email {reportEmail || 'support'} directly and provide details on the
          issue you are experiencing.
        </p>
      )}
    </div>
  );
}
