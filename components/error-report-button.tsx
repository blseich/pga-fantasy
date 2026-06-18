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

const getFailureMessage = (code?: string, reportEmail?: string) => {
  if (code === 'UNAUTHENTICATED_REPORT') {
    return `You need to sign in again before sending an automated report. Please email ${reportEmail || 'support'} directly and provide details on the issue you are experiencing.`;
  }

  if (code === 'ERROR_REPORT_RATE_LIMITED') {
    return 'Please wait a minute before sending another automated report.';
  }

  return `Sorry, but we cannot send the automated report at this time. Please email ${reportEmail || 'support'} directly and provide details on the issue you are experiencing.`;
};

export default function ErrorReportButton({
  message,
  reportEmail = process.env.NEXT_PUBLIC_ERROR_REPORT_EMAIL,
}: ErrorReportButtonProps) {
  const [reportStatus, setReportStatus] = useState<ReportStatus>('idle');
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

  const sendReport = async () => {
    setReportStatus('sending');
    setFailureMessage(null);

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
      if (result.success) {
        setReportStatus('sent');
        return;
      }

      setFailureMessage(getFailureMessage(result.error?.code, reportEmail));
      setReportStatus('failed');
    } catch {
      setFailureMessage(getFailureMessage(undefined, reportEmail));
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
        <p className="text-sm text-destructive-foreground">{failureMessage}</p>
      )}
    </div>
  );
}
