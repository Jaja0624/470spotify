
-- The AppGroup table provides details about a group page excluding group members.
-- * group_uid      : The unique identifier of a group. New groups are assigned 
--                      with an incremented value from the latest unique identifier.
-- * group_name     : The name of a group. The name of a group cannot be null as
--                      it must be identified in a human readable way.
-- * description    : The description of a group.
create table AppGroup (
    group_uid SERIAL, 
    group_name varchar(50) not NULL,
    description varchar(150),
    primary key(group_uid)
);

-- The AppSession table provides details about a session page excluding session admins.
-- * session_uid    : The unique identifier of a session. New sessions are assigned 
--                      with an incremented value from the latest unique identifier.
-- * is_active      : The active state of a session. True dictates that the session 
--                      is live and can still be accessed. False dictates that the 
--                      session is dead and cannot be accessed. This attribute exists 
--                      since the paradigm (currently) is to keep sessions even 
--                      when they are no longer useful.
create table AppSession (
    session_uid SERIAL,
    is_active boolean not NULL,
    spotify_playlist_uri varchar(55),
    public boolean not NULL DEFAULT true,
    description varchar(200),
    primary key(session_uid),
    group_uid bigint,
    constraint fk_group_uid
        foreign key(group_uid)
        references AppGroup(group_uid)
        on delete set null
);

-- The AppUser table provides details on a user.
-- * spotify_uid    : The unique identifier of a user, provided by Spotify.
-- * public_name    : The name of the user as seen publicly. The public name cannot 
--                      be null as they must be identified in a human 
--                      readable way.
-- * session_uid    : The last session that the user is in. This may be null if 
--                      the user has never been to a session.
create table AppUser (
    spotify_uid varchar(50),
    public_name varchar(100) NOT NULL,
    session_uid bigint references AppSession(session_uid),
    PRIMARY KEY(spotify_uid)
);


-- The AppHistory table provides details about past songs added to a queue in a session.
-- * date_added     : The date and time of when a song was added to a queue in a 
--                      session by a user. Main purpose is to serve as a attribute 
--                      for a composite key.
-- * spotify_uid    : The unique identifier of the user who added the song to the 
--                      queue of a session.
-- * spotify_uri    : The unique identifier of the song, provided by Spotify.
-- * session_uid    : The unique identifier of a session of where the song was added.
-- * group_uid      : The unique identifier that shows which group was associated 
--                      with the session. This can be null as a session may optionally 
--                      be associated with a group, since a session can be made 
--                      without first starting a group. Although this paradigm exists, 
--                      current table usage is made simpler, such that a session 
--                      must be initiated by a group.
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

-- The GroupMember table provides details of which users are associated with which 
-- group. This table exists to provide many-to-many relationships.
-- * group_uid      : The unique identifier of a group.
-- * spotify_uid    : The unique identifier of a user, associated with the group.
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

-- The SessionAdmin table provides details of which users are admins with the associated 
-- sessions. This table exists to provide many-to-many relationships.
-- * session_uid    : The unique identifier of a session.
-- * spotify_uid    : the unique identifier of a user who is an admin in the session.
create table SessionAdmin (
    session_uid bigint references AppSession(session_uid),
    spotify_uid varchar(50),
    primary key(session_uid, spotify_uid),
    constraint fk_spotify_uid
        foreign key(spotify_uid)
        references AppUser(spotify_uid)
        on delete cascade
);

-- The AdminCredentials table provides a password for admin login.
-- * admin_password     : The admin password that is used to verify credentials.
create table AdminCredentials (
    admin_password varchar(50) NOT NULL,
    PRIMARY KEY(admin_password)
);