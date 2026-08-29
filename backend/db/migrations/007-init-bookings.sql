CREATE TABLE IF NOT EXISTS bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    package_id uuid REFERENCES packages(id) ON DELETE CASCADE,
    purchase_at TIMESTAMP DEFAULT NOW()
);