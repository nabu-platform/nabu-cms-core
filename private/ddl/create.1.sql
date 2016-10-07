create table group (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name text not null,
	owner_id uuid
);
create table translation (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	context text,
	name text not null,
	translation text not null,
	language_id uuid not null
);
create table user (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	secret text,
	password text,
	salt text,
	password_modified timestamp,
	secret_modified timestamp,
	alias text not null,
	verification_code text,
	invites_left integer,
	blocked_since timestamp,
	anonymous boolean not null
);
create table node (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	owner_id uuid,
	published timestamp,
	verified timestamp,
	enabled boolean not null,
	parent_id uuid,
	version integer not null,
	priority integer not null,
	name text,
	title text,
	description text,
	path text not null,
	language_id uuid,
	component_id uuid not null
);
create table component_action (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name text not null,
	component_id uuid not null
);
create table node_external_id (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	external_id text not null,
	node_id uuid not null,
	external_id_type_id uuid not null
);
create table user_device (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	allowed boolean not null,
	device_id text not null,
	name text not null,
	user_agent text,
	verification_code text,
	user_id uuid not null
);
create table component_action_role (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	component_action_id uuid not null,
	role_id uuid not null
);
create table user_group (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	user_id uuid not null,
	group_id uuid not null
);
create table role (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name text not null,
	pseudo boolean not null
);
create table language (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name text not null
);
create table node_location (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	latitude decimal not null,
	longitude decimal not null,
	street text,
	city text,
	post_code text,
	country text,
	province text,
	additional text,
	number text,
	node_id uuid not null
);
create table external_id_type (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name text not null
);
create table node_audit (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	actor_id uuid not null,
	description text,
	host text,
	port integer,
	device_id uuid,
	node_id uuid not null,
	component_action_id uuid not null,
	audit_state_id uuid not null
);
create table group_role (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	group_id uuid not null,
	role_id uuid not null
);
create table node_action_role (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	inherit boolean not null,
	role_id uuid not null,
	component_action_id uuid not null,
	node_id uuid not null
);
create table component (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name text not null
);
create table audit_state (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	name text not null
);
create table user_oauth2 (
	id uuid primary key,
	db_created_utc timestamp not null,
	db_modified_utc timestamp not null,
	oauth2_provider text not null,
	token text not null,
	active_until timestamp not null,
	refresh_token text,
	user_id uuid not null
);
