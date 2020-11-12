create table AppUser (
    spotify_uid varchar(50),
    public_name varchar(100) NOT NULL,
    session_uid bigint references AppSession(session_uid)
    PRIMARY KEY(spotify_uid)
);

create table AppGroup (
    group_uid SERIAL, 
    group_name varchar(50) not NULL,
    description varchar(150),
    primary key(group_uid)
);

--Currently with the logic of Session, session records are meant to be kept instead of deleted
create table AppSession (
    session_uid bigint,
    is_active boolean not NULL,
    primary key(session_uid)
);

create table AppHistory (
    date_added timestamp,
    spotify_uid varchar(50) references AppUser(spotify_uid),
    spotify_uri varchar(50),
    session_uid bigint references AppSession(session_uid),
    group_uid bigint,
    primary key(date_added, spotify_uid),
    constraint fk_group_uid
        foreign key(group_uid)
        references AppGroup(group_uid)
        on delete set null
);

create table GroupMember (
    group_uid bigint,
    spotify_uid varchar(50),
    primary key(group_uid, spotify_uid),
    constraint fk_group_uid
        foreign key(group_uid)
        references AppGroup(group_uid)
        on delete cascade,
    constraint fk_spotify_uid
        foreign key(spotify_uid)
        references AppUser(spotify_uid)
        on delete cascade
);

create table SessionAdmin (
    session_uid bigint references AppSession(session_uid),
    spotify_uid varchar(50),
    primary key(session_uid, spotify_uid),
    constraint fk_spotify_uid
        foreign key(spotify_uid)
        references AppUser(spotify_uid)
        on delete cascade
);

insert into appgroup (group_name) values ('dbgroupname1');
insert into appgroup (group_name) values ('dbgroupname2');
insert into appgroup (group_name) values ('dbgroupname3');

alter table history rename column session_id to session_uid;
alter table history add foreign key (session_uid) references appsession(session_uid);
alter table appuser add column session_uid bigint references appsession(session_uid);

ALTER TABLE groupmember 
ADD constraint fk_spotify_uid
        foreign key(spotify_uid)
        references AppUser(spotify_uid)
        on delete cascade;