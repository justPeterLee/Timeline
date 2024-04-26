create table
  "user" (
    id bigint primary key generated always as identity,
    username text not null,
    password text not null,
    email text unique not null
  );

create table
  timeline (
    id bigint primary key generated always as identity,
    title text,
    year smallint not null,
    user_id bigint not null references "user" (id),
    unique (year, user_id)
  );

create table 
 sort_data (
    id bigint primary key generated always as identity,
    sort jsonb not null default '{}'::JSONB,
    year_id bigint not null references timeline (id) on delete cascade,
    unique (id, year_id)
  );

create table 
  time_pole (
    id bigint primary key generated always as identity,
    title text not null,
    description text,
    complete boolean not null default false,
    user_id bigint not null references "user"(id) ON DELETE CASCADE,
    year_id bigint not null references timeline(id) ON DELETE CASCADE
  );

create table
  time_pole_date(
    id bigint primary key generated always as identity,
    date smallint not null,
    month smallint not null,
    year smallint not null,
    day smallint not null,
    full_date DATE not null,
    time_pole_id bigint not null references time_pole(id) ON DELETE CASCADE
  );