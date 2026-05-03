CREATE TABLE IF NOT EXISTS leads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tirages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_id BIGINT UNSIGNED NULL,
  public_id VARCHAR(64) NOT NULL UNIQUE,
  question TEXT NOT NULL,
  question_fingerprint CHAR(64) NOT NULL,
  ip_fingerprint CHAR(64) NOT NULL,
  rune_1 VARCHAR(64) NOT NULL,
  rune_2 VARCHAR(64) NOT NULL,
  rune_3 VARCHAR(64) NOT NULL,
  summary_text TEXT NULL,
  teaser_text TEXT NULL,
  full_reading_text TEXT NULL,
  interpretation_json JSON NULL,
  status ENUM('free', 'unlocked', 'paid') NOT NULL DEFAULT 'free',
  full_unlocked_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tirages_lead
    FOREIGN KEY (lead_id) REFERENCES leads(id)
    ON DELETE SET NULL
);

CREATE INDEX idx_tirages_question_time
  ON tirages (question_fingerprint, full_unlocked_at);

CREATE INDEX idx_tirages_ip_question
  ON tirages (ip_fingerprint, question_fingerprint);

CREATE INDEX idx_tirages_lead_question_time
  ON tirages (lead_id, question_fingerprint, full_unlocked_at);

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_id BIGINT UNSIGNED NOT NULL,
  tirage_id BIGINT UNSIGNED NULL,
  stripe_session_id VARCHAR(255) NOT NULL UNIQUE,
  stripe_payment_intent_id VARCHAR(255) NULL,
  amount_cents INT UNSIGNED NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'eur',
  status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME NULL,
  CONSTRAINT fk_payments_lead
    FOREIGN KEY (lead_id) REFERENCES leads(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_payments_tirage
    FOREIGN KEY (tirage_id) REFERENCES tirages(id)
    ON DELETE SET NULL
);
