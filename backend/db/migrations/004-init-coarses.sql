CREATE TABLE IF NOT EXISTS courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    start_at TIMESTAMP,
    end_at TIMESTAMP,
    max_participants INT,
    meeting_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    skill_id uuid REFERENCES skills(id) ON DELETE CASCADE
);
