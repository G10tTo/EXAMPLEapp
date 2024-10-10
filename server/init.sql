create database badges;
\c badges

create table badges_list(
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL CHECK (char_length(title) <= 100),
    description TEXT NOT NULL CHECK (char_length(description) >= 3 AND char_length(description) <= 300),
    points INT CHECK (points >= 0 AND points <= 100) DEFAULT 0,
    modified_date TIMESTAMPTZ DEFAULT NULL -- Timestamp  with timezone and default to NULL
);

-- Sample insert without modified date
insert into badges_list(title, description) values('git-basics', 'Mastering the basic git skills');
insert into badges_list(title, description) values('git-collaborator', 'Mastering the workflow and collaboration techniques');
insert into badges_list(title, description) values('fullstack-basics', 'Mastering the basic full stack skills');
