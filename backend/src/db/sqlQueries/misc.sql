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

--selects processed session data and each song associated with the data.
--parameter should be a specific group uid
select SessionOverview.session_uid as session_uid, SessionOverview.date_start, SessionOverview.participants, ah2.date_added, au2.public_name, ah2.spotify_uri, ag.group_name
from (
        select ah1.session_uid, min(ah1.date_added) as date_start, string_agg(distinct(au1.public_name), ', ') as participants
        from AppHistory ah1
        join AppUser au1 on ah1.spotify_uid = au1.spotify_uid
        where group_uid = 34
        group by ah1.session_uid
) as SessionOverview
join AppHistory ah2 on SessionOverview.session_uid = ah2.session_uid
join AppUser au2 on ah2.spotify_uid = au2.spotify_uid
left join AppGroup ag on ah2.group_uid = ag.group_uid;


--inserts hardcoded data in the apphistory
insert into apphistory (date_added, spotify_uid, spotify_uri, session_uid, group_uid)
values
('1999-01-08 04:05:06', '12141627997', 1, 4, 34),--maple, with session 4, spoon group, random uri?
('1999-01-08 04:05:30', 'up89ecq6ac5e1bgtrpe9f144u', 2, 4, 34),--migs, with session 4, spoon group, random uri?
('1999-01-08 04:06:30', 'up89ecq6ac5e1bgtrpe9f144u', 3, 4, 34),--migs, with session 4, spoon group, random uri?
('1999-01-08 04:06:36', '12141627997', 1, 4, 34);

--alter appsession and add public attribute and description attribute
alter table AppSession add column description varchar(200)
alter table AppSession add column public boolean default true
ALTER TABLE AppSession ALTER COLUMN public SET NOT NULL;

-- issue 54
alter table appgroup add column date_created timestamp;
alter table appgroup add column last_modified timestamp;
alter table appsession add column date_created timestamp;
alter table appsession add column last_modified timestamp;
alter table appuser add column date_created timestamp;
alter table appuser add column last_modified timestamp;
alter table groupmember add column date_joined timestamp;
alter table sessionadmin add column date_added timestamp;