# Memory-games

-- Table: public.creativegames

-- DROP TABLE IF EXISTS public.creativegames;

CREATE TABLE IF NOT EXISTS public.creativegames
(
    id integer NOT NULL DEFAULT nextval('creativegames_id_seq'::regclass),
    "time" character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT creativegames_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.creativegames
    OWNER to postgres;


    -- Table: public.logicalgames

-- DROP TABLE IF EXISTS public.logicalgames;

CREATE TABLE IF NOT EXISTS public.logicalgames
(
    id integer NOT NULL DEFAULT nextval('logicalgames_id_seq'::regclass),
    "time" character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT logicalgames_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.logicalgames
    OWNER to postgres;
