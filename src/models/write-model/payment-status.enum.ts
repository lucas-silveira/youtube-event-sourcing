export enum PaymentStatus {
  Pending = 'pending',
  Authorized = 'authorized',
  NotAuthorized = 'not_authorized',
  FraudAnalysisApproved = 'fraud_analysis_approved',
  FraudAnalysisDenied = 'fraud_analysis_denied',
  Paid = 'paid',
  Failed = 'failed',
}
