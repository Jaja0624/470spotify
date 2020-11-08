create table AppUser (
    spotify_uid varchar(50),
    public_name varchar(100) NOT NULL,
    PRIMARY KEY(spotify_uid)
);

-- group_uid SERIAL changed from bigint (fyi miguel)
-- auto ids, auto increments
create table AppGroup (
    group_uid SERIAL, 
    group_name varchar(50) not NULL,
    description varchar(150),
    primary key(group_uid)
);

create table History(
    date_recommend timestamp,
    spotify_uid varchar(50) references AppUser(spotify_uid),
    spotify_uri varchar(50),
    session_id bigint NOT NULL,
    group_uid bigint,
    primary key(date_recommend, spotify_uid),
    constraint fk_group_uid
        foreign key(group_uid)
        references AppGroup(group_uid)
        on delete set null
);

create table GroupMember (
    group_uid bigint,
    spotify_uid varchar(50) references AppUser(spotify_uid),
    primary key(group_uid, spotify_uid),
    constraint fk_group_uid
        foreign key(group_uid)
        references AppGroup(group_uid)
        on delete cascade
);

insert into appgroup (group_name) values ('dbgroupname1');
insert into appgroup (group_name) values ('dbgroupname2');
insert into appgroup (group_name) values ('dbgroupname3');