insert into appgroup (group_name) values ('dbgroupname1');
insert into appgroup (group_name) values ('dbgroupname2');
insert into appgroup (group_name) values ('dbgroupname3');

alter table apphistory rename column session_id to session_uid;
alter table apphistory add foreign key (session_uid) references appsession(session_uid);
alter table apphistory add column session_uid bigint references appsession(session_uid);
alter table appuser add column session_uid bigint references appsession(session_uid);
ALTER TABLE AppSession ALTER COLUMN session_uid TYPE serial;

ALTER TABLE groupmember 
ADD constraint fk_spotify_uid
        foreign key(spotify_uid)
        references AppUser(spotify_uid)
        on delete cascade;