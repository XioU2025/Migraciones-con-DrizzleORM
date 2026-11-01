CREATE TABLE "tasks" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar(120) NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
