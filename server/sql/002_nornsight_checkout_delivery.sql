ALTER TABLE tirages
  MODIFY status ENUM(
    'created',
    'payment_pending',
    'paid',
    'generating',
    'delivered',
    'failed',
    'free',
    'unlocked'
  ) NOT NULL DEFAULT 'created';
