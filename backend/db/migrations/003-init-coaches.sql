CREATE TABLE IF NOT EXISTS coaches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_years INT,
    description VARCHAR(255),
    profile_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE
);
