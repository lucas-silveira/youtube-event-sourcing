export enum EventKey {
  PaymentCreated = 'payment.created',
  PaymentAuthorized = 'payment.authorized',
  PaymentNotAuthorized = 'payment.not_authorized',
  PaymentFraudAnalysisApproved = 'payment.fraud_analysis_approved',
  PaymentFraudAnalysisDenied = 'payment.fraud_analysis_denied',
  PaymentPaid = 'payment.paid',
  PaymentFailed = 'payment.failed',
}
