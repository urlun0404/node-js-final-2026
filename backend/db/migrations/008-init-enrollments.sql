CREATE TABLE IF NOT EXISTS enrollments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    cancelled_at TIMESTAMP DEFAULT NULL
);