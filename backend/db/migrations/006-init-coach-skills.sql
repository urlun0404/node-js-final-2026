CREATE TABLE IF NOT EXISTS coach_skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    skill_id uuid REFERENCES skills(id) ON DELETE CASCADE
);