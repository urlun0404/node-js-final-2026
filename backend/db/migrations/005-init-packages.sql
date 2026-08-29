CREATE TABLE IF NOT EXISTS packages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    credit_amount INT NOT NULL,
    price INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
