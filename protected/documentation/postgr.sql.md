create table http_access_logs (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	connection_created timestamp,
	remote_ip text not null,
	remote_host text,
	remote_port integer not null,
	local_port integer not null,
	local_host text,
	http_version decimal not null,
	method text not null,
	target text not null,
	accept_language text,
	user_agent text,
	session text,
	referer text,
	server text not null,
	server_group text,
	device_id uuid
);
create table node_history_values (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	started timestamp,
	stopped timestamp,
	table_name text not null,
	field_name text not null,
	new_value text,
	instance_id uuid not null,
	change_type text not null,
	context_id uuid not null
);
create table time_constrained (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	started timestamp,
	stopped timestamp
);
create table master_data_categories (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null,
	owner_id uuid,
	description text
);
create table master_data_entries (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null,
	owner_id uuid,
	description text,
	master_data_category_id uuid references master_data_categories(id) not null
);
create table components (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null unique,
	description text,
	parent_id uuid references components(id),
	owner_id uuid
);
create table nodes (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	started timestamp,
	stopped timestamp,
	owner_id uuid references nodes(id),
	verified timestamp,
	enabled boolean not null,
	parent_id uuid references nodes(id),
	version integer not null,
	priority integer not null,
	name text,
	title text,
	description text,
	path text not null,
	slug text unique,
	language_id uuid references master_data_entries(id),
	component_id uuid references components(id) not null
);
create table groups (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null,
	owner_id uuid references nodes(id)
);
create table actions (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null unique,
	audit boolean not null,
	owner_id uuid references nodes(id),
	description text,
	component_id uuid references components(id)
);
create table users (
	id uuid references nodes(id) primary key,
	created timestamp not null,
	modified timestamp not null,
	password text,
	salt text not null,
	password_modified timestamp,
	alias text not null,
	verification_code text,
	invites_left integer,
	blocked_since timestamp,
	anonymous boolean not null,
	realm text not null,
	alias_type_id uuid references master_data_entries(id),
	algorithm text not null
);
create table user_devices (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	allowed boolean not null,
	name text not null,
	description text,
	verification_code text,
	secret text,
	secret_modified timestamp,
	device_id uuid not null,
	user_id uuid references users(id) not null
);
create table node_external_ids (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	external_id text not null,
	external_id_type_id uuid references master_data_entries(id) not null,
	node_id uuid references nodes(id) not null
);
create table node_ratings (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	definition_id uuid references master_data_entries(id) not null,
	rating decimal not null,
	owner_id uuid references nodes(id) not null,
	node_id uuid references nodes(id) not null
);
create table user_groups (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	started timestamp,
	stopped timestamp,
	user_id uuid references users(id) not null,
	group_id uuid references groups(id) not null
);
create table node_audits (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	actor_id uuid references nodes(id),
	description text,
	user_device_id uuid references user_devices(id),
	host text,
	error_code text,
	error_log text,
	parent_id uuid references node_audits(id),
	device_id uuid,
	audit_level_id uuid references master_data_entries(id) not null,
	action_id uuid references actions(id) not null,
	node_id uuid references nodes(id)
);
create table component_fields (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null,
	data_type text,
	component_id uuid references components(id) not null
);
create table node_locations (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	x decimal,
	y decimal,
	street_id uuid references master_data_entries(id),
	city_id uuid references master_data_entries(id),
	post_code_id uuid references master_data_entries(id),
	country_id uuid references master_data_entries(id),
	province_id uuid references master_data_entries(id),
	additional text,
	number text,
	district_id uuid references master_data_entries(id),
	first_name text,
	last_name text,
	priority integer,
	location_type_id uuid references master_data_entries(id),
	sector_id uuid references master_data_entries(id),
	node_id uuid references nodes(id) not null
);
create table node_tags (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	definition_id uuid references master_data_entries(id) not null,
	owner_id uuid references nodes(id),
	node_id uuid references nodes(id) not null
);
create table node_addresses (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	x decimal,
	y decimal,
	street text,
	city text,
	post_code text,
	country text,
	province text,
	additional text,
	number text,
	district text,
	priority integer,
	address_type_id uuid references master_data_entries(id),
	sector text,
	node_id uuid references nodes(id) not null
);
create table roles (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null,
	pseudo boolean not null,
	owner_id uuid references nodes(id)
);
create table translations (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	context text,
	name text not null,
	translation text not null,
	language_id uuid references master_data_entries(id) not null
);
create table node_fields (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	content text not null,
	node_id uuid references nodes(id) not null,
	component_field_id uuid references component_fields(id) not null
);
create table httpsessions (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	remote_ip text not null,
	remote_host text,
	user_id uuid references users(id)
);
create table node_logs (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	started timestamp,
	stopped timestamp,
	message text not null,
	description text,
	code text,
	correlation_id text,
	log_type_id uuid references master_data_entries(id) not null,
	uri text,
	server text not null,
	log_level_id uuid references master_data_entries(id) not null,
	actor_id uuid references nodes(id),
	audit_id uuid references node_audits(id),
	node_id uuid references nodes(id) not null
);
create table action_roles (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	action_id uuid references actions(id) not null,
	role_id uuid references roles(id) not null
);
create table node_properties (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	name text not null,
	content text not null,
	node_id uuid references nodes(id) not null
);
create table node_relations (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	started timestamp,
	stopped timestamp,
	relation_type_id uuid references master_data_entries(id) not null,
	source_id uuid references nodes(id) not null,
	target_id uuid references nodes(id) not null
);
create table group_roles (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	started timestamp,
	stopped timestamp,
	service text,
	inherit boolean not null,
	group_id uuid references groups(id) not null,
	role_id uuid references roles(id) not null,
	node_id uuid references nodes(id)
);
create table user_oauth2_credentials (
	id uuid primary key,
	created timestamp not null,
	modified timestamp not null,
	web_application text not null,
	oauth2_provider text not null,
	token text not null,
	active_until timestamp not null,
	refresh_token text,
	account_id text,
	token_type text,
	resource text,
	user_id uuid references users(id) not null
);

alter table node_relations add constraint relation_unique unique(source_id, target_id, relation_type_id);
alter table actions add constraint action_unique unique(name, component_id);
alter table user_oauth2_credentials add constraint oauth2_unique unique(web_application, oauth2_provider, user_id, resource);

-- this does not work!
--alter table users add constraint alias_lower_unique unique(lower(alias));

create unique index alias_unique on users (lower(alias), realm);

-- make sure tags can only be set once on a node
alter table node_tags add constraint tag_unique unique(node_id, definition_id);

-- make sure translations are unique
alter table translations add constraint translation_unique unique(context, name, language_id);

-- make sure categories and entries are unique
--alter table master_data_categories add constraint master_data_category_unique unique(name, owner_id);
--alter table master_data_entries add constraint master_data_entry_unique unique(name, master_data_category_id, owner_id);

-- in postgresql, null != null. to make sure there is only one entry with null, we need two indexes
create unique index master_data_category_unique on master_data_categories (name, owner_id) where owner_id is null;
create unique index master_data_category_unique2 on master_data_categories (name, owner_id) where owner_id is not null;

create unique index master_data_entry_unique on master_data_entries (name, master_data_category_id, owner_id) where owner_id is null;
create unique index master_data_entry_unique2 on master_data_entries (name, master_data_category_id, owner_id) where owner_id is not null;

create unique index user_device_unique on user_devices (user_id, device_id);