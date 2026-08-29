CREATE TABLE IF NOT EXISTS skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
